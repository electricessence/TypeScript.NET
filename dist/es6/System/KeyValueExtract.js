/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
import { ArgumentException } from "./Exceptions/ArgumentException";
import { ArgumentNullException } from "./Exceptions/ArgumentNullException";
const VOID0 = void 0, DOT = '.', KEY = 'key', VALUE = 'value', ITEM = 'item', ITEM_1 = ITEM + '[1]', ITEM_KEY = ITEM + DOT + KEY, ITEM_VALUE = ITEM + DOT + VALUE, INVALID_KVP_MESSAGE = 'Invalid type.  Must be a KeyValuePair or Tuple of length 2.', CANNOT_BE_UNDEFINED = 'Cannot equal undefined.';
export function isKeyValuePair(kvp) {
    return kvp && kvp.hasOwnProperty(KEY) && kvp.hasOwnProperty(VALUE);
}
export function assertKey(key, name = ITEM) {
    assertNotUndefined(key, name + DOT + KEY);
    if (key === null)
        throw new ArgumentNullException(name + DOT + KEY);
    return key;
}
export function assertTuple(tuple, name = ITEM) {
    if (tuple.length != 2)
        throw new ArgumentException(name, 'KeyValuePair tuples must be of length 2.');
    assertKey(tuple[0], name);
}
export function assertNotUndefined(value, name) {
    if (value === VOID0)
        throw new ArgumentException(name, CANNOT_BE_UNDEFINED);
    return value;
}
export function extractKeyValue(item, to) {
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
        throw new ArgumentException(ITEM, INVALID_KVP_MESSAGE);
    }
    return to(key, value);
}
export default extractKeyValue;
//# sourceMappingURL=KeyValueExtract.js.map