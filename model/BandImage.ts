///////////////////////////////////////////////////////////////////////////////
//
// File 	: 	BandImage.ts
//
// Purpose	: 	BandImage Interface
//
// Copyright (c) 2015	Johan SMET      All rights reserved
//
///////////////////////////////////////////////////////////////////////////////

import mongoose         = require("mongoose");
import IBandImagePOJO   = require("./IBandImagePOJO");

export interface IBandImage extends IBandImagePOJO, mongoose.Document {
}

var bandImageSchema = new mongoose.Schema({
    bandId: String,
    image: Buffer
});

export var repository = mongoose.model<IBandImage>("BandImage", bandImageSchema);