///////////////////////////////////////////////////////////////////////////////
//
// File 	: 	ITourDatePOJO.ts
//
// Purpose	: 	TourDate interface
//
// Copyright (c) 2015	Johan SMET      All rights reserved
//
///////////////////////////////////////////////////////////////////////////////

interface ITourDatePOJO {
    bandId      : string;
    startDate   : Date;
    endDate     : Date;
    stage       : string;
    venue       : string;
    city        : string;
    countryCode : string;
    supportAct  : boolean;
};

export = ITourDatePOJO;