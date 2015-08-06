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
        // Build up the key
        var key = {
            email: event.email,
            date: moment().utc().format('YYYY-MM-DD[T]HH:mm:ss[Z]')
        };
        
        // Build up the body
        var body = {
            selfie: event.selfie,
            active: 1
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