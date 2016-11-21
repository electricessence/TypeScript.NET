"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
var createComparer_1 = require("./Sorting/createComparer");
exports.createComparer = createComparer_1.createComparer;
exports.default = createComparer_1.createComparer;
exports.by = createComparer_1.createComparer;
__export(require("./Sorting/quickSort"));