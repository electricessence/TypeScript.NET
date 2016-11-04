/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */
import { EmptyEnumerator } from "./EmptyEnumerator";
export class EmptyEnumerable {
    constructor() {
        this.isEndless = false;
    }
    getEnumerator() {
        return EmptyEnumerator;
    }
}
//# sourceMappingURL=EmptyEnumerable.js.map