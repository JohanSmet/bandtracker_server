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

import auth         = require('../middleware_auth');
import Task         = require('../model/Task');

var router = express.Router();
var jsonParser = bodyParser.json()

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

router.post("/tour-list-fm", auth.requireAdmin, function (request: express.Request, response: express.Response) {
    // XXX validate request body   
    var f_band = request.query.band; 

    for (var f_year = 2015; f_year >= 2000; --f_year) {
        Task.createNew("setlistFmTourDates", [f_band, f_year]).save();
    }

    response.json({ "done": 1 });

});

export = router;