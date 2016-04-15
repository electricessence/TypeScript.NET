/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Based on code from: https://github.com/kriskowal/q
 */
(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", "../Types", "../Collections/LinkedNodeList", "../Collections/Queue"], factory);
    }
})(function (require, exports) {
    "use strict";
    var Types_1 = require("../Types");
    var LinkedNodeList_1 = require("../Collections/LinkedNodeList");
    var Queue_1 = require("../Collections/Queue");
    "use strict";
    var requestTick;
    var isNodeJS = false;
    var flushing = false;
    function flush() {
        var entry;
        while (entry = immediateQueue.first) {
            var task_1 = entry.task, domain = entry.domain;
            immediateQueue.removeNode(entry);
            if (domain)
                domain.enter();
            runSingle(task_1, domain);
        }
        var task;
        while (task = laterQueue.dequeue()) {
            runSingle(task);
        }
        flushing = false;
    }
    var immediateQueue = new LinkedNodeList_1.default();
    var laterQueue = new Queue_1.default();
    function runSingle(task, domain) {
        try {
            task();
        }
        catch (e) {
            if (isNodeJS) {
                if (domain) {
                    domain.exit();
                }
                setTimeout(flush, 0);
                if (domain) {
                    domain.enter();
                }
                throw e;
            }
            else {
                setTimeout(function () {
                    throw e;
                }, 0);
            }
        }
        if (domain) {
            domain.exit();
        }
    }
    function requestFlush() {
        if (!flushing) {
            flushing = true;
            requestTick();
        }
    }
    function deferImmediate(task) {
        var entry = {
            task: task,
            domain: isNodeJS && process['domain']
        };
        immediateQueue.addNode(entry);
        requestFlush();
        return function () { return !!immediateQueue.removeNode(entry); };
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = deferImmediate;
    function runAfterDeferred(task) {
        laterQueue.enqueue(task);
        requestFlush();
    }
    exports.runAfterDeferred = runAfterDeferred;
    if (Types_1.default.isObject(process)
        && process.toString() === "[object process]"
        && process.nextTick) {
        isNodeJS = true;
        requestTick = function () {
            process.nextTick(flush);
        };
    }
    else if (typeof setImmediate === "function") {
        if (typeof window !== "undefined") {
            requestTick = setImmediate.bind(window, flush);
        }
        else {
            requestTick = function () {
                setImmediate(flush);
            };
        }
    }
    else if (typeof MessageChannel !== "undefined") {
        var channel = new MessageChannel();
        channel.port1.onmessage = function () {
            requestTick = requestPortTick;
            channel.port1.onmessage = flush;
            flush();
        };
        var requestPortTick = function () {
            channel.port2.postMessage(0);
        };
        requestTick = function () {
            setTimeout(flush, 0);
            requestPortTick();
        };
    }
    else {
        requestTick = function () {
            setTimeout(flush, 0);
        };
    }
});
//# sourceMappingURL=deferImmediate.js.map