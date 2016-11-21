(function (dependencies, factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(dependencies, factory);
    }
})(["require", "exports", "gulp-typescript-helper"], function (require, exports) {
    "use strict";
    var gulp_typescript_helper_1 = require("gulp-typescript-helper");
    var DIST_ = 'dist.';
    var TYPESCRIPT = 'typescript';
    exports.DIST = 'dist', exports.DIST_ES6 = DIST_ + gulp_typescript_helper_1.Target.ES6, exports.DIST_AMD = DIST_ + gulp_typescript_helper_1.Module.AMD, exports.DIST_UMD = DIST_ + gulp_typescript_helper_1.Module.UMD + '.min', exports.DIST_COMMONJS = DIST_ + gulp_typescript_helper_1.Module.COMMONJS, exports.DIST_SYSTEMJS = DIST_ + gulp_typescript_helper_1.Module.SYSTEMJS, exports.TYPESCRIPT_QUNIT = TYPESCRIPT + '.qunit', exports.TYPESCRIPT_MOCHA = TYPESCRIPT + '.mocha', exports.TYPEDOC = 'typedoc', exports.NUGET_PACK = 'nuget-pack', exports.DEFAULT = 'default';
});
//# sourceMappingURL=TaskNames.js.map