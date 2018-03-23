"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
///<reference types="node"/>
var assert = require("assert");
var TextUtility = require("../../../../dist/commonjs/System/Text/Utility");
var s1 = "	 HI  ";
var s2 = ".-.-xHIX//\\";
describe('.trimEntries()', function () {
    it("should leave a string without leading or trailing whitespace", function () {
        assert.equal(TextUtility.trim(s1), "HI");
    });
    it("should leave a string without leading or trailing trimEntries characters (string)", function () {
        assert.equal(TextUtility.trim(s2, ".-/\\x", true), "HI");
    });
    it("should leave a string without leading or trailing trimEntries characters (array)", function () {
        assert.equal(TextUtility.trim(s2, [".", "-", "/", "\\", "x", "X"]), "HI");
    });
    it("should leave a string untouched if no trimEntries characters", function () {
        assert.equal(TextUtility.trim(s2, ""), s2);
    });
});
describe(".format(source,..args)", function () {
    it("should replace contents of a string", function () {
        assert.equal(TextUtility.format("Hello, my name is {0} and I'm number {length}.", "George", 2), "Hello, my name is George and I'm number 2.");
    });
});
describe(".supplant(source,..args)", function () {
    it("should replace contents of a string", function () {
        assert.equal(TextUtility.supplant("Hello, my name is {name} and I like {like}. {x} {y}", {
            name: "George",
            like: "cheese",
            x: {}
        }), "Hello, my name is George and I like cheese. [object Object] {y}");
    });
});
describe(".startsWith(source,pattern)", function () {
    it("should detect pattern at beginning", function () {
        return assert.ok(TextUtility.startsWith("Hello, my name is", "Hello"));
    });
    it("should not detect pattern at beginning", function () {
        return assert.ok(!TextUtility.startsWith("Hello, my name is", "is"));
    });
});
describe(".endsWith(source,pattern)", function () {
    it("should detect pattern at beginning", function () {
        return assert.ok(TextUtility.endsWith("Hello, my name is", "is"));
    });
    it("should not detect pattern at beginning", function () {
        assert.ok(!TextUtility.endsWith("Hello, my name is", "Hello"));
        assert.ok(!TextUtility.endsWith("Hello, my name is", "is "));
    });
});
//# sourceMappingURL=Utility.js.map