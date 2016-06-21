/// <reference path="../typings/gulp/gulp" />
import {Target, Module, CoreTypeScriptOptions, BuildHelper} from "gulp-typescript-helper";
import * as PATH from "./constants/Paths";
import * as gulp from "gulp";
import * as TASK from "./constants/TaskNames";
import * as File from "../_utility/file-promise";
import {JsonMap} from "../source/JSON";
import {IMap} from "../source/System/Collections/Dictionaries/IDictionary";
import {Promise} from "../source/System/Promises/Promise";
import {streamToPromise as stream} from "../_utility/stream-to-promise";

const fields:IMap<boolean> = {
	"name": true,
	"version": true,
	"license": true,
	"author": true,
	"description": true,
	"repository": true,
	"private": true,
	"keywords": true
};

function getPackage(dist:string):PromiseLike<JsonMap>
{
	return File.json.read<JsonMap>('./package.json')
		.then(pkg=>
		{
			for(let key of Object.keys(pkg))
			{
				if(!fields[key])
					delete pkg[key];
			}
			pkg["name"] += "-" + dist;
			return pkg;
		});

}

function savePackage(dist:string, folder:string = dist):PromiseLike<File[]>
{
	return getPackage(dist)
		.then(pkg=>File.json.write(`./dist/${folder}/package.json`, pkg))
		.then(()=>copyReadme(folder));
}

function copyReadme(folder:string):PromiseLike<File[]>
{
	return stream.toPromise<File[]>(
		gulp.src("./dist/README.md")
			.pipe(gulp.dest(`./dist/${folder}/`)));
}

const DEFAULTS:CoreTypeScriptOptions = Object.freeze(<CoreTypeScriptOptions>{
	noImplicitAny: true,
	removeComments: true,
	noEmitHelpers: true,
	sourceMap: true,
	declaration: true
});

const builder = BuildHelper
	.inject(Promise.factory)
	.fromTo(PATH.SOURCE, "./dist", DEFAULTS);

gulp.task(
	TASK.DIST_ES6,
	()=> builder
		.init(Module.ES6, Target.ES6, Module.ES6)
		.clear()
		.execute()
		.then(()=>savePackage(Module.ES6))
);

gulp.task(
	TASK.DIST_AMD,
	()=> builder
		.init(Module.AMD, Target.ES5, Module.AMD)
		.clear()
		.minify()
		.execute()
		.then(()=>savePackage(Module.AMD))
);

gulp.task(
	TASK.DIST_UMD,
	()=> builder
		.init(Module.UMD + '.min', Target.ES5, Module.UMD)
		.clear()
		.minify()
		.execute()
		.then(()=>savePackage(Module.UMD, Module.UMD + '.min'))
);

gulp.task(
	TASK.DIST_COMMONJS,
	()=> builder
		.init(Module.COMMONJS, Target.ES5, Module.COMMONJS)
		.clear()
		.execute()
		.then(()=>savePackage(Module.COMMONJS))
);

gulp.task(
	TASK.DIST_SYSTEMJS,
	()=> builder
		.init(Module.SYSTEMJS, Target.ES5, Module.SYSTEMJS)
		.clear()
		.execute()
		.then(()=>savePackage(Module.SYSTEMJS))
);

gulp.task(TASK.DIST, [
	TASK.DIST_ES6,
	TASK.DIST_AMD,
	TASK.DIST_UMD,
	TASK.DIST_COMMONJS,
	TASK.DIST_SYSTEMJS
]);

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