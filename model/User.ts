///////////////////////////////////////////////////////////////////////////////
//
// File 	: 	User.ts
//
// Purpose	: 	User model
//
// Copyright (c) 2015	Johan SMET      All rights reserved
//
///////////////////////////////////////////////////////////////////////////////

import mongoose = require("mongoose");
import IUserPOJO = require("./IUserPOJO");

export interface IUser extends IUserPOJO, mongoose.Document {
}

var userSchema = new mongoose.Schema({
    name: String,
    passwdHash: String,
    salt : String,
    roles: [String]
});

export var repository = mongoose.model<IUser>("User", userSchema);