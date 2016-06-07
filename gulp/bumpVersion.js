(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", "gulp", "semver", "fs"], factory);
    }
})(function (require, exports) {
    "use strict";
    var gulp = require("gulp");
    var semver = require("semver");
    var fs = require("fs");
    var VERSION_BUMP_MINOR = 'version-bump-minor', VERSION_BUMP_PATCH = 'version-bump-patch';
    function bumpVersion(type) {
        var bump = require('gulp-bump');
        var pkg = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
        var newVer = semver.inc(pkg.version, type);
        return gulp.src(['./bower.json', './package.json'])
            .pipe(bump({ version: newVer }))
            .pipe(gulp.dest('./'));
    }
    gulp.task(VERSION_BUMP_PATCH, function () { bumpVersion('patch'); });
    gulp.task(VERSION_BUMP_MINOR, function () { bumpVersion('minor'); });
});
//# sourceMappingURL=bumpVersion.js.map