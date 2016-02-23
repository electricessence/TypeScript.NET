'use strict';
const NAME = 'Exception';
export default class Exception {
    constructor(message = null, innerException = null, beforeSealing) {
        this.message = message;
        var _ = this;
        _.name = _.getName();
        _.data = {};
        if (innerException)
            _.data['innerException'] = innerException;
        if (beforeSealing)
            beforeSealing(_);
        Object.freeze(_);
    }
    getName() { return NAME; }
    toString() {
        var _ = this, m = _.message;
        m = m ? (': ' + m) : '';
        return '[' + _.name + m + ']';
    }
    dispose() {
        var data = this.data;
        for (let k in data) {
            if (data.hasOwnProperty(k))
                delete data[k];
        }
    }
}
//# sourceMappingURL=Exception.js.map