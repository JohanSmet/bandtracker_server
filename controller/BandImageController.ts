///////////////////////////////////////////////////////////////////////////////
//
// File 	: 	BandImageController.ts
//
// Purpose	: 	access band images
//
// Copyright (c) 2015	Johan SMET      All rights reserved
//
///////////////////////////////////////////////////////////////////////////////

import mongoose = require('mongoose');
import express  = require('express');

import auth = require('../middleware_auth');
import BandImage = require('../model/BandImage');

var router = express.Router();

router.get('/:id', auth.requireAuth, function (request: express.Request, response: express.Response) {
    BandImage.repository.findOne({ 'bandId': request.params.id }, function (err, res) {
        if (err)
            return response.send(400, err);
        if (!res)
            return response.sendStatus(404);

        response.writeHead(200, { 'Content-Type': 'image/jpeg' })
        response.end(res.image, 'binary');
    });
});

export = router;