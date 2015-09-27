﻿///////////////////////////////////////////////////////////////////////////////
//
// File 	: 	BandController.ts
//
// Purpose	: 	access/modify tourdates
//
// Copyright (c) 2015	Johan SMET      All rights reserved
//
///////////////////////////////////////////////////////////////////////////////

import mongoose     = require('mongoose');
import express      = require('express');
import bodyParser   = require('body-parser');

import Band     = require('../model/Band');

var router = express.Router();
var jsonParser = bodyParser.json()

///////////////////////////////////////////////////////////////////////////////
//
// list all bands
//

router.get('/', function (request: express.Request, response: express.Response) {
    Band.repository.find(function (err, res) {
        response.send(res);
    });
});

///////////////////////////////////////////////////////////////////////////////
//
// find by name
//

router.get('/find-by-name', function (request: express.Request, response: express.Response) {
    
    // XXX escape query variables

    var f_lang = ('lang' in request.query) ? request.query.lang : 'en';

    Band.repository.aggregate()
        .match({ 'name': new RegExp('.*' + request.query.name + '.*', 'i') })
        .project({ _id: 0, MBID: 1, name: 1, genre: 1, imageUrl: 1, biography: `$biography.${f_lang}` })
        .sort('name')
        .exec(function (err, res) {
            if (err)
                return response.send(400, err);
            if (!res)
                return response.sendStatus(404);

            response.send(res);
        });
});

///////////////////////////////////////////////////////////////////////////////
//
// fetch a particular band
//

router.get('/:id', function (request: express.Request, response: express.Response) {
    Band.repository.findOne({ 'MBID': request.params.id }, function (err, res) {
        if (err)
            return response.send(400, err);
        if (!res)
            return response.sendStatus(404);

        response.send(res);
    });
});

///////////////////////////////////////////////////////////////////////////////
//
// insert/update a particular band
//

router.post('/', jsonParser, function (request: express.Request, response: express.Response) {
    // XXX validate request body   

    // update database
    Band.repository.findOneAndUpdate({ 'MBID': request.body.MBID }, request.body, { upsert: true }, function (err, res) {
        if (err)
            return response.send(400, err);

        response.send(res);
    });
});

export = router;