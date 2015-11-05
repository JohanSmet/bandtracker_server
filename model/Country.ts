///////////////////////////////////////////////////////////////////////////////
//
// File 	: 	Country.ts
//
// Purpose	: 	Country model
//
// Copyright (c) 2015	Johan SMET      All rights reserved
//
///////////////////////////////////////////////////////////////////////////////

import mongoose = require("mongoose");
import ICountryPOJO = require("./ICountryPOJO");

export interface ICountry extends ICountryPOJO, mongoose.Document {
}

var countrySchema = new mongoose.Schema({
    code: String,
    name: {},
    smallFlag: Buffer,
    flag : Buffer
});

export var repository = mongoose.model<ICountry>("Country", countrySchema);