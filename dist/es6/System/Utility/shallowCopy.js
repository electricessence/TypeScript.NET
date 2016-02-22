export default function shallowCopy(source, target = {}) {
    if (target) {
        for (let k in source) {
            target[k] = source[k];
        }
    }
    return target;
}
//# sourceMappingURL=shallowCopy.js.map