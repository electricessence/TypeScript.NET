/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */

import {Func} from "../FunctionTypes";

export type IEventListener = EventListenerOrEventListenerObject | Func<void>;

export default IEventListener;