/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
class DeferBase {
    dispose() {
        this.cancel();
    }
}
class Defer extends DeferBase {
    constructor(task, delay) {
        super();
        if (!(delay >= 0))
            delay = 0;
        this._id = setTimeout(Defer.handler, delay, task, this);
    }
    cancel() {
        var id = this._id;
        if (id) {
            clearTimeout(id);
            this._id = null;
            return true;
        }
        return false;
    }
    static handler(task, d) {
        d.cancel();
        task();
    }
}
class DeferInterval extends DeferBase {
    constructor(task, interval, _remaining = Infinity) {
        super();
        this._remaining = _remaining;
        if (interval === null || interval === void (0))
            throw "'interval' must be a valid number.";
        if (interval < 0)
            throw "'interval' cannot be negative.";
        this._id = setInterval(DeferInterval.handler, interval, task, this);
    }
    cancel() {
        var id = this._id;
        if (id) {
            clearInterval(id);
            this._id = null;
            return true;
        }
        return false;
    }
    static handler(task, d) {
        if (!(--d._remaining))
            d.cancel();
        task();
    }
}
export default function defer(task, delay) {
    return new Defer(task, delay);
}
export function interval(task, interval, count = Infinity) {
    return new DeferInterval(task, interval, count);
}
//# sourceMappingURL=defer.js.map