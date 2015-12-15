///////////////////////////////////////////////////////////////////////////////
//
// File 	: 	TaskScheduler.ts
//
// Purpose	: 	Run regular background-tasks
//
// Copyright (c) 2015	Johan SMET      All rights reserved
//
///////////////////////////////////////////////////////////////////////////////

import mongoose = require('mongoose');

import Task = require('../model/Task');

export interface TaskCallback { (params: string[]): void; }
var taskRepository: { [key: string]: TaskCallback; } = { }

export function init() {
    task_runner();
}

export function registerCallback(p_name: string, p_func: TaskCallback) {
    taskRepository[p_name] = p_func;
}

function task_runner() {

    Task.repository.findOneAndUpdate({ dateExecuted: null }, { dateExecuted: new Date() }, function (err, task: Task.ITask) {

        var f_delay: number = 5

        if (task) {
            task_execute(task);           
            f_delay = 1;
        }

        // schedule the next execution
        setTimeout(task_runner, f_delay * 60 * 1000);
    });
}

function task_execute(task: Task.ITask) {
    
    if (task) {
        var callback = taskRepository[task.taskType];

        if (callback)
            callback(task.taskParams);
    }
}

// force-import all the tasks to make them register their callbacks
import "./TaskMusicBrainzArtists";
import "./TaskMusicBrainzUrl";
import "./TaskWikipediaBandBio";
import "./TaskWikipediaTourDates";
import "./TaskWikipediaTourList";
import "./TaskSetlistFmTourDates";