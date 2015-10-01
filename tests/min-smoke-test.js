define(["require", "exports", '../min/System/Collections/Array/Utility', '../min/System/Text/Utility'], function (require, exports, ArrayUtility, TextUtility) {
    var a = ArrayUtility.initialize(50);
    alert(TextUtility.supplant('Array Initialized to {i}.', { i: a.length }));
});
//# sourceMappingURL=min-smoke-test.js.map