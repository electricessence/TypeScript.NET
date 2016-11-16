import { SystemException, Error } from "./SystemException";
export { Error };
export declare class ArgumentException extends SystemException {
    paramName: string;
    constructor(paramName: string, message?: string, innerException?: Error, beforeSealing?: (ex: any) => void);
    protected getName(): string;
}
export default ArgumentException;
