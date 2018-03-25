///<reference types="node"/>
import * as assert from "assert";
import trim from "../../../../build/umd/dist/Text/trim";
import {format, supplant} from "../../../../build/umd/dist/Text/supplant";
import {endsWith, startsWith} from "../../../../build/umd/dist/Text/Text";

const s1 = "	 HI  ";
const s2 = ".-.-xHIX//\\";
describe('.trimEntries()', () => {
	it("should leave a string without leading or trailing whitespace", () => {
		assert.equal(trim(s1), "HI");
	});
	it("should leave a string without leading or trailing trimEntries characters (string)", () => {
		assert.equal(trim(s2, ".-/\\x", true), "HI");
	});

	it("should leave a string without leading or trailing trimEntries characters (array)", () => {
		assert.equal(trim(s2, [".", "-", "/", "\\", "x", "X"]), "HI");
	});

	it("should leave a string untouched if no trimEntries characters", () => {
		assert.equal(trim(s2, ""), s2);
	});
});

describe(".format(source,..args)", () => {
	it("should replace contents of a string", () => {
		assert.equal(format(
			"Hello, my name is {0} and I'm number {length}.", "George", 2),
			"Hello, my name is George and I'm number 2.");
	});
});

describe(".supplant(source,..args)", () => {
	it("should replace contents of a string", () => {
		assert.equal(supplant(
			"Hello, my name is {name} and I like {like}. {x} {y}", {
				name: "George",
				like: "cheese",
				x: <any>{}
			}),
			"Hello, my name is George and I like cheese. [object Object] {y}");
	});
});

describe(".startsWith(source,pattern)", () => {
	it("should detect pattern at beginning", () =>
		assert.ok(startsWith(
			"Hello, my name is",
			"Hello"))
	);
	it("should not detect pattern at beginning", () =>
		assert.ok(!startsWith(
			"Hello, my name is",
			"is"))
	);
});

describe(".endsWith(source,pattern)", () => {
	it("should detect pattern at beginning", () =>
		assert.ok(endsWith(
			"Hello, my name is",
			"is"))
	);
	it("should not detect pattern at beginning", () => {
		assert.ok(!endsWith(
			"Hello, my name is",
			"Hello"));

		assert.ok(!endsWith(
			"Hello, my name is",
			"is "))
		}
	);
});