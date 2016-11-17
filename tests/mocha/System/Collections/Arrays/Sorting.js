(function (dependencies, factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(dependencies, factory);
    }
})(["require", "exports", "assert", "../../../../../dist/commonjs/System/Collections/Array/Compare", "../../../../../dist/commonjs/System/Compare", "../../../../../source/System/Integer", "../../../../../dist/commonjs/System/Collections/Array/Sorting/quickSort", "../../../../../dist/commonjs/System/Collections/Array/Sorting/mergeSort", "../../../../../dist/commonjs/System/Collections/Array/Sorting/insertionSort"], function (require, exports) {
    "use strict";
    var assert = require("assert");
    var Compare_1 = require("../../../../../dist/commonjs/System/Collections/Array/Compare");
    var Compare_2 = require("../../../../../dist/commonjs/System/Compare");
    var Integer_1 = require("../../../../../source/System/Integer");
    var quickSort_1 = require("../../../../../dist/commonjs/System/Collections/Array/Sorting/quickSort");
    var mergeSort_1 = require("../../../../../dist/commonjs/System/Collections/Array/Sorting/mergeSort");
    var insertionSort_1 = require("../../../../../dist/commonjs/System/Collections/Array/Sorting/insertionSort");
    var performanceCheck = false;
    function arraySort(a) {
        a.sort(Compare_2.compare);
        return a;
    }
    function nullSort(a) {
        return a;
    }
    var sourceCount = 4, sourceMax = 200;
    var source = [];
    for (var i = 0; i < sourceCount; i++) {
        source.push(Object.freeze(Integer_1.Integer.random.set(sourceMax, sourceMax / 2)));
    }
    Object.freeze(source);
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
    var insertionResults = [];
    function insertion() {
        test(insertionResults, insertionSort_1.insertionSort);
    }
    var quickResults = [];
    function quick() {
        test(quickResults, quickSort_1.quickSort);
    }
    var mergeResults = [];
    function merge() {
        test(mergeResults, mergeSort_1.mergeSort);
    }
    var count = performanceCheck ? 100000 : 1;
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
    describe("Insertion Sort", function () {
        report("Insertion Sort:", insertion);
        it("should match array sort", function () {
            insertion();
            assertResults(insertionResults);
        });
    });
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
});
//# sourceMappingURL=Sorting.js.map