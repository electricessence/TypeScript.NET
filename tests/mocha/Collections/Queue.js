var ICollectionTests = require('./ICollection');
var Queue_1 = require('source/System/Collections/Queue');
function run() {
    ICollectionTests.StringCollection('Queue', new Queue_1.default());
    ICollectionTests.NumberCollection('Queue', new Queue_1.default());
    ICollectionTests.InstanceCollection('Queue', new Queue_1.default());
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = run;
//# sourceMappingURL=Queue.js.map