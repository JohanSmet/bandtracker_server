///////////////////////////////////////////////////////////////////////////////
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

import BandController = require('./controller/BandController');

///////////////////////////////////////////////////////////////////////////////
//
// setup express
//

var app = express();

app.use('/api/bands', BandController);

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