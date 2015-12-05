///////////////////////////////////////////////////////////////////////////////
//
// File 	: 	RestClient.ts
//
// Purpose	: 	Access a REST Web API
//
// Copyright (c) 2015	Johan SMET      All rights reserved
//
///////////////////////////////////////////////////////////////////////////////

import querystring = require("querystring");
import http = require("http");
import https = require("https");

export function request(server: string, endpoint: string, params: { [key: string]: string; }, options: { [key: string]: any; }, success: (result: any) => void) {

    var strData = JSON.stringify(params);
    var headers  = options["headers"] || {};
    var method   = options["method"] || "GET";
    var protocol = options["protocol"] || "https";

    // handle parameters
    if (method == "GET") {
        endpoint += "?" + querystring.stringify(params);
    } else {
        headers["Content-Type"]   = "application/json";
        headers["Content-Length"] = strData.length.toString();
    }

    // request options
    var reqOptions = {
        host: server,
        path: endpoint,
        method: method,
        headers: headers
    };

    if ("port" in options) {
        reqOptions["port"] = options["port"];
    }

    // request callback
    var f_callback = function (res: http.IncomingMessage) {
        res.setEncoding("utf-8");

        var responseString: string = "";

        res.on('data', function (data) {
            responseString += data;
        });

        res.on('end', function () {
            var responseObject = JSON.parse(responseString);
            success(responseObject);
        });
    };

    // perform request
    var request = (protocol == "https") ? https.request(reqOptions, f_callback) : http.request(reqOptions, f_callback);

    if (method != "GET") {
        request.write(strData);
    }

    request.end();
}
