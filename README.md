reactive.js
===========

Reactive multi-threaded pipe framework

See examples below

===========

```Javascript

var p = require ('reactive.js')
/* 

  Benefits: 
  Do not care about when it will be executed
  You can return simple result or promise of result

*/
 
//Simple example:  
 
//Just demostration of promise
 
var func1 = function (input)  { 
                   var promise = p.promise()
                   // you can create request and put promise.success as callback here. 
                   // The second function will be executed only after data obtained
                   promise.success({
                            resultField: input.initialField,
                            resultField2: 2
                   })
                   return promise
}
 
var func2 = function (input) {
                   var promise = p.promise()
                   promise.success({
                            result: input.resultField + input.resultField2
                   })
                   return promise
}
 
var chain = [func1,func2]
 
p.go(chain, { initialField: 1 })  //=> {result:  3 }
 
 
 
//Composition: 
 
//The chain can be moved in another array and included in main array
 
 
 
var composition  = [
            function (input) { return input.initialField },
            function (input) { return input + 1 }
            ]
 
 
var chain2 = [ 
               composition,
               function (input) { return  input+2 }
            ]
p.go(chain2, { initialField: 1 })  //=> 4
 
 
 
//Parallel: 
 
//It is possible to create a simple object with properties which has values with type "Function"
//All properties will be evaluated and result will be joined in an object with same property names 
//but with results instead functions and passed to next chained function
 
 
var chain3 = [
             {task1: function (input) { return input.initialField },
              task2: function (input) { return input.initialField}},
             function (input) { return input.taks1 + input.taks2 }
             ]
 
 
p.go (chain3, { initialField: 1 })  //=> 2


```
