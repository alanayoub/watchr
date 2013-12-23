var colors = require('colors'),
    random_ua = require('random-ua'),
    phantom = require('node-phantom'),
    instances = [], max_scrapes_per_instance = 3, instanceid = 0;

var getphantom = function (callback) {
    var instance, cloptions = {
        parameters: {
            'ignore-ssl-errors': true,
            'load-images': false
        }
    };
    /**
     * - Create a new phantomjs instance
     * - Add it to the instance array
     * - Pass a reference to the callback
     * @param callback
     */
    var newinstance = function (callback) {
        phantom.create(function (error, ph) {
            var id;
            if (error) return console.log('Error creating Phantom instance %j'.red, error);
            id = instances.push(ph);
            instance = instances[id-1];
            instance.watchr = {
                scraped: 0,
                scrapping: 0,
                instanceid: instanceid++
            };
            console.log('Creating new phantomjs instance: %s'.blue, instance.watchr.instanceid);
            callback(error, instance);
        }, cloptions);
    };
    if (instances.length === 0) {
        newinstance(function (error, ph) {
            callback(error, ph);
        });
    }
    else {
        console.log('Number of instances'.blue, instances.length);
        instances.every(function (val, idx) {
            if (val.watchr.scraped > max_scrapes_per_instance) {
                console.log('Max scrapes for this instance, try another: %s'.blue, val.watchr.instanceid);
                console.log('Killing instance %s'.blue, val.watchr.instanceid);
                instances.splice(idx, 1);
                val.exit();
                return true
            }
            else {
                console.log('Found one with less than max scrapes: %s'.blue, val.watchr.instanceid);
                instance = val;
                return false
            };
        });
        if (!instance) {
            console.log('No free instances found, need to create new instance'.blue);
            newinstance(function (error, ph) {
                console.log('Number of scraped pages with this instance'.blue, instance.watchr.scraped);
                console.log('Instance currently scraping'.blue, instance.watchr.scrapping);
                callback(error, ph);
            });
        }
        else {
            console.log('Scraped pages with instance'.blue, instance.watchr.scraped);
            console.log('Instance currently scraping'.blue, instance.watchr.scrapping);
            callback(false, instance);
        }
    }
};

exports.scraper = function (options, callback) {

    /**
     * TODO: Need to make sure the headers are more random. Find out what else I can do to prevent requests looking similar
     * TODO: Pass headers through from client
     * TODO: Create phantom class that creates a phantom instance with the following methods
     *      ph.fetch({selector: ''}, url): url/xpath and selectors and return results
     *      ph.create_page: creates a new page. Need to figure out which is better, using the same page or creating a new onw
     * TODO: Create or source a phantom pool
     */

        var user_agent = random_ua.generate();
        console.log('Generated UserAgent: %s'.green, user_agent);

        getphantom(function (error, ph) {
            ph.watchr.scrapping++;
            if (error) return console.log('Error: %s'.red, error);
            ph.createPage(function (error, page) {
                page.customHeaders = {
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                    'Accept-Language': 'en-GB,en-US;q=0.8,en;q=0.6',
                    'Connection': 'keep-alive',
                    'Referer': ''
                };
                page.settings = {
                    'User-Agent': user_agent
                };
                page.onResourceRequested = function (request) {
//                console.log('Request ' + JSON.stringify(request, undefined, 4));
                };
                page.onResourceReceived = function (response) {
//                console.log('Receive ' + JSON.stringify(response, undefined, 4));
                };
                page.onError = function (msg, trace) {
                    var msgStack = ['%s'.red, msg];
                    if (trace && trace.length) {
                        msgStack.push('TRACE:');
                        trace.forEach(function (t) {
                            msgStack.push(' -> ' + t.file + ': ' + t.line + (t.function ? ' (in function "' + t.function + '")' : ''));
                        });
                    }
                    console.error('Error from webpage: %j'.red, msgStack.join('\n'));
                };
                page.onLoadStarted = function () {
                    console.log('Start loading...'.green);
                };
                page.onLoadFinished = function (status) {
                    console.log('Loading finished.'.green);
                };
                page.onConsoleMessage = function (msg, line, source) {
                    if (msg.indexOf('Unsafe JavaScript attempt to access frame with URL') > -1) return;
                    console.log('console: %s %s %s'.grey, msg, line, source);
                };
                page.onNavigationRequested = function (url, type, willNavigate, main) {
                    console.log('Trying to navigate to: ' + url);
                    console.log('Caused by: ' + type);
                    console.log('Will actually navigate: ' + willNavigate);
                    console.log('Sent from the page\'s main frame: ' + main);
                };
                /**
                 * This isnt working for some reason
                 * */
                page.onClosing = function(closing_page) {
                    ph.watchr.scrapping--;
                    console.log('The page is closing! URL: %s', closing_page.url);
                };
                page.open(options.url, function (error, status) {
                    console.log('Phantom status: %s'.green, status);
                    if (error) {
                        console.error('Error: ', error);
                        ph.watchr.scrapping--;
                        page.close();
                        return
                    }
                    if (status !== 'success') return console.error('Status: ', status);
                    /**
                     * Check selector against markup up to x times.
                     * The page may have an unsupported redirect and so the correct markup might not be ready.
                     *
                     * Example: mtgox.com homepage is simply a script that drops a cookie then reloads. We don't want to
                     * check against the first load. Also note that the url is the same in this case.
                     */
                    !function check (tries) {
                        setTimeout(function () {
                            page.injectJs('bower_components/jquery/jquery.min.js', function () {
                                page.evaluate(
                                    function (options) {
                                        if (options.selector) {return $(options.selector).text();}
                                        else
                                        if (options.xpath) {
                                            return document.evaluate(
                                                '//*[@id="top-story"]/h2/a', document, null, XPathResult.STRING_TYPE, null
                                            ).stringValue;
                                        }
                                    },
                                    function (error, result) {
                                        if (error) {
                                            console.log('Error evaluating: %s'.red, error);
                                            ph.watchr.scrapping--;
                                            page.close();
                                            return;
                                        }
                                        tries--;
                                        if (result) {
                                            callback(result);
                                            ph.watchr.scraped++;
                                            ph.watchr.scrapping--;
                                            page.close();
                                        }
                                        if (tries === 0) page.close();
                                        if (tries > 0 && !result) check(tries);
                                    }, options
                                );
                            });
                        }, 200);
                    }(20);
                    page.render('renders/lastpage.png');
                });
            });
        });


};

//var url = 'https://www.mtgox.com/';
//var sel = '#lastPrice';

//var url = 'http://www.rentmychest.com/';
//var sel = 'center a';

//var url = 'http://uk.hotels.com/hotel/details.html?pa=3&pn=1&ps=3&tab=description&destinationId=556293&searchDestination=Towcester&hotelId=219421&arrivalDate=30-11-2013&departureDate=01-12-2013&rooms[0].numberOfAdults=2&roomno=1&validate=false&previousDateful=false&reviewOrder=date_newest_first';
//var sel = '.dateful.green';

//var url = 'http://uk.hotels.com/';
//var sel = '.footer-bar .trust .text strong';

//var url = 'http://www.expedia.co.uk/';
//var sel = '.whyBookExp h2';

//var url = 'http://www.bbc.co.uk/news/';
//var sel = '.top-story-header ';
//var xpa = '//*[@id="top-story"]/h2/a';

//watchr(url, sel, function (result) {
//    console.log('result', result);
//});

//watchr({url: url, selector: sel}, function (result) {
//    console.log('Result: %s'.green, result);
//});

//watchr({url: 'http://www.bbc.co.uk/news/', selector: '.top-story-header '}, function (result) {
//    console.log('Result: %s'.green, result);
//});
