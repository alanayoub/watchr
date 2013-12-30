var $ = require('jquery'),
    colors = require('colors'),
    random_ua = require('random-ua'),
    logger = require('./services/logger'),
    getphantom = require('./services/phantom');

module.exports = function (options) {
    /**
     * TODO: Need to make sure the headers are more random. Find out what else I can do to prevent requests looking similar
     * TODO: Pass headers through from client
     * TODO: Create phantom class that creates a phantom instance with the following methods
     *      ph.fetch({selector: ''}, url): url/xpath and selectors and return results
     *      ph.create_page: creates a new page. Need to figure out which is better, using the same page or creating a new onw
     * TODO: Create or source a phantom pool
     */
    var $deferred = $.Deferred();
    getphantom().then(function (error, ph) {
        logger.info('scrape request recieved');
        var user_agent = random_ua.generate();
        logger.info('Generated UserAgent: %s', user_agent);
        ph.watchr.scrapping++;
        if (error) {
            logger.error('Error getting phantom instance: %s', error);
            return
        }
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
            page.onResourceRequested = function (request) {};
            page.onResourceReceived = function (response) {};
            page.onError = function (msg, trace) {
                var msgStack = ['%s'.red, msg];
                if (trace && trace.length) {
                    msgStack.push('TRACE:');
                    trace.forEach(function (t) {
                        msgStack.push(' -> ' + t.file + ': ' + t.line + (t.function ? ' (in function "' + t.function + '")' : ''));
                    });
                }
                logger.error('Error from webpage: %j', msgStack.join('\n'));
            };
            page.onLoadStarted = function () {
                logger.info('page.onLoadStarted');
            };
            page.onLoadFinished = function (status) {
                logger.info('page.onLoadFinished');
            };
            page.onConsoleMessage = function (msg, line, source) {
                if (msg.indexOf('Unsafe JavaScript attempt to access frame with URL') > -1) return;
                logger.info('phantom page console: %s %s %s', msg, line, source);
            };
            page.onNavigationRequested = function (url, type, will_navigate, main) {
                logger.info('Trying to navigate to: %s', url);
                logger.info('Caused by: %s', type);
                logger.info('Will actually navigate: %s', will_navigate);
                logger.info('Sent from the page\'s main frame: %s', main);
            };
            /**
             * This isnt working for some reason
             * */
            page.onClosing = function(closing_page) {
                ph.watchr.scrapping--;
                logger.info('page.onClosing. URL: %s', closing_page.url);
            };
            page.open(options.url, function (error, status) {
                if (error) {
                    logger.error('page.open: ', error);
                    ph.watchr.scrapping--;
                    page.close();
                    return
                }
                if (status !== 'success') {
                    logger.error('page.open status: ', status);
                    page.close();
                    return
                }
                /**
                 * Check selector against markup up to x times.
                 * The page may have an unsupported redirect and so the correct markup might not be ready.
                 *
                 * Example: mtgox.com homepage is simply a script that drops a cookie then reloads. We don't want to
                 * check against the first load. Also note that the url is the same in this case.
                 */
                !function check (tries) {
                    setTimeout(function () {
                        page.injectJs('public/lib/jquery/jquery.js', function () {
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
                                        logger.error('page.evaluate: %s', error);
                                        ph.watchr.scrapping--;
                                        page.close();
                                        return;
                                    }
                                    tries--;
                                    if (result) {
                                        $deferred.resolve(result);
                                        ph.watchr.scraped++;
                                        ph.watchr.scrapping--;
                                        logger.info('found result, close page. Result = ', result);
                                        page.close();
                                    }
                                    if (tries === 0) {
                                        logger.info('ran out of tries, closing page');
                                        $deferred.reject('The selector didn\'t return any result after 10 seconds');
                                        page.close();
                                    }
                                    if (tries > 0 && !result) check(tries);
                                }, options
                            );
                        });
                    }, 500);
                }(20);
                page.render('renders/lastpage.png');
            });
        });
    });
    return $deferred.promise();
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
//var sel = '.top-story-header';
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
