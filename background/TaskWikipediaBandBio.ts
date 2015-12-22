///////////////////////////////////////////////////////////////////////////////
//
// File 	: 	TaskWikipediaBandBio.ts
//
// Purpose	: 	Download band biography information from wikipedia
//
// Copyright (c) 2015	Johan SMET      All rights reserved
//
///////////////////////////////////////////////////////////////////////////////

import request  = require("request");
import http     = require("http");
import url      = require("url");
import cheerio  = require("cheerio");

import Band = require('../model/Band');
import Task = require('../model/Task');

import TaskScheduler = require('./TaskScheduler');

var striptags = require("striptags");

(() => {
    TaskScheduler.registerCallback(name(), execute);
})();

export function name() {
    return "wikipediaBandBio";
}

export function execute(params: string[], completionCallback: (err?: Error) => void) {

    // check parameters
    if (params.length < 2)
        return completionCallback(new Error("Invalid number of parameters"));

    var f_bandId = params[0]
    var f_url = params[1]

    // execute request
    request(f_url, function (error: any, response: http.IncomingMessage, body: any) {

        if (error || response.statusCode != 200) {
            return completionCallback(new Error(error));
        }

        var imageUrl : string = "";
        var bandBio  : string = "";
        var lang     : string = "en";

        // parse the html data
        var $ = cheerio.load(body);

        // band image
        var bandImg = $("table.infobox").find("img");

        if (bandImg && bandImg.length > 0) {
            imageUrl = cleanImageUrl(f_url, bandImg.attr("src"));
        }

        // biography
        var contentText = $("div#mw-content-text");

        lang = contentText.attr("lang");

        var block = contentText.find('p').first();

        while (block.has("> span.error").length > 0) {
            block = block.next("p");
        }

        bandBio = block.html();
        bandBio = striptags(bandBio, ["b", "i", "u"]);
        bandBio = bandBio.replace(/\[[0-9]+\]/g, "");
        
        // update the band
        Band.repository.findOne({ 'MBID': f_bandId }, function (err, band) {
            if (band) {
                band.imageUrl = imageUrl;

                Band.setBiography(band, lang, bandBio, f_url);

                band.save(completionCallback);
            } else {
                completionCallback(new Error("findOne failed"));
            }
        });
    });
}

function cleanImageUrl(pageLink: string, imgLink: string): string {

    var imgUrl = url.parse(imgLink);

    if (!imgUrl.host) {
        return url.resolve(pageLink, imgLink);
    } else {
        return url.format(imgUrl);
    }
}