///<reference path="../typings/gulp/gulp" />

import * as TARGET from "./typescript/Targets";
import * as MODULE from "./typescript/ModuleTypes";
import * as PATH from "./constants/Paths";
import * as gulp from "gulp";
import * as TASK from "./constants/TaskNames";
import * as File from "../_utility/file-promise";
import {TypeScriptRendererFactory} from "./typescript/TypeScriptRenderer";
import {JsonMap} from "../source/JSON";
import {IMap} from "../source/System/Collections/Dictionaries/IDictionary";
import {toPromise} from "../_utility/stream-convert";
import {CoreTypeScriptOptions} from "./typescript/TypeScriptRendererBase";

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
	return toPromise<File[]>(
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

const renderer = TypeScriptRendererFactory.fromTo(PATH.SOURCE, "./dist" , DEFAULTS);

gulp.task(
	TASK.DIST_ES6,
	()=> renderer
		.init(MODULE.ES6, TARGET.ES6, MODULE.ES6)
		.clear()
		.render()
		.then(()=>savePackage(MODULE.ES6))
);

gulp.task(
	TASK.DIST_AMD,
	()=> renderer
		.init(MODULE.AMD, TARGET.ES5, MODULE.AMD)
		.clear()
		.minify()
		.render()
		.then(()=>savePackage(MODULE.AMD))
);

gulp.task(
	TASK.DIST_UMD,
	()=> renderer
		.init(MODULE.UMD + '.min', TARGET.ES5, MODULE.UMD)
		.clear()
		.minify()
		.render()
		.then(()=>savePackage(MODULE.UMD, MODULE.UMD + '.min'))
);

gulp.task( // Need to double process to get the declarations from es6 without modules
	TASK.DIST_COMMONJS,
	()=> renderer
		.init(MODULE.COMMONJS, TARGET.ES5, MODULE.COMMONJS)
		.clear()
		.render()
		.then(()=>savePackage(MODULE.COMMONJS))
);

gulp.task(
	TASK.DIST_SYSTEMJS,
	()=> renderer
		.init(MODULE.SYSTEMJS, TARGET.ES5, MODULE.SYSTEMJS)
		.clear()
		.render()
		.then(()=>savePackage(MODULE.SYSTEMJS))
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
// 			.at('./source', TARGET.ES5, MODULE.UMD, {noEmitHelpers: true});
// 		var s = r.sourceMapOptions;
// 		s.sourceRoot = "";
// 		s.includeContent = false;
//
// 		return r.render()
// 	});