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
import cache        = require('../middleware_cache');
import TourDate     = require('../model/TourDate');

var router = express.Router();
var jsonParser = bodyParser.json()

///////////////////////////////////////////////////////////////////////////////
//
// find
//

router.get('/find', auth.requireApp, cache.medium, function (request: express.Request, response: express.Response) {
    
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
                return response.status(400).send(err);
            if (!tourdates)
                return response.sendStatus(404);

            response.json(tourdates);
        });
});

///////////////////////////////////////////////////////////////////////////////
//
// band-years : get all years with known tourdates for specified band
//

router.get("/band-years-count", auth.requireApp, function (request: express.Request, response: express.Response) {

    var f_query = { bandId: request.query.band };

    TourDate.repository.aggregate()
        .match(f_query)
        .project({ _id: 0, year: { $year: "$startDate" } })
        .group({ _id: "$year", count: { $sum: 1 } })
        .sort("_id")
        .project({ _id: 0, year: "$_id", count: 1 })
        .exec(function (err, res: any) {
            if (err)
                return response.status(400).send(err);
            if (!res)
                return response.sendStatus(404);

            response.json(res);
        });
});

router.get("/band-years", auth.requireApp, cache.medium, function (request: express.Request, response: express.Response) {

    var f_query = { bandId: request.query.band };

    TourDate.repository.aggregate()
        .match(f_query)
        .project({ _id: 0, year: { $year: "$startDate" } })
        .group({ _id: "$year" })
        .sort("_id")
        .exec(function (err, res : any) {
            if (err)
                return response.status(400).send(err);
            if (!res)
                return response.sendStatus(404);

            var f_result: string[] = [];

            for (var f_idx = 0; f_idx < res.length; ++f_idx) {
                f_result.push(res[f_idx]._id);
            }

            response.json(f_result);
        });
});



export = router;

