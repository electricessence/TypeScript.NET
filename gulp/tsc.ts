///<reference path="../typings/gulp/gulp" />
///<reference path="../typings/gulp-sourcemaps/gulp-sourcemaps" />
///<reference path="../typings/gulp-typescript/gulp-typescript" />
///<reference path="../typings/gulp-replace/gulp-replace" />
///<reference path="../typings/gulp-uglify/gulp-uglify" />
///<reference path="../typings/del/del" />
///<reference path="../typings/merge2/merge2" />

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
import {JsonMap} from "../source/JSON";
import * as merge from "merge2";
import ReadWriteStream = NodeJS.ReadWriteStream;
const tsc = require("gulp-tsc");

export const DEFAULTS:typescript.Params = Object.freeze(<typescript.Params>{
	noImplicitAny: true,
	removeComments: true,
	noEmitHelpers: true,
	sourceMap: true
});

function extend<T extends IMap<any>, U extends IMap<any>>(target:T, source:U):T & U
{
	const result:any = target || {};
	for(let key of Object.keys(source))
	{
		if(!target.hasOwnProperty(key)) target[key] = source[key];
	}
	return result;
}

function ensureDefaults<T extends JsonMap | typescript.Params>(target:T):T & typescript.Params
{
	return extend(target, DEFAULTS);
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
		.pipe(tsc(getTscOptions(to, target, module, declaration)))
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
	noEmitHelpers?:boolean,
	implicitAny?:boolean):ReadWriteStream
{

	return fromToV2(folder, folder, target, module, {
		noImplicitAny: !implicitAny,
		noEmitHelpers: !!noEmitHelpers,
	});
}

export function fromToV2(
	from:string,
	to:string,
	target:EcmaTarget,
	module:ModuleType,
	options?:typescript.Params):ReadWriteStream
{

	var typescriptOptions:typescript.Params = options || {};
	if(target) typescriptOptions.target = target;
	if(module) typescriptOptions.module = module;
	typescriptOptions = ensureDefaults(typescriptOptions);

	const sourceMapOptions = {
		sourceRoot: <string>null
	};

	console.log('TypeScript Render:', target, module, to);

	var source = from + '/**/*.ts';

	function pipeTs(g:ReadWriteStream):ReadWriteStream
	{
		return g.pipe(sourcemaps.init())
			.pipe(typescript(typescriptOptions))
			.pipe(sourcemaps.write('.', sourceMapOptions))
			.pipe(replace(/(\n\s*$)+/gm, "")) // Since gulp-typescript is 'different'
			.pipe(gulp.dest(to));
	}

	if(options.declaration || options.declarationFiles)
	{
		var tsResult = gulp.src(source)
			.pipe(typescript(typescript.createProject(options)));

		return merge([ // Merge the two output streams, so this task is finished when the IO of both operations are done.
			tsResult.dts.pipe(gulp.dest(to)),
			pipeTs(tsResult.js)
		]);
	}

	return pipeTs(gulp.src(source));
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
	postProcess:()=>ReadWriteStream)
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
