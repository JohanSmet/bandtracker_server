﻿///////////////////////////////////////////////////////////////////////////////
//
// File 	: 	ICountryPOJO.ts
//
// Purpose	: 	Country Interface
//
// Copyright (c) 2015	Johan SMET      All rights reserved
//
///////////////////////////////////////////////////////////////////////////////

interface ICountryPOJO {
    code: string;
    name: { [key: string]: string; },
    smallFlag : Buffer
    flag : Buffer
};

export = ICountryPOJO;