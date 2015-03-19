///<reference path="../build/System.d.ts"/>
///<reference path="../build/System.Linq.d.ts"/>

/*
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE
 */

module System.Xml.Linq
{
	export class XAttribute extends XObject {
        /*internal*/
        _next: XAttribute;
        _name: XName;
        _value : string;

        constructor() {
			super();
        }

        /// <summary>
		/// Gets a value indicating if this attribute is a namespace declaration.
		/// </summary>
        get isNamespaceDeclaration(): boolean {

            var namespaceName = this._name.namespaceName;
            if (namespaceName.length === 0) {
                return this._name.localName === "xmlns";
            }
            return namespaceName === XNamespace.xmlns.namespaceName;
        }

        /// <summary>
		/// Gets the name of this attribute.
		/// </summary>
        get name() : XName {
	        return this._name;
        }
        
		/// <summary>
		/// Gets the node type for this node.
		/// </summary>
        get nodeType(): XmlNodeType {
            return XmlNodeType.Attribute;
        }

        /// <summary>
		/// Gets the value of this attribute.
		/// </summary>
        get value() : string {
	        return this._value;
        }

        /// <summary>
		/// sets the value of this attribute.
		/// </summary>
        set value(value: string) {
            if (isNullOrUndefined(value))
                throw 'ArgumentNullException("val")';

            this.validateAttribute(this._name, value);
            var notify = this._notifyChanging(this, XObjectChangeEventArgs.value);
            this._value = value;
            if (notify)
                this._notifyChanged(this, XObjectChangeEventArgs.value);
        }


        get previousAttribute(): XAttribute {
            if (isNullOrUndefined(parent)) return null;
            
            var parent = <XElement> this.parent;
            var a = parent.lastAttribute;
            
            while (a._next !== this) {
                a = a._next;
            }
            return a !== (<XElement>parent).lastAttribute ? a : null;
        }

        get nextAttribute(): XAttribute
        {
            //get { return parent != null && ((XElement)parent).lastAttr != this ? next : null; }
            return !isNullOrUndefined(this.parent) && (<XElement>this.parent).lastAttribute !== this ? this._next : null;
        }


        public remove(): void {
            if (isNullOrUndefined(parent))
                throw 'InvalidOperationException("MissingParent")';
            
            (<XElement>this.parent).removeAttribute(this);
        }

        public toString() : string {
            // TODO
            return null;
            //using(StringWriter sw = new StringWriter(CultureInfo.InvariantCulture))
            //{
            //    XmlWriterSettings ws = new XmlWriterSettings();
            //    ws.ConformanceLevel = ConformanceLevel.Fragment;
            //    using(XmlWriter w = XmlWriter.Create(sw, ws))
            //    {
            //        w.WriteAttributeString(GetPrefixOfNamespace(name.Namespace), name.LocalName, name.NamespaceName, value);
            //    }
            //    return sw.ToString().Trim();
            //}
        }

        validateAttribute(name: XName, value: string) : void {
	        // TODO
            var namespaceName = name.namespaceName;
            if (namespaceName === XNamespace.xmlns.namespaceName)
            {
                if (value.length === 0) {
                    // The empty namespace name can only be declared by 
                    // the default namespace declaration
                    throw "ArgumentException(Argument_NamespaceDeclarationPrefixed, " + name.localName +")";
                }
                else if (value === XNamespace.xml.namespaceName) {
                    // 'http://www.w3.org/XML/1998/namespace' can only
                    // be declared by the 'xml' prefix namespace declaration.
                    if (name.localName !== "xml")
                        throw "ArgumentException(Argument_NamespaceDeclarationXml)";
                }
                else if (value == XNamespace.xmlns.namespaceName) {
                    // 'http://www.w3.org/2000/xmlns/' must not be declared
                    // by any namespace declaration.
                    throw "ArgumentException(Argument_NamespaceDeclarationXmlns)";
                }
                else {
                    var localName = name.localName;
                    if (localName === "xml") {
                        // No other namespace name can be declared by the 'xml' 
                        // prefix namespace declaration. 
                        throw "ArgumentException(Argument_NamespaceDeclarationXml)";
                    }
                    else if (localName === "xmlns") {
                        // The 'xmlns' prefix must not be declared. 
                        throw "ArgumentException(Argument_NamespaceDeclarationXmlns)";
                    }
                }
            }
			else if (namespaceName.length === 0 && name.localName === "xmlns") {
                if (value === XNamespace.xml.namespaceName) {
                    // 'http://www.w3.org/XML/1998/namespace' can only
                    // be declared by the 'xml' prefix namespace declaration.
                    throw "ArgumentException(Argument_NamespaceDeclarationXml)";
                }
                else if (value === XNamespace.xmlns.namespaceName) {
                    // 'http://www.w3.org/2000/xmlns/' must not be declared
                    // by any namespace declaration.
                    throw "ArgumentException(Argument_NamespaceDeclarationXmlns)";
                }
            }
	    }
	}
}