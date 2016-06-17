/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", "gulp", "gulp-sourcemaps", "gulp-typescript", "gulp-replace", "merge2", "../../_utility/stream-convert", "./TypeScriptRendererBase", "../../source/System/Text/Utility", "../../source/mergeValues", "../../source/extends"], factory);
    }
})(function (require, exports) {
    "use strict";
    var gulp = require("gulp");
    var sourcemaps = require("gulp-sourcemaps");
    var typescript = require("gulp-typescript");
    var replace = require("gulp-replace");
    var mergeStreams = require("merge2");
    var StreamConvert = require("../../_utility/stream-convert");
    var TypeScriptRendererBase_1 = require("./TypeScriptRendererBase");
    var Utility_1 = require("../../source/System/Text/Utility");
    var mergeValues_1 = require("../../source/mergeValues");
    var extends_1 = require("../../source/extends");
    var __extends = extends_1.default;
    var REMOVE_EMPTY_LINES_REGEX = /(\n\s*$)+/gm;
    var TypeScriptRenderer = (function (_super) {
        __extends(TypeScriptRenderer, _super);
        function TypeScriptRenderer() {
            _super.apply(this, arguments);
        }
        TypeScriptRenderer.prototype.onRender = function () {
            var options = this.compilerOptions, from = this.sourceFolder, to = this.destinationFolder;
            var declaration = options.declaration || options.declarationFiles;
            var tsStart = gulp.src(from + '/**/*.ts');
            if (options.sourceMap)
                tsStart = tsStart.pipe(sourcemaps.init());
            var tsResult = tsStart.pipe(typescript(options));
            var js = declaration ? tsResult.js : tsResult;
            if (this._minify)
                js = js.pipe(this.getPostProcess());
            if (options.sourceMap)
                js = js.pipe(sourcemaps.write('.', this.sourceMapOptions));
            js = js.pipe(replace(REMOVE_EMPTY_LINES_REGEX, ""));
            var stream = declaration
                ?
                    mergeStreams([
                        gulp.src([from + '/**/*.d.ts']),
                        tsResult.dts,
                        js
                    ])
                : js;
            return StreamConvert.toPromise(stream.pipe(gulp.dest(to)));
        };
        return TypeScriptRenderer;
    }(TypeScriptRendererBase_1.TypeScriptRendererBase));
    exports.TypeScriptRenderer = TypeScriptRenderer;
    var TypeScriptRendererFactory = (function () {
        function TypeScriptRendererFactory(sourceFolder, destinationFolder, defaults) {
            if (destinationFolder === void 0) { destinationFolder = './'; }
            this.sourceFolder = sourceFolder;
            this.destinationFolder = destinationFolder;
            this.compilerOptionDefaults
                = mergeValues_1.default({}, defaults);
        }
        TypeScriptRendererFactory.from = function (sourceFolder, defaults) {
            return new TypeScriptRendererFactory(sourceFolder, null, defaults);
        };
        TypeScriptRendererFactory.fromTo = function (sourceFolder, destinationFolder, defaults) {
            return new TypeScriptRendererFactory(sourceFolder, destinationFolder, defaults);
        };
        TypeScriptRendererFactory.at = function (path, defaults) {
            return new TypeScriptRendererFactory(path, path, defaults);
        };
        TypeScriptRendererFactory.defaults = function (options) {
            return new TypeScriptRendererFactory(null, null, options);
        };
        TypeScriptRendererFactory.prototype.from = function (sourceFolder) {
            return new TypeScriptRendererFactory(sourceFolder, this.destinationFolder, this.compilerOptionDefaults);
        };
        TypeScriptRendererFactory.prototype.to = function (destinationFolder) {
            return new TypeScriptRendererFactory(this.sourceFolder, destinationFolder, this.compilerOptionDefaults);
        };
        TypeScriptRendererFactory.prototype.defaults = function (options) {
            return new TypeScriptRendererFactory(this.sourceFolder, this.destinationFolder, options);
        };
        TypeScriptRendererFactory.prototype.init = function (toSubFolder, target, module) {
            var dest = this.destinationFolder;
            if (!dest)
                throw new Error("Need to define a base destination folder before initializing.");
            if (toSubFolder) {
                if (!Utility_1.endsWith(dest, '/'))
                    dest += '/';
                dest += toSubFolder;
            }
            var options = {};
            if (target)
                options.target = target;
            if (module)
                options.module = module;
            return new TypeScriptRenderer(this.sourceFolder, dest, mergeValues_1.default(options, this.compilerOptionDefaults));
        };
        TypeScriptRendererFactory.prototype.addOptions = function (value) {
            return new TypeScriptRendererFactory(this.sourceFolder, this.destinationFolder, mergeValues_1.default(value, this.compilerOptionDefaults));
        };
        TypeScriptRendererFactory.prototype.target = function (value) {
            return this.addOptions({ target: value });
        };
        TypeScriptRendererFactory.prototype.module = function (value) {
            return this.addOptions({ module: value });
        };
        return TypeScriptRendererFactory;
    }());
    exports.TypeScriptRendererFactory = TypeScriptRendererFactory;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = TypeScriptRendererFactory;
});
//# sourceMappingURL=TypeScriptRenderer.js.map