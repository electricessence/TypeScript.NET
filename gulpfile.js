var gulp = require('gulp');

// This renders the same output as WebStorm's configuration.
gulp.task(
	'typescript', function() {

		var typescript = require('gulp-tsc');

		var options = {
			outDir: './source',
			noImplicitAny: true,
			module: 'amd',
			target: 'es5',
			removeComments: true,
			sourceMap: true
		};


		return gulp
			.src(['./source/**/*.ts'])
			.pipe(typescript(options))
			.pipe(gulp.dest('./source'));

	}
);


gulp.task(
	'typescript.min', function() {


		var sourcemaps = require('gulp-sourcemaps');
		var uglify = require('gulp-uglify');

		var


			sourceMapOptions = {
				includeContent: false
			},

			minOptions       = {
				preserveComments:'license'
			}
			;


		return gulp
			.src(['source/**/*.js'], { base: 'source' })
			//.pipe(sourcemaps.init({loadMaps: true}))
			.pipe(uglify(minOptions))
			//.pipe(sourcemaps.write('../maps', sourceMapOptions))
			.pipe(gulp.dest('./min'));

	}
);


gulp.task(
	'typedoc', ['typescript'], function() {

		var typedoc = require('gulp-typedoc');

		return gulp
			.src(['source'])
			.pipe(
			typedoc(
				{
					name: 'TypeScript.NET',
					out: './documentation',

					module: 'amd',
					target: 'es5',

					ignoreCompilerErrors: false,
					version: true
				}
			)
		);

	}
);