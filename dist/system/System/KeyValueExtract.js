/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
System.register(["./Exceptions/ArgumentException", "./Exceptions/ArgumentNullException"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var ArgumentException_1, ArgumentNullException_1;
    var VOID0, DOT, KEY, VALUE, ITEM, ITEM_1, ITEM_KEY, ITEM_VALUE, INVALID_KVP_MESSAGE, CANNOT_BE_UNDEFINED;
    function isKeyValuePair(kvp) {
        return kvp && kvp.hasOwnProperty(KEY) && kvp.hasOwnProperty(VALUE);
    }
    exports_1("isKeyValuePair", isKeyValuePair);
    function assertKey(key, name) {
        if (name === void 0) { name = ITEM; }
        assertNotUndefined(key, name + DOT + KEY);
        if (key === null)
            throw new ArgumentNullException_1.ArgumentNullException(name + DOT + KEY);
        return key;
    }
    exports_1("assertKey", assertKey);
    function assertTuple(tuple, name) {
        if (name === void 0) { name = ITEM; }
        if (tuple.length != 2)
            throw new ArgumentException_1.ArgumentException(name, 'KeyValuePair tuples must be of length 2.');
        assertKey(tuple[0], name);
    }
    exports_1("assertTuple", assertTuple);
    function assertNotUndefined(value, name) {
        if (value === VOID0)
            throw new ArgumentException_1.ArgumentException(name, CANNOT_BE_UNDEFINED);
        return value;
    }
    exports_1("assertNotUndefined", assertNotUndefined);
    function extractKeyValue(item, to) {
        var _ = this, key, value;
        if (item instanceof Array) {
            assertTuple(item);
            key = item[0];
            value = assertNotUndefined(item[1], ITEM_1);
        }
        else if (isKeyValuePair(item)) {
            key = assertKey(item.key);
            value = assertNotUndefined(item.value, ITEM_VALUE);
        }
        else {
            throw new ArgumentException_1.ArgumentException(ITEM, INVALID_KVP_MESSAGE);
        }
        return to(key, value);
    }
    exports_1("extractKeyValue", extractKeyValue);
    return {
        setters:[
            function (ArgumentException_1_1) {
                ArgumentException_1 = ArgumentException_1_1;
            },
            function (ArgumentNullException_1_1) {
                ArgumentNullException_1 = ArgumentNullException_1_1;
            }],
        execute: function() {
            VOID0 = void 0, DOT = '.', KEY = 'key', VALUE = 'value', ITEM = 'item', ITEM_1 = ITEM + '[1]', ITEM_KEY = ITEM + DOT + KEY, ITEM_VALUE = ITEM + DOT + VALUE, INVALID_KVP_MESSAGE = 'Invalid type.  Must be a KeyValuePair or Tuple of length 2.', CANNOT_BE_UNDEFINED = 'Cannot equal undefined.';
            exports_1("default",extractKeyValue);
        }
    }
});
//# sourceMappingURL=KeyValueExtract.js.map