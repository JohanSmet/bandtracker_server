///////////////////////////////////////////////////////////////////////////////
//
// File 	: 	ITaskPOJO.ts
//
// Purpose	: 	Task Interface
//
// Copyright (c) 2015	Johan SMET      All rights reserved
//
///////////////////////////////////////////////////////////////////////////////

interface ITaskPOJO {
    taskType    : string;
    taskParams  : string[];

    dateCreated  : Date;
    dateExecuted : Date;
    resultOk     : Boolean;
};

export = ITaskPOJO;