///<reference path="../typings/gulp/gulp" />

import * as TARGET from "./constants/Targets";
import * as MODULE from "./constants/ModuleTypes";
import * as gulp from "gulp";
import * as tsc from "./tsc";
import * as TASK from "./constants/TaskNames";
import * as fs from "fs";
import {JsonData} from "../source/JSON";
import {IMap} from "../source/System/Collections/Dictionaries/IDictionary";
import {Promise} from "../source/System/Promises/Promise";

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

function readJsonFile(path:string, encoding:string = 'utf8'):PromiseLike<JsonData>
{
	return new Promise<JsonData>((resolve, reject)=>
	{
		fs.readFile(path, encoding, (err, data)=>
		{
			if(err) reject(err);
			else resolve(JSON.parse(data));
		});
	}, true);
}

function getPackage(dist:string):PromiseLike<JsonData>
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

function savePackage(dist:string, folder:string = dist):PromiseLike<void>
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
			}));
}

gulp.task(
	TASK.DIST_ES6,
	()=> tsc
		.distES6(MODULE.ES6, true)
		.then(()=>savePackage(MODULE.ES6))
);

gulp.task(
	TASK.DIST_AMD,
	()=> tsc
		.distMini(MODULE.AMD, TARGET.ES5, MODULE.AMD)
		.then(()=>savePackage(MODULE.AMD))
);

gulp.task(
	TASK.DIST_UMD,
	()=> tsc
		.distMini(MODULE.UMD + '.min', TARGET.ES5, MODULE.UMD)
		.then(()=>savePackage(MODULE.UMD, MODULE.UMD + '.min'))
);

gulp.task( // Need to double process to get the declarations from es6 without modules
	TASK.DIST_COMMONJS,
	()=> tsc
		.dist(MODULE.COMMONJS, TARGET.ES5, MODULE.COMMONJS)
		.then(()=>savePackage(MODULE.COMMONJS))
);

gulp.task(
	TASK.DIST_SYSTEMJS,
	()=> tsc
		.dist(MODULE.SYSTEMJS, TARGET.ES5, MODULE.SYSTEMJS)
		.then(()=>savePackage(MODULE.SYSTEMJS))
);

gulp.task(TASK.DIST, [
	TASK.DIST_ES6,
	TASK.DIST_AMD,
	TASK.DIST_UMD,
	TASK.DIST_COMMONJS,
	TASK.DIST_SYSTEMJS
]);
