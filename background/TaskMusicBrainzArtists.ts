///////////////////////////////////////////////////////////////////////////////
//
// File 	: 	TaskMusicBrainzArtists.ts
//
// Purpose	: 	Download artist information from MusicBrainz
//
// Copyright (c) 2015	Johan SMET      All rights reserved
//
///////////////////////////////////////////////////////////////////////////////

import request  = require("request");
import http = require('http');

import Band = require('../model/Band');
import Task = require('../model/Task');

export function execute(params: string[]) {

    // check parameters
    if (params.length < 1)
        return;

    var f_query = params[0]
    var f_skip = 0;

    if (params.length >= 2)
        f_skip = parseInt(params[1]);

    // construct request url
    var f_url = `http://musicbrainz.org/ws/2/artist?fmt=json&limit=100&offset=${f_skip}&query=${f_query}`

    // execute request
    request(f_url, function (error: any, response: http.IncomingMessage, body: any) {

        if (error || response.statusCode != 200) {
            return;
        }
       
        // parse body 
        var f_data  = JSON.parse(body);
        var f_count = 0;
        
        for (var f_idx = 0; f_idx < f_data.artists.length; ++f_idx) {
            updateArtist(f_data.artists[f_idx]);
            ++f_count;
        }

        // fetch the remainder of the query
        f_skip += f_count;

        if (f_skip < f_data.count) {
            var f_task = Task.createNew("musicBrainzArtists", [f_query, f_skip.toString()]);
            f_task.save();
        }
    });
}

function updateArtist(artist) {
    Band.repository.findOne({ 'MBID': artist.id }, function (err, band) {
        // create or update the band
        if (!band) {
            band = Band.createNew(artist.id);
        }

        band.name = artist.name;
        band.save();

        // create a task to fetch more information about the band
        Task.createNew("musicBrainzUrl", [band.MBID]).save();
    });
}