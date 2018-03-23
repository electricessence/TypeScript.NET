/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */
export default function distinctElements(source) {
    if (!source)
        return []; // Allowing for null facilitates regex filtering.
    var seen = {};
    return source.filter(function (e) { return !(e in seen) && (seen[e] = true); });
}
//# sourceMappingURL=distinctElements.js.map