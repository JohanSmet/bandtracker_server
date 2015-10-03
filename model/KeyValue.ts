///////////////////////////////////////////////////////////////////////////////
//
// File 	: 	KeyValue.ts
//
// Purpose	: 	KeyValue model
//
// Copyright (c) 2015	Johan SMET      All rights reserved
//
///////////////////////////////////////////////////////////////////////////////

import mongoose = require("mongoose");
import IKeyValuePOJO = require("./IKeyValuePOJO");

export interface IKeyValue extends IKeyValuePOJO, mongoose.Document {
}

var keyValueSchema = new mongoose.Schema({
    key: String,
    val: String
});

export var repository = mongoose.model<IKeyValue>("KeyValue", keyValueSchema);