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
    discogsId   : String,
    name        : String,
    genre       : String,
    imageUrl    : String,
    biography   : {},
    bioSource   : String,
    recordStatus: Number,
    lastChanged : Date
});

export var repository = mongoose.model<IBand>("Band", bandSchema);

export enum RecordStatus {
    New         = 0,
    Released    = 1,
    Revoked     = -1
}

export function createNew(MBID: string): IBand {
    var f_band = new repository();

    f_band.MBID         = MBID;
    f_band.discogsId    = "";
    f_band.name         = "";
    f_band.genre        = "";
    f_band.imageUrl     = "";
    f_band.biography    = {};
    f_band.bioSource    = "";
    f_band.recordStatus = RecordStatus.New;
    f_band.lastChanged  = new Date();

    return f_band;
}

export function newVersion(band: IBand): IBand {
    var f_band = new repository(band);
    f_band._id          = new mongoose.Types.ObjectId();
    f_band.isNew        = true; 
    f_band.recordStatus = RecordStatus.New;

    return f_band;
}

export function newVersionIfReleased(band: IBand): IBand {
    if (band.recordStatus != RecordStatus.New) {
        return newVersion(band);
    } else {
        return band;
    }
}

export function setBiography(band: IBand, lang: string, bio: string, source: string) {
    if (!band.biography)
        band.biography = {};
    band.biography[lang] = bio;
    band.markModified("biography");
    band.bioSource = source;
}