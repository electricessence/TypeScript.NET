/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */

///<reference path="../typings/gulp-sourcemaps/gulp-sourcemaps" />
///<reference path="../typings/gulp-uglify/gulp-uglify" />
///<reference path="../typings/del/del" />


import * as uglify from "gulp-uglify";
import * as sourcemaps from "gulp-sourcemaps";
import mergeValues from "../source/mergeValues";
import {ModuleType} from "./constants/ModuleTypes";
import {EcmaTarget} from "./constants/Targets";
import * as del from "del";
import ReadWriteStream = NodeJS.ReadWriteStream;


export interface CoreTypeScriptOptions
{
	module?:string;
	noEmitOnError?:boolean;
	noExternalResolve?:boolean;
	noImplicitAny?:boolean;
	noLib?:boolean;
	removeComments?:boolean;
	sourceRoot?:string;
	sortOutput?:boolean;
	target?:string;
	typescript?:any;
	outFile?:string;
	outDir?:string;
	suppressImplicitAnyIndexErrors?:boolean;
	jsx?:string;
	declaration?:boolean;
	emitDecoratorMetadata?:boolean;
	experimentalDecorators?:boolean;
	experimentalAsyncFunctions?:boolean;
	moduleResolution?:string;
	noEmitHelpers?:boolean;
	preserveConstEnums?:boolean;
	isolatedModules?:boolean;
	sourceMap?:boolean;
}

export const DEFAULTS:CoreTypeScriptOptions = Object.freeze(<CoreTypeScriptOptions>{
	noImplicitAny: true,
	removeComments: true,
	noEmitHelpers: true,
	sourceMap: true,
});

export abstract class TypeScriptRendererBase<TOptions extends CoreTypeScriptOptions>
{

	public compilerOptions:TOptions;

	constructor(
		public sourceFolder:string,
		public destinationFolder:string,
		compilerOptions:TOptions)
	{

		this.sourceMapOptions = {
			sourceRoot: null
		};

		this.compilerOptions
			= compilerOptions
			= mergeValues({},compilerOptions); // Make a copy first...

		mergeValues(compilerOptions, DEFAULTS);
	}

	protected _minify:boolean;
	minify(value:boolean = true):this
	{
		this._minify = value;
		return this;
	}

	sourceMapOptions:sourcemaps.WriteOptions;

	protected abstract onRender():PromiseLike<File[]>;

	render():PromiseLike<File[]> {

		var from = this.sourceFolder, to = this.destinationFolder;

		if(!from)
			throw new Error("No source folder.");
		if(!to)
			throw new Error("No destination folder.");

		// Validate first...
		if(this._clear && from==to)
			throw new Error("Cannot clear a source folder.");

		var {module,target} = this.compilerOptions;

		if(module && module!=target)
			console.log('TypeScript Render:',
				target, module,
				from==to ? from : (from + ' >> ' + to));
		else
			console.log('TypeScript Render:',
				target || module,
				from==to ? from : (from + ' >> ' + to));

		return this._clear
			? del(to + '/**/*').then(()=>this.onRender())
			: this.onRender(); // Could hook up post render console logs here?
	}

	protected _clear:boolean;
	clear(value:boolean = true):this
	{
		this._clear = value;
		return this;
	}

	target(value:EcmaTarget):this
	{
		this.compilerOptions.target = value;
		return this;
	}

	module(value:ModuleType):this
	{
		this.compilerOptions.module = value;
		return this;
	}

	override(options:TOptions):this
	{
		for(let key of Object.keys(options)) (<any>this.compilerOptions)[key] = (<any>options)[key];
		return this;
	}


	protected getPostProcess():ReadWriteStream
	{
		return uglifyPostProcess();
	}
}

function uglifyPostProcess():ReadWriteStream
{
	return uglify(<any>{
		preserveComments: 'license' // This is poorly typed :(
	})
}

export default TypeScriptRendererBase;
