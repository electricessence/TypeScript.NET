var gulp = require('gulp');
var shell = require('gulp-shell');
var typescript = require('gulp-tsc');
var minify = require('gulp-minify');

var BUILD_FOLDER = '../build';
var SOURCE_ROOT = '../System';
var ignoreFiles = ['Globalization/TimeSpanFormat.ts'];
var srcPaths = ['**/*.ts'];

ignoreFiles.forEach(
	function(f) {
		srcPaths.push('!' + f);
	});

gulp.task(
	'compile', function() {
		return gulp.src(srcPaths) // Ignore
			.pipe(
			typescript(
				{
					out: 'System.js',
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
	'compile.min', ['compile'], function() { // Have 'compile' as a dependency to ensure constraints.
		gulp.src(BUILD_FOLDER + '/System.js')
			.pipe(
			minify(
				{
					sourceRoot: SOURCE_ROOT,
					inSourceMap: BUILD_FOLDER +"/System.js.map",
					outSourceMap: BUILD_FOLDER +"/System.min.js.map"
				}))
			.pipe(gulp.dest(BUILD_FOLDER));
	});

gulp.task(
	'default', ['compile', 'compile.min'], function() {
	});