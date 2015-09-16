var gulp = require('gulp');
var del = require('del');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');

function clearGulpTscTemp() {
	del([ './gulp-tsc-tmp-*' ]);
	del([ './source/.gulp-tsc-tmp-*' ]);
}

gulp.task(
	// This renders the same output as WebStorm's configuration.
	'typescript', function() {

		var options = {
			outDir: './source',
			noImplicitAny: true,
			module: 'amd',
			target: 'es5',
			removeComments: true,
			sourceMap: true
		};

		del([ './min/**/*' ]);

		// In order to mirror WebStorm's compiler option, gulp-tsc is used.
		var stream = gulp
			.src(['./source/**/*.ts'])
			.pipe(require('gulp-tsc')(options))
			.pipe(gulp.dest('./source'))
			;

		clearGulpTscTemp();

		return stream;
	}
);


gulp.task(
	'typescript.min', function() {

		var
			sourceMapOptions = {
				//sourceRoot: '../../source/',
				sourceRoot: function(file) {
					return '../../source/';
				}
				,
				includeContent: false
			};

		del([ './min/**/*' ]);

		var stream = gulp
			.src(['./source/**/*.ts'], { base: './source' })
			.pipe(sourcemaps.init())
			.pipe(require('gulp-typescript')({
				outDir:'./min',
				noImplicitAny: true,
				module: 'amd',
				target: 'es5',
				removeComments: true
			}))
			.pipe(uglify({preserveComments:'license'}))
			.pipe(sourcemaps.write('.', sourceMapOptions))
			.pipe(gulp.dest('./min'));

		clearGulpTscTemp();

		return stream;

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