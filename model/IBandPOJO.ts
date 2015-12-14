///////////////////////////////////////////////////////////////////////////////
//
// File 	: 	IBandPOJO.ts
//
// Purpose	: 	Band Interface
//
// Copyright (c) 2015	Johan SMET      All rights reserved
//
///////////////////////////////////////////////////////////////////////////////

interface IBandPOJO {
    MBID        : string;
    name        : string;
    genre       : string;
    imageUrl    : string;
    biography   : { [key: string]: string; }
    bioSource   : string;
};

export = IBandPOJO;