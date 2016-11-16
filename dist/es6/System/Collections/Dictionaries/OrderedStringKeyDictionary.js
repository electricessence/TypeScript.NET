import * as ArrayUtility from "../Array/Utility";
import { StringKeyDictionary } from "./StringKeyDictionary";
import { ArgumentOutOfRangeException } from "../../Exceptions/ArgumentOutOfRangeException";
import __extendsImport from "../../../extends";
const __extends = __extendsImport;
const VOID0 = void 0;
export class OrderedStringKeyDictionary extends StringKeyDictionary {
    constructor() {
        super();
        this._order = [];
    }
    indexOfKey(key) {
        const o = this._order;
        return o.length ? o.indexOf(key, 0) : -1;
    }
    getValueByIndex(index) {
        const o = this._order;
        return index < o.length ? this.getValue(o[index]) : VOID0;
    }
    setValue(key, value, keepIndex) {
        const _ = this;
        let exists = _.indexOfKey(key) != -1;
        if (!exists && (value !== VOID0 || keepIndex))
            _._order.push(key);
        else if (exists && value === VOID0 && !keepIndex)
            ArrayUtility.remove(_._order, key);
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