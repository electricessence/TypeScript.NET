"use strict";
var assert = require("assert");
var quickSort_1 = require("../../../../../dist/commonjs/System/Collections/Array/Sort/quickSort");
var mergeSort_1 = require("../../../../../dist/commonjs/System/Collections/Array/Sort/mergeSort");
var Compare_1 = require("../../../../../dist/commonjs/System/Collections/Array/Compare");
var Compare_2 = require("../../../../../dist/commonjs/System/Compare");
function arraySort(a) {
    a.sort(Compare_2.compare);
    return a;
}
function nullSort(a) {
    return a;
}
var source = Object.freeze([
    Object.freeze([2, 5, 4, 1, 3, 10, 20, 14, 7, 2, 5, 4, 1, 3, 10, 20, 14, 7]),
    Object.freeze([2, 18, 14, 37, 20, 33, 26, 21, 5, 31, 2, 18, 14, 37, 20, 33, 26, 21, 5, 31]),
    Object.freeze([9, 19, 5, 7, 38, 13, 20, 2, 12, 35, 9, 19, 5, 7, 38, 13, 20, 2, 12, 35])
]), sourceCount = source.length;
function test(target, fn) {
    for (var i = 0; i < sourceCount; i++) {
        target[i] = fn(source[i].slice());
    }
}
function assertResults(result) {
    for (var i = 0; i < sourceCount; i++) {
        var ok = Compare_1.areEqual(arrayResults[i], result[i]);
        if (!ok)
            console.warn(result);
        assert.ok(ok);
    }
}
var arrayResults = [];
function dummy() {
    test(arrayResults, nullSort);
}
function array() {
    test(arrayResults, arraySort);
}
var quickResults = [];
function quick() {
    test(quickResults, quickSort_1.quickSort);
}
var mergeResults = [];
function merge() {
    test(mergeResults, mergeSort_1.mergeSort);
}
var count = 1;
function measure(fn) {
    var time = Date.now();
    for (var i = 0; i < count; i++) {
        fn();
    }
    return Date.now() - time;
}
function report(name, fn) {
    if (count > 1)
        console.log(name, measure(fn), "milliseconds");
}
if (count > 1) {
    console.log(count + " iterations running...");
}
report("Dummy Sort (copy only):", dummy);
report("Array Sort:", array);
array();
describe("Quick Sort", function () {
    report("Quick Sort:", quick);
    it("should match array sort", function () {
        quick();
        assertResults(quickResults);
    });
});
describe("Merge Sort", function () {
    report("Merge Sort:", merge);
    it("should match array sort", function () {
        merge();
        assertResults(mergeResults);
    });
});
//# sourceMappingURL=Sort.js.map