///////////////////////////////////////////////////////////////////////////////
//
// File 	: 	TaskDiscogsBandInfo.ts
//
// Purpose	: 	Download band-profile information from discogs
//
// Copyright (c) 2015	Johan SMET      All rights reserved
//
///////////////////////////////////////////////////////////////////////////////

import RestClient    = require("./RestClient");

import Band          = require('../model/Band');
import BandImage     = require("../model/BandImage");
import TaskScheduler = require('./TaskScheduler');

var Discogs          = require('disconnect').Client;

var API_KEY = "IPBxKHcmvdFysmwTbxcu";
var API_SECRET = "LplnDCgNevMOhZqMxzPxakRwVdXRFnSI";

(() => {
    TaskScheduler.registerCallback(name(), execute);
})();

export function name() {
    return "discogsBandInfo";
}

export function execute(params: string[], completionCallback: (err?: Error) => void) {

    // check parameters
    if (params.length != 1)
        return completionCallback(new Error("Invalid number of parameters"));

    var f_bandId = params[0];

    // retrieve the band 
    Band.repository.findOne({ "MBID": f_bandId }, function (err, band) {

        if (!band) {
            return completionCallback(err);
        }

        // request band information
        var discogsDb = new Discogs({
            consumerKey: API_KEY,
            consumerSecret: API_SECRET
        }).database();

        discogsDb.artist(band.discogsId, function (error, data) {
            
            // parse body 
            var f_new_biography = "";
            var f_new_bioSource = "";
            var f_new_imageUrl = "";

            // profile
            if (data && data.profile) {
                var f_parts = data.profile.split(/\r\n\r\n/);

                if (f_parts && f_parts.length > 0) {
                    f_new_biography = f_parts[0];
                    f_new_bioSource = data.uri;
                }
            }

            // band image
            if (data && data.images && data.images.length > 0) {
                var f_imgurl = data.images[0].uri150;
                f_new_imageUrl = `https://bandtracker-justcode.rhcloud.com/api/bandImage/${f_bandId}`;

                // download image
                discogsDb.image(f_imgurl, function (error, imgData, rateLimit) {
                    var f_bandimg = new BandImage.repository();
                    f_bandimg.bandId = f_bandId;
                    f_bandimg.image = new Buffer(imgData, "binary");

                    BandImage.repository.findOneAndUpdate({ 'bandId': f_bandId }, f_bandimg, { upsert: true }, function (err, res) {
                        if (err) console.log(err);
                    });
                });
            }

            // update band
            if (f_new_biography != "" && band.bioSource.indexOf("wikipedia") < 0) {
                Band.setBiography(band, "en", f_new_biography, f_new_bioSource);
            }
            if (f_new_imageUrl != "") {
                band.imageUrl = f_new_imageUrl;
            }

            band.save(completionCallback);
        });
    });
}
