﻿///////////////////////////////////////////////////////////////////////////////
//
// File 	: 	TaskWikipediaTourList.ts
//
// Purpose	: 	Parse page with links to tour dates
//
// Copyright (c) 2015	Johan SMET      All rights reserved
//
///////////////////////////////////////////////////////////////////////////////

import request = require("request");
import http    = require("http");
import url     = require("url");
import cheerio = require("cheerio");

import Task          = require('../model/Task');
import TaskScheduler = require('./TaskScheduler');

(() => {
    TaskScheduler.registerCallback(name(), execute);
})();

export function name() {
    return "wikipediaTourList";
}

export function execute(params: string[], completionCallback: (err?: Error) => void) {

    // check parameters
    if (params.length < 1)
        return completionCallback(new Error("Invalid number of parameters"));

    var f_url = params[0]

    // execute request
    request(f_url, function (error: any, response: http.IncomingMessage, body: any) {

        if (error || response.statusCode != 200) {
            return completionCallback(new Error(error));
        }

        // parse the html data
        var $ = cheerio.load(body);

        var contentText = $("div#mw-content-text div.mw-content-ltr");

        contentText.find('a').each(function (index, link) {

            var title: string = $(link).attr("title");
            var href: string = $(link).attr("href");

            // don't follow "List of xxxx tours" links
            if (title.match("List of")) {
                return;
            }

            Task.createNew("wikipediaTourDates", [cleanUrl(f_url, href)]).save();
        });

        // XXX temporary - doesn't handle failures in previous each statement
        completionCallback();
    });
}

function cleanUrl(pageLink: string, link: string): string {

    var cleanUrl = url.parse(link);

    if (!cleanUrl.host) {
        return url.resolve(pageLink, link);
    } else {
        return url.format(cleanUrl);
    }
}