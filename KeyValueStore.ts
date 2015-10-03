///////////////////////////////////////////////////////////////////////////////
//
// File 	: 	KeyValueStore.ts
//
// Purpose	: 	Global Key-Value Store
//
// Copyright (c) 2015	Johan SMET      All rights reserved
//
///////////////////////////////////////////////////////////////////////////////

import mongoose = require("mongoose");
import KeyValue = require("./model/KeyValue");

var g_data: { [key: string]: KeyValue.IKeyValue; } = {}

export function load() {

    KeyValue.repository.find(function (error, result : [KeyValue.IKeyValue]) {
        result.forEach(function (kv: KeyValue.IKeyValue) {
            g_data[kv.key] = kv;
        });
    });

}

export function retrieve(key: string, def: string): string {
    
    if (!g_data[key]) {
        return def;        
    } 
    
    return g_data[key].val
}

export function save(key: string, val: string) {
    var kv = g_data[key] || new KeyValue.repository();
    kv.key = key;
    kv.val = val;
    kv.save();

    g_data[key] = kv;
}