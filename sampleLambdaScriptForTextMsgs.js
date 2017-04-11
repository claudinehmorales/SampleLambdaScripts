'use strict';

const AWS = require('aws-sdk');

const SNS = new AWS.SNS({ apiVersion: '2010-03-31' });
const PHONE_NUMBER = '1-555-555-5555'; // change it to your phone number

exports.handler = (event, context, callback) => {
    
    var whiteLightOn = 'Your LIFX bulb is on and emitting a white light.';
    var blueLightOn = 'Your LIFX bulb is on and emitting a blue light.';
    var lightOff = 'Your LIFX bulb has been turned off.';
    
    console.log('Received event:', event);

    console.log(`Sending SMS to ${PHONE_NUMBER}`);
    
    var message = whiteLightOn;
    
    if(event.clickType == "DOUBLE"){
        message = blueLightOn;
    }
    if(event.clickType == "LONG"){
        message = lightOff;
    }
    
    const params = {
        PhoneNumber: PHONE_NUMBER,
        Message: message,
    };
    // result will go to function callback
    SNS.publish(params, callback);
};