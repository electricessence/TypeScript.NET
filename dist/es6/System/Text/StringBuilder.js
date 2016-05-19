/*!
 * @author electricessence / https://github.com/electricessence/
 * .NET Reference: http://referencesource.microsoft.com/#mscorlib/system/text/StringBuilder.cs
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
import { Type } from "../Types";
const VOID0 = void 0;
export class StringBuilder {
    constructor(...initial) {
        var _ = this;
        _._latest = null;
        _._partArray = [];
        _.appendThese(initial);
    }
    appendSingle(item) {
        if (item !== null && item !== VOID0) {
            var _ = this;
            _._latest = null;
            switch (typeof item) {
                case Type.OBJECT:
                case Type.FUNCTION:
                    item = item.toString();
                    break;
            }
            _._partArray.push(item);
        }
    }
    appendThese(items) {
        var _ = this;
        items.forEach(s => _.appendSingle(s));
        return _;
    }
    append(...items) {
        this.appendThese(items);
        return this;
    }
    appendLine(...items) {
        this.appendLines(items);
        return this;
    }
    appendLines(items) {
        var _ = this;
        items.forEach(i => {
            if (i !== null && i !== VOID0) {
                _.appendSingle(i);
                _._partArray.push("\r\n");
            }
        });
        return _;
    }
    get isEmpty() {
        return this._partArray.length === 0;
    }
    toString() {
        var latest = this._latest;
        if (!latest === null)
            this._latest = latest = this._partArray.join();
        return latest;
    }
    join(delimiter) {
        return this._partArray.join(delimiter);
    }
    clear() {
        this._partArray.length = 0;
        this._latest = null;
    }
    dispose() {
        this.clear();
    }
}
export default StringBuilder;
//# sourceMappingURL=StringBuilder.js.map