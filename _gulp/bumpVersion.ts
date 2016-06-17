///<reference path="../typings/gulp/gulp" />
///<reference path="../typings/semver/semver" />
import * as gulp from "gulp";
import * as semver from "semver";
import * as fs from "fs";

const
	VERSION_BUMP_MINOR = 'version-bump-minor',
	VERSION_BUMP_PATCH ='version-bump-patch';


/**
 * @param {string} type
 * @returns {NodeJS.ReadableStream}
 */
function bumpVersion(type:string):void
{
	// No tsd yet.
	const bump = require('gulp-bump');

	var pkg = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
	// increment version
	var newVer = semver.inc(pkg.version, type);

	return gulp.src(['./bower.json', './package.json'])
		.pipe(bump({version: newVer}))
		.pipe(gulp.dest('./'));

}


gulp.task(VERSION_BUMP_PATCH, function() { bumpVersion('patch'); });

gulp.task(VERSION_BUMP_MINOR, function() { bumpVersion('minor'); });
