/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */

///<reference path="../typings/gulp/gulp" />
///<reference path="../typings/gulp-typescript/gulp-typescript" />
///<reference path="../typings/gulp-sourcemaps/gulp-sourcemaps" />
///<reference path="../typings/gulp-replace/gulp-replace" />
///<reference path="../typings/gulp-uglify/gulp-uglify" />
///<reference path="../typings/del/del" />
///<reference path="../typings/merge2/merge2" />

import {ModuleType} from "./constants/ModuleTypes";
import {EcmaTarget} from "./constants/Targets";
import * as PATH from "./constants/Paths";
import * as gulp from "gulp";
import * as sourcemaps from "gulp-sourcemaps";
import * as typescript from "gulp-typescript";
import * as replace from "gulp-replace";
import * as mergeStreams from "merge2";
import * as StreamConvert from "./stream-convert";
import {TypeScriptRendererBase, CoreTypeScriptOptions} from "./TypeScriptRendererBase";
import __extendsImport from "../source/extends";
import mergeValues from "../source/mergeValues";
import ReadableStream = NodeJS.ReadableStream;
const __extends = __extendsImport;

const REMOVE_EMPTY_LINES_REGEX = /(\n\s*$)+/gm;

export type TypeScriptRenderParams = typescript.Params & CoreTypeScriptOptions;

export class TypeScriptRenderer extends TypeScriptRendererBase<TypeScriptRenderParams>
{
	protected onRender():PromiseLike<File[]>
	{
		const options = this.compilerOptions,
		      from    = this.sourceFolder,
		      to      = this.destinationFolder;

		const declaration = options.declaration || options.declarationFiles;
		
		var tsStart = gulp.src(from + '/**/*.ts');
		if(options.sourceMap) tsStart = tsStart.pipe(sourcemaps.init());
		var tsResult = tsStart.pipe(typescript(options));

		var js = declaration ? tsResult.js : tsResult;
		if(this._minify) js = js.pipe(this.getPostProcess());
		if(options.sourceMap)
			js = js.pipe(sourcemaps.write('.', this.sourceMapOptions));

		js = js.pipe(replace(REMOVE_EMPTY_LINES_REGEX, "")); // Since gulp-typescript is 'different'

		const stream = declaration
			?
			mergeStreams([
				gulp.src([from + '/**/*.d.ts']),
				tsResult.dts,
				js
			])
			: js;

		return StreamConvert.toPromise<File[]>(stream.pipe(gulp.dest(to)));


	}

}

export function at(
	folder:string,
	target:EcmaTarget,
	module:ModuleType,
	options:TypeScriptRenderParams = {
		noImplicitAny: false,
		noEmitHelpers: false
	}):TypeScriptRenderer
{
	options = mergeValues({}, options);
	if(target) options.target = target;
	if(module) options.module = module;
	return new TypeScriptRenderer(folder, folder, options);
}

export function sourceTo(
	folder:string,
	target:EcmaTarget,
	module:ModuleType,
	options?:TypeScriptRenderParams):TypeScriptRenderer
{
	options = mergeValues({}, options);
	if(target) options.target = target;
	if(module) options.module = module;
	return new TypeScriptRenderer(PATH.SOURCE, folder, options);
}

export function dist(
	folder:string,
	target:EcmaTarget,
	module:ModuleType):TypeScriptRenderer
{
	var d = './dist/' + folder;
	return sourceTo(d, target, module, {declaration: true}).clear();
}