/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
System.register(['../../Disposable/DisposableBase'], function(exports_1, context_1) {
    'use strict';
    var __moduleName = context_1 && context_1.id;
    var __extends = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var DisposableBase_1;
    var Yielder, EnumeratorState, EnumeratorBase;
    return {
        setters:[
            function (DisposableBase_1_1) {
                DisposableBase_1 = DisposableBase_1_1;
            }],
        execute: function() {
            Yielder = (function () {
                function Yielder() {
                }
                Object.defineProperty(Yielder.prototype, "current", {
                    get: function () { return this._current; },
                    enumerable: true,
                    configurable: true
                });
                Yielder.prototype.yieldReturn = function (value) {
                    this._current = value;
                    return true;
                };
                Yielder.prototype.yieldBreak = function () {
                    this._current = null;
                    return false;
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
                function EnumeratorBase(initializer, tryGetNext, disposer) {
                    _super.call(this);
                    this.initializer = initializer;
                    this.tryGetNext = tryGetNext;
                    this.disposer = disposer;
                    this.reset();
                }
                Object.defineProperty(EnumeratorBase.prototype, "current", {
                    get: function () {
                        return this._yielder.current;
                    },
                    enumerable: true,
                    configurable: true
                });
                EnumeratorBase.prototype.reset = function () {
                    var _ = this;
                    _._yielder = new Yielder();
                    _._state = EnumeratorState.Before;
                };
                EnumeratorBase.prototype.moveNext = function () {
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
                };
                EnumeratorBase.prototype._onDispose = function () {
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
                };
                return EnumeratorBase;
            }(DisposableBase_1.default));
            exports_1("default", EnumeratorBase);
        }
    }
});
//# sourceMappingURL=EnumeratorBase.js.map