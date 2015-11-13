///////////////////////////////////////////////////////////////////////////////
//
// File 	: 	TaskSetlistFmTourDates.ts
//
// Purpose	: 	Download tour-date information from setlist.fm
//
// Copyright (c) 2015	Johan SMET      All rights reserved
//
///////////////////////////////////////////////////////////////////////////////

import request  = require("request");
import http     = require('http');
import async    = require("async");

import TourDate = require('../model/TourDate');
import Country  = require('../model/Country');
import Task     = require('../model/Task');

export function execute(params: string[]) {

    // check parameters
    if (params.length < 2)
        return;
    
    var f_band = params[0];
    var f_year = parseInt(params[1]);

    // construct request url
    var f_url = constructUrl(f_band, f_year, 1);

    // execute request
    request(f_url, function (error: any, response: http.IncomingMessage, body: any) {

        if (error || response.statusCode != 200) {
            return;
        }
       
        // parse body 
        var f_data = JSON.parse(body);

        processSetlists(f_band, f_data);

        // download the rest of the pages
        var f_total   = parseInt(f_data.setlists["@total"]);
        var f_perpage = parseInt(f_data.setlists["@itemsPerPage"]);
        var f_urls: string[] = [];

        for (var f_idx = 2; f_idx <= Math.ceil(f_total/f_perpage); ++f_idx) {
            f_urls.push(constructUrl(f_band, f_year, f_idx));
        }

        async.forEachOfLimit(f_urls, 1, function (url, key, callback) {

            request(url, function (error: any, response: http.IncomingMessage, body: any) {

                if (error || response.statusCode != 200) {
                    return;
                }
       
                // parse body 
                var f_data = JSON.parse(body);
                processSetlists(f_band, f_data);
                callback();
            });

        });


    });
}

function constructUrl(p_band: string, p_year: Number, p_page: Number = 1): string {
    return `http://api.setlist.fm/rest/0.1/search/setlists.json?artistMbid=${p_band}&year=${p_year}&p=${p_page}`
}

function processSetlists(p_band : string, p_data: any) {
    
    // parse the data
    var f_setlists: any[] = p_data.setlists.setlist;

    f_setlists.forEach(function (p_setlist: any) {
        var f_gig: { [key: string]: string } = {}

        f_gig["band"]    = p_band;
        f_gig["date"]    = p_setlist["@eventDate"];
        f_gig["city"]    = p_setlist.venue.city["@name"];
        f_gig["country"] = p_setlist.venue.city.country["@code"];
        f_gig["venue"]   = p_setlist.venue["@name"];

        // update the database
        handleGig(f_gig);
    });

    
}

function handleGig(gig: { [key: string]: string }) {
    
    var startDate = parseDate(gig["date"]);

    TourDate.repository.findOne({ 'bandId': gig["band"], 'startDate': startDate }, function (err, tourdate) {
        if (!tourdate) {
            tourdate = new TourDate.repository();
            tourdate.bandId = gig["band"]
            tourdate.startDate = startDate;
            tourdate.endDate = startDate;
            tourdate.stage = "";
            tourdate.supportAct = false;
        }

        tourdate.venue = gig["venue"].replace(/\[[0-9]+\]/g, "");
        tourdate.city = gig["city"].replace(/\[[0-9]+\]/g, "");;
        tourdate.countryCode = gig["country"];
        tourdate.save();
    });
}

function parseDate(input: string): Date {
    var f_parts = input.split("-");
    return new Date(parseInt(f_parts[2]), parseInt(f_parts[1]) - 1,  parseInt(f_parts[0]));
}