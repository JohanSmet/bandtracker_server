///////////////////////////////////////////////////////////////////////////////
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

import auth     = require('../middleware_auth');
import Band     = require('../model/Band');

var router = express.Router();
var jsonParser = bodyParser.json()

///////////////////////////////////////////////////////////////////////////////
//
// list all bands
//

router.get('/', auth.requireApp, function (request: express.Request, response: express.Response) {
    Band.repository.find(function (err, res) {
        response.send(res);
    });
});

///////////////////////////////////////////////////////////////////////////////
//
// find by name
//

router.get('/find-by-name', auth.requireApp, function (request: express.Request, response: express.Response) {
    
    // XXX escape query variables

    var f_lang = ('lang' in request.query) ? request.query.lang : 'en';

    Band.repository.aggregate()
        .match({
            'name': new RegExp('.*' + request.query.name + '.*', 'i'),
            'recordStatus': Band.RecordStatus.Released
         })
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
// list a selection of bands
//

router.get("/list", auth.requireAdmin, function (request: express.Request, response: express.Response) {

    // XXX escape query variables
    var p_lang  = ("lang"  in request.query) ? request.query.lang : "en";
    var p_count = ("count" in request.query) ? parseInt(request.query.count) : 100;
    var p_skip  = ("skip"  in request.query) ? parseInt(request.query.skip) : 0;
    var p_sort  = ("sort"  in request.query) ? request.query.sort : "name";
    
    // construct query
    var f_match = {
        recordStatus: { $gte: Band.RecordStatus.New }
    }
    if ("source" in request.query) {
        f_match["bioSource"] = new RegExp(request.query.source, "i");
    }
    if ("name" in request.query) {
        f_match["name"] = new RegExp(request.query.name, "i");
    }
    if ("nobio" in request.query) {
        f_match[`biography.${p_lang}`] = { $exists: false };
    }
    if ("nodiscogs" in request.query) {
        f_match["discogsId"] = "";
    }

    // execute query
    Band.repository.aggregate()
        .match(f_match)
        .project({ _id: 0, MBID: 1, discogsId: 1, name: 1, genre: 1, imageUrl: 1, bioSource: 1, biography: `$biography.${p_lang}`, recordStatus: 1, lastChanged: 1 })
        .sort(p_sort)
        .skip(p_skip)
        .limit(p_count)
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

router.get('/:id', auth.requireApp, function (request: express.Request, response: express.Response) {
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

router.post('/', auth.requireAdmin, jsonParser, function (request: express.Request, response: express.Response) {
    // XXX validate request body   

    // update database
    Band.repository.findOneAndUpdate({ 'MBID': request.body.MBID }, request.body, { upsert: true }, function (err, res) {
        if (err)
            return response.send(400, err);

        response.send(res);
    });
});

export = router;