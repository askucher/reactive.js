(function(){
  var p, Promise, Parallel, go, toString$ = {}.toString;
  p = require('prelude-ls');
  Promise = (function(){
    Promise.displayName = 'Promise';
    var prototype = Promise.prototype, constructor = Promise;
    function Promise(){
      this.callbacks = [];
    }
    prototype.onSuccess = function(it){
      return this.callbacks.push(it);
    };
    prototype.success = function(result){
      p.each(function(it){
        return it(result);
      })(
      this.callbacks);
      if (this.callbacks.length === 0) {
        return this.onSuccess = function(func){
          return func(result);
        };
      }
    };
    return Promise;
  }());
  Parallel = (function(){
    Parallel.displayName = 'Parallel';
    var prototype = Parallel.prototype, constructor = Parallel;
    function Parallel(config){
      var ref;
      this.tasks = p.objToPairs(
      config);
      this.results = [];
      this.callbacks = [];
      ref = this;
      this.success = curry$(function(name, res){
        var i$, ref$, len$, callback, results$ = [];
        ref.results.push([name, res]);
        if (ref.tasks.length === ref.results.length) {
          for (i$ = 0, len$ = (ref$ = ref.callbacks).length; i$ < len$; ++i$) {
            callback = ref$[i$];
            results$.push(callback(
            p.pairsToObj(
            ref.results)));
          }
          return results$;
        }
      });
    }
    prototype.onSuccess = function(func){
      return this.callbacks.push(func);
    };
    prototype.run = function(val){
      var i$, ref$, len$, pair, composition, array, results$ = [];
      for (i$ = 0, len$ = (ref$ = this.tasks).length; i$ < len$; ++i$) {
        pair = ref$[i$];
        composition = (fn$());
        array = composition.concat([this.success(pair[0])]);
        results$.push(go(array, val));
      }
      return results$;
      function fn$(){
        switch (toString$.call(pair[1]).slice(8, -1)) {
        case 'Function':
          return [pair[1]];
        case 'Array':
          return pair[1];
        }
      }
    };
    return Parallel;
  }());
  go = curry$(function(fns, val){
    var o, processVal, parallel;
    o = fns.shift();
    if (o == null) {
      return;
    }
    processVal = function(nval){
      var next;
      next = go(fns);
      if (toString$.call(nval).slice(8, -1) === 'Object' && toString$.call(nval.onSuccess).slice(8, -1) === 'Function') {
        return nval.onSuccess(next);
      } else {
        return next(nval);
      }
    };
    switch (toString$.call(o).slice(8, -1)) {
    case 'Function':
      return processVal(
      o(
      val));
    case 'Array':
      return go(o.concat(fns), val);
    case 'Object':
      parallel = new Parallel(o);
      parallel.onSuccess(processVal);
      return parallel.run(val);
    }
  });
  module.exports = {
    promise: function(){
      return new Promise();
    },
    go: go
  };
  function curry$(f, bound){
    var context,
    _curry = function(args) {
      return f.length > 1 ? function(){
        var params = args ? args.concat() : [];
        context = bound ? context || this : this;
        return params.push.apply(params, arguments) <
            f.length && arguments.length ?
          _curry.call(context, params) : f.apply(context, params);
      } : f;
    };
    return _curry();
  }
}).call(this);
