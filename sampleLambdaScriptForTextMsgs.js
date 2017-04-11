'use strict';

const AWS = require('aws-sdk');

const SNS = new AWS.SNS({ apiVersion: '2010-03-31' });
const PHONE_NUMBER = '1-555-555-5555'; // change it to your phone number

exports.handler = (event, context, callback) => {
    
    var simpleHello = 'Your LIFX bulb is on and emitting a white light.';
    var helpNeeded = 'Your LIFX bulb is on and emitting a blue light.';
    var emergency = 'Your LIFX bulb has been turned off.';
    
    console.log('Received event:', event);

    console.log(`Sending SMS to ${PHONE_NUMBER}`);
    
    var message = simpleHello;
    
    if(event.clickType == "DOUBLE"){
        message = helpNeeded;
    }
    if(event.clickType == "LONG"){
        message = emergency;
    }
    
    const params = {
        PhoneNumber: PHONE_NUMBER,
        Message: message,
    };
    // result will go to function callback
    SNS.publish(params, callback);
};