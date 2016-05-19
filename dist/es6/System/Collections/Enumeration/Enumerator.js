/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
import { using } from "../../Disposable/dispose";
import { Type } from "../../Types";
import { ArrayEnumerator } from "./ArrayEnumerator";
import { IndexEnumerator } from "./IndexEnumerator";
import { UnsupportedEnumerableException } from "./UnsupportedEnumerableException";
const VOID0 = void (0), STRING_EMPTY = "", ENDLESS_EXCEPTION_MESSAGE = 'Cannot call forEach on an endless enumerable. ' +
    'Would result in an infinite loop that could hang the current process.';
export function throwIfEndless(isEndless) {
    if (isEndless)
        throw new UnsupportedEnumerableException(ENDLESS_EXCEPTION_MESSAGE);
}
function initArrayFrom(source) {
    if (Array.isArray(source) || Type.isString(source)) {
        var len = source.length;
        if (isFinite(len)) {
            if (len > 65535)
                return new Array(len);
            var result = [];
            result.length = len;
            return result;
        }
    }
    return [];
}
class EmptyEnumerator {
    get current() {
        return VOID0;
    }
    moveNext() {
        return false;
    }
    nextValue() {
        return VOID0;
    }
    next() {
        return {
            value: VOID0,
            done: true
        };
    }
    reset() { }
    dispose() { }
    get isEndless() {
        return false;
    }
}
const Empty = new EmptyEnumerator();
Object.freeze(Empty);
export const empty = Empty;
export function from(source) {
    if (!source)
        return Empty;
    if (Array.isArray(source))
        return new ArrayEnumerator(source);
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
    if (!Type.isPrimitive(source)) {
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
    if (e !== VOID0 && e !== null) {
        if (Type.isArrayLike(e)) {
            throwIfEndless(!isFinite(e.length));
            for (let i = 0; i < e.length; i++) {
                if (action(e[i], i) === false)
                    break;
            }
            return true;
        }
        if (isEnumerator(e)) {
            throwIfEndless(e.isEndless);
            var index = 0;
            while (e.moveNext()) {
                if (action(e.current, index++) === false)
                    break;
            }
            return true;
        }
        if (isEnumerable(e)) {
            throwIfEndless(e.isEndless);
            using(e.getEnumerator(), f => forEach(f, action));
            return true;
        }
        return false;
    }
}
export function toArray(source) {
    if (source === STRING_EMPTY)
        return [];
    if (Array.isArray(source))
        return source.slice();
    var result = initArrayFrom(source);
    if (!forEach(source, (e, i) => { result[i] = e; }))
        throw new UnsupportedEnumerableException();
    return result;
}
export function map(source, selector) {
    var result = initArrayFrom(source);
    if (!forEach(source, (e, i) => { result[i] = selector(e); }))
        throw new UnsupportedEnumerableException();
    return result;
}
//# sourceMappingURL=Enumerator.js.map