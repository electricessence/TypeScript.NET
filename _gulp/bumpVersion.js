(function (dependencies, factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(dependencies, factory);
    }
})(["require", "exports", "gulp", "semver", "../_utility/file-promise", "../_utility/stream-to-promise"], function (require, exports) {
    "use strict";
    var gulp = require("gulp");
    var semver = require("semver");
    var file = require("../_utility/file-promise");
    var stream_to_promise_1 = require("../_utility/stream-to-promise");
    var bump = require('gulp-bump');
    var VERSION_BUMP_MINOR = 'version-bump-minor', VERSION_BUMP_PATCH = 'version-bump-patch';
    function bumpVersion(type) {
        return file.json
            .read('./package.json')
            .then(function (pkg) {
            var newVer = semver.inc(pkg.version, type);
            return stream_to_promise_1.streamToPromise.toPromise(gulp.src(['./bower.json', './package.json'])
                .pipe(bump({ version: newVer }))
                .pipe(gulp.dest('./')));
        });
    }
    gulp.task(VERSION_BUMP_PATCH, function () { return bumpVersion('patch'); });
    gulp.task(VERSION_BUMP_MINOR, function () { return bumpVersion('minor'); });
});
//# sourceMappingURL=bumpVersion.js.map