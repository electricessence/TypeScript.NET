/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */
import { repeatElement } from "../Collections/Array/repeatElement";
var EMPTY = '';
export default function repeatText(source, count) {
    if (isNaN(source) && !source)
        return EMPTY;
    return repeatElement(source, count).join(EMPTY);
}
//# sourceMappingURL=repeatText.js.map