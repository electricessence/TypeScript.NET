/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Based on code from: https://github.com/kriskowal/q
 */
import { Type } from "../Types";
import { LinkedNodeList } from "../Collections/LinkedNodeList";
import { Queue } from "../Collections/Queue";
import { ObjectPool } from "../Disposable/ObjectPool";
var requestTick;
var isNodeJS = false;
var flushing = false;
function flush() {
    var entry;
    while (entry = immediateQueue.first) {
        let { task, domain, context, args } = entry;
        entry.canceller();
        if (domain)
            domain.enter();
        runSingle(task, domain, context, args);
    }
    let task;
    while (task = laterQueue.dequeue()) {
        runSingle(task);
    }
    flushing = false;
}
var immediateQueue = new LinkedNodeList();
var laterQueue = new Queue();
var entryPool = new ObjectPool(40, () => ({}), o => {
    o.task = null;
    o.domain = null;
    o.context = null;
    if (o.args)
        o.args.length = 0;
    o.args = null;
    o.canceller = null;
});
function runSingle(task, domain, context, params) {
    try {
        task.apply(context, params);
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
export function deferImmediate(task, context, args) {
    var entry = entryPool.take();
    entry.task = task;
    entry.domain = isNodeJS && process['domain'];
    entry.context = context;
    entry.args = args && args.slice();
    entry.canceller = () => {
        if (!entry)
            return false;
        let r = !!immediateQueue.removeNode(entry);
        entryPool.add(entry);
        entry = null;
        return r;
    };
    immediateQueue.addNode(entry);
    requestFlush();
    return {
        cancel: entry.canceller,
        dispose: () => { entry && entry.canceller(); }
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