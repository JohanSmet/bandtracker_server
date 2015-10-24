///////////////////////////////////////////////////////////////////////////////
//
// File 	: 	VenueController.ts
//
// Purpose	: 	access venues
//
// Copyright (c) 2015	Johan SMET      All rights reserved
//
///////////////////////////////////////////////////////////////////////////////

import mongoose = require('mongoose');
import express  = require('express');

import auth     = require('../middleware_auth');
import TourDate = require('../model/TourDate');

var router = express.Router();

///////////////////////////////////////////////////////////////////////////////
//
// find
//

router.get('/find', auth.requireApp, function (request: express.Request, response: express.Response) {
    
    // XXX escape query variables
    var f_query = { venue: new RegExp(request.query.pattern, "i") };
    
    if ("city" in request.query) {
        f_query["city"] = new RegExp(request.query.city, "i");
    }

    if ("country" in request.query) {
        f_query["countryCode"] = request.query.country;
    }

    TourDate.repository.aggregate()
        .match(f_query)
        .group({ _id: "$venue" })
        .project({ _id: 0, venue: "$_id" })
        .sort('venue')
        .exec(function (err, res) {
            if (err)
                return response.send(400, err);
            if (!res)
                return response.sendStatus(404);

            var f_result: string[] = [];
            
            for (var f_idx = 0; f_idx < res.length; ++f_idx) {
                f_result.push(res[f_idx].venue);
            }

            response.json(f_result);
        });
});

export = router;