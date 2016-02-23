/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
'use strict';
import DisposableBase from '../../Disposable/DisposableBase';
class Yielder {
    get current() { return this._current; }
    yieldReturn(value) {
        this._current = value;
        return true;
    }
    yieldBreak() {
        this._current = null;
        return false;
    }
}
var EnumeratorState;
(function (EnumeratorState) {
    EnumeratorState[EnumeratorState["Before"] = 0] = "Before";
    EnumeratorState[EnumeratorState["Running"] = 1] = "Running";
    EnumeratorState[EnumeratorState["After"] = 2] = "After";
})(EnumeratorState || (EnumeratorState = {}));
export default class EnumeratorBase extends DisposableBase {
    constructor(initializer, tryGetNext, disposer) {
        super();
        this.initializer = initializer;
        this.tryGetNext = tryGetNext;
        this.disposer = disposer;
        this.reset();
    }
    get current() {
        return this._yielder.current;
    }
    reset() {
        var _ = this;
        _._yielder = new Yielder();
        _._state = EnumeratorState.Before;
    }
    moveNext() {
        var _ = this;
        try {
            switch (_._state) {
                case EnumeratorState.Before:
                    _._state = EnumeratorState.Running;
                    var initializer = _.initializer;
                    if (initializer)
                        initializer();
                case EnumeratorState.Running:
                    if (_.tryGetNext(_._yielder)) {
                        return true;
                    }
                    else {
                        this.dispose();
                        return false;
                    }
                case EnumeratorState.After:
                    return false;
            }
        }
        catch (e) {
            this.dispose();
            throw e;
        }
    }
    _onDispose() {
        var _ = this, disposer = _.disposer;
        _.initializer = null;
        _.disposer = null;
        var yielder = _._yielder;
        _._yielder = null;
        if (yielder)
            yielder.yieldBreak();
        try {
            if (disposer)
                disposer();
        }
        finally {
            this._state = EnumeratorState.After;
        }
    }
}
//# sourceMappingURL=EnumeratorBase.js.map