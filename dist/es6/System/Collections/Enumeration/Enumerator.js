/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
import { using } from "../../Disposable/dispose";
import { Type } from "../../Types";
import { ArrayEnumerator } from "./ArrayEnumerator";
import { IndexEnumerator } from "./IndexEnumerator";
import { UnsupportedEnumerableException } from "./UnsupportedEnumerableException";
import { InfiniteEnumerator } from "./InfiniteEnumerator";
import { EmptyEnumerator as Empty } from "./EmptyEnumerator";
import { IteratorEnumerator } from "./IteratorEnumerator";
const VOID0 = void (0), STRING_EMPTY = "", ENDLESS_EXCEPTION_MESSAGE = 'Cannot call forEach on an endless enumerable. ' +
    'Would result in an infinite loop that could hang the current process.';
export function throwIfEndless(isEndless) {
    if (isEndless)
        throw new UnsupportedEnumerableException(ENDLESS_EXCEPTION_MESSAGE);
}
function initArrayFrom(source, max = Infinity) {
    if (Array.isArray(source) || Type.isString(source)) {
        var len = Math.min(source.length, max);
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
        if (Type.isFunction(source))
            return new InfiniteEnumerator(source);
        if (isIterator(source))
            return new IteratorEnumerator(source);
    }
    throw new UnsupportedEnumerableException();
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
export function isIterator(instance) {
    return Type.hasMemberOfType(instance, "next", Type.FUNCTION);
}
export function forEach(e, action, max = Infinity) {
    if (e === STRING_EMPTY)
        return 0;
    if (e && max > 0) {
        if (Type.isArrayLike(e)) {
            throwIfEndless(!isFinite(max) && !isFinite(e.length));
            let i = 0;
            for (; i < Math.min(e.length, max); i++) {
                if (action(e[i], i) === false)
                    break;
            }
            return i;
        }
        if (isEnumerator(e)) {
            throwIfEndless(!isFinite(max) && e.isEndless);
            let i = 0;
            while (max > i && e.moveNext()) {
                if (action(e.current, i++) === false)
                    break;
            }
            return i;
        }
        if (isEnumerable(e)) {
            throwIfEndless(!isFinite(max) && e.isEndless);
            return using(e.getEnumerator(), f => forEach(f, action, max));
        }
        if (isIterator(e)) {
            throwIfEndless(!isFinite(max));
            let i = 0, r;
            while (max > i && !(r = e.next()).done) {
                if (action(r.value, i++) === false)
                    break;
            }
            return i;
        }
    }
    return -1;
}
export function toArray(source, max = Infinity) {
    if (source === STRING_EMPTY)
        return [];
    if (!isFinite(max) && Array.isArray(source))
        return source.slice();
    var result = initArrayFrom(source, max);
    if (-1 === forEach(source, (e, i) => { result[i] = e; }, max))
        throw new UnsupportedEnumerableException();
    return result;
}
export function map(source, selector, max = Infinity) {
    if (source === STRING_EMPTY)
        return [];
    if (!isFinite(max) && Array.isArray(source))
        return source.map(selector);
    var result = initArrayFrom(source, max);
    if (-1 === forEach(source, (e, i) => { result[i] = selector(e); }, max))
        throw new UnsupportedEnumerableException();
    return result;
}
//# sourceMappingURL=Enumerator.js.map