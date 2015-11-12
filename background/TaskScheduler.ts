﻿///////////////////////////////////////////////////////////////////////////////
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

import TaskMusicBrainzArtists   = require("./TaskMusicBrainzArtists");
import TaskMusicBrainzUrl       = require("./TaskMusicBrainzUrl");
import TaskWikipediaBandBio     = require("./TaskWikipediaBandBio");
import TaskWikipediaTourDates   = require("./TaskWikipediaTourDates");
import TaskWikipediaTourList    = require("./TaskWikipediaTourList");
import TaskSetlistFmTourDates   = require("./TaskSetlistFmTourDates");

export function init() {
    task_runner();
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
    
    if (task.taskType == "musicBrainzArtists") {
        TaskMusicBrainzArtists.execute(task.taskParams);
    } else if (task.taskType == "musicBrainzUrl") {
        TaskMusicBrainzUrl.execute(task.taskParams);
    } else if (task.taskType == "wikipediaBandBio") {
        TaskWikipediaBandBio.execute(task.taskParams);
    } else if (task.taskType == "wikipediaTourDates") {
        TaskWikipediaTourDates.execute(task.taskParams);
    } else if (task.taskType == "wikipediaTourList") {
        TaskWikipediaTourList.execute(task.taskParams);
    } else if (task.taskType == "setlistFmTourDates") {
        TaskSetlistFmTourDates.execute(task.taskParams);
    }

}