/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
'use strict';
import Type from "../../Types";
import ArrayEnumerator from "./ArrayEnumerator";
import IndexEnumerator from "./IndexEnumerator";
class EmptyEnumerator {
    get current() {
        return undefined;
    }
    moveNext() {
        return false;
    }
    reset() { }
    dispose() { }
}
const Empty = new EmptyEnumerator();
Object.freeze(Empty);
export const empty = Empty;
export function from(source) {
    if (!source)
        return Empty;
    if (Array.isArray(source))
        return new ArrayEnumerator(source);
    if (!Type.isPrimitive(source)) {
        if (Type.isArrayLike(source)) {
            return new IndexEnumerator(() => {
                return {
                    source: source,
                    length: source.length,
                    pointer: 0,
                    step: 1
                };
            });
        }
        if (isEnumerable(source))
            return source.getEnumerator();
    }
    throw new Error("Unknown enumerable.");
}
export function isEnumerable(instance) {
    return Type.hasMemberOfType(instance, "getEnumerator", Type.FUNCTION);
}
export function isEnumerableOrArrayLike(instance) {
    return Type.isArrayLike(instance) || isEnumerable(instance);
}
export function isEnumerator(instance) {
    return Type.hasMemberOfType(instance, "moveNext", Type.FUNCTION);
}
export function forEach(e, action) {
    if (e) {
        if (Type.isArrayLike(e)) {
            for (let i = 0; i < e.length; ++i)
                action(e[i], i);
            return;
        }
        if (isEnumerable(e)) {
            e = e.getEnumerator();
        }
        if (isEnumerator(e)) {
            var index = 0;
            while (e.moveNext()) {
                if (action(e.current, index++) === false)
                    break;
            }
        }
    }
}
//# sourceMappingURL=Enumerator.js.map