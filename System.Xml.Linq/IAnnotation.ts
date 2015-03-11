/*
 * @author electricessence / https://github.com/electricessence/
 * Documentation: https://msdn.microsoft.com/en-us/library/system.xml.xmlnodetype%28v=vs.110%29.aspx
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE
 */

module System.Xml.Linq
{
	import IXmlLineInfo = System.Xml.IXmlLineInfo;
	import XmlNodeType = System.Xml.XmlNodeType;

	export interface IAnnotation
	{
		Type: any;
		Object: any;
	}
}