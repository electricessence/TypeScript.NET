define(["require", "exports", './ICollection', '../../source/System/Collections/LinkedList'], function (require, exports, ICollectionTests, LinkedList) {
    function run() {
        ICollectionTests.StringCollection('LinkedList', new LinkedList());
        ICollectionTests.NumberCollection('LinkedList', new LinkedList());
        ICollectionTests.InstanceCollection('LinkedList', new LinkedList());
    }
    return run;
});
//# sourceMappingURL=LinkedList.js.map