///<reference path="../typings/gulp/gulp" />

import * as TARGET from "./constants/Targets";
import * as MODULE from "./constants/ModuleTypes";
import * as gulp from "gulp";
import * as tsc from "./tsc";
import * as TASK from "./constants/TaskNames";

gulp.task(
	TASK.DIST_ES6,
	()=> tsc.distES6(TARGET.ES6, true)
);

gulp.task(
	TASK.DIST_AMD,
	()=> tsc.distMini(MODULE.AMD, TARGET.ES5, MODULE.AMD)
);

gulp.task(
	TASK.DIST_UMD,
	()=> tsc.distMini(MODULE.UMD + '.min', TARGET.ES5, MODULE.UMD)
);

gulp.task( // Need to double process to get the declarations from es6 without modules
	TASK.DIST_COMMONJS,
	()=> tsc.dist(MODULE.COMMONJS, TARGET.ES5, MODULE.COMMONJS)
);

gulp.task(
	TASK.DIST_SYSTEMJS,
	()=> tsc.dist(MODULE.SYSTEMJS, TARGET.ES5, MODULE.SYSTEMJS)
);

gulp.task(TASK.DIST, [
	TASK.DIST_ES6,
	TASK.DIST_AMD,
	TASK.DIST_UMD,
	TASK.DIST_COMMONJS,
	TASK.DIST_SYSTEMJS
]);
