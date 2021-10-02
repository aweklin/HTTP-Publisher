// dependency imports
const http = require('http');
const Subscription = require('../models/subscription');

/**
 * 
 * Lists all subscribed topics to ease publishing.
 * 
 * @param {*} request 
 * @param {*} response 
 * @param {*} next 
 */
exports.get_all_topics = (request, response, next) => {
    Subscription
        .find()
        .distinct('topic', (error, topics) => {
            if (error) {
                return response.status(500).json({ error: error.message });
            }

            return response.status(200).json({ topics: topics });
        });
}

/**
 * 
 * Publishes a given topic to all subscribers. 
 * This endpoint expects topic in path paramater, and the (JSON) body to publish.
 * 
 * @param {*} request 
 * @param {*} response 
 * @param {*} next 
 * @returns 
 */
exports.publish_topic = (request, response, next) => {
    // some validations
    const topic = request.params.topic;
    if (!topic) {
        return response.status(500).json({
            error: {
                message: 'Topic is required in the request path.'
            }
        });
    }
    const keys = Object.keys(request.body);
    if (keys.length == 0) {
        return response.status(500).json({
            error: {
                message: 'Data to publish is required in the request body.'
            }
        });
    }

    const postedData = JSON.stringify(request.body);

    // confirm the topic exists
    console.log(`Searching for topic: ${topic}...`);
    Subscription
        .findOne({ topic: topic })
        .exec()
        .then(topicSearchResult => {
            if (!topicSearchResult) {
                return response.status(404).json({
                    error: {
                        message: `${topic} is not a valid topic`
                    }
                });
            }
            
            console.log('Topic found, fetching subscribers...');

            // get all subscribers for this topic
            Subscription
                .find({ topic: topic })
                .select('url')
                .exec()
                .then(subscribers => {
                    if (subscribers.length < 1) {
                        return response.status(200).json({
                            message: 'No subscriber found to publish the topic to'
                        });
                    }

                    const promise = new Promise((resolve, reject) => {
                        subscribers.forEach(item => {
                            const subscriberURL = new URL(item.url);
                            const actionAndParams = (subscriberURL.pathname ?? '') + (subscriberURL.search ?? '');
                            const options = {
                                url: `${subscriberURL.protocol}//${subscriberURL.hostname}`,
                                path: (actionAndParams ?? '/'),
                                method: 'POST',
                                port: subscriberURL.port,
                                headers : {
                                    'Content-Type': 'application/json'
                                }
                            };
                            const fullUrl = options.url + ':' + options.port + options.path;
                            console.log(`Publishing ${topic} to ${item.url}...`);
                            console.log(fullUrl);
    
                            const req = http.request(options, (res) => {
                                console.log(`Response received from ${item.url}:`);

                                if (subscribers.length == subscribers.indexOf(item) + 1) {
                                    resolve('Complete');
                                }
                            });
    
                            req.on('error', (err) => {
                                console.log(`Error received while publishing ${topic} to ${item.url}`);
                            });
    
                            req.write(postedData);
                            req.end();
                        });
                    });
                    
                    promise.then(data => {
                        const completionResponse = `${topic} published to ${subscribers.length} subscriber${subscribers.length > 1 ? 's' : ''} successfully.`;
                        response.status(200).json({ 
                            message: completionResponse
                        });
                        console.log(completionResponse);
                    })
                    .catch(error => {
                        response.status(500).json({
                            error: {
                                message: error.message
                            }
                        });
                    });
                })
                .catch(error => {
                    response.status(500).json({
                        error: {
                            message: error.message
                        }
                    });
                });
        }).catch(error => {
            response.status(500).json({
                error: {
                    message: error.message
                }
            });
        });    
}