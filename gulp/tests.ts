import * as TARGET from "./constants/Targets";
import * as MODULE from "./constants/ModuleTypes";
import * as TASK from "./constants/TaskNames";
import * as gulp from "gulp";
import * as tsc from "./tsc";


gulp.task(
	// Can't figure out why the TSC doesn't work the same for this folder as it does for the source folder. :(
	TASK.TYPESCRIPT_QUNIT,
	()=> tsc.atV2('./tests/qunit', TARGET.ES5, MODULE.UMD, false, true)
);

gulp.task(
	TASK.TYPESCRIPT_MOCHA,
	[
		TASK.DIST_COMMONJS
	],
	()=> tsc.atV2('./tests/mocha', TARGET.ES5, MODULE.COMMONJS, false, true)
);


gulp.task(
	TASK.BUILD + ".tests", [
		TASK.TYPESCRIPT_QUNIT,
		TASK.TYPESCRIPT_MOCHA
	]
);