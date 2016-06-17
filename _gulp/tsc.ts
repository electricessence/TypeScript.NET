///<reference path="../typings/gulp/gulp" />
///<reference path="../typings/gulp-sourcemaps/gulp-sourcemaps" />
///<reference path="../typings/gulp-typescript/gulp-typescript" />
///<reference path="../typings/gulp-replace/gulp-replace" />
///<reference path="../typings/gulp-uglify/gulp-uglify" />
///<reference path="../typings/del/del" />
///<reference path="../typings/merge2/merge2" />

import {ModuleType} from "./typescript/ModuleTypes";
import {EcmaTarget} from "./typescript/Targets";
import * as PATH from "./constants/Paths";
import * as gulp from "gulp";
import * as typescript from "gulp-typescript";
import {Promise, PromiseBase} from "../source/System/Promises/Promise";
import {JsonMap} from "../source/JSON";
import * as StreamConvert from "../_utility/stream-convert";
import mergeValues from "../source/mergeValues";
import ReadWriteStream = NodeJS.ReadWriteStream;
const tsc = require("gulp-tsc");




export const DEFAULTS:typescript.Params = Object.freeze(<typescript.Params>{
	noImplicitAny: true,
	removeComments: true,
	noEmitHelpers: true,
	sourceMap: true
});

function ensureDefaults<T extends JsonMap | typescript.Params>(target:T):T & typescript.Params
{
	return mergeValues(target, DEFAULTS);
}

function getTscOptions(
	destination:string,
	target:EcmaTarget,
	module:ModuleType,
	declaration:boolean):JsonMap & typescript.Params
{
	return ensureDefaults({
		tscPath: PATH.TSC,
		outDir: destination,
		module: module,
		target: target,
		declaration: !!declaration
	});
}

export function fromTo(
	from:string,
	to:string,
	target:EcmaTarget,
	module:ModuleType,
	declaration?:boolean,
	doNotEmit?:boolean):PromiseLike<File[]>
{

	if(!doNotEmit)
	{
		if(module)
			console.log('TypeScript Render:',
				target, module,
				from==to ? from : (from + ' >> ' + to));
		else
			console.log('TypeScript Render:',
				target,
				from==to ? from : (from + ' >> ' + to));
	}
	// In order to mirror WebStorm's compiler option (the tsc), gulp-tsc is used.

	const start:PromiseBase<any> = declaration
		? StreamConvert.toPromise(
		gulp
			.src([from + '/**/*.d.ts'])
			.pipe(gulp.dest(to)))
		: Promise.resolve();

	return start.then(()=>StreamConvert.toPromise<File[]>(
		gulp
			.src([from + '/**/*.ts'])
			.pipe(tsc(getTscOptions(to, target, module, declaration)))
			.pipe(gulp.dest(to))));

}

export function at(
	folder:string,
	target:EcmaTarget,
	module:ModuleType):PromiseLike<File[]>
{
	return fromTo(folder, folder, target, module);
}

export function sourceTo(
	folder:string,
	target:EcmaTarget,
	module:ModuleType,
	declaration?:boolean,
	doNotEmit?:boolean):PromiseLike<File[]>
{
	return fromTo(PATH.SOURCE, folder, target, module, declaration, doNotEmit);
}
