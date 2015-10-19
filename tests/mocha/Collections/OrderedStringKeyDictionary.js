/// <reference path="../../../source/System/Collections/Dictionaries/IDictionary.d.ts"/>
var ICollectionTests = require('./ICollection');
var OrderedStringKeyDictionary_1 = require('source/System/Collections/Dictionaries/OrderedStringKeyDictionary');
function run() {
    ICollectionTests.Collection('OrderedStringKeyDictionary<number>', new OrderedStringKeyDictionary_1.default(), [
        { key: 'A', value: 1 },
        { key: 'B', value: 2 },
        { key: 'C', value: 3 },
        { key: 'D', value: 4 },
        { key: 'E', value: 5 },
        { key: 'F', value: 6 }
    ]);
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = run;
//# sourceMappingURL=OrderedStringKeyDictionary.js.map