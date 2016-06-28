define(["require", "exports", "./ICollection", "source/System/Collections/Queue"], function (require, exports, ICollectionTests, Queue_1) {
    "use strict";
    function run() {
        ICollectionTests.StringCollection('Queue', new Queue_1.default());
        ICollectionTests.NumberCollection('Queue', new Queue_1.default());
        ICollectionTests.InstanceCollection('Queue', new Queue_1.default());
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = run;
});
//# sourceMappingURL=Queue.js.map