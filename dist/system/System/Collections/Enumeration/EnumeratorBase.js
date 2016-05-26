/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
System.register(["../../Types", "../../Disposable/DisposableBase", "../../Disposable/ObjectPool", "./IteratorResult"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __extends = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var Types_1, DisposableBase_1, ObjectPool_1, IteratorResult_1;
    var VOID0, yielderPool, Yielder, EnumeratorState, EnumeratorBase;
    function yielder(recycle) {
        if (!yielderPool)
            yielderPool
                = new ObjectPool_1.ObjectPool(40, function () { return new Yielder(); }, function (y) { return y.yieldBreak(); });
        if (!recycle)
            return yielderPool.take();
        yielderPool.add(recycle);
    }
    return {
        setters:[
            function (Types_1_1) {
                Types_1 = Types_1_1;
            },
            function (DisposableBase_1_1) {
                DisposableBase_1 = DisposableBase_1_1;
            },
            function (ObjectPool_1_1) {
                ObjectPool_1 = ObjectPool_1_1;
            },
            function (IteratorResult_1_1) {
                IteratorResult_1 = IteratorResult_1_1;
            }],
        execute: function() {
            VOID0 = void (0);
            Yielder = (function () {
                function Yielder() {
                    this._current = VOID0;
                }
                Object.defineProperty(Yielder.prototype, "current", {
                    get: function () { return this._current; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Yielder.prototype, "index", {
                    get: function () { return this._index; },
                    enumerable: true,
                    configurable: true
                });
                Yielder.prototype.yieldReturn = function (value) {
                    this._current = value;
                    if (this._index === VOID0)
                        this._index = 0;
                    else
                        this._index++;
                    return true;
                };
                Yielder.prototype.yieldBreak = function () {
                    this._current = VOID0;
                    this._index = VOID0;
                    return false;
                };
                Yielder.prototype.dispose = function () {
                    this.yieldBreak();
                };
                return Yielder;
            }());
            (function (EnumeratorState) {
                EnumeratorState[EnumeratorState["Before"] = 0] = "Before";
                EnumeratorState[EnumeratorState["Running"] = 1] = "Running";
                EnumeratorState[EnumeratorState["After"] = 2] = "After";
            })(EnumeratorState || (EnumeratorState = {}));
            EnumeratorBase = (function (_super) {
                __extends(EnumeratorBase, _super);
                function EnumeratorBase(_initializer, _tryGetNext, disposer, isEndless) {
                    _super.call(this);
                    this._initializer = _initializer;
                    this._tryGetNext = _tryGetNext;
                    this.reset();
                    if (Types_1.Type.isBoolean(isEndless))
                        this._isEndless = isEndless;
                    else if (Types_1.Type.isBoolean(disposer))
                        this._isEndless = disposer;
                    if (Types_1.Type.isFunction(disposer))
                        this._disposer = disposer;
                }
                Object.defineProperty(EnumeratorBase.prototype, "current", {
                    get: function () {
                        var y = this._yielder;
                        return y && y.current;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(EnumeratorBase.prototype, "index", {
                    get: function () {
                        var y = this._yielder;
                        return y && y.index;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(EnumeratorBase.prototype, "isEndless", {
                    get: function () {
                        return this._isEndless;
                    },
                    enumerable: true,
                    configurable: true
                });
                EnumeratorBase.prototype.reset = function () {
                    var _ = this;
                    _.throwIfDisposed();
                    var y = _._yielder;
                    _._yielder = null;
                    _._state = EnumeratorState.Before;
                    if (y)
                        yielder(y);
                };
                EnumeratorBase.prototype.moveNext = function () {
                    var _ = this;
                    try {
                        switch (_._state) {
                            case EnumeratorState.Before:
                                _._yielder = _._yielder || yielder();
                                _._state = EnumeratorState.Running;
                                var initializer = _._initializer;
                                if (initializer)
                                    initializer();
                            case EnumeratorState.Running:
                                if (_._tryGetNext(_._yielder)) {
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
                };
                EnumeratorBase.prototype.nextValue = function () {
                    return this.moveNext()
                        ? this.current
                        : VOID0;
                };
                EnumeratorBase.prototype.next = function () {
                    return this.moveNext()
                        ? new IteratorResult_1.IteratorResult(this.current, this.index)
                        : IteratorResult_1.IteratorResult.Done;
                };
                EnumeratorBase.prototype['return'] = function (value) {
                    try {
                        return value === VOID0 || this._state === EnumeratorState.After
                            ? IteratorResult_1.IteratorResult.Done
                            : new IteratorResult_1.IteratorResult(value, VOID0, true);
                    }
                    finally {
                        this.dispose();
                    }
                };
                EnumeratorBase.prototype._onDispose = function () {
                    var _ = this, disposer = _._disposer;
                    _._initializer = null;
                    _._disposer = null;
                    var y = _._yielder;
                    _._yielder = null;
                    this._state = EnumeratorState.After;
                    if (y)
                        yielder(y);
                    if (disposer)
                        disposer();
                };
                return EnumeratorBase;
            }(DisposableBase_1.DisposableBase));
            exports_1("EnumeratorBase", EnumeratorBase);
            exports_1("default",EnumeratorBase);
        }
    }
});
//# sourceMappingURL=EnumeratorBase.js.map