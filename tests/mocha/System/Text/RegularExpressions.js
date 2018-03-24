"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
///<reference types="node"/>
var assert = require("assert");
var RegexMatchEnumerator_1 = require("../../../../dist/umd/Text/RegexMatchEnumerator");
var RegularExpressions_1 = require("../../../../dist/umd/Text/RegularExpressions");
var str = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
var regex = new RegularExpressions_1.default("(?<" + "first>[A-E]+)", ["i"]);
//noinspection JSUnusedLocalSymbols
var regex2 = new RegularExpressions_1.default(/([A-E]+)/im);
//noinspection JSUnusedLocalSymbols
var regex3 = new RegularExpressions_1.default(/([A-E]+)/);
var regex4 = new RegularExpressions_1.default(/A	B C D  E/, "i", "w");
var pattern = "([A-E]+)";
describe("Regex", function () {
    describe("new", function () {
        it("should throw", function () {
            assert.throws(function () { return new RegularExpressions_1.default(null); });
        });
    });
    describe(".isMatch(input)", function () {
        it("should indicate true for match", function () {
            assert.ok(regex.isMatch(str));
            assert.ok(RegularExpressions_1.default.isMatch(str, pattern, ["i"]));
        });
        it("should indicate false for non-match", function () {
            assert.ok(!regex.isMatch("ZYXWV"));
            assert.ok(!RegularExpressions_1.default.isMatch("ZYXWV", pattern, ["i"]));
        });
    });
    describe(".match(input)", function () {
        it("should match correctly", function () {
            var m = regex.match(str);
            assert.equal(m.value, "ABCDE");
            assert.equal(m.index, 0);
            assert.equal(m.namedGroups["first"].value, "ABCDE");
            m = regex.match(str, 20);
            assert.equal(m.value, "abcde");
            assert.equal(m.index, 26);
            assert.equal(m.namedGroups["first"].value, "abcde");
        });
    });
    describe(".matches(input)", function () {
        it("should capture all instances", function () {
            function check(m) {
                assert.equal(m.length, 2);
                assert.equal(m[0].value, "ABCDE");
                assert.equal(m[0].index, 0);
                assert.equal(m[1].value, "abcde");
                assert.equal(m[1].index, 26);
            }
            check(regex.matches(str));
            check(regex4.matches(str));
        });
    });
    describe(".replace(input, x)", function () {
        it("should replace requested instances", function () {
            //noinspection SpellCheckingInspection
            assert.equal(regex.replace(str, "XXX"), "XXXFGHIJKLMNOPQRSTUVWXYZXXXfghijklmnopqrstuvwxyz");
            assert.equal(RegularExpressions_1.default.replace(str, pattern, "XXX", ['i']), "XXXFGHIJKLMNOPQRSTUVWXYZXXXfghijklmnopqrstuvwxyz");
            //noinspection SpellCheckingInspection
            assert.equal(regex.replace(str, ""), "FGHIJKLMNOPQRSTUVWXYZfghijklmnopqrstuvwxyz");
            assert.equal(regex.replace(str, null), str);
            //noinspection SpellCheckingInspection
            assert.equal(regex.replace(str, function () { return "*"; }), "*FGHIJKLMNOPQRSTUVWXYZ*fghijklmnopqrstuvwxyz");
            assert.equal(regex.replace(str, function (x) { return x.value + "*"; }), "ABCDE*FGHIJKLMNOPQRSTUVWXYZabcde*fghijklmnopqrstuvwxyz");
            assert.equal(regex.replace(str, function (x, i) { return i; }), "0FGHIJKLMNOPQRSTUVWXYZ1fghijklmnopqrstuvwxyz");
        });
    });
});
describe("RegexMatchEnumerator", function () {
    it("should enumerate properly", function () {
        var m = RegexMatchEnumerator_1.default(str, regex);
        function check(v, value, index) {
            assert.equal(v.value, value);
            assert.equal(v.index, index);
        }
        //noinspection SpellCheckingInspection
        check(m.nextValue(), "ABCDE", 0);
        //noinspection SpellCheckingInspection
        check(m.nextValue(), "abcde", 26);
        assert.ok(!m.moveNext());
    });
});
//# sourceMappingURL=RegularExpressions.js.map