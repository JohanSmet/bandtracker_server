///////////////////////////////////////////////////////////////////////////////
//
// File 	: 	middleware_auth.ts
//
// Purpose	: 	authentication middleware
//
// Copyright (c) 2015	Johan SMET      All rights reserved
//
//////////////////////////////////////////////////////////////////////////////

import express      = require('express');
import jsonwebtoken = require('jsonwebtoken');

import cfg_auth     = require('./config/auth');

function validateToken(request: express.Request, response: express.Response, next: Function, needRoles: string[]) {
    // check header or url parameters or post parameters for token
    var token = request.headers['x-access-token'];

    if (!token && 'access-token' in request.query) {
        token = request.query['access-token']
    }

    if (token) {
        // verify validity
        jsonwebtoken.verify(token, cfg_auth.secret, function (err, decoded) {
            if (err) {
                return response.status(403).json({ success: false, message: 'invalid token' });
            }
        
            // check for required role
            var matches = decoded.roles.filter(role => needRoles.indexOf(role) >= 0);
            
            if (matches.length <= 0) {
                return response.status(403).json({ success: false, message: 'insufficient privileges' });
            }

            next();
        });
    } else {
        return response.status(403).json({ success: false, message: 'no token' });
    }
}

export function requireAuth(request: express.Request, response: express.Response, next: Function) {
    return validateToken(request, response, next, ["ADMIN", "APP"]);
}

export function requireAdmin(request: express.Request, response: express.Response, next: Function) {
    return validateToken(request, response, next, ["ADMIN"]);
}

export function requireApp(request: express.Request, response: express.Response, next: Function) {
    return validateToken(request, response, next, ["APP"]);
}