///////////////////////////////////////////////////////////////////////////////
//
// File 	: 	BandTrackerClient.ts
//
// Purpose	: 	Access the BandTracker API
//
// Copyright (c) 2015	Johan SMET      All rights reserved
//
///////////////////////////////////////////////////////////////////////////////

import RestClient = require("./RestClient");
import cfg_http = require("../../config/http");

// authentication
export function login(username: string, password: string, callback: (success: boolean, token: string, error: string) => void) {
    var params: { [key: string]: string; } = {
        name: username,
        passwd: password
    };

    var options: { [key: string]: any; } = {
        port: cfg_http.port,
        protocol: cfg_http.protocol,
        method: "POST"
    };

    RestClient.request(cfg_http.host, "/api/auth/login", params, options, function (result) {
        callback(result.success, result.token, result.error);
    });
}

// bands
export function bandList(count: number, skip: number, token: string, callback: (bands: [any]) => void) {

    var params: { [key: string]: string; } = {
        skip: skip.toString(),
        count: count.toString()
    };

    var options: { [key: string]: any; } = {
        port: cfg_http.port,
        protocol: cfg_http.protocol,
        headers: {
            "x-access-token": token
        }
    };

    RestClient.request(cfg_http.host, "/api/bands/list", params, options, function (bands) {
        callback(bands);
    });
}
