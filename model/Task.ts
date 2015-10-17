///////////////////////////////////////////////////////////////////////////////
//
// File 	: 	Task.ts
//
// Purpose	: 	Task model
//
// Copyright (c) 2015	Johan SMET      All rights reserved
//
///////////////////////////////////////////////////////////////////////////////

import mongoose = require("mongoose");
import ITaskPOJO = require("./ITaskPOJO");

export interface ITask extends ITaskPOJO, mongoose.Document {
}

var taskSchema = new mongoose.Schema({
    taskType    : String,
    taskParams  : [String],
    dateCreated : Date,
    dateExecuted: Date,
    resultOk    : Boolean
});

export var repository = mongoose.model<ITask>("Task", taskSchema);

export function createNew(taskType: string, taskParams: string[]) : ITask {
    var f_task = new repository();
    f_task.taskType     = taskType;
    f_task.taskParams   = taskParams;
    f_task.dateCreated  = new Date();
    f_task.dateExecuted = null;
    f_task.resultOk     = false;
    return f_task;
}