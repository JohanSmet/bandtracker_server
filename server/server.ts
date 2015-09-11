///////////////////////////////////////////////////////////////////////////////
//
// File 	: 	input/motion/device_factory.cpp
//
// Purpose	: 	create motion input devices
//
// Copyright (c) 2015	Johan SMET      All rights reserved
//
///////////////////////////////////////////////////////////////////////////////

import mongoose = require('mongoose');
import express  = require('express');

import cfg_db   = require('config/db');
import cfg_http = require('config/http');

///////////////////////////////////////////////////////////////////////////////
//
// setup express
//

var app = express();

///////////////////////////////////////////////////////////////////////////////
//
// setup mongodb / mongoose
//

mongoose.connect(cfg_db.url);

mongoose.connection.on('error', console.error.bind(console, 'connection error:'));
mongoose.connection.once('open', function (callback) {

    // start web-service
    var server = app.listen(cfg_http.port, function () {
    });

});