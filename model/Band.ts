///////////////////////////////////////////////////////////////////////////////
//
// File 	: 	Band.ts
//
// Purpose	: 	Band model
//
// Copyright (c) 2015	Johan SMET      All rights reserved
//
///////////////////////////////////////////////////////////////////////////////

import mongoose = require("mongoose");
import IBandPOJO = require("./IBandPOJO");

export interface IBand extends IBandPOJO, mongoose.Document {
}

var bandSchema = new mongoose.Schema({
    MBID        : String,
    name        : String,
    genre       : String,
    imageUrl    : String,
    biography   : {},
    source      : String
});

export var repository = mongoose.model<IBand>("Band", bandSchema);