define(["require", "exports",
    '../dist/amd/System/Collections/Array/Utility',
	'../dist/amd/System/Text/Utility'
], function (require, exports,
	ArrayUtility,
	TextUtility) {
    var a = ArrayUtility.initialize(50);
    alert(TextUtility.supplant('Array Initialized to {i}.', { i: a.length }));
});
//# sourceMappingURL=amd-smoke-test.js.map
