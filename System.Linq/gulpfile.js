var gulp = require('gulp');

// TypeScript Compilation..
(function(namespace) {

	const PARENT = '../', TS = '.ts', JS = '.js', MIN = '.min', AMD = '.amd';
	const BUILD_FOLDER = PARENT + 'build/';
	const SOURCE_ROOT = PARENT + namespace;

	const TASK_COMPILE = namespace + ' compile';
	const TASK_COMPRESS = TASK_COMPILE + MIN;
	const TASK_AMD = TASK_COMPILE + AMD;

	const JS_OUT = namespace + JS;

	var srcPaths = ['**/*' + TS];

	//['Globalization/TimeSpanFormat'+TS]
	//	.forEach(function(f) {
	//		srcPaths.push('!' + f);
	//	});

	var typescript = require('gulp-tsc');
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

	var rename = require('gulp-rename');
	var sourcemaps = require('gulp-sourcemaps');

	var rjs = require('gulp-r');
	gulp.task(
		TASK_AMD, [TASK_COMPILE], function() {
			return gulp.src([BUILD_FOLDER + namespace + JS])
				.pipe(sourcemaps.init({loadMaps: true}))
				.pipe(
				rjs(
					{
						baseUrl: BUILD_FOLDER,
						shim: {
							"System.Linq": {
								deps: ["System"],
								exports: "System.Linq"
							}
						}
					}))
				.pipe(rename(namespace + AMD + JS))
				.pipe(sourcemaps.write(BUILD_FOLDER, {includeContent: false}))
				.pipe(gulp.dest(BUILD_FOLDER));
		});


	var uglify = require('gulp-uglify');
	gulp.task(
		TASK_COMPRESS, [TASK_COMPILE], function() { // Have 'TASK_COMPILE' as a dependency to ensure constraints.
			return gulp.src(BUILD_FOLDER + JS_OUT)
				.pipe(sourcemaps.init({loadMaps: true}))
				.pipe(uglify())
				.pipe(rename(namespace + MIN + JS))
				.pipe(sourcemaps.write(BUILD_FOLDER, {includeContent: false}))
				.pipe(gulp.dest(BUILD_FOLDER));
		});


	gulp.task(
		'default', [TASK_COMPILE, TASK_COMPRESS, TASK_AMD], function() {
		});

})('System.Linq');