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
    discogsId   : string;
    name        : string;
    genre       : string;
    imageUrl    : string;
    biography   : { [key: string]: string; }
    bioSource   : string;
    recordStatus: number;
    lastChanged : Date;
};

export = IBandPOJO;