/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "fs", "../source/System/Promises/Promise"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var fs = require("fs");
    var Promise_1 = require("../source/System/Promises/Promise");
    var ENCODING;
    (function (ENCODING) {
        ENCODING.UTF8 = 'utf8';
    })(ENCODING = exports.ENCODING || (exports.ENCODING = {}));
    function readFile(path, encoding) {
        if (encoding === void 0) { encoding = ENCODING.UTF8; }
        return new Promise_1.TSDNPromise(function (resolve, reject) {
            fs.readFile(path, encoding, function (err, data) {
                if (err)
                    reject(err);
                else
                    resolve(data);
            });
        });
    }
    exports.read = readFile;
    function writeFile(path, data, options) {
        return Promise_1.TSDNPromise.using(function (resolve, reject) {
            fs.writeFile(path, data, options || {}, function (err) {
                if (err)
                    reject(err);
                else
                    resolve();
            });
        });
    }
    exports.write = writeFile;
    var json;
    (function (json) {
        function read(path, encoding) {
            if (encoding === void 0) { encoding = ENCODING.UTF8; }
            return readFile(path, encoding).then(function (result) { return JSON.parse(result); });
        }
        json.read = read;
        function write(path, data, options) {
            return Promise_1.TSDNPromise
                .using(function (resolve) { return resolve(JSON.stringify(data, null, 2)); })
                .thenSynchronous(function (s) { return writeFile(path, s, options); });
        }
        json.write = write;
    })(json = exports.json || (exports.json = {}));
});
//# sourceMappingURL=file-promise.js.map