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
        // Make sure the date is in utc
        var date = moment().utc().format('YYYY-MM-DD[T]HH:mm:ss[Z]');
        
        // Insert the selfie in the database
        return Selfie.insert({email: event.email, date: date}, {description: event.description || '', selfie: event.selfie}).exec();
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