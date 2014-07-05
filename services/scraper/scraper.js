var $ = require('jquery'),
    colors = require('colors'),
    validator = require('validator'),
    config  = require('../../config'),
    random_ua = require('random-ua'),
    logger = require('./../logger'),
    getphantom = require('./phantom'),
    stall = config.get('app:phantom:wait_inbetween_checks'),
    times = config.get('app:phantom:check_for_match_times');

module.exports = function (options) {
    logger.info(__filename, 'options: ', options);
    var $deferred = $.Deferred(),
        cssIsValid = validator.isCSSSelector(options.css),
        urlIsValid = validator.isURL(options.url);
    if (options.result) { // short circut
        $deferred.resolve(options.result);
    }
    if (!cssIsValid) {
        logger.warn(__filename, 'CSS Invalid');
        $deferred.reject({
            error: true,
            type: 'phantom',
            message: 'CSS invalid'
        });
    }
    if (!urlIsValid) {
        logger.warn(__filename, 'URL Invalid');
        $deferred.reject({
            error: true,
            type: 'phantom',
            message: 'URL invalid'
        });
    }
    if (!options.result && cssIsValid && urlIsValid) getphantom().then(function (error, ph) {
        logger.info(__filename, 'Scrape request received');
        var user_agent = random_ua.generate();
        logger.info(__filename, 'Generated UserAgent: %s', user_agent);
        ph.watchr.scrapping++;
        if (error) {
            logger.error(__filename, 'Error getting phantom instance: %s', error);
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
                logger.info(__filename, 'Error from webpage: %j', msgStack.join('\n'));
            };
            page.onLoadStarted = function () {
                logger.info(__filename, 'page.onLoadStarted');
            };
            page.onLoadFinished = function () {
                logger.info(__filename, 'page.onLoadFinished');
            };
            page.onConsoleMessage = function (msg, line, source) {
                if (msg.indexOf('Unsafe JavaScript attempt to access frame with URL') > -1) return;
                logger.info(__filename, 'Phantom page console: %s %s %s', msg, line, source);
            };
            page.onNavigationRequested = function (url, type, will_navigate, main) {
                logger.info(__filename, 'Trying to navigate to: %s', url);
                logger.info(__filename, 'Caused by: %s', type);
                logger.info(__filename, 'Will actually navigate: %s', will_navigate);
                logger.info(__filename, 'Sent from the page\'s main frame: %s', main);
            };
            /**
             * This isn't working for some reason
             */
            page.onClosing = function(closing_page) {
                ph.watchr.scrapping--;
                logger.info(__filename, 'Page.onClosing. URL: %s', closing_page.url);
            };
            page.open(options.url, function (error, status) {
                if (error) {
                    logger.error(__filename, 'page.open: ', error);
                    ph.watchr.scrapping--;
                    page.close();
                    return
                }
                if (status !== 'success') {
                    logger.error(__filename, 'page.open status: ', status);
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
                                    if (options.css) {return $(options.css).text();}
                                    else
                                    if (options.xpath) {
                                        return document.evaluate(
                                            '//*[@id="top-story"]/h2/a', document, null, XPathResult.STRING_TYPE, null
                                        ).stringValue;
                                    }
                                },
                                function (error, result) {
                                    if (error) {
                                        logger.error(__filename, 'page.evaluate: %s', error);
                                        ph.watchr.scrapping--;
                                        $deferred.reject({
                                            error: true,
                                            type: 'phantom',
                                            message: error
                                        });
                                        page.close();
                                        return;
                                    }
                                    tries--;
                                    if (result) {
                                        $deferred.resolve(result);
                                        ph.watchr.scraped++;
                                        ph.watchr.scrapping--;
                                        logger.info(__filename, 'found result, close page. Result = ', result);
                                        page.close();
                                    }
                                    if (tries === 0) {
                                        logger.info(__filename, 'ran out of tries, closing page');
                                        $deferred.reject({
                                            error: true,
                                            type: 'phantom',
                                            message: 'The selector didn\'t return any result after 10 seconds'
                                        });
                                        page.close();
                                    }
                                    if (tries > 0 && !result) check(tries);
                                }, options
                            );
                        });
                    }, stall);
                }(times);
                page.render('renders/lastpage.png');
            });
        });
    });
    return $deferred.promise();
};
