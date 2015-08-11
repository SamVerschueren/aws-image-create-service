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
    // Log the event for debugging purposes
    console.log(event);
    
    Q.fcall(function() {
        // Parse the date provided
        var date = moment(event.date);
        
        // Build up the key
        var key = {
            id: date.format('YYYY-MM-DD'),
            dateId: date.format() + '_' + event.id
        };
        
        // Build up the body
        var body = {
            date: date.format(),
            name: event.name,
            email: event.email,
            image: event.image
        };
        
        if(event.description) {
            // Add the description if a description is provided
            body.description = event.description;
        }
        
        // Insert the selfie in the database
        return Selfie.insert(key, body).exec();
    }).then(function(item) {
        // Selfie successfully inserted
        context.succeed(item);
    }).catch(function(err) {
        // Print the error if something went wrong
        console.log(err, err.stack);
        
        // Something went wrong
        context.fail(err);
    });
};