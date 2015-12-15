///////////////////////////////////////////////////////////////////////////////
//
// File 	: 	TaskMusicBrainzUrl.ts
//
// Purpose	: 	Download url-relation information from MusicBrainz
//
// Copyright (c) 2015	Johan SMET      All rights reserved
//
///////////////////////////////////////////////////////////////////////////////

import request = require("request");
import http = require('http');

import Band          = require('../model/Band');
import Task          = require('../model/Task');
import TaskScheduler = require('./TaskScheduler');

(() => {
    TaskScheduler.registerCallback(name(), execute);
})();

export function name() {
    return "musicBrainzUrl";
}

export function execute(params: string[]) {

    // check parameters
    if (params.length < 1)
        return;

    var f_bandId = params[0]

    // construct request url
    var f_url = `https://musicbrainz.org/ws/2/artist/${f_bandId}?inc=url-rels&fmt=json`

    // execute request
    request(f_url, function (error: any, response: http.IncomingMessage, body: any) {

        if (error || response.statusCode != 200) {
            return;
        }
       
        // parse body 
        var f_data = JSON.parse(body);

        for (var f_idx = 0; f_idx < f_data.relations.length; ++f_idx) {

            var f_rel = f_data.relations[f_idx];

            if (f_rel.type == "wikipedia") {
                Task.createNew("wikipediaBandBio", [f_bandId, f_rel.url.resource]).save();
            } else if (f_rel.type == "discogs") {
                var f_id = f_rel.url.resource.match(/\d+$/)[0];

                Band.repository.findOne({ "MBID": f_bandId }, function (err, band) {
                    if (band) {
                        band.discogsId = f_id;
                        band.save();
                    }
                });
            }
        }
    });
}
