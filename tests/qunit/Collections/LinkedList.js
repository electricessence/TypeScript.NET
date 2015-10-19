define(["require", "exports", './ICollection', 'source/System/Collections/LinkedList'], function (require, exports, ICollectionTests, LinkedList_1) {
    function run() {
        ICollectionTests.StringCollection('LinkedList', new LinkedList_1.default());
        ICollectionTests.NumberCollection('LinkedList', new LinkedList_1.default());
        ICollectionTests.InstanceCollection('LinkedList', new LinkedList_1.default());
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = run;
});
//# sourceMappingURL=LinkedList.js.map