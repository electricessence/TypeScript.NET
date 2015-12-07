/*
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Based on code from: https://github.com/kriskowal/q
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _Types = require('../Types');

var _Types2 = _interopRequireDefault(_Types);

var _CollectionsLinkedList = require("../Collections/LinkedList");

var _CollectionsLinkedList2 = _interopRequireDefault(_CollectionsLinkedList);

var _CollectionsQueue = require("../Collections/Queue");

var _CollectionsQueue2 = _interopRequireDefault(_CollectionsQueue);

"use strict";
var requestTick;
var isNodeJS = false;
var flushing = false;
function flush() {
    var entry;
    while (entry = immediateQueue.first) {
        var e = entry.value,
            domain = e.domain;
        entry.remove();
        if (domain) domain.enter();
        runSingle(e.task, domain);
    }
    var task;
    while (task = laterQueue.dequeue()) {
        runSingle(task);
    }
    flushing = false;
}
var immediateQueue = new _CollectionsLinkedList2["default"]();
var laterQueue = new _CollectionsQueue2["default"]();
function runSingle(task, domain) {
    try {
        task();
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
var TaskScheduler;
(function (TaskScheduler) {
    function defer(task, delay) {
        if (_Types2["default"].isNumber(delay, false) && delay >= 0) {
            var timeout = 0;
            var cancel = function cancel() {
                if (timeout) {
                    clearTimeout(timeout);
                    timeout = 0;
                    return true;
                }
                return false;
            };
            timeout = setTimeout(function () {
                cancel();
                task();
            }, delay);
            return cancel;
        }
        var entry = {
            task: task,
            domain: isNodeJS && process['domain']
        };
        immediateQueue.add(entry);
        requestFlush();
        return function () {
            return !!immediateQueue.remove(entry);
        };
    }
    TaskScheduler.defer = defer;
    function runAfterDeferred(task) {
        laterQueue.enqueue(task);
        requestFlush();
    }
    TaskScheduler.runAfterDeferred = runAfterDeferred;
})(TaskScheduler || (TaskScheduler = {}));
if (_Types2["default"].isObject(process) && process.toString() === "[object process]" && process.nextTick) {
    isNodeJS = true;
    requestTick = function () {
        process.nextTick(flush);
    };
} else if (typeof setImmediate === "function") {
    if (typeof window !== "undefined") {
        requestTick = setImmediate.bind(window, flush);
    } else {
        requestTick = function () {
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
    requestTick = function () {
        setTimeout(flush, 0);
        requestPortTick();
    };
} else {
    requestTick = function () {
        setTimeout(flush, 0);
    };
}
exports["default"] = TaskScheduler;
module.exports = exports["default"];
//# sourceMappingURL=TaskScheduler.js.map
