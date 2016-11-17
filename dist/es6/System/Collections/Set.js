import { Type } from "../Types";
import { getIdentifier } from "./Dictionaries/getIdentifier";
import { HashSet } from "./HashSet";
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