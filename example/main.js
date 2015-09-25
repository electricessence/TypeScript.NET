define(["require", "exports", '../source/System/Collections/Array/Utility', '../source/System/Text/Utility'], function (require, exports, ArrayUtility, Text) {
    var supplant = Text.supplant;
    var a = ArrayUtility.initialize(50);
    alert(supplant('Array Initialized to {i}.', { i: a.length }));
});
//# sourceMappingURL=main.js.map