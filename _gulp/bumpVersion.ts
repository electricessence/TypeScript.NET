import * as gulp from "gulp";
import * as semver from "semver";
import * as file from "../_utility/file-promise";
import {streamToPromise as stream} from "../_utility/stream-to-promise";
import {JsonMap} from "../source/JSON";


// No tsd yet.
const bump = require('gulp-bump');

const
	VERSION_BUMP_MINOR = 'version-bump-minor',
	VERSION_BUMP_PATCH = 'version-bump-patch';


//noinspection JSValidateJSDoc
/**
 * @param {string} type
 * @returns {NodeJS.ReadableStream}
 */
async function bumpVersion(type:string):PromiseLike<File[]>
{
	let pkg = await file.json.read<JsonMap>('./package.json');

	let newVer = semver.inc(<string>pkg['version'], type);
	return stream.toPromise<File[]>(
		gulp.src(['./bower.json', './package.json'])
			.pipe(bump({version: newVer}))
			.pipe(gulp.dest('./'))
	)
}


gulp.task(
	VERSION_BUMP_PATCH,
	()=> bumpVersion('patch'));

gulp.task(
	VERSION_BUMP_MINOR,
	()=> bumpVersion('minor'));
