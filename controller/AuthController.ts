///////////////////////////////////////////////////////////////////////////////
//
// File 	: 	AuthController.ts
//
// Purpose	: 	authentication
//
// Copyright (c) 2015	Johan SMET      All rights reserved
//
///////////////////////////////////////////////////////////////////////////////

import mongoose     = require('mongoose');
import express      = require('express');
import bodyParser   = require('body-parser');
import crypto       = require('crypto');
import uuid         = require('node-uuid');
import jsonwebtoken = require('jsonwebtoken');

import cfg_auth     = require('../config/auth');

import auth         = require('../middleware_auth');
import User         = require('../model/User');

var router = express.Router();
var jsonParser = bodyParser.json()

function hashPassword(p_passwd: string, p_salt: string): string {
    return crypto.createHmac('sha256', p_salt).update(p_passwd).digest('hex')
}

/* only for first time setup of a server
router.post('/setup', function (request: express.Request, response: express.Response) {

    var f_user = new User.repository();

    f_user.name = "admin";
    f_user.salt = uuid.v1();
    f_user.passwdHash = hashPassword("xxxxxxxx", f_user.salt);
    f_user.roles = ["ADMIN"];

    f_user.save();
});
*/

///////////////////////////////////////////////////////////////////////////////
//
// authenticate and return token
//

router.post('/login', jsonParser, function (request: express.Request, response: express.Response) {
    
    User.repository.findOne({ 'name': request.body.name }, function (err, user) {
        if (err)
            return response.status(403).json({ success: false, error: err });
        if (!user)
            return response.status(403).json({ success: false, error: "invalid credentials" });
        if (user.passwdHash != hashPassword(request.body.passwd, user.salt))
            return response.status(403).json({ success: false, error: "invalid credentials" });

        var f_token = jsonwebtoken.sign(user.roles, cfg_auth.secret, { expiresInMinutes: 1440 });
        
        response.json({
            success: true,
            token : f_token
        });
    });
});

///////////////////////////////////////////////////////////////////////////////
//
// create a new user
//

router.post('/new-user', auth.requireAdmin, jsonParser, function (request: express.Request, response: express.Response) {

    var f_user = new User.repository();

    f_user.name = request.body.name;
    f_user.salt = uuid.v1();
    f_user.passwdHash = hashPassword(request.body.passwd, f_user.salt);
    f_user.roles = ["APP"];
    f_user.save();

    return response.json(f_user);
});

export = router;