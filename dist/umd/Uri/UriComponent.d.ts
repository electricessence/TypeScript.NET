/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
import Primitive from "../Primitive";
import ISerializable from "../Serialization/ISerializable";
import IMap from "../IMap";
declare module UriComponent {
    interface Formattable {
        toUriComponent(): string;
    }
    type Value = Primitive | ISerializable | Formattable;
    interface Map extends IMap<Value | Value[]> {
    }
}
export default UriComponent;
