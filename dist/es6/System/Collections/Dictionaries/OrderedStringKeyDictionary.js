/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
import { StringKeyDictionary } from "./StringKeyDictionary";
import { ArgumentOutOfRangeException } from "../../Exceptions/ArgumentOutOfRangeException";
import { remove } from "../Array/Utility";
import { Integer } from "../../Integer";
// noinspection JSUnusedLocalSymbols
const VOID0 = void 0;
export class OrderedStringKeyDictionary extends StringKeyDictionary {
    constructor() {
        super();
        // noinspection JSMismatchedCollectionQueryUpdate
        this._order = []; // Maintains indexes.
    }
    indexOfKey(key) {
        const o = this._order;
        return o.length ? o.indexOf(key, 0) : -1;
    }
    getValueByIndex(index) {
        Integer.assertZeroOrGreater(index);
        const o = this._order;
        if (index < o.length)
            return this.getAssuredValue(o[index]);
        throw new ArgumentOutOfRangeException('index', index);
    }
    // adding keepIndex allows for clearing a value while still retaining it's index.
    setValue(key, value, keepIndex) {
        // TODO: This may be inefficient and could be improved.
        const _ = this;
        let exists = _.indexOfKey(key) != -1;
        if (!exists && (value !== VOID0 || keepIndex))
            _._order.push(key);
        else if (exists && value === VOID0 && !keepIndex)
            remove(_._order, key);
        return super.setValue(key, value);
    }
    setByIndex(index, value) {
        const _ = this;
        const order = _._order;
        if (index < 0)
            throw new ArgumentOutOfRangeException('index', index, 'Is less than zero.');
        if (index >= order.length)
            throw new ArgumentOutOfRangeException('index', index, 'Is greater than the count.');
        return _.setValue(order[index], value);
    }
    // importValues([x,y,z]);
    importValues(values) {
        const _ = this;
        return _.handleUpdate(() => {
            let changed = false;
            for (let i = 0; i < values.length; i++) {
                if (_.setByIndex(i, values[i]))
                    changed = true;
            }
            return changed;
        });
    }
    // setValues(x,y,z);
    setValues(...values) {
        return this.importValues(values);
    }
    removeByIndex(index) {
        return this.setByIndex(index, VOID0);
    }
    getKeys() {
        const _ = this;
        const o = _._order;
        return o.length && o.filter(key => _.containsKey(key)) || [];
    }
}
export default OrderedStringKeyDictionary;
//# sourceMappingURL=OrderedStringKeyDictionary.js.map