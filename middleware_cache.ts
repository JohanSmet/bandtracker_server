///////////////////////////////////////////////////////////////////////////////
//
// File 	: 	middleware_cache.ts
//
// Purpose	: 	caching middleware
//
// Copyright (c) 2015	Johan SMET      All rights reserved
//
//////////////////////////////////////////////////////////////////////////////

import express = require('express');

export function short(request: express.Request, response: express.Response, next: Function) {
    response.setHeader("Cache-Control", "max-age=300");         // 5 minutes
    next();
}

export function medium(request: express.Request, response: express.Response, next: Function) {
    response.setHeader("Cache-Control", "max-age=43200");       // 12 hours
    next();
}

export function long(request: express.Request, response: express.Response, next: Function) {
    response.setHeader("Cache-Control", "max-age=2592000");     // 30 days
    next();
}
