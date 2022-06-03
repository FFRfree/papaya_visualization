var $jscomp = $jscomp || {};
$jscomp.scope = {};
$jscomp.arrayIteratorImpl = function (a) {
  var b = 0;
  return function () {
    return b < a.length ? { done: !1, value: a[b++] } : { done: !0 };
  };
};
$jscomp.arrayIterator = function (a) {
  return { next: $jscomp.arrayIteratorImpl(a) };
};
$jscomp.makeIterator = function (a) {
  var b = "undefined" != typeof Symbol && Symbol.iterator && a[Symbol.iterator];
  return b ? b.call(a) : $jscomp.arrayIterator(a);
};
$jscomp.arrayFromIterator = function (a) {
  for (var b, d = []; !(b = a.next()).done; ) d.push(b.value);
  return d;
};
$jscomp.arrayFromIterable = function (a) {
  return a instanceof Array
    ? a
    : $jscomp.arrayFromIterator($jscomp.makeIterator(a));
};
$jscomp.ASSUME_ES5 = !1;
$jscomp.ASSUME_NO_NATIVE_MAP = !1;
$jscomp.ASSUME_NO_NATIVE_SET = !1;
$jscomp.SIMPLE_FROUND_POLYFILL = !1;
$jscomp.ISOLATE_POLYFILLS = !1;
$jscomp.FORCE_POLYFILL_PROMISE = !1;
$jscomp.FORCE_POLYFILL_PROMISE_WHEN_NO_UNHANDLED_REJECTION = !1;
$jscomp.defineProperty =
  $jscomp.ASSUME_ES5 || "function" == typeof Object.defineProperties
    ? Object.defineProperty
    : function (a, b, d) {
        if (a == Array.prototype || a == Object.prototype) return a;
        a[b] = d.value;
        return a;
      };
$jscomp.getGlobal = function (a) {
  a = [
    "object" == typeof globalThis && globalThis,
    a,
    "object" == typeof window && window,
    "object" == typeof self && self,
    "object" == typeof global && global,
  ];
  for (var b = 0; b < a.length; ++b) {
    var d = a[b];
    if (d && d.Math == Math) return d;
  }
  throw Error("Cannot find global object");
};
$jscomp.global = $jscomp.getGlobal(this);
$jscomp.IS_SYMBOL_NATIVE =
  "function" === typeof Symbol && "symbol" === typeof Symbol("x");
$jscomp.TRUST_ES6_POLYFILLS =
  !$jscomp.ISOLATE_POLYFILLS || $jscomp.IS_SYMBOL_NATIVE;
$jscomp.polyfills = {};
$jscomp.propertyToPolyfillSymbol = {};
$jscomp.POLYFILL_PREFIX = "$jscp$";
var $jscomp$lookupPolyfilledValue = function (a, b) {
  var d = $jscomp.propertyToPolyfillSymbol[b];
  if (null == d) return a[b];
  d = a[d];
  return void 0 !== d ? d : a[b];
};
$jscomp.polyfill = function (a, b, d, f) {
  b &&
    ($jscomp.ISOLATE_POLYFILLS
      ? $jscomp.polyfillIsolated(a, b, d, f)
      : $jscomp.polyfillUnisolated(a, b, d, f));
};
$jscomp.polyfillUnisolated = function (a, b, d, f) {
  d = $jscomp.global;
  a = a.split(".");
  for (f = 0; f < a.length - 1; f++) {
    var c = a[f];
    if (!(c in d)) return;
    d = d[c];
  }
  a = a[a.length - 1];
  f = d[a];
  b = b(f);
  b != f &&
    null != b &&
    $jscomp.defineProperty(d, a, { configurable: !0, writable: !0, value: b });
};
$jscomp.polyfillIsolated = function (a, b, d, f) {
  var c = a.split(".");
  a = 1 === c.length;
  f = c[0];
  f = !a && f in $jscomp.polyfills ? $jscomp.polyfills : $jscomp.global;
  for (var h = 0; h < c.length - 1; h++) {
    var e = c[h];
    if (!(e in f)) return;
    f = f[e];
  }
  c = c[c.length - 1];
  d = $jscomp.IS_SYMBOL_NATIVE && "es6" === d ? f[c] : null;
  b = b(d);
  null != b &&
    (a
      ? $jscomp.defineProperty($jscomp.polyfills, c, {
          configurable: !0,
          writable: !0,
          value: b,
        })
      : b !== d &&
        (void 0 === $jscomp.propertyToPolyfillSymbol[c] &&
          ($jscomp.propertyToPolyfillSymbol[c] = $jscomp.IS_SYMBOL_NATIVE
            ? $jscomp.global.Symbol(c)
            : $jscomp.POLYFILL_PREFIX + c),
        $jscomp.defineProperty(f, $jscomp.propertyToPolyfillSymbol[c], {
          configurable: !0,
          writable: !0,
          value: b,
        })));
};
$jscomp.underscoreProtoCanBeSet = function () {
  var a = { a: !0 },
    b = {};
  try {
    return (b.__proto__ = a), b.a;
  } catch (d) {}
  return !1;
};
$jscomp.setPrototypeOf =
  $jscomp.TRUST_ES6_POLYFILLS && "function" == typeof Object.setPrototypeOf
    ? Object.setPrototypeOf
    : $jscomp.underscoreProtoCanBeSet()
    ? function (a, b) {
        a.__proto__ = b;
        if (a.__proto__ !== b) throw new TypeError(a + " is not extensible");
        return a;
      }
    : null;
$jscomp.generator = {};
$jscomp.generator.ensureIteratorResultIsObject_ = function (a) {
  if (!(a instanceof Object))
    throw new TypeError("Iterator result " + a + " is not an object");
};
$jscomp.generator.Context = function () {
  this.isRunning_ = !1;
  this.yieldAllIterator_ = null;
  this.yieldResult = void 0;
  this.nextAddress = 1;
  this.finallyAddress_ = this.catchAddress_ = 0;
  this.finallyContexts_ = this.abruptCompletion_ = null;
};
$jscomp.generator.Context.prototype.start_ = function () {
  if (this.isRunning_) throw new TypeError("Generator is already running");
  this.isRunning_ = !0;
};
$jscomp.generator.Context.prototype.stop_ = function () {
  this.isRunning_ = !1;
};
$jscomp.generator.Context.prototype.jumpToErrorHandler_ = function () {
  this.nextAddress = this.catchAddress_ || this.finallyAddress_;
};
$jscomp.generator.Context.prototype.next_ = function (a) {
  this.yieldResult = a;
};
$jscomp.generator.Context.prototype.throw_ = function (a) {
  this.abruptCompletion_ = { exception: a, isException: !0 };
  this.jumpToErrorHandler_();
};
$jscomp.generator.Context.prototype.return = function (a) {
  this.abruptCompletion_ = { return: a };
  this.nextAddress = this.finallyAddress_;
};
$jscomp.generator.Context.prototype.jumpThroughFinallyBlocks = function (a) {
  this.abruptCompletion_ = { jumpTo: a };
  this.nextAddress = this.finallyAddress_;
};
$jscomp.generator.Context.prototype.yield = function (a, b) {
  this.nextAddress = b;
  return { value: a };
};
$jscomp.generator.Context.prototype.yieldAll = function (a, b) {
  a = $jscomp.makeIterator(a);
  var d = a.next();
  $jscomp.generator.ensureIteratorResultIsObject_(d);
  if (d.done) (this.yieldResult = d.value), (this.nextAddress = b);
  else return (this.yieldAllIterator_ = a), this.yield(d.value, b);
};
$jscomp.generator.Context.prototype.jumpTo = function (a) {
  this.nextAddress = a;
};
$jscomp.generator.Context.prototype.jumpToEnd = function () {
  this.nextAddress = 0;
};
$jscomp.generator.Context.prototype.setCatchFinallyBlocks = function (a, b) {
  this.catchAddress_ = a;
  void 0 != b && (this.finallyAddress_ = b);
};
$jscomp.generator.Context.prototype.setFinallyBlock = function (a) {
  this.catchAddress_ = 0;
  this.finallyAddress_ = a || 0;
};
$jscomp.generator.Context.prototype.leaveTryBlock = function (a, b) {
  this.nextAddress = a;
  this.catchAddress_ = b || 0;
};
$jscomp.generator.Context.prototype.enterCatchBlock = function (a) {
  this.catchAddress_ = a || 0;
  a = this.abruptCompletion_.exception;
  this.abruptCompletion_ = null;
  return a;
};
$jscomp.generator.Context.prototype.enterFinallyBlock = function (a, b, d) {
  d
    ? (this.finallyContexts_[d] = this.abruptCompletion_)
    : (this.finallyContexts_ = [this.abruptCompletion_]);
  this.catchAddress_ = a || 0;
  this.finallyAddress_ = b || 0;
};
$jscomp.generator.Context.prototype.leaveFinallyBlock = function (a, b) {
  b = this.finallyContexts_.splice(b || 0)[0];
  if ((b = this.abruptCompletion_ = this.abruptCompletion_ || b)) {
    if (b.isException) return this.jumpToErrorHandler_();
    void 0 != b.jumpTo && this.finallyAddress_ < b.jumpTo
      ? ((this.nextAddress = b.jumpTo), (this.abruptCompletion_ = null))
      : (this.nextAddress = this.finallyAddress_);
  } else this.nextAddress = a;
};
$jscomp.generator.Context.prototype.forIn = function (a) {
  return new $jscomp.generator.Context.PropertyIterator(a);
};
$jscomp.generator.Context.PropertyIterator = function (a) {
  this.object_ = a;
  this.properties_ = [];
  for (var b in a) this.properties_.push(b);
  this.properties_.reverse();
};
$jscomp.generator.Context.PropertyIterator.prototype.getNext = function () {
  for (; 0 < this.properties_.length; ) {
    var a = this.properties_.pop();
    if (a in this.object_) return a;
  }
  return null;
};
$jscomp.generator.Engine_ = function (a) {
  this.context_ = new $jscomp.generator.Context();
  this.program_ = a;
};
$jscomp.generator.Engine_.prototype.next_ = function (a) {
  this.context_.start_();
  if (this.context_.yieldAllIterator_)
    return this.yieldAllStep_(
      this.context_.yieldAllIterator_.next,
      a,
      this.context_.next_
    );
  this.context_.next_(a);
  return this.nextStep_();
};
$jscomp.generator.Engine_.prototype.return_ = function (a) {
  this.context_.start_();
  var b = this.context_.yieldAllIterator_;
  if (b)
    return this.yieldAllStep_(
      "return" in b
        ? b["return"]
        : function (d) {
            return { value: d, done: !0 };
          },
      a,
      this.context_.return
    );
  this.context_.return(a);
  return this.nextStep_();
};
$jscomp.generator.Engine_.prototype.throw_ = function (a) {
  this.context_.start_();
  if (this.context_.yieldAllIterator_)
    return this.yieldAllStep_(
      this.context_.yieldAllIterator_["throw"],
      a,
      this.context_.next_
    );
  this.context_.throw_(a);
  return this.nextStep_();
};
$jscomp.generator.Engine_.prototype.yieldAllStep_ = function (a, b, d) {
  try {
    var f = a.call(this.context_.yieldAllIterator_, b);
    $jscomp.generator.ensureIteratorResultIsObject_(f);
    if (!f.done) return this.context_.stop_(), f;
    var c = f.value;
  } catch (h) {
    return (
      (this.context_.yieldAllIterator_ = null),
      this.context_.throw_(h),
      this.nextStep_()
    );
  }
  this.context_.yieldAllIterator_ = null;
  d.call(this.context_, c);
  return this.nextStep_();
};
$jscomp.generator.Engine_.prototype.nextStep_ = function () {
  for (; this.context_.nextAddress; )
    try {
      var a = this.program_(this.context_);
      if (a) return this.context_.stop_(), { value: a.value, done: !1 };
    } catch (b) {
      (this.context_.yieldResult = void 0), this.context_.throw_(b);
    }
  this.context_.stop_();
  if (this.context_.abruptCompletion_) {
    a = this.context_.abruptCompletion_;
    this.context_.abruptCompletion_ = null;
    if (a.isException) throw a.exception;
    return { value: a.return, done: !0 };
  }
  return { value: void 0, done: !0 };
};
$jscomp.generator.Generator_ = function (a) {
  this.next = function (b) {
    return a.next_(b);
  };
  this.throw = function (b) {
    return a.throw_(b);
  };
  this.return = function (b) {
    return a.return_(b);
  };
  this[Symbol.iterator] = function () {
    return this;
  };
};
$jscomp.generator.createGenerator = function (a, b) {
  b = new $jscomp.generator.Generator_(new $jscomp.generator.Engine_(b));
  $jscomp.setPrototypeOf &&
    a.prototype &&
    $jscomp.setPrototypeOf(b, a.prototype);
  return b;
};
$jscomp.asyncExecutePromiseGenerator = function (a) {
  function b(f) {
    return a.next(f);
  }
  function d(f) {
    return a.throw(f);
  }
  return new Promise(function (f, c) {
    function h(e) {
      e.done ? f(e.value) : Promise.resolve(e.value).then(b, d).then(h, c);
    }
    h(a.next());
  });
};
$jscomp.asyncExecutePromiseGeneratorFunction = function (a) {
  return $jscomp.asyncExecutePromiseGenerator(a());
};
$jscomp.asyncExecutePromiseGeneratorProgram = function (a) {
  return $jscomp.asyncExecutePromiseGenerator(
    new $jscomp.generator.Generator_(new $jscomp.generator.Engine_(a))
  );
};
$jscomp.initSymbol = function () {};
$jscomp.polyfill(
  "Symbol",
  function (a) {
    if (a) return a;
    var b = function (c, h) {
      this.$jscomp$symbol$id_ = c;
      $jscomp.defineProperty(this, "description", {
        configurable: !0,
        writable: !0,
        value: h,
      });
    };
    b.prototype.toString = function () {
      return this.$jscomp$symbol$id_;
    };
    var d = 0,
      f = function (c) {
        if (this instanceof f)
          throw new TypeError("Symbol is not a constructor");
        return new b("jscomp_symbol_" + (c || "") + "_" + d++, c);
      };
    return f;
  },
  "es6",
  "es3"
);
$jscomp.polyfill(
  "Symbol.iterator",
  function (a) {
    if (a) return a;
    a = Symbol("Symbol.iterator");
    for (
      var b =
          "Array Int8Array Uint8Array Uint8ClampedArray Int16Array Uint16Array Int32Array Uint32Array Float32Array Float64Array".split(
            " "
          ),
        d = 0;
      d < b.length;
      d++
    ) {
      var f = $jscomp.global[b[d]];
      "function" === typeof f &&
        "function" != typeof f.prototype[a] &&
        $jscomp.defineProperty(f.prototype, a, {
          configurable: !0,
          writable: !0,
          value: function () {
            return $jscomp.iteratorPrototype($jscomp.arrayIteratorImpl(this));
          },
        });
    }
    return a;
  },
  "es6",
  "es3"
);
$jscomp.iteratorPrototype = function (a) {
  a = { next: a };
  a[Symbol.iterator] = function () {
    return this;
  };
  return a;
};
$jscomp.polyfill(
  "Promise",
  function (a) {
    function b() {
      this.batch_ = null;
    }
    function d(e) {
      return e instanceof c
        ? e
        : new c(function (g, k) {
            g(e);
          });
    }
    if (
      a &&
      (!(
        $jscomp.FORCE_POLYFILL_PROMISE ||
        ($jscomp.FORCE_POLYFILL_PROMISE_WHEN_NO_UNHANDLED_REJECTION &&
          "undefined" === typeof $jscomp.global.PromiseRejectionEvent)
      ) ||
        !$jscomp.global.Promise ||
        -1 === $jscomp.global.Promise.toString().indexOf("[native code]"))
    )
      return a;
    b.prototype.asyncExecute = function (e) {
      if (null == this.batch_) {
        this.batch_ = [];
        var g = this;
        this.asyncExecuteFunction(function () {
          g.executeBatch_();
        });
      }
      this.batch_.push(e);
    };
    var f = $jscomp.global.setTimeout;
    b.prototype.asyncExecuteFunction = function (e) {
      f(e, 0);
    };
    b.prototype.executeBatch_ = function () {
      for (; this.batch_ && this.batch_.length; ) {
        var e = this.batch_;
        this.batch_ = [];
        for (var g = 0; g < e.length; ++g) {
          var k = e[g];
          e[g] = null;
          try {
            k();
          } catch (l) {
            this.asyncThrow_(l);
          }
        }
      }
      this.batch_ = null;
    };
    b.prototype.asyncThrow_ = function (e) {
      this.asyncExecuteFunction(function () {
        throw e;
      });
    };
    var c = function (e) {
      this.state_ = 0;
      this.result_ = void 0;
      this.onSettledCallbacks_ = [];
      this.isRejectionHandled_ = !1;
      var g = this.createResolveAndReject_();
      try {
        e(g.resolve, g.reject);
      } catch (k) {
        g.reject(k);
      }
    };
    c.prototype.createResolveAndReject_ = function () {
      function e(l) {
        return function (n) {
          k || ((k = !0), l.call(g, n));
        };
      }
      var g = this,
        k = !1;
      return { resolve: e(this.resolveTo_), reject: e(this.reject_) };
    };
    c.prototype.resolveTo_ = function (e) {
      if (e === this)
        this.reject_(new TypeError("A Promise cannot resolve to itself"));
      else if (e instanceof c) this.settleSameAsPromise_(e);
      else {
        a: switch (typeof e) {
          case "object":
            var g = null != e;
            break a;
          case "function":
            g = !0;
            break a;
          default:
            g = !1;
        }
        g ? this.resolveToNonPromiseObj_(e) : this.fulfill_(e);
      }
    };
    c.prototype.resolveToNonPromiseObj_ = function (e) {
      var g = void 0;
      try {
        g = e.then;
      } catch (k) {
        this.reject_(k);
        return;
      }
      "function" == typeof g
        ? this.settleSameAsThenable_(g, e)
        : this.fulfill_(e);
    };
    c.prototype.reject_ = function (e) {
      this.settle_(2, e);
    };
    c.prototype.fulfill_ = function (e) {
      this.settle_(1, e);
    };
    c.prototype.settle_ = function (e, g) {
      if (0 != this.state_)
        throw Error(
          "Cannot settle(" +
            e +
            ", " +
            g +
            "): Promise already settled in state" +
            this.state_
        );
      this.state_ = e;
      this.result_ = g;
      2 === this.state_ && this.scheduleUnhandledRejectionCheck_();
      this.executeOnSettledCallbacks_();
    };
    c.prototype.scheduleUnhandledRejectionCheck_ = function () {
      var e = this;
      f(function () {
        if (e.notifyUnhandledRejection_()) {
          var g = $jscomp.global.console;
          "undefined" !== typeof g && g.error(e.result_);
        }
      }, 1);
    };
    c.prototype.notifyUnhandledRejection_ = function () {
      if (this.isRejectionHandled_) return !1;
      var e = $jscomp.global.CustomEvent,
        g = $jscomp.global.Event,
        k = $jscomp.global.dispatchEvent;
      if ("undefined" === typeof k) return !0;
      "function" === typeof e
        ? (e = new e("unhandledrejection", { cancelable: !0 }))
        : "function" === typeof g
        ? (e = new g("unhandledrejection", { cancelable: !0 }))
        : ((e = $jscomp.global.document.createEvent("CustomEvent")),
          e.initCustomEvent("unhandledrejection", !1, !0, e));
      e.promise = this;
      e.reason = this.result_;
      return k(e);
    };
    c.prototype.executeOnSettledCallbacks_ = function () {
      if (null != this.onSettledCallbacks_) {
        for (var e = 0; e < this.onSettledCallbacks_.length; ++e)
          h.asyncExecute(this.onSettledCallbacks_[e]);
        this.onSettledCallbacks_ = null;
      }
    };
    var h = new b();
    c.prototype.settleSameAsPromise_ = function (e) {
      var g = this.createResolveAndReject_();
      e.callWhenSettled_(g.resolve, g.reject);
    };
    c.prototype.settleSameAsThenable_ = function (e, g) {
      var k = this.createResolveAndReject_();
      try {
        e.call(g, k.resolve, k.reject);
      } catch (l) {
        k.reject(l);
      }
    };
    c.prototype.then = function (e, g) {
      function k(p, m) {
        return "function" == typeof p
          ? function (r) {
              try {
                l(p(r));
              } catch (t) {
                n(t);
              }
            }
          : m;
      }
      var l,
        n,
        q = new c(function (p, m) {
          l = p;
          n = m;
        });
      this.callWhenSettled_(k(e, l), k(g, n));
      return q;
    };
    c.prototype.catch = function (e) {
      return this.then(void 0, e);
    };
    c.prototype.callWhenSettled_ = function (e, g) {
      function k() {
        switch (l.state_) {
          case 1:
            e(l.result_);
            break;
          case 2:
            g(l.result_);
            break;
          default:
            throw Error("Unexpected state: " + l.state_);
        }
      }
      var l = this;
      null == this.onSettledCallbacks_
        ? h.asyncExecute(k)
        : this.onSettledCallbacks_.push(k);
      this.isRejectionHandled_ = !0;
    };
    c.resolve = d;
    c.reject = function (e) {
      return new c(function (g, k) {
        k(e);
      });
    };
    c.race = function (e) {
      return new c(function (g, k) {
        for (
          var l = $jscomp.makeIterator(e), n = l.next();
          !n.done;
          n = l.next()
        )
          d(n.value).callWhenSettled_(g, k);
      });
    };
    c.all = function (e) {
      var g = $jscomp.makeIterator(e),
        k = g.next();
      return k.done
        ? d([])
        : new c(function (l, n) {
            function q(r) {
              return function (t) {
                p[r] = t;
                m--;
                0 == m && l(p);
              };
            }
            var p = [],
              m = 0;
            do
              p.push(void 0),
                m++,
                d(k.value).callWhenSettled_(q(p.length - 1), n),
                (k = g.next());
            while (!k.done);
          });
    };
    return c;
  },
  "es6",
  "es3"
);
$jscomp.owns = function (a, b) {
  return Object.prototype.hasOwnProperty.call(a, b);
};
$jscomp.polyfill(
  "Object.entries",
  function (a) {
    return a
      ? a
      : function (b) {
          var d = [],
            f;
          for (f in b) $jscomp.owns(b, f) && d.push([f, b[f]]);
          return d;
        };
  },
  "es8",
  "es3"
);
var correlationLoader = null,
  CorrelationLoader = function (a, b) {
    this.mask = null;
    this.index = this.z = this.y = this.x = 0;
    var d = this,
      f = new XMLHttpRequest();
    f.open("GET", a, !0);
    f.responseType = "arraybuffer";
    f.onreadystatechange = function () {
      if (4 === f.readyState && 200 === f.status) {
        var c = f.response;
        if (
          nifti.isCompressed(c) &&
          ((c = nifti.decompress(c)), nifti.isNIFTI(c))
        ) {
          var h = nifti.readHeader(c);
          if (3 === h.dims[0]) {
            c = nifti.readImage(h, c);
            if (h.datatypeCode === nifti.NIFTI1.TYPE_UINT8)
              c = new Uint8Array(c);
            else if (h.datatypeCode === nifti.NIFTI1.TYPE_INT16)
              c = new Int16Array(c);
            else if (h.datatypeCode === nifti.NIFTI1.TYPE_INT32)
              c = new Int32Array(c);
            else if (h.datatypeCode === nifti.NIFTI1.TYPE_FLOAT32)
              c = new Float32Array(c);
            else if (h.datatypeCode === nifti.NIFTI1.TYPE_FLOAT64)
              c = new Float64Array(c);
            else if (h.datatypeCode === nifti.NIFTI1.TYPE_INT8)
              c = new Int8Array(c);
            else if (h.datatypeCode === nifti.NIFTI1.TYPE_UINT16)
              c = new Uint16Array(c);
            else if (h.datatypeCode === nifti.NIFTI1.TYPE_UINT32)
              c = new Uint32Array(c);
            else return;
            d.mask = c;
            d.x = h.dims[1];
            d.y = h.dims[2];
            d.z = h.dims[3];
            d.loadCorrelation(b);
          }
        }
      }
    };
    f.send(null);
  };
CorrelationLoader.prototype.isValid = function (a, b, d) {
  if (!this.mask) return !0;
  a = ((d - 1) * this.y + (b - 1)) * this.x + (a - 1);
  return a >= this.mask.length ? !1 : 1 === this.mask[a];
};
CorrelationLoader.prototype.loadCorrelation = function (a) {
  var b = papayaContainers[this.index],
    d = b.viewer.getIndexAt(a.x, a.y, a.z),
    f = b.viewer.screenVolumes[0].volume.getOrigin();
  f.x *= -b.viewer.screenVolumes[0].volume.getXSize();
  f.y *= -b.viewer.screenVolumes[0].volume.getYSize();
  f.z *= -b.viewer.screenVolumes[0].volume.getZSize();
  f.x += 14.5;
  f.y += 14.2;
  f.z += 3.45;
  f.x /= 0.5;
  f.y /= 0.5;
  f.z /= 0.5;
  var c = b.viewer.screenVolumes[0].volume.getXSize() / 0.5;
  a = Math.round(d.x * c - f.x + 1);
  c = b.viewer.screenVolumes[0].volume.getYSize() / 0.5;
  var h = Math.round(
    (b.viewer.screenVolumes[0].volume.getYDim() - d.y - 1) * c + f.y + 1
  );
  c = b.viewer.screenVolumes[0].volume.getZSize() / 0.5;
  f = Math.round(
    (b.viewer.screenVolumes[0].volume.getZDim() - d.z - 1) * c + f.z + 1
  );
  if (this.isValid(a, h, f)) {
    d = data_sources[b.preferences.dataSource];
    a = "/" + d.prefix + "_" + a + "_" + h + "_" + f;
    h = d.zmaps + a + "_Z.nii.gz";
    f = d.zsurfs + a + "_Z.R.func.gii";
    if (d.variability_zmaps && "Omit" !== b.preferences.showVariability) {
      var e = d.variability_zmaps + a + "_V.nii.gz";
      var g = d.variability_zsurfs + a + "_V.R.func.gii";
    }
    this.addOverlay(h, f, e, g);
  } else
    b.viewer.drawViewer(),
      b.viewer.container.display.drawError(
        "Out of bounds, please select voxel in gray matter"
      );
};
CorrelationLoader.prototype.addOverlay = function (a, b, d, f) {
  for (
    var c = papayaContainers[this.index], h = c.viewer.screenVolumes, e = 1;
    h.length > e;

  )
    h[e].volume.fileName in params ? e++ : c.viewer.closeOverlay(e);
  c.viewer.hasSurface() && (c.viewer.surfaces[0].parametricData.length = 0);
  h = a.split("/").pop();
  c.params[h] = overlayParams;
  e = parseFloat(c.preferences.minRange);
  c.params[h].min = e ? e : overlayParams.min;
  e = parseFloat(c.preferences.maxRange);
  c.params[h].max = e ? e : overlayParams.max;
  c.params[h].nicename = c.preferences.dataSource + " Correlation";
  if (d) {
    var g = this;
    c.params[h].loadingComplete = function () {
      c.viewer.loadOverlay([d], !0, !1, !1);
      var k = c.viewer.loadingVolume;
      if (f && c.viewer.hasSurface()) {
        var l = c.viewer.surfaces[0];
        k.surface = l;
        g.loadSurfaceColorData(f, l, c.viewer, k);
      }
    };
    h = d.split("/").pop();
    c.params[h] = {
      alpha: 0.7,
      parametric: !1,
      lut: "Green Overlay",
      hidden: "Hide" === c.preferences.showVariability,
      nicename: c.preferences.dataSource + " Variability",
      loadingComplete: function () {
        c.viewer.setCurrentScreenVol(1);
      },
    };
  } else c.params[h].loadingComplete = void 0;
  c.viewer.loadOverlay([a], !0, !1, !1);
  a = c.viewer.loadingVolume;
  b &&
    c.viewer.hasSurface() &&
    ((h = c.viewer.surfaces[0]),
    (a.surface = h),
    this.loadSurfaceColorData(b, h, c.viewer, a));
};
CorrelationLoader.prototype.loadSurfaceColorData = function (a, b, d, f) {
  var c = new XMLHttpRequest();
  c.open("GET", a, !0);
  c.onreadystatechange = function () {
    if (4 === c.readyState && 200 === c.status) {
      var h = gifti.parse(c.response);
      null != h.getZScoresDataArray() &&
        (b.parametricData.push({
          viewer: d,
          volume: f,
          data: h.getZScoresDataArray().getData(),
        }),
        d.drawViewer(!0));
    }
  };
  c.send(null);
};
function loadCorrelation() {
  var a = papayaContainers[0].viewer.currentCoord;
  correlationLoader
    ? correlationLoader.loadCorrelation(a)
    : (correlationLoader = new CorrelationLoader("mask.nii.gz", a));
}
function downloadCorrelation() {
  for (
    var a = papayaContainers[0].viewer.screenVolumes, b = a.length - 1;
    0 < b;
    b--
  )
    if (!(a[b].volume.fileName in params)) {
      window.open(a[b].volume.urls[0]);
      return;
    }
  papayaContainers[0].viewer.container.display.drawError(
    "No correlation loaded"
  );
}
var ctxManager = function () {};
ctxManager.menudata = {
  label: "Test",
  items: [{ label: "Load Correlation", action: "Context-Load" }],
};
ctxManager.prototype.getContextAtImagePosition = function (a, b, d) {
  papayaContainers[0].viewer.currentCoord.setCoordinate(a, b, d);
  return ctxManager.menudata;
};
ctxManager.prototype.actionPerformed = function (a) {
  "Load" === a && loadCorrelation();
};
var resetViewerOld = papaya.Container.resetViewer;
papaya.Container.resetViewer = function (a, b) {
  for (var d in params)
    "images" !== d && "surfaces" !== d && (b[d] = params[d]);
  resetViewerOld(a, b);
  papayaContainers[0].params.images = [""];
};