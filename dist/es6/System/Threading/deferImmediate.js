import { Type } from "../Types";
import { LinkedNodeList } from "../Collections/LinkedNodeList";
import { Queue } from "../Collections/Queue";
import { ObjectPool } from "../Disposable/ObjectPool";
import { isNodeJS } from "../Environment";
let requestTick;
let flushing = false;
function flush() {
    let entry;
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
const immediateQueue = new LinkedNodeList();
const laterQueue = new Queue();
const entryPool = new ObjectPool(40, () => ({}), (o) => {
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
    let entry = entryPool.take();
    entry.task = task;
    entry.domain = isNodeJS && process['domain'];
    entry.context = context;
    entry.args = args && args.slice();
    entry.canceller = () => {
        if (!entry)
            return false;
        let r = Boolean(immediateQueue.removeNode(entry));
        entryPool.add(entry);
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
if (isNodeJS) {
    requestTick = () => {
        process.nextTick(flush);
    };
}
else if (typeof setImmediate === Type.FUNCTION) {
    if (typeof window !== Type.UNDEFINED) {
        requestTick = setImmediate.bind(window, flush);
    }
    else {
        requestTick = () => {
            setImmediate(flush);
        };
    }
}
else if (typeof MessageChannel !== Type.UNDEFINED) {
    const channel = new MessageChannel();
    channel.port1.onmessage = function () {
        requestTick = requestPortTick;
        channel.port1.onmessage = flush;
        flush();
    };
    let requestPortTick = () => {
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