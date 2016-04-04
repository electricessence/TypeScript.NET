(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", './ICollection', '../../../../source/System/Collections/LinkedList', '../../../../source/System/Collections/Array/Compare'], factory);
    }
})(function (require, exports) {
    "use strict";
    var ICollectionTests = require('./ICollection');
    var LinkedList_1 = require('../../../../source/System/Collections/LinkedList');
    var Compare_1 = require('../../../../source/System/Collections/Array/Compare');
    var assert = require('../../../../node_modules/assert/assert');
    ICollectionTests.StringCollection('LinkedList', new LinkedList_1.default());
    ICollectionTests.NumberCollection('LinkedList', new LinkedList_1.default());
    ICollectionTests.InstanceCollection('LinkedList', new LinkedList_1.default());
    describe('.addAfter & .addBefore', function () {
        var part1 = [1, 2, 3], part2 = [5, 6, 7];
        var parts = part1.concat(part2), len1 = parts.length;
        var list = new LinkedList_1.default(parts);
        var list1 = list.toArray();
        var count1 = list.count;
        var partsSpliced = part1.concat([4]).concat(part2);
        var len2 = partsSpliced.length;
        list.find(5).addBefore(4);
        var count2 = list.count;
        var list2 = list.toArray();
        list.find(6).addAfter(6.5);
        var count3 = list.count;
        var list3 = list.toArray();
        it('should match expected initial count', function () {
            assert.equal(len1, count1);
            assert.ok(Compare_1.areEqual(parts, list1));
        });
        it('should match expected count after inserting before', function () {
            assert.equal(len2, count2);
            assert.ok(Compare_1.areEqual(partsSpliced, list2), partsSpliced.join(',') + " != " + list2.join(','));
        });
        it('should match expected count after inserting after', function () {
            assert.equal(len2 + 1, count3);
            assert.ok(Compare_1.areEqual(partsSpliced, list2), list3.join(','));
        });
    });
});

//# sourceMappingURL=LinkedList.js.map
