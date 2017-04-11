var https = require('https'); 
var lifxApiHost = 'api.lifx.com'; 

// your API token generated from https://cloud.lifx.com/settings
var lifxapitoken = '<yourToken>'; 
var selector = 'all'; 

var longClick = {
    "power": "off", 
    "duration" : 0
}; 

var singleClick = { 
    "power": "on", 
    "brightness": 1, 
    "color": "white", 
    "duration" : 0 
}; 

var doubleClick = { 
    "power": "on", 
    "brightness": 0.5, 
    "color": "blue", 
    "duration" : 0 
}; 

function getRequestOptions(reqPath, reqMethod, reqContentLength) { 
    var reqheaders = { 
        'Accept': '*/*', 
        'Authorization': 'Bearer ' + lifxapitoken, 
        'content-type': 'application/json', 
        'content-length': reqContentLength 
    }; 
    var options = { 
        host: lifxApiHost, 
        path: reqPath, 
        method: reqMethod, 
        headers: reqheaders 
    }; 
    //console.log("LIFX request options: ", options); 
    return options; 
} 

function setState(requestData, callback) { 
    var options = getRequestOptions('/v1/lights/' + selector + '/state', 'PUT', Buffer.byteLength(requestData)); console.log('Try to call https://' + options.host + options.path); 
    console.log('Request Data = ', requestData); 
    // Create the HTTP request and // make the API call. 
    var req = https.request(options, function(res) { 
        // Log the status code... 
        console.log('setState(): Status Code = ', res.statusCode); 
        var responseBody = ''; 
        res.setEncoding('utf-8'); 
        res.on('data', function(data) { 
            console.log('response body: ' + data); 
            responseBody += data; 
        }); 
        res.on('end', function() { 
            // Any result in 2xx is OK. 
            if (res.statusCode >= 200 && res.statusCode <= 299) { 
                console.log('setState() was successful.'); 
                callback(true, responseBody); 
            } else { 
                console.log('setState() was failed.'); 
                callback(false, responseBody); 
            } 
        }); 
    }).on('error', function(e) { 
        console.log('setState() failed: '+ e.message); 
        callback(false, 'setState() failed: '+ e.message); 
    }); 
    req.write(requestData); 
    req.end(); 
} 

exports.handler = function(event, context) { 
    console.log('Called handler()'); 
    console.log('ClickType: ' + event.clickType); 
    switch(event.clickType) { 
        case "SINGLE": 
            state = singleClick; 
            break; 
        case "DOUBLE": 
            state = doubleClick; 
            break; 
        case "LONG": 
            state = longClick; 
            break; 
        default: console.log('Unknown clickType: ' + event.clickType); 
            context.fail('Unknown clickType: ' + event.clickType); 
            return; 
    } 
    var requestData = JSON.stringify(state); 
    setState(requestData, function(result, responseBody) { 
        if (result) { 
            console.log('The process completed successfully.'); 
            context.succeed(responseBody); 
        } else { 
            console.log('The process completed with errors.'); 
            context.fail(responseBody); 
        } 
    }); 
};

