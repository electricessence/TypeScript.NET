/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
import { Type } from "../Types";
import { getIdentifier } from "./Dictionaries/getIdentifier";
import { HashSet } from "./HashSet";
import __extendsImport from "../../extends";
const __extends = __extendsImport;
const OTHER = 'other';
const VOID0 = void 0;
function getId(obj) {
    return getIdentifier(obj, typeof obj != Type.BOOLEAN);
}
export class Set extends HashSet {
    constructor(source) {
        super(source, getId);
    }
}
export default Set;
//# sourceMappingURL=Set.js.map