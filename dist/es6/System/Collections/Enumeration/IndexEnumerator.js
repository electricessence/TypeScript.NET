/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
'use strict';
import EnumeratorBase from './EnumeratorBase';
export default class IndexEnumerator extends EnumeratorBase {
    constructor(sourceFactory) {
        var source;
        super(() => {
            source = sourceFactory();
            if (source && source.source) {
                if (source.length && source.step === 0)
                    throw new Error("Invalid IndexEnumerator step value (0).");
                var pointer = source.pointer;
                if (!pointer)
                    source.pointer = 0;
                else if (pointer != Math.floor(pointer))
                    throw new Error("Invalid IndexEnumerator pointer value (" + pointer + ") has decimal.");
                source.pointer = pointer;
                var step = source.step;
                if (!step)
                    source.step = 1;
                else if (step != Math.floor(step))
                    throw new Error("Invalid IndexEnumerator step value (" + step + ") has decimal.");
                source.step = step;
            }
        }, (yielder) => {
            var len = (source && source.source) ? source.length : 0;
            if (!len)
                return yielder.yieldBreak();
            var current = source.pointer;
            source.pointer += source.step;
            return (current < len && current >= 0)
                ? yielder.yieldReturn(source.source[current])
                : yielder.yieldBreak();
        }, () => {
            if (source) {
                source.source = null;
            }
        });
    }
}
//# sourceMappingURL=IndexEnumerator.js.map