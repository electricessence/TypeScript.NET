///<reference path="../../typings/qunit/qunit.d.ts"/>
/// <amd-dependency path="QUnit"/>
define(["require", "exports", './LinkedList', './Queue', './OrderedStringKeyDictionary', "QUnit"], function (require, exports, LinkedList, Queue, OrderedStringKeyDictionary) {
    function run() {
        LinkedList();
        Queue();
        OrderedStringKeyDictionary();
    }
    return run;
});
//# sourceMappingURL=_all.js.map