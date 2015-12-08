/*
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Based on code from: https://github.com/kriskowal/q
 */
(function (deps, factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(deps, factory);
    }
})(["require", "exports", '../System/Types', "../System/Collections/LinkedList", "../System/Collections/Queue"], function (require, exports) {
    ///<reference path="ICancellable.d.ts"/>
    var Types_1 = require('../System/Types');
    var LinkedList_1 = require("../System/Collections/LinkedList");
    var Queue_1 = require("../System/Collections/Queue");
    "use strict";
    var requestTick;
    var isNodeJS = false;
    var flushing = false;
    function flush() {
        var entry;
        while (entry = immediateQueue.first) {
            var e = entry.value, domain = e.domain;
            entry.remove();
            if (domain)
                domain.enter();
            runSingle(e.task, domain);
        }
        var task;
        while (task = laterQueue.dequeue()) {
            runSingle(task);
        }
        flushing = false;
    }
    var immediateQueue = new LinkedList_1.default();
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
    var NextTick;
    (function (NextTick) {
        function queue(task) {
            var entry = {
                task: task,
                domain: isNodeJS && process['domain']
            };
            immediateQueue.add(entry);
            requestFlush();
            return Object.freeze({ cancel: function () { return !!immediateQueue.remove(entry); } });
        }
        NextTick.queue = queue;
        function runAfter(task) {
            laterQueue.enqueue(task);
            requestFlush();
        }
        NextTick.runAfter = runAfter;
    })(NextTick || (NextTick = {}));
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
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = NextTick;
});
//# sourceMappingURL=NextTick.js.map