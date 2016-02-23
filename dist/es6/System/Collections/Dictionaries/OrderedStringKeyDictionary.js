/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
'use strict';
import * as ArrayUtility from '../Array/Utility';
import StringKeyDictionary from './StringKeyDictionary';
import ArgumentOutOfRangeException from '../../Exceptions/ArgumentOutOfRangeException';
const VOID0 = void 0;
export default class OrderedStringKeyDictionary extends StringKeyDictionary {
    constructor() {
        super();
        this._order = [];
    }
    indexOfKey(key) {
        return this._order.indexOf(key, 0);
    }
    getValueByIndex(index) {
        return this.getValue(this._order[index]);
    }
    setValue(key, value, keepIndex) {
        var _ = this, exists = _.indexOfKey(key) != -1;
        if (!exists && (value !== VOID0 || keepIndex))
            _._order.push(key);
        else if (exists && value === VOID0 && !keepIndex)
            ArrayUtility.remove(_._order, key);
        return super.setValue(key, value);
    }
    setByIndex(index, value) {
        var _ = this, order = _._order;
        if (index < 0)
            throw new ArgumentOutOfRangeException('index', index, 'Is less than zero.');
        if (index >= order.length)
            throw new ArgumentOutOfRangeException('index', index, 'Is greater than the count.');
        return _.setValue(order[index], value);
    }
    importValues(values) {
        var _ = this;
        return _.handleUpdate(() => {
            var changed = false;
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
        return this.setByIndex(index, undefined);
    }
    getKeys() {
        var _ = this;
        return _._order.filter(key => _.containsKey(key));
    }
}
//# sourceMappingURL=OrderedStringKeyDictionary.js.map