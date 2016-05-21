/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Based on code from: https://github.com/kriskowal/q
 */
import { Type } from "../Types";
import { LinkedNodeList } from "../Collections/LinkedNodeList";
import { Queue } from "../Collections/Queue";
var requestTick;
var isNodeJS = false;
var flushing = false;
function flush() {
    var entry;
    while (entry = immediateQueue.first) {
        let { task, domain } = entry;
        immediateQueue.removeNode(entry);
        if (domain)
            domain.enter();
        runSingle(task, domain);
    }
    let task;
    while (task = laterQueue.dequeue()) {
        runSingle(task);
    }
    flushing = false;
}
var immediateQueue = new LinkedNodeList();
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
export function deferImmediate(task) {
    var entry = {
        task: task,
        domain: isNodeJS && process['domain']
    };
    immediateQueue.addNode(entry);
    requestFlush();
    return {
        cancel: () => !!immediateQueue.removeNode(entry),
        dispose: () => { this.cancel(); }
    };
}
export function runAfterDeferred(task) {
    laterQueue.enqueue(task);
    requestFlush();
}
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
export default deferImmediate;
//# sourceMappingURL=deferImmediate.js.map