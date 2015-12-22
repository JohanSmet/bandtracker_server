///////////////////////////////////////////////////////////////////////////////
//
// File 	: 	TaskController.ts
//
// Purpose	: 	access/create tasks
//
// Copyright (c) 2015	Johan SMET      All rights reserved
//
///////////////////////////////////////////////////////////////////////////////

import mongoose     = require('mongoose');
import express      = require('express');
import bodyParser   = require('body-parser');
import async        = require("async");

import auth         = require('../middleware_auth');
import Task         = require('../model/Task');

var router = express.Router();
var jsonParser = bodyParser.json()

///////////////////////////////////////////////////////////////////////////////
//
// retrieve a list of tasks
//

router.get("/", auth.requireAdmin, function (request: express.Request, response: express.Response) {

    var p_status = ("status" in request.query) ? request.query.status : "any";
    var f_match = {}
    
    if (p_status == "open") {
        f_match["dateExecuted"] = null;
    } else if (p_status == "done") {
        f_match["dateExecuted"] = { $ne: null };
    }

    Task.repository.find(f_match)
                    .sort("-dateCreated")
                    .exec(function (err, res) {
        response.json(res);
    });
});


///////////////////////////////////////////////////////////////////////////////
//
// create tasks to parse the known URLS of a band on MusicBrainz
//  input = array of MBID
//

router.post("/mb-urls", auth.requireAdmin, jsonParser, function (request: express.Request, response: express.Response) {

    var f_bands = <Array<string>> request.body.bands;

    async.each(f_bands, function (bandId: string, callback: any) {
        Task.createNew("musicBrainzUrl", [bandId]).save(callback);
    }, function (error) {
        response.json({ "done": f_bands.length });
    });
});

///////////////////////////////////////////////////////////////////////////////
//
// create tasks to download tourlists from wikipedia
//

router.post('/tour-list', auth.requireAdmin, jsonParser, function (request: express.Request, response: express.Response) {
    // XXX validate request body   

    var f_data = <Array<any>> request.body.list;
    var f_todo = f_data.length;

    f_data.forEach(function (taskUrl: string) {
        Task.createNew("wikipediaTourList", [taskUrl]).save();

        // feedback
        --f_todo;
        if (f_todo <= 0) {
            response.json({ "done": f_data.length });
        }
    });
})

///////////////////////////////////////////////////////////////////////////////
//
// create tasks to download tourlists from setlist.fm
//

router.post("/tour-list-fm", auth.requireAdmin, function (request: express.Request, response: express.Response) {
    // XXX validate request body   
    var f_band = request.query.band; 

    for (var f_year = 2015; f_year >= 2000; --f_year) {
        Task.createNew("setlistFmTourDates", [f_band, f_year]).save();
    }

    response.json({ "done": 1 });

});

///////////////////////////////////////////////////////////////////////////////
//
// create tasks to download band information form discogs
//  input = array of MBIDs
//

router.post("/discogs_band_info", auth.requireAdmin, jsonParser, function (request: express.Request, response: express.Response) {

    var f_bands = <Array<string>> request.body.bands;

    async.each(f_bands, function (bandId: string, callback: any) {
        Task.createNew("discogsBandInfo", [bandId]).save(callback);
    }, function (error) {
        response.json({ "done": f_bands.length });
    });
});

export = router;