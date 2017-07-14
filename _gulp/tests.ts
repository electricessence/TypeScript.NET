import {BuildHelper, Module, Target} from "gulp-typescript-helper";
import * as TASK from "./constants/TaskNames";
import * as gulp from "gulp";
import {TSDNPromise} from "../source/System/Promises/Promise";

const renderer = BuildHelper
	.inject(TSDNPromise.factory)
	.defaults({
		target: Target.ES5,
		module: Module.UMD,
		noEmitHelpers: false,
		sourceMap: true,
		moduleResolution:"node"
	});


gulp.task(
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
		.addOptions({noEmitHelpers:true})
		//.target(Target.ES6)
		.at('./tests/mocha')
		.init()
		.module(Module.COMMONJS)
		.execute()
);