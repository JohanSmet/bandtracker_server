///////////////////////////////////////////////////////////////////////////////
//
// File 	: 	EditorMain.ts
//
// Purpose	: 	entry point of the management interface
//
// Copyright (c) 2015	Johan SMET      All rights reserved
//
///////////////////////////////////////////////////////////////////////////////

import express      = require("express");
import exphbs       = require("express-handlebars");
import session      = require("express-session");
import cookieParser = require("cookie-parser");
import bodyParser   = require('body-parser');

import fs           = require("fs");

import BandTrackerClient = require("./api/BandTrackerClient");

var router = express.Router();
var urlEncoded = bodyParser.urlencoded({ extended: true });

export function init(app: express.Express) {

    var viewDir = fs.realpathSync(__dirname + "/../../editor/views");

    app.engine("handlebars", exphbs.create({ defaultLayout: "main", layoutsDir: viewDir + "/layouts" }).engine);
    app.set("view engine", "handlebars");
    app.set("views", viewDir);

    app.use(cookieParser());
    app.use(session({ secret: '15fdser@#mdlko', resave: true, saveUninitialized: true }));

    app.use("/", router);
}

export function editorRestrict(request: express.Request, response: express.Response, next: Function) {

    if (request.session["token"]) {
        next();
    } else {
        request.session["last-page"] = request.url;
        response.redirect("/login");
    }
}

///////////////////////////////////////////////////////////////////////////////
//
// login
//

router.get("/login", function (request: express.Request, response: express.Response) {
    response.render("login");
});

router.post("/login-submit", urlEncoded, function (request: express.Request, response: express.Response) {
    
    BandTrackerClient.login(request.body.username, request.body.password, function (success: boolean, token: string, error: string) {
        if (success) {
            request.session["token"] = token;
            response.redirect(request.session["last-page"]);
        } else {
            response.render("login", { error: error });
        }
    });
});

///////////////////////////////////////////////////////////////////////////////
//
// bands
//

router.get("/bands", editorRestrict, function (request: express.Request, response: express.Response) {

    var skip: number = request.query.skip || 0;

    BandTrackerClient.bandList(10, skip, request.session["token"], function (bands) {
        response.render("index", { bands: bands });
    });
});

///////////////////////////////////////////////////////////////////////////////
//
// root
//

router.get("/", editorRestrict, function (request: express.Request, response: express.Response) {
    response.redirect("/bands");
});