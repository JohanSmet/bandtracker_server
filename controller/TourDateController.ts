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

import auth         = require('../middleware_auth');
import TourDate     = require('../model/TourDate');

var router = express.Router();
var jsonParser = bodyParser.json()

///////////////////////////////////////////////////////////////////////////////
//
// find
//

router.get('/find', auth.requireApp, function (request: express.Request, response: express.Response) {
    
    var f_query = TourDate.repository.find({ bandId: request.query.band });
                
    if ("start" in request.query) {
        f_query.where("endDate").gt(request.query.start);
    }

    if ("end" in request.query) {
        f_query.where("startDate").lt(request.query.end);
    }

    if ("country" in request.query) {
        f_query.where("countryCode").equals(request.query.country);
    }

    if ("location" in request.query) {
        f_query.or([{ venue: new RegExp(request.query.location, "i") },
                    { city:  new RegExp(request.query.location, "i") } ]);
    }

    f_query
        .sort("startDate")
        .exec(function (err, tourdates) {
            if (err)
                return response.send(400, err);
            if (!tourdates)
                return response.sendStatus(404);

            response.json(tourdates);
        });
});


export = router;

