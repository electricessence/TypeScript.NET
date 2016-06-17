import * as TARGET from "./constants/Targets";
import * as MODULE from "./constants/ModuleTypes";
import * as TASK from "./constants/TaskNames";
import * as gulp from "gulp";
import * as typescript from "./typescript";

const TEST_DEFAULTS = Object.freeze({ noEmitHelpers:false });

gulp.task(
	// Can't figure out why the TSC doesn't work the same for this folder as it does for the source folder. :(
	TASK.TYPESCRIPT_QUNIT,
	()=> typescript
		.at('./tests/qunit', TARGET.ES5, MODULE.UMD, TEST_DEFAULTS)
		.render()
);

gulp.task(
	TASK.TYPESCRIPT_MOCHA,
	[
		TASK.DIST_COMMONJS
	],
	()=> typescript
		.at('./tests/mocha', TARGET.ES5, MODULE.COMMONJS, TEST_DEFAULTS)
		.render()
);


gulp.task(
	TASK.BUILD + ".tests", [
		TASK.TYPESCRIPT_QUNIT,
		TASK.TYPESCRIPT_MOCHA
	]
);