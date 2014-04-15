(function () {
    "use strict";
    /*
     * smpRegistration.js
     * @Author: Brenton O'Callaghan [callaghan001<at>gmail<dot>com]
     * @Date: 15th April 2014
     * @Description: A basic script that connects to an SMP (SAP Mobility Platform v 3.0 SP2)
     *               server and registers the user to retrieve data.
     *               In this case we have network edge authentication in the form
     *               of a client certificate and then a username/password challenge
     *               on the SMP server itself.
     *
     * @requires: node.js basic installation
     * @usage: node smpRegistration.js
     */
    
    /* == JSLint directives == */
    /*global require, console  */
    
    var https = require('https'),   // using the HTTPS library to make all requests.
        fs = require('fs'),         // We use the FS library to read the certs and POST payload.
        options,                    // The options for the request object (headers, auth, host etc.).
        req,                        // The https request object itself.
        data,                       // The data payload/body for the POST request.
        debug = false,              // Our debug flag for outputting more info.
        privateKeyLocation,         // The location of our client cert private key (.pem)
        publicKeyLocation,          // The location of our client cert public key.
        userChallengeCredentials,   // The user's credentials encoded for web transfer e.g. 'Basic QWxhZGRpbjpvcGVuIHNlc2FtZQ=='
        payloadFileLocation;        // The location on disk of the POST payload (not included here for tidyness).
                                    // - An exmaple of a pyload content can be seen at http://bit.ly/smpRARP 
                                    // - under the "Request minimal body" section.
    
    // Set our file locations
    payloadFileLocation = 'payload.xml';
    privateKeyLocation = 'C:\\priKey.pem';
    publicKeyLocation = 'C:\\pubKey.pem';
    userChallengeCredentials = 'Basic MzIxOjMyMQ==';
    
    // Setup the request options
    options = {
        hostname: 'gblonlab02',                             // Hostname of the SMP server.
        port: 8082,                                         // The default port for this would normally be 8081.
        path: '/odata/applications/latest/com.bf.test/Connections', // The SMP registration URL for the app com.bf.test
        method: 'POST',                                     // All registration requests are POSTs
        key: fs.readFileSync(privateKeyLocation),           // The private key of the client certificate identifying the user.
        cert: fs.readFileSync(publicKeyLocation),           // The public key of the client certificate identifying the user.
        headers: {
            'Content-Type': 'application/xml',              // The content type of the payload for the POST (prob XML or JSON).
            'Authorization' : userChallengeCredentials      // Encoded username and password for the user to the SMP server.
        },
        rejectUnauthorized: false                           // We need this if the CA we are using is self signed.
    };
    
    // Construct the request and the callback handlers.
    req = https.request(options, function (res) {
        
        // Output the registration return code (201 = success)
        console.log('Registration return code: ' + res.statusCode);
        
        // If the response code is not 201 we switch on debug mode.
        if (res.statusCode === 201) {
            console.log('Successful registration');
        } else {
            debug = true;
        }
        
        // If we need to, output the headers of the response
        // The unique connection ID provided by SMP is used for any future data requests.
        if (debug) {
            console.log('HEADERS: ' + JSON.stringify(res.headers));
        }
        
        // Set the encoding on the response.
        res.setEncoding('utf8');
        
        // Function for handling when we receive any data back from the server.
        res.on('data', function (chunk) {
            if (debug) {
                console.log('BODY: ' + chunk);
            }
        });
    });
    
    // If the request errors we output the error.
    req.on('error', function (e) {
        console.log('problem with request: ' + e.message);
    });

    // Read in the POST payload from a file somewhere.
    data = fs.readFileSync(payloadFileLocation);
    
    // write data to request body
    req.write(data);
    
    // Complete the request.
    req.end();
}());