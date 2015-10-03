///////////////////////////////////////////////////////////////////////////////
//
// File 	: 	CountryController.ts
//
// Purpose	: 	access/modify contries
//
// Copyright (c) 2015	Johan SMET      All rights reserved
//
///////////////////////////////////////////////////////////////////////////////

import mongoose     = require('mongoose');
import express      = require('express');
import bodyParser   = require('body-parser');

import auth         = require('../middleware_auth');
import Country      = require('../model/Country');
import KeyValueStore = require('../KeyValueStore');

var router = express.Router();
var jsonParser = bodyParser.json()

///////////////////////////////////////////////////////////////////////////////
//
// list all countries
//

router.get('/', auth.requireApp, function (request: express.Request, response: express.Response) {
    Country.repository.find(function (err, res) {
        response.send(res);
    });
});

///////////////////////////////////////////////////////////////////////////////
//
// sync
//

router.get('/sync', auth.requireApp, function (request: express.Request, response: express.Response) {

    // XXX escape query variables
    var f_lang    = ('lang' in request.query) ? request.query.lang : 'en';
    var f_current = request.query.current;

    // compare with the current sync-id
    var f_syncid = parseInt(KeyValueStore.retrieve("country-sync", "0"));

    if (f_syncid == f_current) {
        return response.json({ "sync": f_syncid });
    }

    Country.repository.aggregate()
        .project({ _id: 0, code: 1, name: `$name.${f_lang}` })
        .sort('code')
        .exec(function (err, countries : [Country.ICountry]) {
            if (err)
                return response.send(400, err);
            if (!countries)
                return response.sendStatus(404);

            return response.json({ "sync": f_syncid, "countries": countries })
        });
});

///////////////////////////////////////////////////////////////////////////////
//
// insert/update a particular band
//

router.post('/', auth.requireAdmin, jsonParser, function (request: express.Request, response: express.Response) {
    // XXX validate request body   

    var f_data = <Array<any>> request.body.data;
    var f_lang = request.body.lang;

    var f_todo = f_data.length;

    // update the sync-id
    var f_id = parseInt(KeyValueStore.retrieve("country-sync", "0")) + 1;
    KeyValueStore.save("country-sync", f_id.toString());

    // update all documents 
    for (var f_idx = 0; f_idx < f_data.length; ++f_idx) {

        var f_update = function (f_code, f_name) {

            Country.repository.findOne({ "code": f_code }, function (error, country) {
            
                // create or update the country
                if (!country) {
                    country = new Country.repository();
                    country.code = f_code;
                    country.name = {};
                }

                country.name[f_lang] = f_name;
                country.save();
            
                // feedback
                --f_todo;
                if (f_todo <= 0) {
                    response.json({ "done": f_data.length });
                }
            });
        }

        f_update(f_data[f_idx].code, f_data[f_idx].name);
    }
});

export = router;