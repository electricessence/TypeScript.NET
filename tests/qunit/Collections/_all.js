/// <reference path="../../../typings/qunit/qunit.d.ts"/>
/// <amd-dependency path="QUnit"/>
define(["require", "exports", './LinkedList', './Queue', './OrderedStringKeyDictionary', "QUnit"], function (require, exports, LinkedList_1, Queue_1, OrderedStringKeyDictionary_1) {
    function run() {
        LinkedList_1.default();
        Queue_1.default();
        OrderedStringKeyDictionary_1.default();
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = run;
});

//# sourceMappingURL=_all.js.map
