const TYPESCRIPT = 'typescript';


const MODULE = Object.freeze({
	COMMONJS: 'commonjs',
	SYSTEMJS: 'system',
	UMD: 'umd',
	AMD: 'amd'
});

const TARGET = Object.freeze({
	ES5: 'es5',
	ES6: 'es6'
});

// List of all tasks by name and for reuse as dependencies.
const TASK = Object.freeze({
	SOURCE: 'source (umd)',
	DIST: 'dist',
	DIST_ES6: 'dist.' + TARGET.ES6,
	DIST_AMD: 'dist.' + MODULE.AMD,
	DIST_UMD: 'dist.' + MODULE.UMD + '.min',
	DIST_COMMONJS: 'dist.' + MODULE.COMMONJS,
	DIST_SYSTEMJS: 'dist.' + MODULE.SYSTEMJS,
	TYPESCRIPT_QUNIT: TYPESCRIPT + '.qunit',
	TYPESCRIPT_MOCHA: TYPESCRIPT + '.mocha',
	BUILD: 'build',
	TYPEDOC: 'typedoc',
	VERSION_BUMP_MINOR: 'version-bump-minor',
	VERSION_BUMP_PATCH: 'version-bump-patch',
	NUGET_PACK: 'nuget-pack',
	DEFAULT: 'default'
});

const
	gulp       = require('gulp'),
	del        = require('del'),
	rename     = require('gulp-rename'),
	sourcemaps = require('gulp-sourcemaps'),
	uglify     = require('gulp-uglify'),
	babel      = require('gulp-babel'),
	typescript = require('gulp-typescript'),
	typedoc    = require('gulp-typedoc'),
	replace    = require('gulp-replace'),
	semver     = require('semver'),
	nugetpack  = require('gulp-nuget-pack'),
	Q          = require('q');


const EVENT = Object.freeze({
	END: 'end'
});

const PATH = Object.freeze({
	SOURCE: './source',
	TSC: './node_modules/typescript/bin/tsc',
	DOCS: './documentation'
});


const tsc = (function() {
	"use strict";

	var c = require('gulp-tsc');
	c.getOptions = getOptions;
	c.fromTo = fromTo;
	c.at = at;
	c.atV2 = atV2;
	c.sourceTo = sourceTo;
	c.dist = dist;
	c.distPostProcess = distPostProcess;
	c.distMini = distMini;

	function getOptions(destination, target, module, declaration) {
		return {
			tscPath: PATH.TSC,
			outDir: destination,
			noImplicitAny: true,
			module: module,
			target: target,
			removeComments: true,
			sourceMap: true,
			declaration: declaration
		}
	}

	function fromTo(from, to, target, module, declaration, doNotEmit) {

		if(!doNotEmit) {
			if(module)
				console.log('TypeScript Render:', target, module, from == to ? from : (from + ' >> ' + to));
			else
				console.log('TypeScript Render:', target, from == to ? from : (from + ' >> ' + to));
		}
		// In order to mirror WebStorm's compiler option (the tsc), gulp-tsc is used.

		var render = function() {
			return gulp
				.src([from + '/**/*.ts'])
				.pipe(c(getOptions(to, target, module, declaration)))
				.pipe(gulp.dest(to));
		};

		if(declaration) {
			var deferred = Q.defer();
			gulp
				.src([from + '/**/*.d.ts'])
				.pipe(gulp.dest(to))
				.on(EVENT.END, function() {
					render().on(EVENT.END, deferred.resolve);
				});
			return deferred.promise;
		}
		else {
			return render();
		}
		
	}

	function at(folder, target, module) {
		return tsc.fromTo(folder, folder, target, module);
	}

	function atV2(folder, target, module) {

		var typescriptOptions = {
			noImplicitAny: true,
			module: module,
			target: target,
			removeComments: true
		};

		var sourceMapOptions = {
			sourceRoot: null
		};


		console.log('TypeScript Render:', target, module, folder);

		return gulp
			.src([folder + '/**/*.ts'])
			.pipe(sourcemaps.init())
			.pipe(typescript(typescriptOptions))
			.pipe(sourcemaps.write('.', sourceMapOptions))
			.pipe(gulp.dest(folder));
	}

	function sourceTo(folder, target, module, declaration, doNotEmit) {
		return tsc.fromTo(PATH.SOURCE, folder, target, module, declaration, doNotEmit);
	}

	function distES6(folder) {
		//noinspection JSUnresolvedFunction
		var deferred = Q.defer();
		var d = './dist/' + folder;

		del(d + '/**/*')['then'](function() {
			sourceTo(d, TARGET.ES6, TARGET.ES6, true, true)
				.then(deferred.resolve);
		});

		return deferred.promise;
	}

	function dist(folder, target, module) {
		//noinspection JSUnresolvedFunction
		var deferred = Q.defer();
		var d = './dist/' + folder;
		distES6(folder).then(function(){
			sourceTo(d, target, module)
				.then(deferred.resolve);
		});
		return deferred.promise;
	}

	function distPostProcess(folder, target, module, postProcess) {

		var deferred = Q.defer();
		var d = './dist/' + folder;

		// Export declarations first, then over-write...
		distES6(folder, TARGET.ES6, TARGET.ES6, true)
			.then(function() {

				console.log('TypeScript Render:', target, module, './source >> ' + d);

				var typescriptOptions = {
					noImplicitAny: true,
					module: module,
					target: target,
					removeComments: true
				};

				var sourceMapOptions = {
					sourceRoot: null
				};


				gulp
					.src(['./source/**/*.ts'])
					.pipe(sourcemaps.init())
					.pipe(typescript(typescriptOptions))
					.pipe(postProcess())
					.pipe(sourcemaps.write('.', sourceMapOptions))
					.pipe(gulp.dest(d))
					.on(EVENT.END, deferred.resolve);

			}
		);

		return deferred.promise;

	}

	function distMini(folder, target, module) {

		return distPostProcess(folder, target, module, function() {
			return uglify({
				preserveComments: 'license'
			});
		});
	}

	return c;
})();

gulp.task(
	// This renders the same output as WebStorm's configuration.
	TASK.SOURCE, function()
	{
		return tsc.at('./source', TARGET.ES5, MODULE.UMD);
	}
);

gulp.task(
	TASK.DIST_ES6, function()
	{
		const ES6 = TARGET.ES6;
		return tsc.dist(ES6, ES6);
	}
);

gulp.task(
	TASK.DIST_AMD, function()
	{
		return tsc.distMini(
			MODULE.AMD, TARGET.ES5, MODULE.AMD);
	});


gulp.task(
	TASK.DIST_UMD, function()
	{
		return tsc.distMini(
			MODULE.UMD + '.min', TARGET.ES5, MODULE.UMD);
	});

gulp.task( // Need to double process to get the declarations from es6 without modules
	TASK.DIST_COMMONJS, function()
	{
		return tsc.distPostProcess(
			MODULE.COMMONJS, TARGET.ES6, MODULE.COMMONJS, babel);

		//return tsc.dist(
		//	MODULE.COMMONJS, TARGET.ES5, MODULE.COMMONJS);
	}
);

gulp.task(
	TASK.DIST_SYSTEMJS, function()
	{
		return tsc.dist(
			MODULE.SYSTEMJS, TARGET.ES5, MODULE.SYSTEMJS);
	}
);

gulp.task(TASK.DIST, [
	TASK.DIST_ES6,
	TASK.DIST_AMD,
	TASK.DIST_UMD,
	TASK.DIST_COMMONJS,
	TASK.DIST_SYSTEMJS
]);

gulp.task(
	TASK.TYPESCRIPT_QUNIT, function()
	{
		// Can't figure out why the TSC doesn't work the same for this folder as it does for the source folder. :(
		return tsc.atV2('./tests/qunit', TARGET.ES5, MODULE.UMD);
	}
);

gulp.task(
	TASK.TYPESCRIPT_MOCHA, [
		TASK.SOURCE,
		TASK.DIST_COMMONJS // Common JS is compiled due to babel smoke test in mocha tests.
	], function()
	{
		return tsc.atV2('./tests/mocha', TARGET.ES5, MODULE.UMD);
	}
);


gulp.task(
	TASK.BUILD + ".tests", [
		TASK.TYPESCRIPT_QUNIT,
		TASK.TYPESCRIPT_MOCHA
	]
);

gulp.task(
	TASK.BUILD, [
		TASK.SOURCE,
		TASK.DIST,
		TASK.BUILD + ".tests"
	]
);

gulp.task(
	TASK.TYPEDOC, function()
	{
		var typedocOptions = {
			name: 'TypeScript.NET',
			out: PATH.DOCS,

			module: MODULE.UMD,
			target: TARGET.ES5,

			excludeNotExported: true,
			includeDeclarations: true,
			ignoreCompilerErrors: false,
			version: true
		};

		// Step 1: Render type-docs..
		console.log('TypeDocs: rendering');
		return gulp
			.src(PATH.SOURCE)
			.pipe(typedoc(typedocOptions))
			;

	});

/**
 * @param {string} type
 * @returns {NodeJS.ReadableStream}
 */
function bumpVersion(type)
{
	// No tsd yet.
	var fs   = require('fs'),
	    bump = require('gulp-bump');

	var pkg = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
	// increment version
	var newVer = semver.inc(pkg.version, type);

	return gulp.src(['./bower.json', './package.json'])
		.pipe(bump({ version: newVer }))
		.pipe(gulp.dest('./'));

}

gulp.task(TASK.VERSION_BUMP_PATCH, function() { bumpVersion('patch'); });

gulp.task(TASK.VERSION_BUMP_MINOR, function() { bumpVersion('minor'); });

gulp.task(TASK.NUGET_PACK,
	[
		TASK.BUILD
	],
	function(callback) {

		var fs = require('fs');

		var pkg = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
		nugetpack({
				id: "TypeScript.NET.Library",
				title: "TypeScript.NET",
				version: pkg.version,
				authors: "https://github.com/electricessence/",
				description: pkg.description,
				summary: "See http://electricessence.github.io/TypeScript.NET/ for details.",
				language: "en-us",
				projectUrl: "https://github.com/electricessence/TypeScript.NET",
				licenseUrl: "https://raw.githubusercontent.com/electricessence/TypeScript.NET/master/LICENSE.md",
				tags: "typescript tsc .NET TypeScript.NET LINQ",
				excludes: [],
				outputDir: ".nuget"
			},

			[
				'source',
				'dist',
				'*.md'
			],

			callback
		);
	});


gulp.task(TASK.DEFAULT, [
	TASK.SOURCE,
	TASK.DIST,
	TASK.TYPEDOC
]);
