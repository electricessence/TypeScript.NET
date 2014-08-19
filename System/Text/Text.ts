// ECMA5 StringUtil

module System.Text {

  export function format(source:string, formatString:string, ...args:any[]) {
    for (var i = 0; i < args.length; i++) {
        formatString = formatString.replace("{" + i + "}", args[i]);
    return formatString;
  }

}
