///<reference path="../build/System.d.ts"/>
///<reference path="../build/System.Linq.d.ts"/>

/*
 * @author electricessence / https://github.com/electricessence/
 * Documentation: https://msdn.microsoft.com/en-us/library/system.xml.linq.xdeclaration%28v=vs.110%29.aspx
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE
 */

module System.Xml.Linq
{
	export class XDeclaration
    {
        private _version: string;
        private _encoding: string;
        private _standalone: string;
        
        constructor(version: string, encoding: string, standalone: string)
        {
            this._version = version;
            this._encoding = encoding;
            this._standalone = standalone;
        }

        /* TODO
        public XDeclaration(XDeclaration other) {
            if (other == null) throw new ArgumentNullException("other");
            version = other.version;
            encoding = other.encoding;
            standalone = other.standalone;
        }
        */

        get version(): string { return this._version; }
        set version(value: string) { this._version = value; }

        get encoding(): string { return this._encoding; }
        set encoding(value: string) { this._encoding = value; }

        get standalone(): string { return this._standalone; }
        set standalone(value: string) { this._standalone = value; }

        public toString(): string
        {
            var s =  "<?xml";
            if (!System.isNullOrUndefined(this.version)) {
                s += " version=\"";
                s += this.version;
                s += "\"";
            }
            if (!System.isNullOrUndefined(this.encoding)) {
                s += " encoding=\"";
                s += this.encoding;
                s += "\"";
            }
            if (!System.isNullOrUndefined(this.standalone)) {
                s += " standalone=\"";
                s += this.standalone;
                s += "\"";
            }
            s += "?>";
            return s;
        }
	}
}