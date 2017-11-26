///<reference types="node"/>
import * as assert from "assert";
import * as TextUtility from "../../../../dist/commonjs/System/Text/Utility";

const s1 = "	 HI  ";
const s2 = ".-.-xHIX//\\";
describe('.trim()', () => {
	it("should leave a string without leading or trailing whitespace", () => {
		assert.equal(TextUtility.trim(s1), "HI");
	});
	it("should leave a string without leading or trailing trim characters (string)", () => {
		assert.equal(TextUtility.trim(s2, ".-/\\x", true), "HI");
	});

	it("should leave a string without leading or trailing trim characters (array)", () => {
		assert.equal(TextUtility.trim(s2, [".", "-", "/", "\\", "x", "X"]), "HI");
	});

	it("should leave a string untouched if no trim characters", () => {
		assert.equal(TextUtility.trim(s2, ""), s2);
	});
});

describe(".format(source,..args)", () => {
	it("should replace contents of a string", () => {
		assert.equal(TextUtility.format(
			"Hello, my name is {0} and I'm number {length}.", "George", 2),
			"Hello, my name is George and I'm number 2.");
	});
});

describe(".supplant(source,..args)", () => {
	it("should replace contents of a string", () => {
		assert.equal(TextUtility.supplant(
			"Hello, my name is {name} and I like {like}. {x} {y}", {
				name: "George",
				like: "cheese",
				x: {}
			}),
			"Hello, my name is George and I like cheese. [object Object] {y}");
	});
});

describe(".startsWith(source,pattern)", () => {
	it("should detect pattern at beginning", () =>
		assert.ok(TextUtility.startsWith(
			"Hello, my name is",
			"Hello"))
	);
	it("should not detect pattern at beginning", () =>
		assert.ok(!TextUtility.startsWith(
			"Hello, my name is",
			"is"))
	);
});

describe(".endsWith(source,pattern)", () => {
	it("should detect pattern at beginning", () =>
		assert.ok(TextUtility.endsWith(
			"Hello, my name is",
			"is"))
	);
	it("should not detect pattern at beginning", () => {
		assert.ok(!TextUtility.endsWith(
			"Hello, my name is",
			"Hello"));

		assert.ok(!TextUtility.endsWith(
			"Hello, my name is",
			"is "))
		}
	);
});