import * as TARGET from "./typescript/Targets";
import * as MODULE from "./typescript/ModuleTypes";
import * as TASK from "./constants/TaskNames";
import * as gulp from "gulp";
import {TypeScriptRendererFactory} from "./typescript/TypeScriptRenderer";

const TEST_DEFAULTS = Object.freeze({ noEmitHelpers:false });

const renderer = TypeScriptRendererFactory.at("./tests", { noEmitHelpers:false });


gulp.task(
	// Can't figure out why the TSC doesn't work the same for this folder as it does for the source folder. :(
	TASK.TYPESCRIPT_QUNIT,
	()=> renderer
		.init('qunit', TARGET.ES5, MODULE.UMD)
		.render()
);

gulp.task(
	TASK.TYPESCRIPT_MOCHA,
	[
		TASK.DIST_COMMONJS
	],
	()=> renderer
		.init('mocha', TARGET.ES5, MODULE.COMMONJS)
		.render()
);


gulp.task(
	TASK.BUILD + ".tests", [
		TASK.TYPESCRIPT_QUNIT,
		TASK.TYPESCRIPT_MOCHA
	]
);