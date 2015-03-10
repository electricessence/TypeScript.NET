/*
 * @author electricessence / https://github.com/electricessence/
 * Documentation: https://msdn.microsoft.com/en-us/library/system.xml.ixmllineinfo%28v=vs.110%29.aspx	
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE
 */

module System.Xml
{
	export interface IXmlLineInfo
	{
		lineNumber:number; // int
		linePosition:number; // int
		hasLineInfo():boolean
	}
} 