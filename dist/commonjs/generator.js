"use strict";
/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
Object.defineProperty(exports, "__esModule", { value: true });
function default_1(thisArg, body) {
    var f, y, t;
    // sent can be applied via thisArgs.
    // noinspection JSUnusedGlobalSymbols
    var _ = {
        label: 0,
        trys: [],
        ops: [],
        sent: function () {
            // noinspection JSBitwiseOperatorUsage
            if (t[0] & 1)
                throw t[1];
            return t[1];
        },
    };
    return {
        next: verb(0 /* next */),
        "throw": verb(1 /* throw */),
        "return": verb(2 /* return */)
    };
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f)
            throw new TypeError("Generator is already executing.");
        while (_) {
            try {
                f = 1;
                //noinspection JSBitwiseOperatorUsage
                if (y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"])
                    && !(t = t.call(y, op[1])).done)
                    return t;
                y = 0;
                if (t)
                    op = [0, t.value];
                switch (op[0]) {
                    case 0 /* next */:
                    case 1 /* throw */:
                        t = op;
                        break;
                    case 4:
                        _.label++;
                        return { value: op[1], done: false };
                    case 5:
                        _.label++;
                        y = op[1];
                        op = [0];
                        continue;
                    case 7:
                        op = _.ops.pop();
                        _.trys.pop();
                        continue;
                    default:
                        t = _.trys;
                        if (!(t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                            _ = 0;
                            continue;
                        }
                        if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                            _.label = op[1];
                            break;
                        }
                        if (op[0] === 6 && _.label < t[1]) {
                            _.label = t[1];
                            t = op;
                            break;
                        }
                        if (t && _.label < t[2]) {
                            _.label = t[2];
                            _.ops.push(op);
                            break;
                        }
                        if (t[2])
                            _.ops.pop();
                        _.trys.pop();
                        continue;
                }
                op = body.call(thisArg, _);
            }
            catch (e) {
                op = [6, e];
                y = 0;
            }
            finally {
                f = t = 0;
            }
        }
        //noinspection JSBitwiseOperatorUsage
        if (op[0] & 5)
            throw op[1];
        return { value: op[0] ? op[1] : void 0, done: true };
    }
}
exports.default = default_1;
//# sourceMappingURL=generator.js.map