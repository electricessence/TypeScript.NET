"use strict";

var gulp = require('gulp');
var del = require('del');
var replace = require('gulp-replace');
var EVENT_END = 'end';


const DOCS = './documentation';

gulp.task(
	// This renders the same output as WebStorm's configuration.
	'typescript', function()
	{

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
		return gulp
			.src(['./source/**/*.ts'])
			.pipe(require('gulp-tsc')(options))
			.pipe(gulp.dest('./source'))
			;
	}
);

gulp.task(
	'typescript.min', function()
	{

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


		return gulp
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

	}
);


gulp.task(
	'typedoc', function(done) {

		var typedoc    = require('gulp-typedoc'),
		    rename     = require('gulp-rename'),
		    htmlMinify = require('gulp-html-minify');

		var typedocOptions = {
			name: 'TypeScript.NET',
			out: './documentation',

			module: 'amd',
			target: 'es5',

			includeDeclarations: true,
			ignoreCompilerErrors: false,
			version: true
		};

		// Step 1: Render type-docs..
		console.log("TypeDocs: rendering");
		gulp
			.src('source')
			.pipe(typedoc(typedocOptions))
			.on(EVENT_END, function() {

				// Step 2-A: Fix for issue with search that places a [BACK-SLASH] instead of a [SLASH].
				console.log("TypeDocs: applying fixes");
				const SEARCH_FOLDER = DOCS + '/assets/js';
				gulp
					.src(SEARCH_FOLDER + '/search.js')
					.pipe(replace('\\\\', '/'))
					.pipe(replace('/_', '/'))
					.pipe(gulp.dest(SEARCH_FOLDER));

				// Step 2-B: Refactor (rewrite) html files.
				gulp.src(DOCS + '/**/*.html')
					.pipe(replace('/_', '/'))
					.pipe(replace(' href="_', ' href="'))
					.pipe(htmlMinify())
					.pipe(rename(
						function(path) {
							path.basename = path.basename.replace(/^_/, '');
						}))
					.pipe(gulp.dest(DOCS))
					.on(EVENT_END, function() {
						// Step 3: Delete all old underscored html files.
						del.sync(DOCS + '/**/_*.html', function() {
							console.log("TypeDocs: fixes complete");
							done();
						});
					});

			});


	}
);

gulp.task('default', [
	'typescript',
	'typescript.min',
	'typedoc'
]);
