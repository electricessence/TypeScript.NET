// import * as TARGET from "./gulp/constants/Targets";
// import * as MODULE from "./gulp/constants/ModuleTypes";
// import * as TASK from "./gulp/constants/TaskNames";
// import * as gulp from "gulp";
// import * as tsc from "./gulp/tsc";

// This is currently disabled since the output cannot be matched exactly.
// The source files must be build by tsc.exe or WebStorm's built-in tsc.
// =============
// gulp.task(
// 	// This should render the same output as WebStorm's configuration.
// 	TASK.SOURCE,
// 	()=> tsc.at('./source', TARGET.ES5, MODULE.UMD)
// );

require("./gulp/tests");
require("./gulp/dist");
require("./gulp/bumpVersion");
require("./gulp/nuget-pack");

// gulp.task(
// 	TASK.BUILD, [
// 		TASK.SOURCE,
// 		TASK.DIST,
// 		TASK.BUILD + ".tests"
// 	]
// );


// gulp.task(TASK.DEFAULT, [
// 	TASK.SOURCE,
// 	TASK.DIST
// ]);
