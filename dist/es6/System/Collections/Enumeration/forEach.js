import { using } from '../../Disposable/Utility';
import * as Enumerator from '../../Collections/Enumeration/Enumerator';
export default function forEach(enumerable, action) {
    if (enumerable) {
        using(Enumerator.from(enumerable), e => {
            Enumerator.forEach(e, action);
        });
    }
}
//# sourceMappingURL=forEach.js.map