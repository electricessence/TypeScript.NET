define(["require", "exports", '../source/System/Collections/Array/Utility', '../source/System/Text/Utility'], function (require, exports, ArrayUtility, TextUtility) {
    var a = ArrayUtility.initialize(50);
    alert(TextUtility.supplant('Array Initialized to {i}.', { i: a.length }));
});
//# sourceMappingURL=main.js.map