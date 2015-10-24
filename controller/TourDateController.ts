///////////////////////////////////////////////////////////////////////////////
//
// File 	: 	TourDateController.ts
//
// Purpose	: 	access/modify tourdates
//
// Copyright (c) 2015	Johan SMET      All rights reserved
//
///////////////////////////////////////////////////////////////////////////////

import mongoose     = require('mongoose');
import express      = require('express');
import bodyParser   = require('body-parser');

import TourDate = require('../model/TourDate');

var router = express.Router();
var jsonParser = bodyParser.json()

router.get('/list', function (request: express.Request, response: express.Response) {
    TourDate.repository.find(function (err, res) {
        response.send(res);
    });
});

router.get('/listByBand/:band', function (request: express.Request, response: express.Response) {
    TourDate.repository.find({ 'm_artist': request.params.band }, function (err, res) {
        response.send(res);
    });
});

export = router;

