# HTTP Notification System

## Table of Contents
* [General Info](#general-information)
* [Setup](#setup)
* [Endpoints](#endpoints)
* [Testing](#testing)
* [Contact](#contact)
<!-- * [License](#license) -->


## Setup
- Please ensure you already have installed [Node](https://nodejs.org/)
- Clone the project to your local machine
- Navigate to the directory of the cloned project via Terminal and run `node server.js`


## General Information
This is HTTP notification system. A server (or set of servers) will keep track of topics -> subscribers where a topic is a string and a subscriber is an HTTP endpoint. When a message is published on a topic, it should be forwarded to all subscriber endpoints.


## Endpoints
- */subscribe/:topic*

    This endpoint allows users/server to subscribe to a top. The topic is then saved against the subscriber in MongoDB.
    Topic is requied as a path param and url is expected in the request body.

    Example:
    
    `http://localhost:8000/subscribe/php`

    Payload

    `{ "url": "http://localhost:9000/" }`

- */topics*

    Lists all subscribed topics to ease publishing as array of string. This is needed to ensure that you can publish only from the list of topics already subscribed to by users/servers.

- */publish/:topic*

    Publishes a given topic to all subscribers. 
    This endpoint expects topic in path paramater, and the (JSON) body to publish.


## Testing
You can unit test this api by running the following commands.

`npm test`

To do:
- Test routes & controllers


## Contact
Created by [aweklin@yahoo.com](mailto:aweklin@yahoo.com) - feel free to contact me!