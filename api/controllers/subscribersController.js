// dependency imports
const mongoose = require('mongoose');
const Subscription = require('../models/subscription');
const Utils = require('../infrastructure/utils');

/**
 * 
 * This endpoint allows users/server to subscribe to a top. The topic is then saved against the subscriber in MongoDB.
 * Topic is requied as a path param and url is expected in the request body.
 * 
 * @param {*} request 
 * @param {*} response 
 * @param {*} next 
 * @returns 
 */
exports.subscribe = (request, response, next) => {
    // some validations
    if (!request.params.topic) {
        return response.status(500).json({
            error: {
                message: 'Please parse topic in the request path. Example: http://localhost:9000/subscribe/topic'
            }
        });
    }
    if (!request.body.url) {
        return response.status(500).json({
            error: {
                message: 'Please parse url in the body of your request. Example: { "url": "http://mysubscriber.test" }'
            }
        });
    }
    
    // temporarily store the posted data 
    const topic = request.params.topic;
    const url = request.body.url;
    if (!Utils.isValidURL(url)) {
        return response.status(500).json({
            error: {
                message: `${url} is not a valid URL.`
            }
        });
    }

    // confirm user hasn't already subscribed to this topic to avoid duplication
    Subscription
        .findOne({ topic: topic, url: url })
        .exec()
        .then(existenceCheck => {
            if (existenceCheck) {
                return response.status(201).json({
                    error: {
                        message: `${url} already subscribed to ${topic}.`
                    }
                });
            }

            // proceed to save subscription
            const subscription = new Subscription({
                _id: new mongoose.Types.ObjectId(),
                topic: topic,
                url: url
            });
        
            subscription.save().then(result => {
                console.log(result);
                const data = {
                    topic: topic,
                    url: url
                };
                response.status(200).json(data);
            }).catch(error => {
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