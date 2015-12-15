///////////////////////////////////////////////////////////////////////////////
//
// File 	: 	TaskWikipediaTourDates.ts
//
// Purpose	: 	Download tourdate information from Wikipedia
//
// Copyright (c) 2015	Johan SMET      All rights reserved
//
///////////////////////////////////////////////////////////////////////////////

import request  = require("request");
import http     = require("http");
import url      = require("url");
import cheerio  = require("cheerio");

import Band     = require('../model/Band');
import TourDate = require('../model/TourDate');
import Country  = require('../model/Country');

import TaskScheduler = require('./TaskScheduler');

var striptags = require("striptags");

(() => {
    TaskScheduler.registerCallback(name(), execute);
})();

export function name() {
    return "wikipediaTourDates";
}

class WikipediaTourDateParser {
    
    private m_colidx: number = 0;
    private m_rowspan_count: { [key: string]: number; } = {}
    private m_rowspan_value: { [key: string]: string; } = {}

    private init_parser = () => {
        this.m_rowspan_count["date"]    = 0;
        this.m_rowspan_count["city"]    = 0;
        this.m_rowspan_count["country"] = 0;
        this.m_rowspan_count["venue"]   = 0;
    }

    private parseColumn = (p_name: string, p_col: Cheerio): string => {
        var f_result: string = '';

        if (this.m_rowspan_count[p_name] <= 0) {
            if (p_col.children("a").length > 0 || p_col.children("span").length > 0) {
                f_result = p_col.children(':not(.sortkey)').text();
            } else {
                f_result = p_col.text();
            }

            if (p_col.attr('rowspan') != undefined) {
                this.m_rowspan_count[p_name] = parseInt(p_col.attr('rowspan')) - 1;
                this.m_rowspan_value[p_name] = f_result;
            }

            ++this.m_colidx;
        } else {
            --this.m_rowspan_count[p_name];
            f_result = this.m_rowspan_value[p_name];
        }

        return f_result;
    }

    parseTourDatesHtml = (p_html: string): { [key: string]: string }[]=> {

        var f_gigs: { [key: string]: string }[] = [];
        var $ = cheerio.load(p_html);

        this.init_parser();
        
        // artist : find the table with the summary
        var artistUrl = $('table.infobox').find('span.attendee').find('a').attr("href");

        // find the table with the tourdates
        var tourSpan = $('span#tour_dates');

        if (tourSpan.length == 0) {
            tourSpan = $('span#Tour_dates');
        }

        if (tourSpan.length == 0) {
            tourSpan = $('span#Tour_Dates');
        }

        var gigTable = tourSpan.parent().next('table');
        var parser = this;
           
        gigTable.children('tr').each(function (i, row) {
            var f_row = $(row);

            var f_gig: { [key: string]: string } = {}

            // skip header rows
            if (f_row.attr('style') != undefined || f_row.attr('bgcolor') != undefined) {
                return;
            }

            var f_cols = f_row.children('td');
            if (f_cols == undefined || f_cols.length <= 0)
                return;

            parser.m_colidx  = 0; 
            f_gig["artist"]  = artistUrl;
            f_gig["date"]    = parser.parseColumn('date',    $(f_cols[parser.m_colidx]));
            f_gig["city"]    = parser.parseColumn('city',    $(f_cols[parser.m_colidx]));
            f_gig["country"] = parser.parseColumn('country', $(f_cols[parser.m_colidx]));
            f_gig["venue"]   = parser.parseColumn('venue',   $(f_cols[parser.m_colidx]));

            f_gigs.push(f_gig);
        });

        return f_gigs;
    }
}

export function execute(params: string[]) {

    // check parameters
    if (params.length < 1)
        return;

    var f_url = params[0]

    // execute request
    request(f_url, function (error: any, response: http.IncomingMessage, body: any) {

        if (error || response.statusCode != 200) {
            return;
        }

        // parse the html data
        var f_parser = new WikipediaTourDateParser();
        var f_gigs = f_parser.parseTourDatesHtml(body);

        // stop if there are no gigs
        if (f_gigs.length <= 0) {
            return;
        }
        
        // find the artist
        Band.repository.findOne({ 'source': new RegExp('.*' + f_gigs[0]["artist"] + '.*', 'i') }, function (err, band) {

            if (!band) {
                return;
            } 

            for (var f_idx = 0; f_idx < f_gigs.length; ++f_idx) {
                handleGig(band, f_gigs[f_idx]);
            }

        });


    });
}

function handleGig(band: Band.IBand, gig: { [key: string]: string }) {
    
    // find country
    Country.repository.findOne({ 'name.en': new RegExp(gig["country"], 'i') }, function (err, country) {

        if (!country) {
            return;
        }
    
        var startDate = parseDate(gig["date"]);

        TourDate.repository.findOne({ 'bandId': band.MBID, 'startDate': startDate }, function (err, tourdate) {
            if (!tourdate) {
                tourdate = new TourDate.repository();
                tourdate.bandId     = band.MBID;
                tourdate.startDate  = startDate;
                tourdate.endDate    = startDate;
                tourdate.stage      = "";
                tourdate.supportAct = false;
            }

            tourdate.venue       = gig["venue"].replace(/\[[0-9]+\]/g, "");
            tourdate.city        = gig["city"].replace(/\[[0-9]+\]/g, "");;
            tourdate.countryCode = country.code;
            tourdate.save();
        });

    });
}

function parseDate(input: string): Date {
    var f_clean = input.replace(/\[.*\]/, "");
    var f_local = new Date(f_clean);
    return new Date(Date.UTC(f_local.getFullYear(), f_local.getMonth(), f_local.getDate()));
}
