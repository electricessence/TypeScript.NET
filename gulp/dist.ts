///<reference path="../typings/gulp/gulp" />

import * as TARGET from "./constants/Targets";
import * as MODULE from "./constants/ModuleTypes";
import * as gulp from "gulp";
import * as typescript from "./TypeScriptRenderer";
import * as TASK from "./constants/TaskNames";
import * as fs from "fs";
import {JsonMap} from "../source/JSON";
import {IMap} from "../source/System/Collections/Dictionaries/IDictionary";
import {Promise} from "../source/System/Promises/Promise";
import {toPromise} from "./stream-convert";

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

function readJsonFile(path:string, encoding:string = 'utf8'):PromiseLike<JsonMap>
{
	return new Promise<JsonMap>((resolve, reject)=>
	{
		fs.readFile(path, encoding, (err, data)=>
		{
			if(err) reject(err);
			else resolve(JSON.parse(data));
		});
	}, true);
}

function getPackage(dist:string):PromiseLike<JsonMap>
{
	return readJsonFile('./package.json')
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
		.then(pkg=>
			new Promise<void>((resolve, reject)=>
			{
				fs.writeFile(
					`./dist/${folder}/package.json`,
					JSON.stringify(pkg, null, 2),
					err=>
					{
						if(err) reject(err);
						else resolve();
					})
			}))
		.then(()=>
			copyReadme(folder));
}

function copyReadme(folder:string):PromiseLike<File[]>
{
	return toPromise<File[]>(
		gulp.src("./dist/README.md")
			.pipe(gulp.dest(`./dist/${folder}/`)));
}

gulp.task(
	TASK.DIST_ES6,
	()=> typescript
		.dist(MODULE.ES6, TARGET.ES6, MODULE.ES6)
		.render()
		.then(()=>savePackage(MODULE.ES6))
);

gulp.task(
	TASK.DIST_AMD,
	()=> typescript
		.dist(MODULE.AMD, TARGET.ES5, MODULE.AMD)
		.minify()
		.render()
		.then(()=>savePackage(MODULE.AMD))
);

gulp.task(
	TASK.DIST_UMD,
	()=> typescript
		.dist(MODULE.UMD + '.min', TARGET.ES5, MODULE.UMD)
		.minify()
		.render()
		.then(()=>savePackage(MODULE.UMD, MODULE.UMD + '.min'))
);

gulp.task( // Need to double process to get the declarations from es6 without modules
	TASK.DIST_COMMONJS,
	()=> typescript
		.dist(MODULE.COMMONJS, TARGET.ES5, MODULE.COMMONJS)
		.render()
		.then(()=>savePackage(MODULE.COMMONJS))
);

gulp.task(
	TASK.DIST_SYSTEMJS,
	()=> typescript
		.dist(MODULE.SYSTEMJS, TARGET.ES5, MODULE.SYSTEMJS)
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