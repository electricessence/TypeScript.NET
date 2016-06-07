///<reference path="../typings/gulp/gulp" />
///<reference path="../typings/gulp-sourcemaps/gulp-sourcemaps" />
///<reference path="../typings/gulp-typescript/gulp-typescript" />
///<reference path="../typings/gulp-replace/gulp-replace" />
///<reference path="../typings/gulp-uglify/gulp-uglify" />
///<reference path="../typings/del/del" />

import * as TARGET from "./constants/Targets";
import {EcmaTarget} from "./constants/Targets";
import {ModuleType} from "./constants/ModuleTypes";
import * as PATH from "./constants/Paths";
import * as EVENT from "./constants/Events";
import * as gulp from "gulp";
import * as sourcemaps from "gulp-sourcemaps";
import * as typescript from "gulp-typescript";
import * as replace from "gulp-replace";
import * as del from "del";
import * as uglify from "gulp-uglify";
import {Promise} from "../source/System/Promises/Promise";
import {IMap} from "../source/System/Collections/Dictionaries/IDictionary";
const tsc = require("gulp-tsc");


export function getOptions(
	destination:string,
	target:EcmaTarget,
	module:ModuleType,
	declaration:boolean):IMap<any>
{
	return {
		tscPath: PATH.TSC,
		outDir: destination,
		noImplicitAny: true,
		module: module,
		target: target,
		removeComments: true,
		sourceMap: true,
		declaration: !!declaration,
		noEmitHelpers: true
	}
}

export function fromTo(
	from:string,
	to:string,
	target:EcmaTarget,
	module:ModuleType,
	declaration?:boolean,
	doNotEmit?:boolean):Promise<void>
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

	const render = ()=> gulp
		.src([from + '/**/*.ts'])
		.pipe(tsc(getOptions(to, target, module, declaration)))
		.pipe(gulp.dest(to));

	return new Promise<void>(resolve=>
	{
		if(declaration)
		{
			gulp
				.src([from + '/**/*.d.ts'])
				.pipe(gulp.dest(to))
				.on(EVENT.END, ()=>
				{
					render()
						.on(EVENT.END, resolve);
				});
		}
		else
		{
			render()
				.on(EVENT.END, resolve);
		}
	}, true);

}

export function at(
	folder:string,
	target:EcmaTarget,
	module:ModuleType):Promise<void>
{
	return fromTo(folder, folder, target, module);
}

export function atV2(
	folder:string,
	target:EcmaTarget,
	module:ModuleType,
	noEmitHelpers?:boolean):NodeJS.WritableStream
{

	var typescriptOptions = {
		noImplicitAny: true,
		module: module,
		target: target,
		removeComments: true,
		noEmitHelpers: !!noEmitHelpers
	};

	var sourceMapOptions = {
		sourceRoot: <string>null
	};


	console.log('TypeScript Render:', target, module, folder);

	return gulp
		.src([folder + '/**/*.ts'])
		.pipe(sourcemaps.init())
		.pipe(typescript(typescriptOptions))
		.pipe(sourcemaps.write('.', sourceMapOptions))
		.pipe(replace(/(\n\s*$)+/gm, "")) // Since gulp-typescript is 'different'
		.pipe(gulp.dest(folder));
}

export function sourceTo(
	folder:string,
	target:EcmaTarget,
	module:ModuleType,
	declaration?:boolean,
	doNotEmit?:boolean)
{
	return fromTo(PATH.SOURCE, folder, target, module, declaration, doNotEmit);
}

export function distES6(
	folder:string,
	emit?:boolean):PromiseLike<void>
{
	const d = './dist/' + folder;
	return del(d + '/**/*')
		.then(()=> sourceTo(d, TARGET.ES6, TARGET.ES6, true, !emit));
}

export function dist(folder:string, target:EcmaTarget, module:ModuleType)
{
	var d = './dist/' + folder;
	return distES6(folder)
		.then(()=>sourceTo(d, target, module));
}

export function distPostProcess(
	folder:string,
	target:EcmaTarget,
	module:ModuleType,
	postProcess:()=>NodeJS.ReadWriteStream)
{
	const d = './dist/' + folder;

	console.log('TypeScript Render:', target, module, './source >> ' + d);

	const typescriptOptions = {
		noImplicitAny: true,
		module: module,
		target: target,
		removeComments: true,
		noEmitHelpers: true
	};

	const sourceMapOptions = {
		sourceRoot: <string>null
	};

	// Export declarations first, then over-write...
	return distES6(folder)
		.then(()=>new Promise<void>(resolve=>
		{
			gulp
				.src(['./source/**/*.ts'])
				.pipe(sourcemaps.init())
				.pipe(typescript(typescriptOptions))
				.pipe(postProcess())
				.pipe(sourcemaps.write('.', sourceMapOptions))
				.pipe(gulp.dest(d))
				.on(EVENT.END, resolve);
		}, true));

}

export function distMini(folder:string, target:EcmaTarget, module:ModuleType)
{
	return distPostProcess(folder, target, module, ()=>uglify(<any>{
		preserveComments: 'license' // This is poorly typed :(
	}));
}
