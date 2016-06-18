import {Target, Module, TypeScriptRenderer} from "gulp-typescript-helper";
import * as TASK from "./constants/TaskNames";
import * as gulp from "gulp";
import {Promise} from "../source/System/Promises/Promise";

const TEST_DEFAULTS = Object.freeze({noEmitHelpers: false});

const renderer = TypeScriptRenderer
	.inject(Promise)
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
	()=> renderer
		.at('./tests/qunit')
		.init()
		.render()
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
		.render()
);


gulp.task(
	TASK.BUILD + ".tests", [
		TASK.TYPESCRIPT_QUNIT,
		TASK.TYPESCRIPT_MOCHA
	]
);