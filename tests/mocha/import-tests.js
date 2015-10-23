///<reference path="import"/>
(function (deps, factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(deps, factory);
    }
})(["require", "exports", "fs"], function (require, exports) {
    var fs = require("fs");
    var root = "./tests/mocha/";
    function getFilesAt(path, ext) {
        return fs
            .readdirSync(path)
            .filter(function (name) {
            return (!ext || name.lastIndexOf(ext) == name.length - ext.length)
                && fs.statSync(path + '/' + name).isFile();
        });
    }
    function getDirectoriesAt(path) {
        return fs
            .readdirSync(path)
            .filter(function (name) { return fs.statSync(path + '/' + name).isDirectory(); });
    }
    function importRecursive(path, importFiles, base) {
        if (path === void 0) { path = ""; }
        if (importFiles === void 0) { importFiles = false; }
        if (base === void 0) { base = ""; }
        var dirPath = base + path;
        if (importFiles)
            console.log(dirPath);
        getDirectoriesAt(root + dirPath)
            .sort()
            .forEach(function (dirname) {
            describe(dirname + '/', function () {
                importRecursive(dirname, true, dirPath + '/');
            });
        });
        if (importFiles) {
            getFilesAt(root + dirPath, '.js')
                .sort()
                .forEach(function (filename) {
                var filePath = dirPath + '/' + filename;
                console.log(" ", filename);
                describe(filename.replace(/\.js$/, ''), function () {
                    require('./' + filePath);
                });
            });
        }
    }
    console.log("Importing Tests:");
    importRecursive();
});

//# sourceMappingURL=import-tests.js.map
