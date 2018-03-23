/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */
import repeatText from "./repeatText";
var EMPTY = '';
export default function fromChars(chOrChars, count) {
    if (count === void 0) { count = 1; }
    if ((chOrChars) instanceof (Array)) {
        var result = EMPTY;
        for (var _i = 0, chOrChars_1 = chOrChars; _i < chOrChars_1.length; _i++) {
            var char = chOrChars_1[_i];
            result += String.fromCharCode(char);
        }
        return result;
    }
    else {
        return repeatText(String.fromCharCode(chOrChars), count);
    }
}
//# sourceMappingURL=fromChars.js.map