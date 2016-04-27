/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
System.register(['./EnumeratorBase'], function(exports_1, context_1) {
    'use strict';
    var __moduleName = context_1 && context_1.id;
    var __extends = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var EnumeratorBase_1;
    var IndexEnumerator;
    return {
        setters:[
            function (EnumeratorBase_1_1) {
                EnumeratorBase_1 = EnumeratorBase_1_1;
            }],
        execute: function() {
            IndexEnumerator = (function (_super) {
                __extends(IndexEnumerator, _super);
                function IndexEnumerator(sourceFactory) {
                    var source;
                    _super.call(this, function () {
                        source = sourceFactory();
                        if (source && source.source) {
                            if (source.length && source.step === 0)
                                throw new Error("Invalid IndexEnumerator step value (0).");
                            var pointer = source.pointer;
                            if (!pointer)
                                source.pointer = 0;
                            else if (pointer != Math.floor(pointer))
                                throw new Error("Invalid IndexEnumerator pointer value (" + pointer + ") has decimal.");
                            source.pointer = pointer;
                            var step = source.step;
                            if (!step)
                                source.step = 1;
                            else if (step != Math.floor(step))
                                throw new Error("Invalid IndexEnumerator step value (" + step + ") has decimal.");
                            source.step = step;
                        }
                    }, function (yielder) {
                        var len = (source && source.source) ? source.length : 0;
                        if (!len)
                            return yielder.yieldBreak();
                        var current = source.pointer;
                        source.pointer += source.step;
                        return (current < len && current >= 0)
                            ? yielder.yieldReturn(source.source[current])
                            : yielder.yieldBreak();
                    }, function () {
                        if (source) {
                            source.source = null;
                        }
                    });
                }
                return IndexEnumerator;
            }(EnumeratorBase_1.default));
            exports_1("default", IndexEnumerator);
        }
    }
});
//# sourceMappingURL=IndexEnumerator.js.map