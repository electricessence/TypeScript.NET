/*
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
import Type from '../../Types';
import ArrayEnumerator from './ArrayEnumerator';
import IndexEnumerator from './IndexEnumerator';
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
export function from(source) {
    if (!source)
        return Empty;
    if (source instanceof Array)
        return new ArrayEnumerator(source);
    if (typeof source === Type.OBJECT) {
        if ("length" in source) {
            var a = source;
            return new IndexEnumerator(() => {
                return {
                    source: a,
                    length: a.length,
                    pointer: 0,
                    step: 1
                };
            });
        }
        if ("getEnumerator" in source)
            return source.getEnumerator();
    }
    throw new Error("Unknown enumerable.");
}
export function forEach(e, action) {
    if (e) {
        var index = 0;
        while (e.moveNext()) {
            if (action(e.current, index++) === false)
                break;
        }
    }
}
//# sourceMappingURL=Enumerator.js.map