/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", "gulp-uglify", "../../source/mergeValues", "del"], factory);
    }
})(function (require, exports) {
    "use strict";
    var uglify = require("gulp-uglify");
    var mergeValues_1 = require("../../source/mergeValues");
    var del = require("del");
    var TypeScriptRendererBase = (function () {
        function TypeScriptRendererBase(sourceFolder, destinationFolder, compilerOptions) {
            this.sourceFolder = sourceFolder;
            this.destinationFolder = destinationFolder;
            this.sourceMapOptions = {
                sourceRoot: null
            };
            this.compilerOptions
                = mergeValues_1.default({}, compilerOptions);
        }
        TypeScriptRendererBase.prototype.minify = function (value) {
            if (value === void 0) { value = true; }
            this._minify = value;
            return this;
        };
        TypeScriptRendererBase.prototype.render = function () {
            var _this = this;
            var from = this.sourceFolder, to = this.destinationFolder;
            if (!from)
                throw new Error("No source folder.");
            if (!to)
                throw new Error("No destination folder.");
            if (this._clear && from == to)
                throw new Error("Cannot clear a source folder.");
            var _a = this.compilerOptions, module = _a.module, target = _a.target;
            if (module && module != target)
                console.log('TypeScript Render:', target, module, from == to ? from : (from + ' >> ' + to));
            else
                console.log('TypeScript Render:', target || module, from == to ? from : (from + ' >> ' + to));
            return this._clear
                ? del(to + '/**/*').then(function () { return _this.onRender(); })
                : this.onRender();
        };
        TypeScriptRendererBase.prototype.clear = function (value) {
            if (value === void 0) { value = true; }
            this._clear = value;
            return this;
        };
        TypeScriptRendererBase.prototype.target = function (value) {
            this.compilerOptions.target = value;
            return this;
        };
        TypeScriptRendererBase.prototype.module = function (value) {
            this.compilerOptions.module = value;
            return this;
        };
        TypeScriptRendererBase.prototype.addOptions = function (options) {
            for (var _i = 0, _a = Object.keys(options); _i < _a.length; _i++) {
                var key = _a[_i];
                this.compilerOptions[key] = options[key];
            }
            return this;
        };
        TypeScriptRendererBase.prototype.getPostProcess = function () {
            return uglifyPostProcess();
        };
        return TypeScriptRendererBase;
    }());
    exports.TypeScriptRendererBase = TypeScriptRendererBase;
    function uglifyPostProcess() {
        return uglify({
            preserveComments: 'license'
        });
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = TypeScriptRendererBase;
});
//# sourceMappingURL=TypeScriptRendererBase.js.map