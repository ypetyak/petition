/// >>>>>>> EVAL

// eval can run string as js code.

// var a;
// console.log(eval("a = 2+2"));
// console.log(a);

// >>>>> setTimeout

// it will not run in node, but can be run in  a browser.
// so don't insert string there, only a function.

// setTimeout("alert(10)", 1000);

///

// var fn = new Function('console.log("hi")');
//
// fn();


//// >>>>>>>  XSS

Davidito<img src=0 onerror=alert(10)>  /// handlebars should escape characters &, <, >, ", and ', by default.
