var gulp = require('gulp');

// TypeScript Compilation..
(function(namespace) {

	const PARENT = '../', TS = ".ts", JS = '.js', MAP = '.map', MIN = ".min";
	const BUILD_FOLDER = PARENT + 'build/';
	const SOURCE_ROOT = PARENT + namespace;

	const TASK_COMPILE = "compile";
	const TASK_COMPRESS = TASK_COMPILE + MIN;
	const JS_OUT = namespace + JS;

	var srcPaths = ['**/*'+TS];

	//['Globalization/TimeSpanFormat'+TS]
	//	.forEach(function(f) {
	//		srcPaths.push('!' + f);
	//	});

	var typescript = require('gulp-tsc');
	var uglify = require('gulp-uglify');
	var rename = require("gulp-rename");
	var sourcemaps = require("gulp-sourcemaps");

	gulp.task(
		TASK_COMPILE, function() {
			return gulp.src(srcPaths) // Ignore
				.pipe(
				typescript(
					{
						out: JS_OUT,
						target: 'es5',
						sourcemap: true,
						sourceRoot: SOURCE_ROOT,
						removeComments: true,
						noImplicitAny: true,
						declaration: true
					}))
				.pipe(gulp.dest(BUILD_FOLDER));
		});


	gulp.task(
		TASK_COMPRESS, [TASK_COMPILE], function() { // Have 'compile' as a dependency to ensure constraints.
			gulp.src(BUILD_FOLDER + JS_OUT)
				.pipe(sourcemaps.init({loadMaps:true}))
				.pipe(uglify())
				.pipe(rename(namespace+MIN+JS))
				.pipe(sourcemaps.write(BUILD_FOLDER, {includeContent:false}))
				.pipe(gulp.dest(BUILD_FOLDER));
		});


	gulp.task(
		'default', [TASK_COMPILE, TASK_COMPRESS], function() {
		});

})('System.Linq');