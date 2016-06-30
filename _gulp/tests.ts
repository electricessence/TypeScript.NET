/// <reference path="../typings/gulp/gulp" />
import {Target, Module, BuildHelper} from "gulp-typescript-helper";
import * as TASK from "./constants/TaskNames";
import * as gulp from "gulp";
import {Promise} from "../source/System/Promises/Promise";

const renderer = BuildHelper
	.inject(Promise.factory)
	.defaults({
		target: Target.ES5,
		module: Module.UMD,
		noEmitHelpers: false,
		removeComments: true,
		sourceMap: true,
	});


gulp.task(
	// Can't figure out why the TSC doesn't work the same for this folder as it does for the source folder. :(
	TASK.TYPESCRIPT_QUNIT,
	[
		TASK.DIST_AMD
	],
	()=> renderer
		.at('./tests/qunit')
		.init()
		.execute()
);

gulp.task(
	TASK.TYPESCRIPT_MOCHA,
	[
		TASK.DIST_COMMONJS
	],
	()=> renderer
		.at('./tests/mocha')
		.init()
		.module(Module.COMMONJS)
		.execute()
);


gulp.task(
	TASK.BUILD + ".tests", [
		TASK.TYPESCRIPT_QUNIT,
		TASK.TYPESCRIPT_MOCHA
	]
);