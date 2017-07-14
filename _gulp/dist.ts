import {BuildHelper, CoreTypeScriptOptions, Module, Target} from "gulp-typescript-helper";
import * as PATH from "./constants/Paths";
import * as gulp from "gulp";
import * as TASK from "./constants/TaskNames";
import * as File from "../_utility/file-promise";
import {JsonMap} from "../source/JSON";
import {IMap} from "../source/IMap";
import {streamToPromise as stream} from "../_utility/stream-to-promise";
import {TSDNPromise as NPromise} from "../source/System/Promises/Promise";
import awaiter from "../source/awaiter";
import generator from "../source/generator";
// noinspection JSUnusedLocalSymbols
const __awaiter = awaiter;
// noinspection JSUnusedLocalSymbols
const __generator = generator;

const fields:IMap<boolean> = {
	"name": true,
	"version": true,
	"license": true,
	"author": true,
	"description": true,
	"repository": true,
	"private": true,
	"keywords": true,
	"browser": true
};

async function getPackage(dist:string):NPromise<JsonMap>
{
	let pkg = await File.json.read<JsonMap>('./package.json');
	if(!pkg) throw "package.json not found.";
	for(let key of Object.keys(pkg))
	{
		if(!fields[key])
			delete pkg[key];
	}
	pkg["name"] += "-" + dist;
	return pkg;

}

async function savePackage(dist:string, folder:string = dist):NPromise<File[]>
{
	let pkg = await getPackage(dist);
	await File.json.write(`./dist/${folder}/package.json`, pkg);
	return copyReadmes(folder);
}

function copyReadmes(folder:string):PromiseLike<File[]>
{
	return stream.toPromise<File[]>(
		gulp.src("./dist/*.md")
			.pipe(gulp.dest(`./dist/${folder}/`)));
}

const DEFAULTS:CoreTypeScriptOptions = Object.freeze(<CoreTypeScriptOptions>{
	noImplicitAny: true,
	noEmitHelpers: true,
	removeComments: false,
	sourceMap: true,
	declaration: true,
	strictNullChecks: true,
	moduleResolution: "node"
});

const builder = BuildHelper
	.inject(NPromise.factory)
	.fromTo(PATH.SOURCE, "./dist", DEFAULTS);

gulp.task(
	TASK.DIST_ES6,
	() => builder
		.init(Module.ES6, Target.ES6, Module.ES6)
		.clear()
		.removeExtraneousES6Helpers()
		.execute()
		.then(() => savePackage(Module.ES6))
);

gulp.task(
	TASK.DIST_AMD,
	() => builder
		.init(Module.AMD, Target.ES5, Module.AMD)
		.clear()
		.minify()
		.execute()
		.then(() => savePackage(Module.AMD))
);

gulp.task(
	TASK.DIST_UMD,
	() => builder
		.init(Module.UMD + '.min', Target.ES5, Module.UMD)
		.clear()
		.minify()
		.execute()
		.then(() => savePackage(Module.UMD, Module.UMD + '.min'))
);

gulp.task(
	TASK.DIST_COMMONJS + " js-only",
	() => builder
		.init(Module.COMMONJS + ' js-only', Target.ES5, Module.COMMONJS)
		.addOptions({
			declaration: false,
			sourceMap: false
		})
		.clear()
		//.minify()
		.execute()
		.then(() => savePackage(Module.COMMONJS + '-js-only', Module.COMMONJS + ' js-only'))
);

gulp.task(
	TASK.DIST_COMMONJS,
	() => builder
		.init(Module.COMMONJS, Target.ES5, Module.COMMONJS)
		.clear()
		.execute()
		.then(() => savePackage(Module.COMMONJS))
);

gulp.task(
	TASK.DIST_SYSTEMJS,
	() => builder
		.init(Module.SYSTEMJS, Target.ES5, Module.SYSTEMJS)
		.clear()
		.execute()
		.then(() => savePackage(Module.SYSTEMJS))
);

// gulp.task(TASK.DIST, [
// 	TASK.DIST_ES6,
// 	TASK.DIST_AMD,
// 	TASK.DIST_UMD,
// 	TASK.DIST_COMMONJS,
// 	TASK.DIST_SYSTEMJS
// ]);

// gulp.task(
// 	TASK.SOURCE,
// 	()=>{
// 		var r = typescript
// 			.at('./source', Target.ES5, Module.UMD, {noEmitHelpers: true});
// 		var s = r.sourceMapOptions;
// 		s.sourceRoot = "";
// 		s.includeContent = false;
//
// 		return r.execute()
// 	});