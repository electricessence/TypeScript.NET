///<reference path="../../typings/qunit/qunit.d.ts"/>
/// <amd-dependency path="QUnit"/>
define(["require", "exports", './LinkedList', './Queue', "QUnit"], function (require, exports, LinkedList, Queue) {
    function run() {
        LinkedList();
        Queue();
    }
    return run;
});
//# sourceMappingURL=_all.js.map