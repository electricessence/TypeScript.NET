/// <reference path="../typings/gulp/gulp" />
/// <reference path="../typings/semver/semver" />
import * as gulp from "gulp";
import * as semver from "semver";
import * as file from "../_utility/file-promise";
import {streamToPromise as stream} from "../_utility/stream-to-promise";


// No tsd yet.
const bump = require('gulp-bump');

const
	VERSION_BUMP_MINOR = 'version-bump-minor',
	VERSION_BUMP_PATCH = 'version-bump-patch';


/**
 * @param {string} type
 * @returns {NodeJS.ReadableStream}
 */
function bumpVersion(type:string):PromiseLike<File[]>
{
	return file.json
		.read('./package.json')
		.then((pkg:any)=>
		{
			let newVer = semver.inc(pkg.version, type);
			return stream.toPromise<File[]>(
				gulp.src(['./bower.json', './package.json'])
					.pipe(bump({version: newVer}))
					.pipe(gulp.dest('./'))
			);
		});
}


gulp.task(
	VERSION_BUMP_PATCH,
	()=> bumpVersion('patch'));

gulp.task(
	VERSION_BUMP_MINOR,
	()=> bumpVersion('minor'));
