define(["require", "exports", './ICollection', '../../source/System/Collections/Dictionaries/OrderedStringKeyDictionary'], function (require, exports, ICollectionTests, OrderedStringKeyDictionary) {
    function run() {
        ICollectionTests.Collection('OrderedStringKeyDictionary<number>', new OrderedStringKeyDictionary(), [
            { key: 'A', value: 1 },
            { key: 'B', value: 2 },
            { key: 'C', value: 3 },
            { key: 'D', value: 4 },
            { key: 'E', value: 5 },
            { key: 'F', value: 6 }
        ]);
    }
    return run;
});
//# sourceMappingURL=OrderedStringKeyDictionary.js.map