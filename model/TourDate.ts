///////////////////////////////////////////////////////////////////////////////
//
// File 	: 	TourDate.ts
//
// Purpose	: 	TourDate model
//
// Copyright (c) 2015	Johan SMET      All rights reserved
//
///////////////////////////////////////////////////////////////////////////////

import mongoose = require("mongoose");
import ITourDatePOJO = require("./ITourDatePOJO");

export interface ITourDate extends ITourDatePOJO, mongoose.Document {
}

var tourDateSchema = new mongoose.Schema({
    bandId      : String,
    startDate   : Date,
    endDate     : Date,
    stage       : String,
    venue       : String,
    city        : String,
    countryCode : String,
    supportAct  : Boolean
});

export var repository = mongoose.model<ITourDate>("TourDate", tourDateSchema);