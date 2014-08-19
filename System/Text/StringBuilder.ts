module System.Text {

  export class StringBuilder {
    // Although we could simply have an array of any[] and store all values, that would potentially retain references to objects.
    private _parts:string[];
   
    constructor(...initial:any[])
    {
      var _ = this;
      _._parts = [];
      initial.forEach(s=>_.append(s));
    }

    append(textItem:any):StringBuilder {
      var _ = this;
      if (text!==null && text!==undefined && text!=="") {
        switch(typeof textItem) {
          // TODO: fill in handling.
        }
      }
     
      return _;
    }

    appendLine(text):StringBuilder {
        this.append(text);
        this._parts.add('\r\n');
    }

    clear():void {
        this._parts.length = 0;
    }
    
    get isEmpty() {
        return (this._parts.length == 0);
    }

    toString(delimiter:string = "") {
        return this._parts.join(delimiter);
    }

  }
  
}
