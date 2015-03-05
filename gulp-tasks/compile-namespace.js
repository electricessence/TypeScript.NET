/* This task compiles all the TypeScript for a given namespace as well as it's respective minified and AMD versions. */

module.exports = function(gulp) {

	const PARENT = '../', TS = '.ts', JS = '.js', MIN = '.min', AMD = '.amd';

	// TypeScript Compilation..
	return function(namespace, dependencies) {

		var depString = '';
		if(dependencies && dependencies.length)
		{
			var d = [], o = [];
			dependencies.forEach(
				function(e) {
					if(e)
					{
						o.push(e);
						d.push('\'' + e + '\'');
					}
				});

			if(d.length)
				depString = '[' + d.join(',') + '],';
			dependencies = o;
		}
		else
			dependencies = [];


		var BUILD_FOLDER = PARENT + 'build/';
		var AMD_BUILD_FOLDER = PARENT + "amd/";
		var SOURCE_ROOT = PARENT + namespace;

		var TASK_COMPILE = namespace + '-compile';
		var TASK_COMPRESS = TASK_COMPILE + MIN;
		var TASK_AMD = TASK_COMPILE + AMD;
		var AMD_WRAPPING = ''
			+ 'define("'
			+ namespace + '",'
			+ depString
			+ 'function('
			+ dependencies.join(',')
			+ '){{%=body%};return '
			+ namespace + ';});';

		var JS_OUT = namespace + JS;

		var srcPaths = [SOURCE_ROOT + '/**/*' + TS];

		[SOURCE_ROOT + '/Globalization/TimeSpanFormat' + TS]
			.forEach(
			function(f) {
				srcPaths.push('!' + f);
			});

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

		var sourcemaps = require('gulp-sourcemaps');

		var rename = require('gulp-rename');
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

		var wrap = require("gulp-wrap-js");
		gulp.task(
			TASK_AMD, [TASK_COMPILE], function() {
				return gulp.src(BUILD_FOLDER + JS_OUT)
					.pipe(sourcemaps.init({loadMaps: true}))
					.pipe(wrap(AMD_WRAPPING))
					.pipe(uglify())
					.pipe(sourcemaps.write(AMD_BUILD_FOLDER, {includeContent: false}))
					.pipe(gulp.dest(AMD_BUILD_FOLDER));
			});

		// Return the unique task names to be triggered upstream.
		return [TASK_COMPILE, TASK_COMPRESS, TASK_AMD];
	}
};