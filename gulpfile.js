// List of all tasks by name and for reuse as dependencies.
const
	TASK_TYPESCRIPT         = 'typescript',
	TASK_DIST               = 'dist',
	TASK_DIST_ES6           = TASK_DIST + '.es6',
	TASK_DIST_AMD           = TASK_DIST + '.amd',
	TASK_DIST_COMMONJS      = TASK_DIST + '.commonjs',
	TASK_DIST_SYSTEMJS      = TASK_DIST + '.systemjs',
	TASK_TYPESCRIPT_QUNIT   = TASK_TYPESCRIPT + '.qunit (AMD)',
	TASK_TYPESCRIPT_MOCHA   = TASK_TYPESCRIPT + '.mocha',
	TASK_BUILD              = 'build',
	TASK_TYPEDOC            = 'typedoc',
	TASK_VERSION_BUMP_MINOR = 'version-bump-minor',
	TASK_VERSION_BUMP_PATCH = 'version-bump-patch',
	TASK_NUGET_PACK         = 'nuget-pack',
	TASK_DEFAULT            = 'default';

const
	gulp       = require('gulp'),
	del        = require('del'),
	rename     = require('gulp-rename'),
	sourcemaps = require('gulp-sourcemaps'),
	uglify     = require('gulp-uglify'),
	babel      = require('gulp-babel'),
	gulpTsc    = require('gulp-tsc'),
	typescript = require('gulp-typescript'),
	typedoc    = require('gulp-typedoc'),
	replace    = require('gulp-replace'),
	semver     = require('semver'),
	nugetpack  = require('gulp-nuget-pack');

const EVENT_END = 'end';
const DOCS = './documentation';
const TSC_PATH = './node_modules/typescript/bin/tsc';

const
	COMMONJS = 'commonjs',
	SYSTEMJS = 'system',
	AMD      = 'amd',
	ES5      = 'es5',
	ES6      = 'es6';

function getTscOptions(destination, target, module) {
	return {
		tscPath: TSC_PATH,
		outDir: destination,
		noImplicitAny: true,
		module: module,
		target: target,
		removeComments: true,
		sourceMap: true
	}
}

function tscFromTo(from, to, target, module) {

	console.log('TypeScript Render:', target, module, from==to ? from : (from + ' >> ' + to));
	// In order to mirror WebStorm's compiler option, gulp-tsc is used.
	return gulp
		.src([from + '/**/*.ts'])
		.pipe(gulpTsc(getTscOptions(to, target, module)))
		.pipe(gulp.dest(to));
}

function tsc(folder, target, module) {
	return tscFromTo(folder, folder, target, module);
}

function tscSource(destination, target, module) {
	return tscFromTo('./source', destination, target, module);
}

gulp.task(
	// This renders the same output as WebStorm's configuration.
	TASK_TYPESCRIPT, function()
	{
		return tsc('./source', ES5, COMMONJS);
	}
);

gulp.task(
	TASK_DIST_ES6, function(done)
	{
		const d = './dist/' + ES6;
		del(d + '/**/*')
			.then(function() {
				tscSource(d, ES6, null)
					.on(EVENT_END, done);
			});
	}
);


gulp.task(
	TASK_DIST_AMD, function(done)
	{
		const DESTINATION = './dist/' + AMD;

		var typescriptOptions/*:typescript.Params*/ = {
			noImplicitAny: true,
			module: AMD,
			target: ES5,
			removeComments: true
		};

		// This isn't ideal, but it works and points the maps to the original source.
		var sourceMapOptions/*:sourcemaps.WriteOptions*/ = {
			sourceRoot: null
		};

		var uglifyOptions = {
			preserveComments: 'license'
		};

		del(DESTINATION + '/**/*')
			.then(function() {

				console.log('TypeScript Render:', ES5, AMD, './source >> ' + DESTINATION);

				gulp
					.src(['./source/**/*.ts'])
					.pipe(sourcemaps.init())
					.pipe(typescript(typescriptOptions))
					.pipe(uglify(uglifyOptions))
					.pipe(sourcemaps.write('.', sourceMapOptions))
					.pipe(gulp.dest(DESTINATION))
					.on(EVENT_END, done);
			});

	});


gulp.task(
	TASK_DIST_COMMONJS, function(done)
	{
		const DESTINATION = './dist/' + COMMONJS;

		var typescriptOptions/*:typescript.Params*/ = {
			noImplicitAny: true,
			module: null,
			target: ES6,
			removeComments: true
		};

		// This isn't ideal, but it works and points the maps to the original source.
		var sourceMapOptions/*:sourcemaps.WriteOptions*/ = {
			sourceRoot: null
		};

		del(DESTINATION + '/**/*').then(function() {

			console.log('TypeScript Render:', ES6, './source >> ' + DESTINATION);

			gulp
				.src(['./source/**/*.ts'])
				.pipe(sourcemaps.init())
				.pipe(typescript(typescriptOptions))
				.pipe(babel())
				.pipe(sourcemaps.write('.', sourceMapOptions))
				.pipe(gulp.dest(DESTINATION))
				.on(EVENT_END, done);
		});

	}
);

gulp.task(
	TASK_DIST_SYSTEMJS, function(done)
	{
		const d = './dist/' + SYSTEMJS;
		del(d + '/**/*').then(function() {
			return tscSource(d, ES5, SYSTEMJS)
				.on(EVENT_END, done);
		});
	}
);

gulp.task(TASK_DIST, [
	TASK_DIST_ES6,
	TASK_DIST_AMD,
	TASK_DIST_COMMONJS,
	TASK_DIST_SYSTEMJS
]);

gulp.task(
	TASK_TYPESCRIPT_QUNIT, function()
	{

		const DESTINATION = './tests/qunit';

		var typescriptOptions = {
			noImplicitAny: true,
			module: AMD,
			target: ES5,
			removeComments: true
		};

		// This isn't ideal, but it works and points the maps to the original source.
		var sourceMapOptions/*:sourcemaps.WriteOptions*/ = {
			sourceRoot: null
		};


		console.log('TypeScript Render:', ES5, AMD, DESTINATION);

		return gulp
			.src([DESTINATION+'/**/*.ts'])
			.pipe(sourcemaps.init())
			.pipe(typescript(typescriptOptions))
			.pipe(sourcemaps.write('.', sourceMapOptions))
			.pipe(gulp.dest(DESTINATION));


	}
);

gulp.task(
	TASK_TYPESCRIPT_MOCHA, function()
	{
		return tsc('./tests/mocha', ES5, COMMONJS);
	}
);

gulp.task(
	TASK_BUILD, [
		TASK_TYPESCRIPT,
		TASK_DIST,
		TASK_TYPESCRIPT_QUNIT
	]
);

gulp.task(
	TASK_TYPEDOC, function(done)
	{
		var typedocOptions = {
			name: 'TypeScript.NET',
			out: './documentation',

			module: 'amd',
			target: 'es5',

//			excludeNotExported: true // Disable till fixed.
			includeDeclarations: true,
			ignoreCompilerErrors: false,
			version: true
		};

		// Step 1: Render type-docs..
		console.log('TypeDocs: rendering');
		return gulp
			.src('source')
			.pipe(typedoc(typedocOptions))
			.on(EVENT_END, typedocFixes);


		function typedocFixes()
		{

			// Step 2-A: Fix for issue with search that places a [BACK-SLASH] instead of a [SLASH].
			console.log('TypeDocs: applying fixes');
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
				.pipe(rename(function(path)
				{
					path.basename = path.basename.replace(/^_/, '');
				}))
				.pipe(gulp.dest(DOCS))
				.on(EVENT_END, cleanup);

		}

		function cleanup()
		{
			// Step 3: Delete all old underscored html files.
			del.sync(DOCS + '/**/_*.html', function()
			{
				console.log('TypeDocs: fixes complete');
				done();
			});
		}

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

gulp.task(TASK_VERSION_BUMP_PATCH, function() { bumpVersion('patch'); });

gulp.task(TASK_VERSION_BUMP_MINOR, function() { bumpVersion('minor'); });

gulp.task(TASK_NUGET_PACK,
	[
		TASK_TYPESCRIPT,
		TASK_DIST_AMD
	],
	function(callback) {

		var fs = require('fs');

		var pkg = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
		nugetpack({
				id: "TypeScript.NET.AMD",
				title: pkg.name,
				version: pkg.version,
				authors: "https://github.com/electricessence/",
				description: pkg.description,
				summary: "See http://electricessence.github.io/TypeScript.NET/ for details.",
				language: "en-us",
				projectUrl: "https://github.com/electricessence/TypeScript.NET",
				licenseUrl: "https://raw.githubusercontent.com/electricessence/TypeScript.NET/master/LICENSE.md",
				tags: "typescript tsc .NET TypeScript.NET LINQ",
				excludes: ["js/**/*.dev.js"],
				outputDir: ".nuget"
			},

			[
				'source',
				'min',
				'*.json',
				'*.md'
			],

			callback
		);
	});


gulp.task(TASK_DEFAULT, [
	TASK_TYPESCRIPT,
	TASK_DIST,
	TASK_TYPEDOC
]);
