"use strict";

var gulp = require('gulp');
var del = require('del');
var replace = require('gulp-replace');


const DOCS = './documentation';

function clearGulpTscTemp() {
	//del(['./gulp-tsc-tmp-*']);
	//del(['./source/.gulp-tsc-tmp-*']);
}

gulp.task(
	// This renders the same output as WebStorm's configuration.
	'typescript', function() {

		var options = {
			tscPath: './node_modules/typescript/bin/tsc',
			outDir: './source',
			noImplicitAny: true,
			module: 'amd',
			target: 'es5',
			removeComments: true,
			sourceMap: true
		};

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
	'typescript.min', ['typescript'], function() {

		del(['./min/**/*']);

		var sourcemaps = require('gulp-sourcemaps');
		var uglify = require('gulp-uglify');

		// This isn't ideal, but it works and points the maps to the original source.
		var sourceMapOptions = {
			sourceRoot: function(file) {
				var count = (file.relative + '').split("\\").length;
				var result = '';
				for(var i = 1; i<count; i++)
				{
					result += '../';
				}
				return result + '../source/';
			},
			includeContent: false
		};


		var stream = gulp
			.src(['./source/**/*.ts'])
			.pipe(sourcemaps.init())
			.pipe(require('gulp-typescript')({
				noImplicitAny: true,
				module: 'amd',
				target: 'es5',
				removeComments: true
			}))
			.pipe(uglify({ preserveComments: 'license' }))
			.pipe(sourcemaps.write('.', sourceMapOptions))
			.pipe(gulp.dest('./min'));

		clearGulpTscTemp();

		return stream;

	}
);


gulp.task(
	'typedoc', ['typescript', 'typescript.min'], function() {

		var typedoc = require('gulp-typedoc');

		var stream = gulp
			.src(['source'])
			.pipe(
			typedoc(
				{
					name: 'TypeScript.NET',
					out: './documentation',

					module: 'amd',
					target: 'es5',

					includeDeclarations: true,
					ignoreCompilerErrors: false,
					version: true
				}
			)
		);


		// Fix for issue with search that places a [BACK-SLASH] instead of a [SLASH].
		const SEARCH_FOLDER = DOCS+'/assets/js';
		gulp
			.src([SEARCH_FOLDER + '/search.js'])
			.pipe(replace('\\\\','/'))
			.pipe(replace('/_','/'))
			.pipe(gulp.dest(SEARCH_FOLDER));

		return stream;

	}
);

gulp.task('typedoc-fix',[],function(){

	var rename = require('gulp-rename');

	// Fix for issue where type-docs insert an [UNDERSCORE] in front of all .html files.
	return gulp
		.src([DOCS+'/**/*.html'])
		.pipe(replace('/_','/'))
		.pipe(replace(' href="_',' href="'))
		.pipe(rename(function (path) {
			path.basename = path.basename.replace(/^_/,'');
		}))
		.pipe(gulp.dest(DOCS));
});

gulp.task('typedoc-fix-cleanup',[],function(){
	del([DOCS+'/**/_*.html']);
});

gulp.task('default', [
	'typescript',
	'typescript.min',
	'typedoc'
]);
