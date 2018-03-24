/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "../../Exceptions/ArgumentNullException", "../../Exceptions/ArgumentOutOfRangeException", "../../Integer"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ArgumentNullException_1 = require("../../Exceptions/ArgumentNullException");
    var ArgumentOutOfRangeException_1 = require("../../Exceptions/ArgumentOutOfRangeException");
    var Integer_1 = require("../../Integer");
    var SOURCE = 'source', DESTINATION = 'destination', SOURCE_INDEX = 'sourceIndex', DESTINATION_INDEX = 'destinationIndex';
    /**
     * Copies one array to another.
     * @param source
     * @param destination
     * @param sourceIndex
     * @param destinationIndex
     * @param length An optional limit to stop copying.
     * @returns The destination array.
     */
    function copyArrayTo(source, destination, sourceIndex, destinationIndex, length) {
        if (sourceIndex === void 0) { sourceIndex = 0; }
        if (destinationIndex === void 0) { destinationIndex = 0; }
        if (length === void 0) { length = Infinity; }
        if (!source)
            throw new ArgumentNullException_1.default(SOURCE);
        if (!destination)
            throw new ArgumentNullException_1.default(DESTINATION);
        Integer_1.default.assertZeroOrGreater(sourceIndex, SOURCE_INDEX);
        var sourceLength = source.length;
        if (!sourceLength)
            return destination;
        if (sourceIndex >= sourceLength)
            throw new ArgumentOutOfRangeException_1.default(SOURCE_INDEX, sourceIndex, 'Must be less than the length of the source array.');
        Integer_1.default.assertZeroOrGreater(destinationIndex, DESTINATION_INDEX);
        var maxLength = source.length - sourceIndex;
        if (isFinite(length) && length > maxLength)
            throw new ArgumentOutOfRangeException_1.default(SOURCE_INDEX, sourceIndex, 'Source index + length cannot exceed the length of the source array.');
        length = Math.min(length, maxLength);
        var newLength = destinationIndex + length;
        if (newLength > destination.length)
            destination.length = newLength;
        for (var i = 0; i < length; i++)
            destination[destinationIndex + i] = source[sourceIndex + i];
        return destination;
    }
    exports.default = copyArrayTo;
});
//# sourceMappingURL=copyArrayTo.js.map