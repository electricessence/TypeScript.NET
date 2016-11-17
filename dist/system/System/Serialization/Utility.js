System.register(["../Types", "../Exceptions/InvalidOperationException"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    function toString(value, defaultForUnknown) {
        var v = value;
        switch (typeof v) {
            case Types_1.Type.UNDEFINED:
            case Types_1.Type.STRING:
                return v;
            case Types_1.Type.BOOLEAN:
                return v ? TRUE : FALSE;
            case Types_1.Type.NUMBER:
                return EMPTY + v;
            default:
                if (v === null)
                    return v;
                if (isSerializable(v))
                    return v.serialize();
                else if (defaultForUnknown)
                    return defaultForUnknown;
                var ex = new InvalidOperationException_1.InvalidOperationException('Attempting to serialize unidentifiable type.');
                ex.data['value'] = v;
                throw ex;
        }
    }
    function isSerializable(instance) {
        return Types_1.Type.hasMemberOfType(instance, 'serialize', Types_1.Type.FUNCTION);
    }
    function toPrimitive(value, caseInsensitive, unknownHandler) {
        if (value) {
            if (caseInsensitive)
                value = value.toLowerCase();
            switch (value) {
                case 'null':
                    return null;
                case Types_1.Type.UNDEFINED:
                    return void (0);
                case TRUE:
                    return true;
                case FALSE:
                    return false;
                default:
                    var cleaned = value.replace(/^\s+|,|\s+$/g, EMPTY);
                    if (cleaned) {
                        if (/^\d+$/g.test(cleaned)) {
                            var int = parseInt(cleaned);
                            if (!isNaN(int))
                                return int;
                        }
                        else {
                            var number = parseFloat(value);
                            if (!isNaN(number))
                                return number;
                        }
                    }
                    if (unknownHandler)
                        value = unknownHandler(value);
                    break;
            }
        }
        return value;
    }
    var Types_1, InvalidOperationException_1, EMPTY, TRUE, FALSE;
    exports_1("toString", toString);
    exports_1("isSerializable", isSerializable);
    exports_1("toPrimitive", toPrimitive);
    return {
        setters: [
            function (Types_1_1) {
                Types_1 = Types_1_1;
            },
            function (InvalidOperationException_1_1) {
                InvalidOperationException_1 = InvalidOperationException_1_1;
            }
        ],
        execute: function () {
            EMPTY = '', TRUE = 'true', FALSE = 'false';
        }
    };
});
//# sourceMappingURL=Utility.js.map