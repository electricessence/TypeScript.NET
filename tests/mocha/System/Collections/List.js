"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
///<reference types="node"/>
var assert = require("assert");
require("mocha");
var ICollectionTests = require("./ICollection");
var List_1 = require("../../../../dist/umd/Collections/List");
var CLASS_NAME = 'List';
ICollectionTests.StringCollection(CLASS_NAME, new List_1.default());
ICollectionTests.NumberCollection(CLASS_NAME, new List_1.default());
ICollectionTests.InstanceCollection(CLASS_NAME, new List_1.default());
// Check Linq support...
var list = new List_1.default([1, 2, 3, 4]);
assert.equal(list.linq.where(function (i) { return i > 2; }).count(), 2);
//# sourceMappingURL=List.js.map