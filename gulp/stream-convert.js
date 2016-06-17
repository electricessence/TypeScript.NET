(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", "../source/System/Promises/Promise"], factory);
    }
})(function (require, exports) {
    "use strict";
    var Promise_1 = require("../source/System/Promises/Promise");
    var _DATA = 'data', _END = 'end', _ERROR = 'error', _CLOSE = 'close';
    var StreamEvents;
    (function (StreamEvents) {
        StreamEvents.DATA = _DATA;
        StreamEvents.END = _END;
        StreamEvents.ERROR = _ERROR;
        StreamEvents.CLOSE = _CLOSE;
    })(StreamEvents = exports.StreamEvents || (exports.StreamEvents = {}));
    Object.freeze(StreamEvents);
    function toArray(stream) {
        return new Promise_1.Promise(function (resolve, reject) {
            if (!stream.readable)
                return resolve([]);
            var result = [];
            stream.on(_DATA, onData);
            stream.on(_END, onEnd);
            stream.on(_ERROR, onEnd);
            stream.on(_CLOSE, onClose);
            function onData(doc) {
                result.push(doc);
            }
            function onEnd(err) {
                if (err)
                    reject(err);
                else
                    resolve(result);
                cleanup();
            }
            function onClose() {
                resolve(result);
                cleanup();
            }
            function cleanup() {
                result = null;
                stream.removeListener(_DATA, onData);
                stream.removeListener(_END, onEnd);
                stream.removeListener(_ERROR, onEnd);
                stream.removeListener(_CLOSE, onClose);
            }
        });
    }
    exports.toArray = toArray;
    function toPromise(stream) {
        if (stream.readable)
            return fromReadable(stream);
        if (stream.writable)
            return fromWritable(stream);
        return Promise_1.Promise.resolve();
    }
    exports.toPromise = toPromise;
    function fromReadable(stream) {
        var promise = toArray(stream);
        if (stream.resume)
            stream.resume();
        return promise;
    }
    function fromWritable(stream) {
        return new Promise_1.Promise(function (resolve, reject) {
            stream.once('finish', resolve);
            stream.once('error', reject);
        });
    }
});
//# sourceMappingURL=stream-convert.js.map