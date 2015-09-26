define(["require", "exports", './ICollection', '../../source/System/Collections/Queue'], function (require, exports, ICollectionTests, Queue) {
    function run() {
        ICollectionTests.StringCollection('Queue', new Queue());
        ICollectionTests.NumberCollection('Queue', new Queue());
        ICollectionTests.InstanceCollection('Queue', new Queue());
    }
    return run;
});
//# sourceMappingURL=Queue.js.map