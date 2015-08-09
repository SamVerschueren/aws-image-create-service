'use strict';

/**
 * This microservice inserts the post data in the DynamoDB database.
 * 
 * @author Sam Verschueren      <sam.verschueren@gmail.com>
 * @since  26 Jul. 2015
 */

// module dependencies
var db = require('dynongo'),
    moment = require('moment'),
    Q = require('q');

// connect with the database
db.connect();

var Selfie = db.table('Selfie');
 
/**
 * Main entrypoint of the service.
 * 
 * @param {object}  event       The data regarding the event.
 * @param {object}  context     The AWS Lambda execution context.
 */
exports.handler = function(event, context) {
    Q.fcall(function() {
        // Parse the date provided
        var date = moment(event.date);
        
        // Build up the key
        var key = {
            id: event.email + '-' + getRandomInt(1, 200),
            date: date.format()
        };
        
        // Build up the body
        var body = {
            email: event.email,
            image: event.image,
            day: date.format('YYYY-MM-DD')
        };
        
        if(event.description) {
            // Add the description if a description is provided
            body.description = event.description;
        }
        
        // Insert the selfie in the database
        return Selfie.insert(key, body).exec();
    }).then(function() {
        // Selfie successfully inserted
        context.succeed();
    }).catch(function(err) {
        // Print the error if something went wrong
        console.error(err, err.stack);
        
        // Something went wrong
        context.fail(err);
    });
};

/**
 * Returns a random integer between min (inclusive) and max (inclusive)
 * Using Math.round() will give you a non-uniform distribution!
 */
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}