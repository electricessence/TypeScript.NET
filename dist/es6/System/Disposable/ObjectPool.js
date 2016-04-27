/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Based upon ObjectPool from Parallel Extension Extras and other ObjectPool implmentations.
 * Uses .add(T) and .take():T
 */
import dispose from "./dispose";
import DisposableBase from "./DisposableBase";
import TaskHandler from "../Tasks/TaskHandler";
import ArgumentOutOfRangeException from "../Exceptions/ArgumentOutOfRangeException";
export default class ObjectPool extends DisposableBase {
    constructor(_maxSize, _generator) {
        super();
        this._maxSize = _maxSize;
        this._generator = _generator;
        this.autoClearTimeout = 5000;
        if (_maxSize < 1)
            throw new ArgumentOutOfRangeException('_maxSize', _maxSize, "Must be at least 1.");
        var _ = this;
        _._disposableObjectName = "ObjectPool";
        _._pool = [];
        _._trimmer = new TaskHandler(() => _._trim());
        var clear = () => _._clear();
        _._flusher = new TaskHandler(clear);
        _._autoFlusher = new TaskHandler(clear);
    }
    get maxSize() {
        return this._maxSize;
    }
    get count() {
        var p = this._pool;
        return p ? p.length : 0;
    }
    _trim() {
        var pool = this._pool;
        while (pool.length > this._maxSize)
            dispose.withoutException(pool.pop());
    }
    trim(defer) {
        this.throwIfDisposed();
        this._trimmer.execute(defer);
    }
    _clear() {
        var _ = this, p = _._pool;
        _._trimmer.cancel();
        _._flusher.cancel();
        _._autoFlusher.cancel();
        dispose.these(p, true);
        p.length = 0;
    }
    clear(defer) {
        this.throwIfDisposed();
        this._flusher.execute(defer);
    }
    toArrayAndClear() {
        var _ = this;
        _.throwIfDisposed();
        _._trimmer.cancel();
        _._flusher.cancel();
        var p = _._pool;
        _._pool = [];
        return p;
    }
    dump() {
        return this.toArrayAndClear();
    }
    _onDispose() {
        super._onDispose();
        var _ = this;
        _._generator = null;
        dispose(_._trimmer, _._flusher, _._autoFlusher);
        _._trimmer = null;
        _._flusher = null;
        _._autoFlusher = null;
        _._pool.length = 0;
        _._pool = null;
    }
    extendAutoClear() {
        var _ = this, t = _.autoClearTimeout;
        if (isFinite(t) && !_._autoFlusher.isScheduled)
            _._autoFlusher.execute(t);
    }
    add(o) {
        var _ = this;
        _.throwIfDisposed();
        _._pool.push(o);
        if (_._pool.length > _._maxSize)
            _._trimmer.execute(500);
        _.extendAutoClear();
    }
    take() {
        var _ = this;
        _.throwIfDisposed();
        var e = _._pool.pop() || _._generator(), len = _._pool.length;
        if (_._pool.length <= _._maxSize)
            _._trimmer.cancel();
        if (len)
            _.extendAutoClear();
        return e;
    }
}
//# sourceMappingURL=ObjectPool.js.map