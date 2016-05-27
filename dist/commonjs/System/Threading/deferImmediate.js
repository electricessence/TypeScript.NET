/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Based on code from: https://github.com/kriskowal/q
 */
"use strict";

var Types_1 = require("../Types");
var LinkedNodeList_1 = require("../Collections/LinkedNodeList");
var Queue_1 = require("../Collections/Queue");
var ObjectPool_1 = require("../Disposable/ObjectPool");
var requestTick;
var isNodeJS = false;
var flushing = false;
function flush() {
    var entry;
    while (entry = immediateQueue.first) {
        var _entry = entry;
        var _task = _entry.task;
        var domain = _entry.domain;
        var context = _entry.context;
        var args = _entry.args;

        entry.canceller();
        if (domain) domain.enter();
        runSingle(_task, domain, context, args);
    }
    var task = undefined;
    while (task = laterQueue.dequeue()) {
        runSingle(task);
    }
    flushing = false;
}
var immediateQueue = new LinkedNodeList_1.LinkedNodeList();
var laterQueue = new Queue_1.Queue();
var entryPool = new ObjectPool_1.ObjectPool(40, function () {
    return {};
}, function (o) {
    o.task = null;
    o.domain = null;
    o.context = null;
    if (o.args) o.args.length = 0;
    o.args = null;
    o.canceller = null;
});
function runSingle(task, domain, context, params) {
    try {
        task.apply(context, params);
    } catch (e) {
        if (isNodeJS) {
            if (domain) {
                domain.exit();
            }
            setTimeout(flush, 0);
            if (domain) {
                domain.enter();
            }
            throw e;
        } else {
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
function deferImmediate(task, context, args) {
    var entry = entryPool.take();
    entry.task = task;
    entry.domain = isNodeJS && process['domain'];
    entry.context = context;
    entry.args = args && args.slice();
    entry.canceller = function () {
        if (!entry) return false;
        var r = !!immediateQueue.removeNode(entry);
        entryPool.add(entry);
        entry = null;
        return r;
    };
    immediateQueue.addNode(entry);
    requestFlush();
    return {
        cancel: entry.canceller,
        dispose: function dispose() {
            entry && entry.canceller();
        }
    };
}
exports.deferImmediate = deferImmediate;
function runAfterDeferred(task) {
    laterQueue.enqueue(task);
    requestFlush();
}
exports.runAfterDeferred = runAfterDeferred;
if (Types_1.Type.isObject(process) && process.toString() === "[object process]" && process.nextTick) {
    isNodeJS = true;
    requestTick = function requestTick() {
        process.nextTick(flush);
    };
} else if (typeof setImmediate === "function") {
    if (typeof window !== "undefined") {
        requestTick = setImmediate.bind(window, flush);
    } else {
        requestTick = function requestTick() {
            setImmediate(flush);
        };
    }
} else if (typeof MessageChannel !== "undefined") {
    var channel = new MessageChannel();
    channel.port1.onmessage = function () {
        requestTick = requestPortTick;
        channel.port1.onmessage = flush;
        flush();
    };
    var requestPortTick = function requestPortTick() {
        channel.port2.postMessage(0);
    };
    requestTick = function requestTick() {
        setTimeout(flush, 0);
        requestPortTick();
    };
} else {
    requestTick = function requestTick() {
        setTimeout(flush, 0);
    };
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = deferImmediate;
//# sourceMappingURL=deferImmediate.js.map
