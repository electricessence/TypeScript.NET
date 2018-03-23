/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */
/**
 * Removes any keys that don't exist on the keyMap.
 * @param target
 * @param keyMap
 */
export function trimEntries(target, keyMap) {
    for (var key in target) {
        if (!keyMap.hasOwnProperty(key)) {
            delete target[key];
        }
    }
    //return <any>target;
}
//# sourceMappingURL=trimEntries.js.map