import * as gulp from "gulp";
import * as semver from "semver";
import * as file from "../_utility/file-promise";
import {streamToPromise as stream} from "../_utility/stream-to-promise";
import {JsonMap} from "../source/JSON";
import {TSDNPromise as NPromise} from "../source/System/Promises/Promise";
import awaiter from "../source/awaiter";
import generator from "../source/generator";
// noinspection JSUnusedLocalSymbols
const __awaiter = awaiter;
// noinspection JSUnusedLocalSymbols
const __generator = generator;

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
async function bumpVersion(type:string):NPromise<File[]>
{
	let pkg = await file.json.read<JsonMap>('./package.json');

	let newVer = semver.inc(<string>pkg['version'], type);
	return stream.toPromise<File[]>(
		gulp.src(['./bower.json', './package.json'])
			.pipe(bump({version: newVer}))
			.pipe(gulp.dest('./'))
	);
}


gulp.task(
	VERSION_BUMP_PATCH,
	() => bumpVersion('patch'));

gulp.task(
	VERSION_BUMP_MINOR,
	() => bumpVersion('minor'));
