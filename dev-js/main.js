(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';

var _ForEach = require('../js-exports/ForEach.js');

var _NodeListForEach = require('../js-exports/NodeListForEach.js');

var _ClassList = require('../js-exports/ClassList.js');

var svg = document.getElementById('alaska-map'); /* exported ForEach, NodeListForEach, ClassList */

var timeoutShow,
    timeoutHide,
    nodes,
    cycleIndex = -1;

catalogNodes();
dataOverlay();
addEventListeners();

function addEventListeners() {
	document.querySelectorAll('line.active').forEach(function (l) {
		// need to handle line opacity via css class so that it can be selected here
		l.classList.remove('active');
	});
	var activeNode = document.querySelector('circle.active');
	if (activeNode) {
		activeNode.classList.remove('active');
	}
	svg.querySelectorAll('circle').forEach(function (c) {
		c.addEventListener('mouseenter', activate);
		c.addEventListener('mouseleave', deactivate);
		c.addEventListener('focus', activate);
		c.addEventListener('blur', deactivate);
	});
}

function activate(e) {
	console.log(e);
	if (e.type !== 'focus') {
		document.activeElement.blur();
	}
	var circle = document.querySelector('circle.active');
	console.log(circle);
	if (circle) {
		deactivate.call(circle);
	}
	this.classList.add('active');
	showLinks(this.dataset);
	showDetails(this.dataset);
}

function deactivate() {
	this.classList.remove('active');
	hideLinks(this.dataset);
	hideDetails();
}

function showLinks(d) {
	svg.querySelectorAll('line.' + d.name).forEach(function (l) {
		l.classList.add('active');
		var attachedNodes = l.className.baseVal.match(/[A-Z]+-.*?-[^ ]/g);
		attachedNodes.forEach(function (ndId) {
			if (ndId !== d.name) {
				var nd = svg.querySelector('circle[data-name="' + ndId + '"]');
				if (nd) {
					nd.classList.add('attached');
				}
			}
		});
	});
}
function hideLinks(d) {
	svg.querySelectorAll('line.' + d.name).forEach(function (l) {
		l.classList.remove('active');
	});
	svg.querySelectorAll('circle.attached').forEach(function (c) {
		c.classList.remove('attached');
	});
}
function showDetails(d) {
	clearTimeout(timeoutHide);
	var html = '<b>Fishery: </b>' + d.name + '<br /><b>Species</b>: ' + d.species + ' | <b>Gear</b>: ' + d.gear + ' | <b>Area</b>: ' + d.area + ' | <b>Number of permits</b>: ' + d.count;
	var details = document.querySelector('#detail-div');
	details.style.opacity = 0;
	timeoutShow = setTimeout(function () {
		details.innerHTML = html;
		details.style.opacity = 1;
	}, 250);
}
function hideDetails() {
	clearTimeout(timeoutShow);
	var details = document.querySelector('#detail-div');
	details.style.opacity = 0;
	timeoutHide = setTimeout(function () {
		details.innerHTML = '<em>Select a fishery or cycle through for details.</em>';
		details.style.opacity = 1;
	}, 250);
}
function dataOverlay() {
	var overlayDiv = document.createElement('div');
	overlayDiv.id = 'overlay-div';
	var detailWrapper = document.createElement('div');
	detailWrapper.id = 'detail-wrapper';
	var details = document.createElement('div');
	details.id = 'detail-div';
	details.innerHTML = '<em>Select a fishery or cycle through for details.</em>';
	detailWrapper.appendChild(details);
	overlayDiv.appendChild(detailWrapper);
	var btn = document.createElement('button');
	btn.innerHTML = 'Next';
	btn.addEventListener('click', cycleNext);
	overlayDiv.appendChild(btn);
	document.getElementById('map-container').appendChild(overlayDiv);
}

function cycleNext() {
	cycleIndex++;
	if (cycleIndex === nodes.length) {
		cycleIndex = 0;
	}
	activate.call(nodes[cycleIndex], 'btn');
}

function catalogNodes() {
	nodes = document.querySelectorAll('#alaska-map .nodes circle');
}

},{"../js-exports/ClassList.js":2,"../js-exports/ForEach.js":3,"../js-exports/NodeListForEach.js":4}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
/*
 * classList.js: Cross-browser full element.classList implementation.
 * 1.2.20171210
 *
 * By Eli Grey, http://eligrey.com
 * License: Dedicated to the public domain.
 *   See https://github.com/eligrey/classList.js/blob/master/LICENSE.md
 */

/*global self, document, DOMException */

/*! @source http://purl.eligrey.com/github/classList.js/blob/master/classList.js */

var ClassList = exports.ClassList = function () {

	if ("document" in self) {

		// Full polyfill for browsers with no classList support
		// Including IE < Edge missing SVGElement.classList
		if (!("classList" in document.createElement("_")) || document.createElementNS && !("classList" in document.createElementNS("http://www.w3.org/2000/svg", "g"))) {

			(function (view) {

				"use strict";

				if (!('Element' in view)) return;

				var classListProp = "classList",
				    protoProp = "prototype",
				    elemCtrProto = view.Element[protoProp],
				    objCtr = Object,
				    strTrim = String[protoProp].trim || function () {
					return this.replace(/^\s+|\s+$/g, "");
				},
				    arrIndexOf = Array[protoProp].indexOf || function (item) {
					var i = 0,
					    len = this.length;
					for (; i < len; i++) {
						if (i in this && this[i] === item) {
							return i;
						}
					}
					return -1;
				}
				// Vendors: please allow content code to instantiate DOMExceptions
				,
				    DOMEx = function DOMEx(type, message) {
					this.name = type;
					this.code = DOMException[type];
					this.message = message;
				},
				    checkTokenAndGetIndex = function checkTokenAndGetIndex(classList, token) {
					if (token === "") {
						throw new DOMEx("SYNTAX_ERR", "The token must not be empty.");
					}
					if (/\s/.test(token)) {
						throw new DOMEx("INVALID_CHARACTER_ERR", "The token must not contain space characters.");
					}
					return arrIndexOf.call(classList, token);
				},
				    ClassList = function ClassList(elem) {
					var trimmedClasses = strTrim.call(elem.getAttribute("class") || ""),
					    classes = trimmedClasses ? trimmedClasses.split(/\s+/) : [],
					    i = 0,
					    len = classes.length;
					for (; i < len; i++) {
						this.push(classes[i]);
					}
					this._updateClassName = function () {
						elem.setAttribute("class", this.toString());
					};
				},
				    classListProto = ClassList[protoProp] = [],
				    classListGetter = function classListGetter() {
					return new ClassList(this);
				};
				// Most DOMException implementations don't allow calling DOMException's toString()
				// on non-DOMExceptions. Error's toString() is sufficient here.
				DOMEx[protoProp] = Error[protoProp];
				classListProto.item = function (i) {
					return this[i] || null;
				};
				classListProto.contains = function (token) {
					return ~checkTokenAndGetIndex(this, token + "");
				};
				classListProto.add = function () {
					var tokens = arguments,
					    i = 0,
					    l = tokens.length,
					    token,
					    updated = false;
					do {
						token = tokens[i] + "";
						if (!~checkTokenAndGetIndex(this, token)) {
							this.push(token);
							updated = true;
						}
					} while (++i < l);

					if (updated) {
						this._updateClassName();
					}
				};
				classListProto.remove = function () {
					var tokens = arguments,
					    i = 0,
					    l = tokens.length,
					    token,
					    updated = false,
					    index;
					do {
						token = tokens[i] + "";
						index = checkTokenAndGetIndex(this, token);
						while (~index) {
							this.splice(index, 1);
							updated = true;
							index = checkTokenAndGetIndex(this, token);
						}
					} while (++i < l);

					if (updated) {
						this._updateClassName();
					}
				};
				classListProto.toggle = function (token, force) {
					var result = this.contains(token),
					    method = result ? force !== true && "remove" : force !== false && "add";

					if (method) {
						this[method](token);
					}

					if (force === true || force === false) {
						return force;
					} else {
						return !result;
					}
				};
				classListProto.replace = function (token, replacement_token) {
					var index = checkTokenAndGetIndex(token + "");
					if (~index) {
						this.splice(index, 1, replacement_token);
						this._updateClassName();
					}
				};
				classListProto.toString = function () {
					return this.join(" ");
				};

				if (objCtr.defineProperty) {
					var classListPropDesc = {
						get: classListGetter,
						enumerable: true,
						configurable: true
					};
					try {
						objCtr.defineProperty(elemCtrProto, classListProp, classListPropDesc);
					} catch (ex) {
						// IE 8 doesn't support enumerable:true
						// adding undefined to fight this issue https://github.com/eligrey/classList.js/issues/36
						// modernie IE8-MSW7 machine has IE8 8.0.6001.18702 and is affected
						if (ex.number === undefined || ex.number === -0x7FF5EC54) {
							classListPropDesc.enumerable = false;
							objCtr.defineProperty(elemCtrProto, classListProp, classListPropDesc);
						}
					}
				} else if (objCtr[protoProp].__defineGetter__) {
					elemCtrProto.__defineGetter__(classListProp, classListGetter);
				}
			})(self);
		}

		// There is full or partial native classList support, so just check if we need
		// to normalize the add/remove and toggle APIs.

		(function () {
			"use strict";

			var testElement = document.createElement("_");

			testElement.classList.add("c1", "c2");

			// Polyfill for IE 10/11 and Firefox <26, where classList.add and
			// classList.remove exist but support only one argument at a time.
			if (!testElement.classList.contains("c2")) {
				var createMethod = function createMethod(method) {
					var original = DOMTokenList.prototype[method];

					DOMTokenList.prototype[method] = function (token) {
						var i,
						    len = arguments.length;

						for (i = 0; i < len; i++) {
							token = arguments[i];
							original.call(this, token);
						}
					};
				};
				createMethod('add');
				createMethod('remove');
			}

			testElement.classList.toggle("c3", false);

			// Polyfill for IE 10 and Firefox <24, where classList.toggle does not
			// support the second argument.
			if (testElement.classList.contains("c3")) {
				var _toggle = DOMTokenList.prototype.toggle;

				DOMTokenList.prototype.toggle = function (token, force) {
					if (1 in arguments && !this.contains(token) === !force) {
						return force;
					} else {
						return _toggle.call(this, token);
					}
				};
			}

			// replace() polyfill
			if (!("replace" in document.createElement("_").classList)) {
				DOMTokenList.prototype.replace = function (token, replacement_token) {
					var tokens = this.toString().split(" "),
					    index = tokens.indexOf(token + "");
					if (~index) {
						tokens = tokens.slice(index);
						this.remove.apply(this, tokens);
						this.add(replacement_token);
						this.add.apply(this, tokens.slice(1));
					}
				};
			}

			testElement = null;
		})();
	}
}();

},{}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
// forEach polyfill
// Production steps of ECMA-262, Edition 5, 15.4.4.18
// Reference: http://es5.github.io/#x15.4.4.18
var ForEach = exports.ForEach = function () {
  if (!Array.prototype.forEach) {

    Array.prototype.forEach = function (callback /*, thisArg*/) {

      var T, k;

      if (this == null) {
        throw new TypeError('this is null or not defined');
      }

      // 1. Let O be the result of calling toObject() passing the
      // |this| value as the argument.
      var O = Object(this);

      // 2. Let lenValue be the result of calling the Get() internal
      // method of O with the argument "length".
      // 3. Let len be toUint32(lenValue).
      var len = O.length >>> 0;

      // 4. If isCallable(callback) is false, throw a TypeError exception. 
      // See: http://es5.github.com/#x9.11
      if (typeof callback !== 'function') {
        throw new TypeError(callback + ' is not a function');
      }

      // 5. If thisArg was supplied, let T be thisArg; else let
      // T be undefined.
      if (arguments.length > 1) {
        T = arguments[1];
      }

      // 6. Let k be 0.
      k = 0;

      // 7. Repeat while k < len.
      while (k < len) {

        var kValue;

        // a. Let Pk be ToString(k).
        //    This is implicit for LHS operands of the in operator.
        // b. Let kPresent be the result of calling the HasProperty
        //    internal method of O with argument Pk.
        //    This step can be combined with c.
        // c. If kPresent is true, then
        if (k in O) {

          // i. Let kValue be the result of calling the Get internal
          // method of O with argument Pk.
          kValue = O[k];

          // ii. Call the Call internal method of callback with T as
          // the this value and argument list containing kValue, k, and O.
          callback.call(T, kValue, k, O);
        }
        // d. Increase k by 1.
        k++;
      }
      // 8. return undefined.
    };
  }
}();

},{}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
var NodeListForEach = exports.NodeListForEach = function () {
	if (window.NodeList && !NodeList.prototype.forEach) {
		NodeList.prototype.forEach = function (callback, thisArg) {
			thisArg = thisArg || window;
			for (var i = 0; i < this.length; i++) {
				callback.call(thisArg, this[i], i, this);
			}
		};
	}
}();

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9ncnVudC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJkZXYtanMvbWFpbi5lczYiLCJqcy1leHBvcnRzL0NsYXNzTGlzdC5qcyIsImpzLWV4cG9ydHMvRm9yRWFjaC5qcyIsImpzLWV4cG9ydHMvTm9kZUxpc3RGb3JFYWNoLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNDQTs7QUFDQTs7QUFDQTs7QUFFQSxJQUFJLE1BQU0sU0FBUyxjQUFULENBQXdCLFlBQXhCLENBQVYsQyxDQUxBOztBQU1BLElBQUksV0FBSjtBQUFBLElBQ0MsV0FERDtBQUFBLElBRUMsS0FGRDtBQUFBLElBR0MsYUFBYSxDQUFDLENBSGY7O0FBS0E7QUFDQTtBQUNBOztBQUVBLFNBQVMsaUJBQVQsR0FBNEI7QUFDM0IsVUFBUyxnQkFBVCxDQUEwQixhQUExQixFQUF5QyxPQUF6QyxDQUFpRCxhQUFLO0FBQUU7QUFDdkQsSUFBRSxTQUFGLENBQVksTUFBWixDQUFtQixRQUFuQjtBQUNBLEVBRkQ7QUFHQSxLQUFJLGFBQWEsU0FBUyxhQUFULENBQXVCLGVBQXZCLENBQWpCO0FBQ0EsS0FBSyxVQUFMLEVBQWtCO0FBQ2pCLGFBQVcsU0FBWCxDQUFxQixNQUFyQixDQUE0QixRQUE1QjtBQUNBO0FBQ0QsS0FBSSxnQkFBSixDQUFxQixRQUFyQixFQUErQixPQUEvQixDQUF1QyxhQUFLO0FBQzNDLElBQUUsZ0JBQUYsQ0FBbUIsWUFBbkIsRUFBaUMsUUFBakM7QUFDQSxJQUFFLGdCQUFGLENBQW1CLFlBQW5CLEVBQWlDLFVBQWpDO0FBQ0EsSUFBRSxnQkFBRixDQUFtQixPQUFuQixFQUE0QixRQUE1QjtBQUNBLElBQUUsZ0JBQUYsQ0FBbUIsTUFBbkIsRUFBMkIsVUFBM0I7QUFDQSxFQUxEO0FBTUE7O0FBRUQsU0FBUyxRQUFULENBQWtCLENBQWxCLEVBQW9C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QVUsTUFBVixHQUFtQixDQUF2QixFQUEwQjtBQUN4QixZQUFJLFVBQVUsQ0FBVixDQUFKO0FBQ0Q7O0FBRUQ7QUFDQSxVQUFJLENBQUo7O0FBRUE7QUFDQSxhQUFPLElBQUksR0FBWCxFQUFnQjs7QUFFZCxZQUFJLE1BQUo7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBSSxLQUFLLENBQVQsRUFBWTs7QUFFVjtBQUNBO0FBQ0EsbUJBQVMsRUFBRSxDQUFGLENBQVQ7O0FBRUE7QUFDQTtBQUNBLG1CQUFTLElBQVQsQ0FBYyxDQUFkLEVBQWlCLE1BQWpCLEVBQXlCLENBQXpCLEVBQTRCLENBQTVCO0FBQ0Q7QUFDRDtBQUNBO0FBQ0Q7QUFDRDtBQUNELEtBekREO0FBMEREO0FBQ0YsQ0E5RHNCLEVBQWhCOzs7Ozs7OztBQ0hBLElBQU0sNENBQW1CLFlBQVU7QUFDekMsS0FBSSxPQUFPLFFBQVAsSUFBbUIsQ0FBQyxTQUFTLFNBQVQsQ0FBbUIsT0FBM0MsRUFBb0Q7QUFDaEQsV0FBUyxTQUFULENBQW1CLE9BQW5CLEdBQTZCLFVBQVUsUUFBVixFQUFvQixPQUFwQixFQUE2QjtBQUN0RCxhQUFVLFdBQVcsTUFBckI7QUFDQSxRQUFLLElBQUksSUFBSSxDQUFiLEVBQWdCLElBQUksS0FBSyxNQUF6QixFQUFpQyxHQUFqQyxFQUFzQztBQUNsQyxhQUFTLElBQVQsQ0FBYyxPQUFkLEVBQXVCLEtBQUssQ0FBTCxDQUF2QixFQUFnQyxDQUFoQyxFQUFtQyxJQUFuQztBQUNIO0FBQ0osR0FMRDtBQU1IO0FBQ0QsQ0FUOEIsRUFBeEIiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCIvKiBleHBvcnRlZCBGb3JFYWNoLCBOb2RlTGlzdEZvckVhY2gsIENsYXNzTGlzdCAqL1xuaW1wb3J0IHsgRm9yRWFjaCB9IGZyb20gJy4uL2pzLWV4cG9ydHMvRm9yRWFjaC5qcyc7XG5pbXBvcnQgeyBOb2RlTGlzdEZvckVhY2ggfSBmcm9tICcuLi9qcy1leHBvcnRzL05vZGVMaXN0Rm9yRWFjaC5qcyc7XG5pbXBvcnQgeyBDbGFzc0xpc3QgfSBmcm9tICcuLi9qcy1leHBvcnRzL0NsYXNzTGlzdC5qcyc7XG5cbnZhciBzdmcgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYWxhc2thLW1hcCcpO1xudmFyIHRpbWVvdXRTaG93LFxuXHR0aW1lb3V0SGlkZSxcblx0bm9kZXMsXG5cdGN5Y2xlSW5kZXggPSAtMTtcblxuY2F0YWxvZ05vZGVzKCk7XG5kYXRhT3ZlcmxheSgpO1xuYWRkRXZlbnRMaXN0ZW5lcnMoKTtcblxuZnVuY3Rpb24gYWRkRXZlbnRMaXN0ZW5lcnMoKXtcblx0ZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnbGluZS5hY3RpdmUnKS5mb3JFYWNoKGwgPT4geyAvLyBuZWVkIHRvIGhhbmRsZSBsaW5lIG9wYWNpdHkgdmlhIGNzcyBjbGFzcyBzbyB0aGF0IGl0IGNhbiBiZSBzZWxlY3RlZCBoZXJlXG5cdFx0bC5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcblx0fSk7XG5cdHZhciBhY3RpdmVOb2RlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignY2lyY2xlLmFjdGl2ZScpO1xuXHRpZiAoIGFjdGl2ZU5vZGUgKSB7XG5cdFx0YWN0aXZlTm9kZS5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcblx0fVxuXHRzdmcucXVlcnlTZWxlY3RvckFsbCgnY2lyY2xlJykuZm9yRWFjaChjID0+IHtcblx0XHRjLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZW50ZXInLCBhY3RpdmF0ZSk7XG5cdFx0Yy5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWxlYXZlJywgZGVhY3RpdmF0ZSk7XG5cdFx0Yy5hZGRFdmVudExpc3RlbmVyKCdmb2N1cycsIGFjdGl2YXRlKTtcblx0XHRjLmFkZEV2ZW50TGlzdGVuZXIoJ2JsdXInLCBkZWFjdGl2YXRlKTtcblx0fSk7XG59XG5cbmZ1bmN0aW9uIGFjdGl2YXRlKGUpe1xuXHRjb25zb2xlLmxvZyhlKTtcblx0aWYgKGUudHlwZSAhPT0gJ2ZvY3VzJykge1xuXHRcdGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQuYmx1cigpO1xuXHR9IFxuXHRsZXQgY2lyY2xlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignY2lyY2xlLmFjdGl2ZScpO1xuXHRjb25zb2xlLmxvZyhjaXJjbGUpO1xuXHRpZiAoIGNpcmNsZSApIHtcblx0XHRkZWFjdGl2YXRlLmNhbGwoY2lyY2xlKTtcblx0fVxuXHR0aGlzLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xuXHRzaG93TGlua3ModGhpcy5kYXRhc2V0KTtcblx0c2hvd0RldGFpbHModGhpcy5kYXRhc2V0KTtcbn1cblxuZnVuY3Rpb24gZGVhY3RpdmF0ZSgpe1xuXHR0aGlzLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xuXHRoaWRlTGlua3ModGhpcy5kYXRhc2V0KTtcblx0aGlkZURldGFpbHMoKTtcbn1cblxuZnVuY3Rpb24gc2hvd0xpbmtzKGQpe1xuXHRzdmcucXVlcnlTZWxlY3RvckFsbCgnbGluZS4nICsgZC5uYW1lKS5mb3JFYWNoKGwgPT4ge1xuXHRcdGwuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG5cdFx0dmFyIGF0dGFjaGVkTm9kZXMgPSBsLmNsYXNzTmFtZS5iYXNlVmFsLm1hdGNoKC9bQS1aXSstLio/LVteIF0vZyk7XG5cdFx0YXR0YWNoZWROb2Rlcy5mb3JFYWNoKG5kSWQgPT4ge1xuXHRcdFx0aWYgKCBuZElkICE9PSBkLm5hbWUgKXtcblx0XHRcdFx0bGV0IG5kID0gc3ZnLnF1ZXJ5U2VsZWN0b3IoJ2NpcmNsZVtkYXRhLW5hbWU9XCInICsgbmRJZCArICdcIl0nKTtcblx0XHRcdFx0aWYgKCBuZCApIHtcblx0XHRcdFx0XHRuZC5jbGFzc0xpc3QuYWRkKCdhdHRhY2hlZCcpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH0pO1xufVxuZnVuY3Rpb24gaGlkZUxpbmtzKGQpe1xuXHRzdmcucXVlcnlTZWxlY3RvckFsbCgnbGluZS4nICsgZC5uYW1lKS5mb3JFYWNoKGwgPT4ge1xuXHRcdGwuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XG5cdH0pO1xuXHRzdmcucXVlcnlTZWxlY3RvckFsbCgnY2lyY2xlLmF0dGFjaGVkJykuZm9yRWFjaChjID0+IHtcblx0XHRjLmNsYXNzTGlzdC5yZW1vdmUoJ2F0dGFjaGVkJyk7XG5cdH0pO1xufVxuZnVuY3Rpb24gc2hvd0RldGFpbHMoZCl7XG5cdGNsZWFyVGltZW91dCh0aW1lb3V0SGlkZSk7XG5cdHZhciBodG1sID0gYDxiPkZpc2hlcnk6IDwvYj4ke2QubmFtZX08YnIgLz48Yj5TcGVjaWVzPC9iPjogJHtkLnNwZWNpZXN9IHwgPGI+R2VhcjwvYj46ICR7ZC5nZWFyfSB8IDxiPkFyZWE8L2I+OiAke2QuYXJlYX0gfCA8Yj5OdW1iZXIgb2YgcGVybWl0czwvYj46ICR7ZC5jb3VudH1gO1xuXHR2YXIgZGV0YWlscyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNkZXRhaWwtZGl2Jyk7XG5cdGRldGFpbHMuc3R5bGUub3BhY2l0eSA9IDA7XG5cdHRpbWVvdXRTaG93ID0gc2V0VGltZW91dChmdW5jdGlvbigpe1xuXHRcdGRldGFpbHMuaW5uZXJIVE1MID0gaHRtbDtcblx0XHRkZXRhaWxzLnN0eWxlLm9wYWNpdHkgPSAxO1xuXHR9LDI1MCk7XG59XG5mdW5jdGlvbiBoaWRlRGV0YWlscygpe1xuXHRjbGVhclRpbWVvdXQodGltZW91dFNob3cpO1xuXHR2YXIgZGV0YWlscyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNkZXRhaWwtZGl2Jyk7XG5cdGRldGFpbHMuc3R5bGUub3BhY2l0eSA9IDA7XG5cdHRpbWVvdXRIaWRlID0gc2V0VGltZW91dChmdW5jdGlvbigpe1xuXHRcdGRldGFpbHMuaW5uZXJIVE1MID0gJzxlbT5TZWxlY3QgYSBmaXNoZXJ5IG9yIGN5Y2xlIHRocm91Z2ggZm9yIGRldGFpbHMuPC9lbT4nO1xuXHRcdGRldGFpbHMuc3R5bGUub3BhY2l0eSA9IDE7XG5cdH0sMjUwKTtcbn1cbmZ1bmN0aW9uIGRhdGFPdmVybGF5KCl7XG5cdHZhciBvdmVybGF5RGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5cdG92ZXJsYXlEaXYuaWQgPSAnb3ZlcmxheS1kaXYnO1xuXHR2YXIgZGV0YWlsV3JhcHBlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuXHRkZXRhaWxXcmFwcGVyLmlkID0gJ2RldGFpbC13cmFwcGVyJztcblx0dmFyIGRldGFpbHMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcblx0ZGV0YWlscy5pZCA9ICdkZXRhaWwtZGl2Jztcblx0ZGV0YWlscy5pbm5lckhUTUwgPSAnPGVtPlNlbGVjdCBhIGZpc2hlcnkgb3IgY3ljbGUgdGhyb3VnaCBmb3IgZGV0YWlscy48L2VtPic7XG5cdGRldGFpbFdyYXBwZXIuYXBwZW5kQ2hpbGQoZGV0YWlscyk7XG5cdG92ZXJsYXlEaXYuYXBwZW5kQ2hpbGQoZGV0YWlsV3JhcHBlcik7XG5cdHZhciBidG4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcblx0YnRuLmlubmVySFRNTCA9ICdOZXh0Jztcblx0YnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgY3ljbGVOZXh0KTtcblx0b3ZlcmxheURpdi5hcHBlbmRDaGlsZChidG4pO1xuXHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbWFwLWNvbnRhaW5lcicpLmFwcGVuZENoaWxkKG92ZXJsYXlEaXYpO1xufVxuXG5mdW5jdGlvbiBjeWNsZU5leHQoKXtcblx0Y3ljbGVJbmRleCsrO1xuXHRpZiAoIGN5Y2xlSW5kZXggPT09IG5vZGVzLmxlbmd0aCApIHtcblx0XHRjeWNsZUluZGV4ID0gMDtcblx0fVxuXHRhY3RpdmF0ZS5jYWxsKG5vZGVzW2N5Y2xlSW5kZXhdLCdidG4nKTtcbn1cblxuZnVuY3Rpb24gY2F0YWxvZ05vZGVzKCl7XG5cdG5vZGVzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnI2FsYXNrYS1tYXAgLm5vZGVzIGNpcmNsZScpO1xufSIsIi8qXG4gKiBjbGFzc0xpc3QuanM6IENyb3NzLWJyb3dzZXIgZnVsbCBlbGVtZW50LmNsYXNzTGlzdCBpbXBsZW1lbnRhdGlvbi5cbiAqIDEuMi4yMDE3MTIxMFxuICpcbiAqIEJ5IEVsaSBHcmV5LCBodHRwOi8vZWxpZ3JleS5jb21cbiAqIExpY2Vuc2U6IERlZGljYXRlZCB0byB0aGUgcHVibGljIGRvbWFpbi5cbiAqICAgU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9lbGlncmV5L2NsYXNzTGlzdC5qcy9ibG9iL21hc3Rlci9MSUNFTlNFLm1kXG4gKi9cblxuLypnbG9iYWwgc2VsZiwgZG9jdW1lbnQsIERPTUV4Y2VwdGlvbiAqL1xuXG4vKiEgQHNvdXJjZSBodHRwOi8vcHVybC5lbGlncmV5LmNvbS9naXRodWIvY2xhc3NMaXN0LmpzL2Jsb2IvbWFzdGVyL2NsYXNzTGlzdC5qcyAqL1xuXG5leHBvcnQgY29uc3QgQ2xhc3NMaXN0ID0gKGZ1bmN0aW9uKCl7XG5cblx0aWYgKFwiZG9jdW1lbnRcIiBpbiBzZWxmKSB7XG5cblx0Ly8gRnVsbCBwb2x5ZmlsbCBmb3IgYnJvd3NlcnMgd2l0aCBubyBjbGFzc0xpc3Qgc3VwcG9ydFxuXHQvLyBJbmNsdWRpbmcgSUUgPCBFZGdlIG1pc3NpbmcgU1ZHRWxlbWVudC5jbGFzc0xpc3Rcblx0aWYgKFxuXHRcdCAgICEoXCJjbGFzc0xpc3RcIiBpbiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiX1wiKSkgXG5cdFx0fHwgZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TXG5cdFx0JiYgIShcImNsYXNzTGlzdFwiIGluIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIsXCJnXCIpKVxuXHQpIHtcblxuXHQoZnVuY3Rpb24gKHZpZXcpIHtcblxuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRpZiAoISgnRWxlbWVudCcgaW4gdmlldykpIHJldHVybjtcblxuXHR2YXJcblx0XHQgIGNsYXNzTGlzdFByb3AgPSBcImNsYXNzTGlzdFwiXG5cdFx0LCBwcm90b1Byb3AgPSBcInByb3RvdHlwZVwiXG5cdFx0LCBlbGVtQ3RyUHJvdG8gPSB2aWV3LkVsZW1lbnRbcHJvdG9Qcm9wXVxuXHRcdCwgb2JqQ3RyID0gT2JqZWN0XG5cdFx0LCBzdHJUcmltID0gU3RyaW5nW3Byb3RvUHJvcF0udHJpbSB8fCBmdW5jdGlvbiAoKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5yZXBsYWNlKC9eXFxzK3xcXHMrJC9nLCBcIlwiKTtcblx0XHR9XG5cdFx0LCBhcnJJbmRleE9mID0gQXJyYXlbcHJvdG9Qcm9wXS5pbmRleE9mIHx8IGZ1bmN0aW9uIChpdGVtKSB7XG5cdFx0XHR2YXJcblx0XHRcdFx0ICBpID0gMFxuXHRcdFx0XHQsIGxlbiA9IHRoaXMubGVuZ3RoXG5cdFx0XHQ7XG5cdFx0XHRmb3IgKDsgaSA8IGxlbjsgaSsrKSB7XG5cdFx0XHRcdGlmIChpIGluIHRoaXMgJiYgdGhpc1tpXSA9PT0gaXRlbSkge1xuXHRcdFx0XHRcdHJldHVybiBpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gLTE7XG5cdFx0fVxuXHRcdC8vIFZlbmRvcnM6IHBsZWFzZSBhbGxvdyBjb250ZW50IGNvZGUgdG8gaW5zdGFudGlhdGUgRE9NRXhjZXB0aW9uc1xuXHRcdCwgRE9NRXggPSBmdW5jdGlvbiAodHlwZSwgbWVzc2FnZSkge1xuXHRcdFx0dGhpcy5uYW1lID0gdHlwZTtcblx0XHRcdHRoaXMuY29kZSA9IERPTUV4Y2VwdGlvblt0eXBlXTtcblx0XHRcdHRoaXMubWVzc2FnZSA9IG1lc3NhZ2U7XG5cdFx0fVxuXHRcdCwgY2hlY2tUb2tlbkFuZEdldEluZGV4ID0gZnVuY3Rpb24gKGNsYXNzTGlzdCwgdG9rZW4pIHtcblx0XHRcdGlmICh0b2tlbiA9PT0gXCJcIikge1xuXHRcdFx0XHR0aHJvdyBuZXcgRE9NRXgoXG5cdFx0XHRcdFx0ICBcIlNZTlRBWF9FUlJcIlxuXHRcdFx0XHRcdCwgXCJUaGUgdG9rZW4gbXVzdCBub3QgYmUgZW1wdHkuXCJcblx0XHRcdFx0KTtcblx0XHRcdH1cblx0XHRcdGlmICgvXFxzLy50ZXN0KHRva2VuKSkge1xuXHRcdFx0XHR0aHJvdyBuZXcgRE9NRXgoXG5cdFx0XHRcdFx0ICBcIklOVkFMSURfQ0hBUkFDVEVSX0VSUlwiXG5cdFx0XHRcdFx0LCBcIlRoZSB0b2tlbiBtdXN0IG5vdCBjb250YWluIHNwYWNlIGNoYXJhY3RlcnMuXCJcblx0XHRcdFx0KTtcblx0XHRcdH1cblx0XHRcdHJldHVybiBhcnJJbmRleE9mLmNhbGwoY2xhc3NMaXN0LCB0b2tlbik7XG5cdFx0fVxuXHRcdCwgQ2xhc3NMaXN0ID0gZnVuY3Rpb24gKGVsZW0pIHtcblx0XHRcdHZhclxuXHRcdFx0XHQgIHRyaW1tZWRDbGFzc2VzID0gc3RyVHJpbS5jYWxsKGVsZW0uZ2V0QXR0cmlidXRlKFwiY2xhc3NcIikgfHwgXCJcIilcblx0XHRcdFx0LCBjbGFzc2VzID0gdHJpbW1lZENsYXNzZXMgPyB0cmltbWVkQ2xhc3Nlcy5zcGxpdCgvXFxzKy8pIDogW11cblx0XHRcdFx0LCBpID0gMFxuXHRcdFx0XHQsIGxlbiA9IGNsYXNzZXMubGVuZ3RoXG5cdFx0XHQ7XG5cdFx0XHRmb3IgKDsgaSA8IGxlbjsgaSsrKSB7XG5cdFx0XHRcdHRoaXMucHVzaChjbGFzc2VzW2ldKTtcblx0XHRcdH1cblx0XHRcdHRoaXMuX3VwZGF0ZUNsYXNzTmFtZSA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0ZWxlbS5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLCB0aGlzLnRvU3RyaW5nKCkpO1xuXHRcdFx0fTtcblx0XHR9XG5cdFx0LCBjbGFzc0xpc3RQcm90byA9IENsYXNzTGlzdFtwcm90b1Byb3BdID0gW11cblx0XHQsIGNsYXNzTGlzdEdldHRlciA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdHJldHVybiBuZXcgQ2xhc3NMaXN0KHRoaXMpO1xuXHRcdH1cblx0O1xuXHQvLyBNb3N0IERPTUV4Y2VwdGlvbiBpbXBsZW1lbnRhdGlvbnMgZG9uJ3QgYWxsb3cgY2FsbGluZyBET01FeGNlcHRpb24ncyB0b1N0cmluZygpXG5cdC8vIG9uIG5vbi1ET01FeGNlcHRpb25zLiBFcnJvcidzIHRvU3RyaW5nKCkgaXMgc3VmZmljaWVudCBoZXJlLlxuXHRET01FeFtwcm90b1Byb3BdID0gRXJyb3JbcHJvdG9Qcm9wXTtcblx0Y2xhc3NMaXN0UHJvdG8uaXRlbSA9IGZ1bmN0aW9uIChpKSB7XG5cdFx0cmV0dXJuIHRoaXNbaV0gfHwgbnVsbDtcblx0fTtcblx0Y2xhc3NMaXN0UHJvdG8uY29udGFpbnMgPSBmdW5jdGlvbiAodG9rZW4pIHtcblx0XHRyZXR1cm4gfmNoZWNrVG9rZW5BbmRHZXRJbmRleCh0aGlzLCB0b2tlbiArIFwiXCIpO1xuXHR9O1xuXHRjbGFzc0xpc3RQcm90by5hZGQgPSBmdW5jdGlvbiAoKSB7XG5cdFx0dmFyXG5cdFx0XHQgIHRva2VucyA9IGFyZ3VtZW50c1xuXHRcdFx0LCBpID0gMFxuXHRcdFx0LCBsID0gdG9rZW5zLmxlbmd0aFxuXHRcdFx0LCB0b2tlblxuXHRcdFx0LCB1cGRhdGVkID0gZmFsc2Vcblx0XHQ7XG5cdFx0ZG8ge1xuXHRcdFx0dG9rZW4gPSB0b2tlbnNbaV0gKyBcIlwiO1xuXHRcdFx0aWYgKCF+Y2hlY2tUb2tlbkFuZEdldEluZGV4KHRoaXMsIHRva2VuKSkge1xuXHRcdFx0XHR0aGlzLnB1c2godG9rZW4pO1xuXHRcdFx0XHR1cGRhdGVkID0gdHJ1ZTtcblx0XHRcdH1cblx0XHR9XG5cdFx0d2hpbGUgKCsraSA8IGwpO1xuXG5cdFx0aWYgKHVwZGF0ZWQpIHtcblx0XHRcdHRoaXMuX3VwZGF0ZUNsYXNzTmFtZSgpO1xuXHRcdH1cblx0fTtcblx0Y2xhc3NMaXN0UHJvdG8ucmVtb3ZlID0gZnVuY3Rpb24gKCkge1xuXHRcdHZhclxuXHRcdFx0ICB0b2tlbnMgPSBhcmd1bWVudHNcblx0XHRcdCwgaSA9IDBcblx0XHRcdCwgbCA9IHRva2Vucy5sZW5ndGhcblx0XHRcdCwgdG9rZW5cblx0XHRcdCwgdXBkYXRlZCA9IGZhbHNlXG5cdFx0XHQsIGluZGV4XG5cdFx0O1xuXHRcdGRvIHtcblx0XHRcdHRva2VuID0gdG9rZW5zW2ldICsgXCJcIjtcblx0XHRcdGluZGV4ID0gY2hlY2tUb2tlbkFuZEdldEluZGV4KHRoaXMsIHRva2VuKTtcblx0XHRcdHdoaWxlICh+aW5kZXgpIHtcblx0XHRcdFx0dGhpcy5zcGxpY2UoaW5kZXgsIDEpO1xuXHRcdFx0XHR1cGRhdGVkID0gdHJ1ZTtcblx0XHRcdFx0aW5kZXggPSBjaGVja1Rva2VuQW5kR2V0SW5kZXgodGhpcywgdG9rZW4pO1xuXHRcdFx0fVxuXHRcdH1cblx0XHR3aGlsZSAoKytpIDwgbCk7XG5cblx0XHRpZiAodXBkYXRlZCkge1xuXHRcdFx0dGhpcy5fdXBkYXRlQ2xhc3NOYW1lKCk7XG5cdFx0fVxuXHR9O1xuXHRjbGFzc0xpc3RQcm90by50b2dnbGUgPSBmdW5jdGlvbiAodG9rZW4sIGZvcmNlKSB7XG5cdFx0dmFyXG5cdFx0XHQgIHJlc3VsdCA9IHRoaXMuY29udGFpbnModG9rZW4pXG5cdFx0XHQsIG1ldGhvZCA9IHJlc3VsdCA/XG5cdFx0XHRcdGZvcmNlICE9PSB0cnVlICYmIFwicmVtb3ZlXCJcblx0XHRcdDpcblx0XHRcdFx0Zm9yY2UgIT09IGZhbHNlICYmIFwiYWRkXCJcblx0XHQ7XG5cblx0XHRpZiAobWV0aG9kKSB7XG5cdFx0XHR0aGlzW21ldGhvZF0odG9rZW4pO1xuXHRcdH1cblxuXHRcdGlmIChmb3JjZSA9PT0gdHJ1ZSB8fCBmb3JjZSA9PT0gZmFsc2UpIHtcblx0XHRcdHJldHVybiBmb3JjZTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0cmV0dXJuICFyZXN1bHQ7XG5cdFx0fVxuXHR9O1xuXHRjbGFzc0xpc3RQcm90by5yZXBsYWNlID0gZnVuY3Rpb24gKHRva2VuLCByZXBsYWNlbWVudF90b2tlbikge1xuXHRcdHZhciBpbmRleCA9IGNoZWNrVG9rZW5BbmRHZXRJbmRleCh0b2tlbiArIFwiXCIpO1xuXHRcdGlmICh+aW5kZXgpIHtcblx0XHRcdHRoaXMuc3BsaWNlKGluZGV4LCAxLCByZXBsYWNlbWVudF90b2tlbik7XG5cdFx0XHR0aGlzLl91cGRhdGVDbGFzc05hbWUoKTtcblx0XHR9XG5cdH1cblx0Y2xhc3NMaXN0UHJvdG8udG9TdHJpbmcgPSBmdW5jdGlvbiAoKSB7XG5cdFx0cmV0dXJuIHRoaXMuam9pbihcIiBcIik7XG5cdH07XG5cblx0aWYgKG9iakN0ci5kZWZpbmVQcm9wZXJ0eSkge1xuXHRcdHZhciBjbGFzc0xpc3RQcm9wRGVzYyA9IHtcblx0XHRcdCAgZ2V0OiBjbGFzc0xpc3RHZXR0ZXJcblx0XHRcdCwgZW51bWVyYWJsZTogdHJ1ZVxuXHRcdFx0LCBjb25maWd1cmFibGU6IHRydWVcblx0XHR9O1xuXHRcdHRyeSB7XG5cdFx0XHRvYmpDdHIuZGVmaW5lUHJvcGVydHkoZWxlbUN0clByb3RvLCBjbGFzc0xpc3RQcm9wLCBjbGFzc0xpc3RQcm9wRGVzYyk7XG5cdFx0fSBjYXRjaCAoZXgpIHsgLy8gSUUgOCBkb2Vzbid0IHN1cHBvcnQgZW51bWVyYWJsZTp0cnVlXG5cdFx0XHQvLyBhZGRpbmcgdW5kZWZpbmVkIHRvIGZpZ2h0IHRoaXMgaXNzdWUgaHR0cHM6Ly9naXRodWIuY29tL2VsaWdyZXkvY2xhc3NMaXN0LmpzL2lzc3Vlcy8zNlxuXHRcdFx0Ly8gbW9kZXJuaWUgSUU4LU1TVzcgbWFjaGluZSBoYXMgSUU4IDguMC42MDAxLjE4NzAyIGFuZCBpcyBhZmZlY3RlZFxuXHRcdFx0aWYgKGV4Lm51bWJlciA9PT0gdW5kZWZpbmVkIHx8IGV4Lm51bWJlciA9PT0gLTB4N0ZGNUVDNTQpIHtcblx0XHRcdFx0Y2xhc3NMaXN0UHJvcERlc2MuZW51bWVyYWJsZSA9IGZhbHNlO1xuXHRcdFx0XHRvYmpDdHIuZGVmaW5lUHJvcGVydHkoZWxlbUN0clByb3RvLCBjbGFzc0xpc3RQcm9wLCBjbGFzc0xpc3RQcm9wRGVzYyk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9IGVsc2UgaWYgKG9iakN0cltwcm90b1Byb3BdLl9fZGVmaW5lR2V0dGVyX18pIHtcblx0XHRlbGVtQ3RyUHJvdG8uX19kZWZpbmVHZXR0ZXJfXyhjbGFzc0xpc3RQcm9wLCBjbGFzc0xpc3RHZXR0ZXIpO1xuXHR9XG5cblx0fShzZWxmKSk7XG5cblx0fVxuXG5cdC8vIFRoZXJlIGlzIGZ1bGwgb3IgcGFydGlhbCBuYXRpdmUgY2xhc3NMaXN0IHN1cHBvcnQsIHNvIGp1c3QgY2hlY2sgaWYgd2UgbmVlZFxuXHQvLyB0byBub3JtYWxpemUgdGhlIGFkZC9yZW1vdmUgYW5kIHRvZ2dsZSBBUElzLlxuXG5cdChmdW5jdGlvbiAoKSB7XG5cdFx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0XHR2YXIgdGVzdEVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiX1wiKTtcblxuXHRcdHRlc3RFbGVtZW50LmNsYXNzTGlzdC5hZGQoXCJjMVwiLCBcImMyXCIpO1xuXG5cdFx0Ly8gUG9seWZpbGwgZm9yIElFIDEwLzExIGFuZCBGaXJlZm94IDwyNiwgd2hlcmUgY2xhc3NMaXN0LmFkZCBhbmRcblx0XHQvLyBjbGFzc0xpc3QucmVtb3ZlIGV4aXN0IGJ1dCBzdXBwb3J0IG9ubHkgb25lIGFyZ3VtZW50IGF0IGEgdGltZS5cblx0XHRpZiAoIXRlc3RFbGVtZW50LmNsYXNzTGlzdC5jb250YWlucyhcImMyXCIpKSB7XG5cdFx0XHR2YXIgY3JlYXRlTWV0aG9kID0gZnVuY3Rpb24obWV0aG9kKSB7XG5cdFx0XHRcdHZhciBvcmlnaW5hbCA9IERPTVRva2VuTGlzdC5wcm90b3R5cGVbbWV0aG9kXTtcblxuXHRcdFx0XHRET01Ub2tlbkxpc3QucHJvdG90eXBlW21ldGhvZF0gPSBmdW5jdGlvbih0b2tlbikge1xuXHRcdFx0XHRcdHZhciBpLCBsZW4gPSBhcmd1bWVudHMubGVuZ3RoO1xuXG5cdFx0XHRcdFx0Zm9yIChpID0gMDsgaSA8IGxlbjsgaSsrKSB7XG5cdFx0XHRcdFx0XHR0b2tlbiA9IGFyZ3VtZW50c1tpXTtcblx0XHRcdFx0XHRcdG9yaWdpbmFsLmNhbGwodGhpcywgdG9rZW4pO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fTtcblx0XHRcdH07XG5cdFx0XHRjcmVhdGVNZXRob2QoJ2FkZCcpO1xuXHRcdFx0Y3JlYXRlTWV0aG9kKCdyZW1vdmUnKTtcblx0XHR9XG5cblx0XHR0ZXN0RWxlbWVudC5jbGFzc0xpc3QudG9nZ2xlKFwiYzNcIiwgZmFsc2UpO1xuXG5cdFx0Ly8gUG9seWZpbGwgZm9yIElFIDEwIGFuZCBGaXJlZm94IDwyNCwgd2hlcmUgY2xhc3NMaXN0LnRvZ2dsZSBkb2VzIG5vdFxuXHRcdC8vIHN1cHBvcnQgdGhlIHNlY29uZCBhcmd1bWVudC5cblx0XHRpZiAodGVzdEVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKFwiYzNcIikpIHtcblx0XHRcdHZhciBfdG9nZ2xlID0gRE9NVG9rZW5MaXN0LnByb3RvdHlwZS50b2dnbGU7XG5cblx0XHRcdERPTVRva2VuTGlzdC5wcm90b3R5cGUudG9nZ2xlID0gZnVuY3Rpb24odG9rZW4sIGZvcmNlKSB7XG5cdFx0XHRcdGlmICgxIGluIGFyZ3VtZW50cyAmJiAhdGhpcy5jb250YWlucyh0b2tlbikgPT09ICFmb3JjZSkge1xuXHRcdFx0XHRcdHJldHVybiBmb3JjZTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRyZXR1cm4gX3RvZ2dsZS5jYWxsKHRoaXMsIHRva2VuKTtcblx0XHRcdFx0fVxuXHRcdFx0fTtcblxuXHRcdH1cblxuXHRcdC8vIHJlcGxhY2UoKSBwb2x5ZmlsbFxuXHRcdGlmICghKFwicmVwbGFjZVwiIGluIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJfXCIpLmNsYXNzTGlzdCkpIHtcblx0XHRcdERPTVRva2VuTGlzdC5wcm90b3R5cGUucmVwbGFjZSA9IGZ1bmN0aW9uICh0b2tlbiwgcmVwbGFjZW1lbnRfdG9rZW4pIHtcblx0XHRcdFx0dmFyXG5cdFx0XHRcdFx0ICB0b2tlbnMgPSB0aGlzLnRvU3RyaW5nKCkuc3BsaXQoXCIgXCIpXG5cdFx0XHRcdFx0LCBpbmRleCA9IHRva2Vucy5pbmRleE9mKHRva2VuICsgXCJcIilcblx0XHRcdFx0O1xuXHRcdFx0XHRpZiAofmluZGV4KSB7XG5cdFx0XHRcdFx0dG9rZW5zID0gdG9rZW5zLnNsaWNlKGluZGV4KTtcblx0XHRcdFx0XHR0aGlzLnJlbW92ZS5hcHBseSh0aGlzLCB0b2tlbnMpO1xuXHRcdFx0XHRcdHRoaXMuYWRkKHJlcGxhY2VtZW50X3Rva2VuKTtcblx0XHRcdFx0XHR0aGlzLmFkZC5hcHBseSh0aGlzLCB0b2tlbnMuc2xpY2UoMSkpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0dGVzdEVsZW1lbnQgPSBudWxsO1xuXHR9KCkpO1xuXG5cdH1cbn0pKCk7XG4iLCIvLyBmb3JFYWNoIHBvbHlmaWxsXG4vLyBQcm9kdWN0aW9uIHN0ZXBzIG9mIEVDTUEtMjYyLCBFZGl0aW9uIDUsIDE1LjQuNC4xOFxuLy8gUmVmZXJlbmNlOiBodHRwOi8vZXM1LmdpdGh1Yi5pby8jeDE1LjQuNC4xOFxuZXhwb3J0IGNvbnN0IEZvckVhY2ggPSAoZnVuY3Rpb24oKXtcbiAgaWYgKCFBcnJheS5wcm90b3R5cGUuZm9yRWFjaCkge1xuXG4gICAgQXJyYXkucHJvdG90eXBlLmZvckVhY2ggPSBmdW5jdGlvbihjYWxsYmFjay8qLCB0aGlzQXJnKi8pIHtcblxuICAgICAgdmFyIFQsIGs7XG5cbiAgICAgIGlmICh0aGlzID09IG51bGwpIHtcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcigndGhpcyBpcyBudWxsIG9yIG5vdCBkZWZpbmVkJyk7XG4gICAgICB9XG5cbiAgICAgIC8vIDEuIExldCBPIGJlIHRoZSByZXN1bHQgb2YgY2FsbGluZyB0b09iamVjdCgpIHBhc3NpbmcgdGhlXG4gICAgICAvLyB8dGhpc3wgdmFsdWUgYXMgdGhlIGFyZ3VtZW50LlxuICAgICAgdmFyIE8gPSBPYmplY3QodGhpcyk7XG5cbiAgICAgIC8vIDIuIExldCBsZW5WYWx1ZSBiZSB0aGUgcmVzdWx0IG9mIGNhbGxpbmcgdGhlIEdldCgpIGludGVybmFsXG4gICAgICAvLyBtZXRob2Qgb2YgTyB3aXRoIHRoZSBhcmd1bWVudCBcImxlbmd0aFwiLlxuICAgICAgLy8gMy4gTGV0IGxlbiBiZSB0b1VpbnQzMihsZW5WYWx1ZSkuXG4gICAgICB2YXIgbGVuID0gTy5sZW5ndGggPj4+IDA7XG5cbiAgICAgIC8vIDQuIElmIGlzQ2FsbGFibGUoY2FsbGJhY2spIGlzIGZhbHNlLCB0aHJvdyBhIFR5cGVFcnJvciBleGNlcHRpb24uIFxuICAgICAgLy8gU2VlOiBodHRwOi8vZXM1LmdpdGh1Yi5jb20vI3g5LjExXG4gICAgICBpZiAodHlwZW9mIGNhbGxiYWNrICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoY2FsbGJhY2sgKyAnIGlzIG5vdCBhIGZ1bmN0aW9uJyk7XG4gICAgICB9XG5cbiAgICAgIC8vIDUuIElmIHRoaXNBcmcgd2FzIHN1cHBsaWVkLCBsZXQgVCBiZSB0aGlzQXJnOyBlbHNlIGxldFxuICAgICAgLy8gVCBiZSB1bmRlZmluZWQuXG4gICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgVCA9IGFyZ3VtZW50c1sxXTtcbiAgICAgIH1cblxuICAgICAgLy8gNi4gTGV0IGsgYmUgMC5cbiAgICAgIGsgPSAwO1xuXG4gICAgICAvLyA3LiBSZXBlYXQgd2hpbGUgayA8IGxlbi5cbiAgICAgIHdoaWxlIChrIDwgbGVuKSB7XG5cbiAgICAgICAgdmFyIGtWYWx1ZTtcblxuICAgICAgICAvLyBhLiBMZXQgUGsgYmUgVG9TdHJpbmcoaykuXG4gICAgICAgIC8vICAgIFRoaXMgaXMgaW1wbGljaXQgZm9yIExIUyBvcGVyYW5kcyBvZiB0aGUgaW4gb3BlcmF0b3IuXG4gICAgICAgIC8vIGIuIExldCBrUHJlc2VudCBiZSB0aGUgcmVzdWx0IG9mIGNhbGxpbmcgdGhlIEhhc1Byb3BlcnR5XG4gICAgICAgIC8vICAgIGludGVybmFsIG1ldGhvZCBvZiBPIHdpdGggYXJndW1lbnQgUGsuXG4gICAgICAgIC8vICAgIFRoaXMgc3RlcCBjYW4gYmUgY29tYmluZWQgd2l0aCBjLlxuICAgICAgICAvLyBjLiBJZiBrUHJlc2VudCBpcyB0cnVlLCB0aGVuXG4gICAgICAgIGlmIChrIGluIE8pIHtcblxuICAgICAgICAgIC8vIGkuIExldCBrVmFsdWUgYmUgdGhlIHJlc3VsdCBvZiBjYWxsaW5nIHRoZSBHZXQgaW50ZXJuYWxcbiAgICAgICAgICAvLyBtZXRob2Qgb2YgTyB3aXRoIGFyZ3VtZW50IFBrLlxuICAgICAgICAgIGtWYWx1ZSA9IE9ba107XG5cbiAgICAgICAgICAvLyBpaS4gQ2FsbCB0aGUgQ2FsbCBpbnRlcm5hbCBtZXRob2Qgb2YgY2FsbGJhY2sgd2l0aCBUIGFzXG4gICAgICAgICAgLy8gdGhlIHRoaXMgdmFsdWUgYW5kIGFyZ3VtZW50IGxpc3QgY29udGFpbmluZyBrVmFsdWUsIGssIGFuZCBPLlxuICAgICAgICAgIGNhbGxiYWNrLmNhbGwoVCwga1ZhbHVlLCBrLCBPKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBkLiBJbmNyZWFzZSBrIGJ5IDEuXG4gICAgICAgIGsrKztcbiAgICAgIH1cbiAgICAgIC8vIDguIHJldHVybiB1bmRlZmluZWQuXG4gICAgfTtcbiAgfVxufSkoKTtcbiIsImV4cG9ydCBjb25zdCBOb2RlTGlzdEZvckVhY2ggPSAoZnVuY3Rpb24oKXtcblx0aWYgKHdpbmRvdy5Ob2RlTGlzdCAmJiAhTm9kZUxpc3QucHJvdG90eXBlLmZvckVhY2gpIHtcblx0ICAgIE5vZGVMaXN0LnByb3RvdHlwZS5mb3JFYWNoID0gZnVuY3Rpb24gKGNhbGxiYWNrLCB0aGlzQXJnKSB7XG5cdCAgICAgICAgdGhpc0FyZyA9IHRoaXNBcmcgfHwgd2luZG93O1xuXHQgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5sZW5ndGg7IGkrKykge1xuXHQgICAgICAgICAgICBjYWxsYmFjay5jYWxsKHRoaXNBcmcsIHRoaXNbaV0sIGksIHRoaXMpO1xuXHQgICAgICAgIH1cblx0ICAgIH07XG5cdH1cbn0pKCk7Il19
