(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "tslib", "gulp", "semver", "../_utility/file-promise", "../_utility/stream-to-promise", "../source/System/Promises/Promise"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = require("tslib");
    var gulp = require("gulp");
    var semver = require("semver");
    var file = require("../_utility/file-promise");
    var stream_to_promise_1 = require("../_utility/stream-to-promise");
    var Promise_1 = require("../source/System/Promises/Promise");
    // No tsd yet.
    var bump = require('gulp-bump');
    var VERSION_BUMP_MINOR = 'version-bump-minor', VERSION_BUMP_PATCH = 'version-bump-patch';
    //noinspection JSValidateJSDoc
    /**
     * @param {string} type
     * @returns {NodeJS.ReadableStream}
     */
    function bumpVersion(type) {
        return tslib_1.__awaiter(this, void 0, Promise_1.TSDNPromise, function () {
            var pkg, newVer;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, file.json.read('./package.json')];
                    case 1:
                        pkg = _a.sent();
                        newVer = semver.inc(pkg['version'], type);
                        return [2 /*return*/, stream_to_promise_1.streamToPromise.toPromise(gulp.src(['./bower.json', './package.json'])
                                .pipe(bump({ version: newVer }))
                                .pipe(gulp.dest('./')))];
                }
            });
        });
    }
    gulp.task(VERSION_BUMP_PATCH, function () { return bumpVersion('patch'); });
    gulp.task(VERSION_BUMP_MINOR, function () { return bumpVersion('minor'); });
});
//# sourceMappingURL=bumpVersion.js.map