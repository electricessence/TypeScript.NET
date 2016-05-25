/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var VOID0 = void 0;

var IteratorResult = function IteratorResult(value, index) {
    var done = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];

    _classCallCheck(this, IteratorResult);

    this.value = value;
    this.index = index;
    this.done = done;
    Object.freeze(this);
};

exports.IteratorResult = IteratorResult;
(function (IteratorResult) {
    IteratorResult.Done = new IteratorResult(VOID0, VOID0, true);
    function GetDone(value) {
        return IteratorResult.Done;
    }
    IteratorResult.GetDone = GetDone;
})(IteratorResult = exports.IteratorResult || (exports.IteratorResult = {}));
Object.freeze(IteratorResult);
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = IteratorResult;
//# sourceMappingURL=IteratorResult.js.map
