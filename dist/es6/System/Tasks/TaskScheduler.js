/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Based on code from: https://github.com/kriskowal/q
 */
import Type from '../Types';
import LinkedList from "../Collections/LinkedList";
import Queue from "../Collections/Queue";
"use strict";
var requestTick;
var isNodeJS = false;
var flushing = false;
function flush() {
    var entry;
    while (entry = immediateQueue.first) {
        let e = entry.value, domain = e.domain;
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
var immediateQueue = new LinkedList();
var laterQueue = new Queue();
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
            setTimeout(() => {
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
        if (Type.isNumber(delay, false) && delay >= 0) {
            var timeout = 0;
            var cancel = () => {
                if (timeout) {
                    clearTimeout(timeout);
                    timeout = 0;
                    return true;
                }
                return false;
            };
            timeout = setTimeout(() => {
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
        return () => !!immediateQueue.remove(entry);
    }
    TaskScheduler.defer = defer;
    function runAfterDeferred(task) {
        laterQueue.enqueue(task);
        requestFlush();
    }
    TaskScheduler.runAfterDeferred = runAfterDeferred;
})(TaskScheduler || (TaskScheduler = {}));
if (Type.isObject(process)
    && process.toString() === "[object process]"
    && process.nextTick) {
    isNodeJS = true;
    requestTick = () => {
        process.nextTick(flush);
    };
}
else if (typeof setImmediate === "function") {
    if (typeof window !== "undefined") {
        requestTick = setImmediate.bind(window, flush);
    }
    else {
        requestTick = () => {
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
    var requestPortTick = () => {
        channel.port2.postMessage(0);
    };
    requestTick = () => {
        setTimeout(flush, 0);
        requestPortTick();
    };
}
else {
    requestTick = () => {
        setTimeout(flush, 0);
    };
}
export default TaskScheduler;
//# sourceMappingURL=TaskScheduler.js.map