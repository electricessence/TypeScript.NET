(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", "../typescript/Targets", "../typescript/ModuleTypes"], factory);
    }
})(function (require, exports) {
    "use strict";
    var TARGET = require("../typescript/Targets");
    var MODULE = require("../typescript/ModuleTypes");
    var DIST_ = 'dist.';
    var TYPESCRIPT = 'typescript';
    exports.SOURCE = "source (" + MODULE.UMD + ")", exports.DIST = 'dist', exports.DIST_ES6 = DIST_ + TARGET.ES6, exports.DIST_AMD = DIST_ + MODULE.AMD, exports.DIST_UMD = DIST_ + MODULE.UMD + '.min', exports.DIST_COMMONJS = DIST_ + MODULE.COMMONJS, exports.DIST_SYSTEMJS = DIST_ + MODULE.SYSTEMJS, exports.TYPESCRIPT_QUNIT = TYPESCRIPT + '.qunit', exports.TYPESCRIPT_MOCHA = TYPESCRIPT + '.mocha', exports.BUILD = 'build', exports.TYPEDOC = 'typedoc', exports.NUGET_PACK = 'nuget-pack', exports.DEFAULT = 'default';
});
//# sourceMappingURL=TaskNames.js.map