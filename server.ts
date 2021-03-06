﻿///////////////////////////////////////////////////////////////////////////////
//
// File 	: 	server.ts
//
// Purpose	: 	main entry point of the server
//
// Copyright (c) 2015	Johan SMET      All rights reserved
//
///////////////////////////////////////////////////////////////////////////////

import mongoose = require('mongoose');
import express  = require('express');

import cfg_db   = require('./config/db');
import cfg_http = require('./config/http');

import BandController   = require('./controller/BandController');
import BandImageController  = require('./controller/BandImageController');
import AuthController   = require('./controller/AuthController');
import CountryController= require('./controller/CountryController');
import VenueController  = require('./controller/VenueController');
import CityController   = require('./controller/CityController');
import TourDateController = require('./controller/TourDateController');
import TaskController   = require('./controller/TaskController');

import KeyValueStore    = require('./KeyValueStore');
import TaskScheduler    = require('./background/TaskScheduler');

///////////////////////////////////////////////////////////////////////////////
//
// setup express
//

var app = express();

app.use('/api/bands',   BandController);
app.use('/api/bandImage',   BandImageController);
app.use('/api/auth',    AuthController);
app.use('/api/country', CountryController);
app.use('/api/venue',   VenueController);
app.use('/api/city',    CityController);
app.use('/api/tourdate', TourDateController);
app.use('/api/task',    TaskController);

///////////////////////////////////////////////////////////////////////////////
//
// setup mongodb / mongoose
//

mongoose.Promise = require('bluebird');
mongoose.connect(cfg_db.url, { useNewUrlParser: true });

mongoose.connection.on('error', console.error.bind(console, 'connection error:'));
mongoose.connection.once('open', function (callback) {

    // load state
    KeyValueStore.load();

    // start web-service
    var server = app.listen(cfg_http.port, cfg_http.host, function () {
    });

    // start background-tasks
    TaskScheduler.init();
});