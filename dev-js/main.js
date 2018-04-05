(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

var _polyfills = require("../js-exports/polyfills");

(function () {
  "use strict";

  /*var species = {
    B: "Halibut",
    C: "Sablefish",
    D: "Dungeness crab",
    E: "Hair Crab",
    F: "Freshwater fish",
    G: "Herring roe",
    H: "Herring (food/bait)",
    I: "Ling cod",
    J: "Geoduck clams",
    K: "King crab",
    L: "Herring spawn on kelp",
    M: "Misc. saltwater finfish",
    N: "Snails",
    O: "Octopus/squid",
    P: "Shrimp",
    Q: "Sea cucumber",
    R: "Clams",
    S: "Salmon",
    T: "Tanner crab",
    TB: "Tanner Bairdi crab",
    U: "Sea urchin",
    W: "Scallops",
    Y: "Rockfish"
  };
   var gear = {"1":"PURSE SEINE","2":"VESSEL TO 80'","4":"SET GILLNET","5":"HAND TROLL","6":"LONGLINE VESSEL UNDER 60'","7":"OTTER TRAWL","8":"FISH WHEEL","9":"POT GEAR VESSEL UNDER 60'","10":"RING NET","11":"DIVING GEAR","12":"DIVE/HAND PICK","17":"BEAM TRAWL","18":"SHOVEL","21":"POUND","23":"MECHANICAL DIGGER","25":"DINGLEBAR TROLL","26":"MECHANICAL JIG","34":"GILLNET","37":"PAIR TRAWL","61":"LONGLINE VESSEL 60' OR OVER","77":"GILLNET","91":"POT GEAR VESSEL 60' OR OVER"};
   var regions = {"A":"SOUTHEAST","B":"STATEWIDE","D":"YAKUTAT","E":"PRINCE WILLIAM SOUND","J":"WESTWARD","L":"CHIGNIK","M":"ALASKA PENINSULA","Q":"BERING SEA","T":"BRISTOL BAY","X":"KOTZEBUE","H":"COOK INLET","S":"SECURITY COVE","V":"CAPE AVINOF","Z":"NORTON SOUND","K":"KODIAK","O":"DUTCH HARBOR","OA":"ALEUTIAN CDQAPICDA","OB":"ALEUTIAN CDQBBEDC","OC":"ALEUTIAN CDQCBSFA","OD":"ALEUTIAN CDQCVRF","OE":"ALEUTIAN CDQNSEDC","OF":"ALEUTIAN CDQYDFDA","OG":"ALEUTIAN ISLANDS ACAACDC","QA":"BERING SEA CDQAPICDA","QB":"BERING SEA CDQBBEDC","QC":"BERING SEA CDQCBSFA","QD":"BERING SEA CDQCVRF","QE":"BERING SEA CDQNSEDC","QF":"BERING SEA CDQYDFDA","TA":"BRISTOL BAY CDQAPICDA","TB":"BRISTOL BAY CDQBBEDC","TC":"BRISTOL BAY CDQCBSFA","TD":"BRISTOL BAY CDQCVRF","TE":"BRISTOL BAY CDQNSEDC","TF":"BRISTOL BAY CDQYDFDA","ZE":"NORTON SOUND CDQNSEDC","ZF":"NORTON SOUND CDQYDFDA","G":"GOA","AB":"STATEWIDE","AG":"GOA","BB":"STATEWIDE","BG":"GOA","FB":"STATEWIDE","FG":"GOA","GB":"STATEWIDE","GG":"GOA","HB":"STATEWIDE","HG":"GOA","IB":"STATEWIDE","IG":"GOA","F":"ATKA/AMLIA ISLANDS","R":"ADAK","AFW":"FEDERAL WATERS","ASW":"STATE WATERS","BFW":"FEDERAL WATERS","BSW":"STATE WATERS"};
  */

  var fishNodes = null,
      fishLinks = null,
      margin = { // expressed as percentages
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  },
      width = 100 - margin.right - margin.left,
      height = 100 - margin.top - margin.bottom;

  var color = d3.scaleOrdinal(d3.schemeCategory20);

  var rScale = d3.scaleLog().range([0.3, 3]);
  var strengthScale = d3.scaleLinear().range([1, 5]);
  var simulation = d3.forceSimulation().velocityDecay([0.5]).force("link", d3.forceLink()).force("charge", d3.forceManyBody().strength(-1)).force("center", d3.forceCenter(width / 2, height / 2)).force("collide", d3.forceCollide().radius(function (d) {
    return rScale(d.count);
  }).iterations(2));

  d3.csv('matrix-headers.csv', function (data) {
    console.log(data);
    fishLinks = data;
    goGate();
  });
  d3.csv('fisheries-nodes.csv', function (data) {
    console.log(data);
    data.forEach(function (each) {
      for (var key in each) {
        if (each.hasOwnProperty(key)) {
          if (!isNaN(+each[key])) {
            each[key] = +each[key];
          }
        }
      }
    });
    fishNodes = data;
    goGate();
  });

  function goGate() {
    if (fishNodes !== null && fishLinks !== null) {
      go();
    } else {
      return;
    }
  }

  var newLinks = [],
      network = {};

  function go() {
    function isMatch(key) {
      return fishNodes.find(function (obj) {
        return obj.id === key;
      });
    }
    fishLinks.forEach(function (each, i) {
      for (var key in each) {
        if (each.hasOwnProperty(key)) {
          var match = isMatch(key);
          var index = fishNodes.indexOf(match);
          if (index !== i && each[key] !== "0") {
            // if source and target are not the same
            newLinks.push({
              source: i,
              target: index,
              value: +each[key]
            });
          }
        }
      }
    }); // end forEach
    network.nodes = fishNodes;
    network.links = newLinks;
    console.log(network);
    render(network);
  } // end go()

  function render(network) {
    /* if (true){
       return;
     }*/

    rScale.domain(d3.extent(network.nodes, function (d) {
      return d.count;
    }));
    strengthScale.domain([1, d3.mean(network.links, function (d) {
      return d.value;
    }) + d3.deviation(network.links, function (d) {
      return d.value;
    }) * 2]);

    var radius = 2;
    function count(node) {
      var i = 0;
      network.links.forEach(function (link) {
        if (link.source === node || link.target === node) {
          i++;
        }
      });
      return i;
    }
    simulation.nodes(network.nodes).on("tick", ticked);

    simulation.force("link").links(network.links).strength(function (d) {
      //  console.log(d);
      return d.target.cluster === d.source.cluster ? 1 / Math.min(count(d.source), count(d.target)) : 1 / Math.min(count(d.source), count(d.target)) / 10; // reporoduce the default value for links that meet the criteria
    });
    var svg = d3.select('body').append('svg').attr('width', '100%').attr('xmlns', 'http://www.w3.org/2000/svg').attr('version', '1.1').attr('viewBox', '0 0 100 100').append('g').attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    var link = svg.append("g").attr("class", "links").selectAll("line").data(network.links).enter().append("line").attr('stroke', function (d) {

      return d.source.cluster === d.target.cluster ? color(d.target.cluster) : '#999';
    }).attr("stroke-width", function (d) {
      return d.value > 9 || d.source.cluster === d.target.cluster ? Math.sqrt(d.value) / 20 : 0;
    });

    var node = svg.append("g").attr("class", "nodes").selectAll("circle").data(network.nodes).enter().append("circle").attr("r", function (d) {
      return rScale(d.count);
    }).attr("fill", function (d) {
      return color(d.cluster);
    }).call(d3.drag().on("start", dragstarted).on("drag", dragged).on("end", dragended));

    node.append("title").text(function (d) {
      return d.id;
    });

    function ticked() {
      link.attr("x1", function (d) {
        return d.source.x;
      }).attr("y1", function (d) {
        return d.source.y;
      }).attr("x2", function (d) {
        return d.target.x;
      }).attr("y2", function (d) {
        return d.target.y;
      });

      node.attr("cx", function (d) {
        d.x = Math.max(radius, Math.min(width - radius, d.x));
        return d.x;
      }).attr("cy", function (d) {
        d.y = Math.max(radius, Math.min(height - radius, d.y));
        return d.y;
      });
    }
  } // end render()
  function dragstarted(d) {
    if (!d3.event.active) {
      simulation.alphaTarget(0.3).restart();
    }
    d.fx = d.x;
    d.fy = d.y;
  }

  function dragged(d) {
    d.fx = d3.event.x;
    d.fy = d3.event.y;
  }

  function dragended(d) {
    if (!d3.event.active) {
      simulation.alphaTarget(0);
    }
    d.fx = null;
    d.fy = null;
  }
})(); /* exported arrayFind */

},{"../js-exports/polyfills":2}],2:[function(require,module,exports){
(function (global){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/**
 * SVG focus 
 * Copyright(c) 2017, John Osterman
 *
 * MIT License
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and 
 * associated documentation files (the "Software"), to deal in the Software without restriction, including 
 * without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell 
 * copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the 
 * following conditions:

 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT 
 * LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO 
 * EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER 
 * IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE 
 * USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

// IE/Edge (perhaps others) does not allow programmatic focusing of SVG Elements (via `focus()`). Same for `blur()`.

var SVGFocus = exports.SVGFocus = function () {
  if ('focus' in SVGElement.prototype === false) {
    SVGElement.prototype.focus = HTMLElement.prototype.focus;
  }
  if ('blur' in SVGElement.prototype === false) {
    SVGElement.prototype.blur = HTMLElement.prototype.blur;
  }
}();

/**
 * innerHTML property for SVGElement
 * Copyright(c) 2010, Jeff Schiller
 *
 * Licensed under the Apache License, Version 2
 *
 * Works in a SVG document in Chrome 6+, Safari 5+, Firefox 4+ and IE9+.
 * Works in a HTML5 document in Chrome 7+, Firefox 4+ and IE9+.
 * Does not work in Opera since it doesn't support the SVGElement interface yet.
 *
 * I haven't decided on the best name for this property - thus the duplication.
 */
// edited by John Osterman to declare the variable `sXML`, which was referenced without being declared
// which failed silently in implicit strict mode of an export

// most browsers allow setting innerHTML of svg elements but IE does not (not an HTML element)
// this polyfill provides that. necessary for d3 method `.html()` on svg elements

var SVGInnerHTML = exports.SVGInnerHTML = function () {
  var serializeXML = function serializeXML(node, output) {
    var nodeType = node.nodeType;
    if (nodeType == 3) {
      // TEXT nodes.
      // Replace special XML characters with their entities.
      output.push(node.textContent.replace(/&/, '&amp;').replace(/</, '&lt;').replace('>', '&gt;'));
    } else if (nodeType == 1) {
      // ELEMENT nodes.
      // Serialize Element nodes.
      output.push('<', node.tagName);
      if (node.hasAttributes()) {
        var attrMap = node.attributes;
        for (var i = 0, len = attrMap.length; i < len; ++i) {
          var attrNode = attrMap.item(i);
          output.push(' ', attrNode.name, '=\'', attrNode.value, '\'');
        }
      }
      if (node.hasChildNodes()) {
        output.push('>');
        var childNodes = node.childNodes;
        for (var i = 0, len = childNodes.length; i < len; ++i) {
          serializeXML(childNodes.item(i), output);
        }
        output.push('</', node.tagName, '>');
      } else {
        output.push('/>');
      }
    } else if (nodeType == 8) {
      // TODO(codedread): Replace special characters with XML entities?
      output.push('<!--', node.nodeValue, '-->');
    } else {
      // TODO: Handle CDATA nodes.
      // TODO: Handle ENTITY nodes.
      // TODO: Handle DOCUMENT nodes.
      throw 'Error serializing XML. Unhandled node of type: ' + nodeType;
    }
  };
  // The innerHTML DOM property for SVGElement.
  if ('innerHTML' in SVGElement.prototype === false) {
    Object.defineProperty(SVGElement.prototype, 'innerHTML', {
      get: function get() {
        var output = [];
        var childNode = this.firstChild;
        while (childNode) {
          serializeXML(childNode, output);
          childNode = childNode.nextSibling;
        }
        return output.join('');
      },
      set: function set(markupText) {
        console.log(this);
        // Wipe out the current contents of the element.
        while (this.firstChild) {
          this.removeChild(this.firstChild);
        }

        try {
          // Parse the markup into valid nodes.
          var dXML = new DOMParser();
          dXML.async = false;
          // Wrap the markup into a SVG node to ensure parsing works.
          console.log(markupText);
          var sXML = '<svg xmlns="http://www.w3.org/2000/svg">' + markupText + '</svg>';
          console.log(sXML);
          var svgDocElement = dXML.parseFromString(sXML, 'text/xml').documentElement;

          // Now take each node, import it and append to this element.
          var childNode = svgDocElement.firstChild;
          while (childNode) {
            this.appendChild(this.ownerDocument.importNode(childNode, true));
            childNode = childNode.nextSibling;
          }
        } catch (e) {
          throw new Error('Error parsing XML string');
        };
      }
    });

    // The innerSVG DOM property for SVGElement.
    Object.defineProperty(SVGElement.prototype, 'innerSVG', {
      get: function get() {
        return this.innerHTML;
      },
      set: function set(markupText) {
        this.innerHTML = markupText;
      }
    });
  }
}();

// https://tc39.github.io/ecma262/#sec-array.prototype.find
var arrayFind = exports.arrayFind = function () {
  if (!Array.prototype.find) {
    Object.defineProperty(Array.prototype, 'find', {
      value: function value(predicate) {
        // 1. Let O be ? ToObject(this value).
        if (this == null) {
          throw new TypeError('"this" is null or not defined');
        }

        var o = Object(this);

        // 2. Let len be ? ToLength(? Get(O, "length")).
        var len = o.length >>> 0;

        // 3. If IsCallable(predicate) is false, throw a TypeError exception.
        if (typeof predicate !== 'function') {
          throw new TypeError('predicate must be a function');
        }

        // 4. If thisArg was supplied, let T be thisArg; else let T be undefined.
        var thisArg = arguments[1];

        // 5. Let k be 0.
        var k = 0;

        // 6. Repeat, while k < len
        while (k < len) {
          // a. Let Pk be ! ToString(k).
          // b. Let kValue be ? Get(O, Pk).
          // c. Let testResult be ToBoolean(? Call(predicate, T, « kValue, k, O »)).
          // d. If testResult is true, return kValue.
          var kValue = o[k];
          if (predicate.call(thisArg, kValue, k, o)) {
            return kValue;
          }
          // e. Increase k by 1.
          k++;
        }

        // 7. Return undefined.
        return undefined;
      }
    });
  }
}();

// Copyright (C) 2011-2012 Software Languages Lab, Vrije Universiteit Brussel
// This code is dual-licensed under both the Apache License and the MPL

// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/* Version: MPL 1.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Original Code is a shim for the ES-Harmony reflection module
 *
 * The Initial Developer of the Original Code is
 * Tom Van Cutsem, Vrije Universiteit Brussel.
 * Portions created by the Initial Developer are Copyright (C) 2011-2012
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *
 */

// ----------------------------------------------------------------------------

// This file is a polyfill for the upcoming ECMAScript Reflect API,
// including support for Proxies. See the draft specification at:
// http://wiki.ecmascript.org/doku.php?id=harmony:reflect_api
// http://wiki.ecmascript.org/doku.php?id=harmony:direct_proxies

// For an implementation of the Handler API, see handlers.js, which implements:
// http://wiki.ecmascript.org/doku.php?id=harmony:virtual_object_api

// This implementation supersedes the earlier polyfill at:
// code.google.com/p/es-lab/source/browse/trunk/src/proxies/DirectProxies.js

// This code was tested on tracemonkey / Firefox 12
//  (and should run fine on older Firefox versions starting with FF4)
// The code also works correctly on
//   v8 --harmony_proxies --harmony_weakmaps (v3.6.5.1)

// Language Dependencies:
//  - ECMAScript 5/strict
//  - "old" (i.e. non-direct) Harmony Proxies
//  - Harmony WeakMaps
// Patches:
//  - Object.{freeze,seal,preventExtensions}
//  - Object.{isFrozen,isSealed,isExtensible}
//  - Object.getPrototypeOf
//  - Object.keys
//  - Object.prototype.valueOf
//  - Object.prototype.isPrototypeOf
//  - Object.prototype.toString
//  - Object.prototype.hasOwnProperty
//  - Object.getOwnPropertyDescriptor
//  - Object.defineProperty
//  - Object.defineProperties
//  - Object.getOwnPropertyNames
//  - Object.getOwnPropertySymbols
//  - Object.getPrototypeOf
//  - Object.setPrototypeOf
//  - Object.assign
//  - Function.prototype.toString
//  - Date.prototype.toString
//  - Array.isArray
//  - Array.prototype.concat
//  - Proxy
// Adds new globals:
//  - Reflect

// Direct proxies can be created via Proxy(target, handler)

// ----------------------------------------------------------------------------

var reflect = exports.reflect = function (global) {
  // function-as-module pattern
  "use strict";

  // === Direct Proxies: Invariant Enforcement ===

  // Direct proxies build on non-direct proxies by automatically wrapping
  // all user-defined proxy handlers in a Validator handler that checks and
  // enforces ES5 invariants.

  // A direct proxy is a proxy for an existing object called the target object.

  // A Validator handler is a wrapper for a target proxy handler H.
  // The Validator forwards all operations to H, but additionally
  // performs a number of integrity checks on the results of some traps,
  // to make sure H does not violate the ES5 invariants w.r.t. non-configurable
  // properties and non-extensible, sealed or frozen objects.

  // For each property that H exposes as own, non-configurable
  // (e.g. by returning a descriptor from a call to getOwnPropertyDescriptor)
  // the Validator handler defines those properties on the target object.
  // When the proxy becomes non-extensible, also configurable own properties
  // are checked against the target.
  // We will call properties that are defined on the target object
  // "fixed properties".

  // We will name fixed non-configurable properties "sealed properties".
  // We will name fixed non-configurable non-writable properties "frozen
  // properties".

  // The Validator handler upholds the following invariants w.r.t. non-configurability:
  // - getOwnPropertyDescriptor cannot report sealed properties as non-existent
  // - getOwnPropertyDescriptor cannot report incompatible changes to the
  //   attributes of a sealed property (e.g. reporting a non-configurable
  //   property as configurable, or reporting a non-configurable, non-writable
  //   property as writable)
  // - getPropertyDescriptor cannot report sealed properties as non-existent
  // - getPropertyDescriptor cannot report incompatible changes to the
  //   attributes of a sealed property. It _can_ report incompatible changes
  //   to the attributes of non-own, inherited properties.
  // - defineProperty cannot make incompatible changes to the attributes of
  //   sealed properties
  // - deleteProperty cannot report a successful deletion of a sealed property
  // - hasOwn cannot report a sealed property as non-existent
  // - has cannot report a sealed property as non-existent
  // - get cannot report inconsistent values for frozen data
  //   properties, and must report undefined for sealed accessors with an
  //   undefined getter
  // - set cannot report a successful assignment for frozen data
  //   properties or sealed accessors with an undefined setter.
  // - get{Own}PropertyNames lists all sealed properties of the target.
  // - keys lists all enumerable sealed properties of the target.
  // - enumerate lists all enumerable sealed properties of the target.
  // - if a property of a non-extensible proxy is reported as non-existent,
  //   then it must forever be reported as non-existent. This applies to
  //   own and inherited properties and is enforced in the
  //   deleteProperty, get{Own}PropertyDescriptor, has{Own},
  //   get{Own}PropertyNames, keys and enumerate traps

  // Violation of any of these invariants by H will result in TypeError being
  // thrown.

  // Additionally, once Object.preventExtensions, Object.seal or Object.freeze
  // is invoked on the proxy, the set of own property names for the proxy is
  // fixed. Any property name that is not fixed is called a 'new' property.

  // The Validator upholds the following invariants regarding extensibility:
  // - getOwnPropertyDescriptor cannot report new properties as existent
  //   (it must report them as non-existent by returning undefined)
  // - defineProperty cannot successfully add a new property (it must reject)
  // - getOwnPropertyNames cannot list new properties
  // - hasOwn cannot report true for new properties (it must report false)
  // - keys cannot list new properties

  // Invariants currently not enforced:
  // - getOwnPropertyNames lists only own property names
  // - keys lists only enumerable own property names
  // Both traps may list more property names than are actually defined on the
  // target.

  // Invariants with regard to inheritance are currently not enforced.
  // - a non-configurable potentially inherited property on a proxy with
  //   non-mutable ancestry cannot be reported as non-existent
  // (An object with non-mutable ancestry is a non-extensible object whose
  // [[Prototype]] is either null or an object with non-mutable ancestry.)

  // Changes in Handler API compared to previous harmony:proxies, see:
  // http://wiki.ecmascript.org/doku.php?id=strawman:direct_proxies
  // http://wiki.ecmascript.org/doku.php?id=harmony:direct_proxies

  // ----------------------------------------------------------------------------

  // ---- WeakMap polyfill ----

  // TODO: find a proper WeakMap polyfill

  // define an empty WeakMap so that at least the Reflect module code
  // will work in the absence of WeakMaps. Proxy emulation depends on
  // actual WeakMaps, so will not work with this little shim.

  if (typeof WeakMap === "undefined") {
    global.WeakMap = function () {};
    global.WeakMap.prototype = {
      get: function get(k) {
        return undefined;
      },
      set: function set(k, v) {
        throw new Error("WeakMap not supported");
      }
    };
  }

  // ---- Normalization functions for property descriptors ----

  function isStandardAttribute(name) {
    return (/^(get|set|value|writable|enumerable|configurable)$/.test(name)
    );
  }

  // Adapted from ES5 section 8.10.5
  function toPropertyDescriptor(obj) {
    if (Object(obj) !== obj) {
      throw new TypeError("property descriptor should be an Object, given: " + obj);
    }
    var desc = {};
    if ('enumerable' in obj) {
      desc.enumerable = !!obj.enumerable;
    }
    if ('configurable' in obj) {
      desc.configurable = !!obj.configurable;
    }
    if ('value' in obj) {
      desc.value = obj.value;
    }
    if ('writable' in obj) {
      desc.writable = !!obj.writable;
    }
    if ('get' in obj) {
      var getter = obj.get;
      if (getter !== undefined && typeof getter !== "function") {
        throw new TypeError("property descriptor 'get' attribute must be " + "callable or undefined, given: " + getter);
      }
      desc.get = getter;
    }
    if ('set' in obj) {
      var setter = obj.set;
      if (setter !== undefined && typeof setter !== "function") {
        throw new TypeError("property descriptor 'set' attribute must be " + "callable or undefined, given: " + setter);
      }
      desc.set = setter;
    }
    if ('get' in desc || 'set' in desc) {
      if ('value' in desc || 'writable' in desc) {
        throw new TypeError("property descriptor cannot be both a data and an " + "accessor descriptor: " + obj);
      }
    }
    return desc;
  }

  function isAccessorDescriptor(desc) {
    if (desc === undefined) return false;
    return 'get' in desc || 'set' in desc;
  }
  function isDataDescriptor(desc) {
    if (desc === undefined) return false;
    return 'value' in desc || 'writable' in desc;
  }
  function isGenericDescriptor(desc) {
    if (desc === undefined) return false;
    return !isAccessorDescriptor(desc) && !isDataDescriptor(desc);
  }

  function toCompletePropertyDescriptor(desc) {
    var internalDesc = toPropertyDescriptor(desc);
    if (isGenericDescriptor(internalDesc) || isDataDescriptor(internalDesc)) {
      if (!('value' in internalDesc)) {
        internalDesc.value = undefined;
      }
      if (!('writable' in internalDesc)) {
        internalDesc.writable = false;
      }
    } else {
      if (!('get' in internalDesc)) {
        internalDesc.get = undefined;
      }
      if (!('set' in internalDesc)) {
        internalDesc.set = undefined;
      }
    }
    if (!('enumerable' in internalDesc)) {
      internalDesc.enumerable = false;
    }
    if (!('configurable' in internalDesc)) {
      internalDesc.configurable = false;
    }
    return internalDesc;
  }

  function isEmptyDescriptor(desc) {
    return !('get' in desc) && !('set' in desc) && !('value' in desc) && !('writable' in desc) && !('enumerable' in desc) && !('configurable' in desc);
  }

  function isEquivalentDescriptor(desc1, desc2) {
    return sameValue(desc1.get, desc2.get) && sameValue(desc1.set, desc2.set) && sameValue(desc1.value, desc2.value) && sameValue(desc1.writable, desc2.writable) && sameValue(desc1.enumerable, desc2.enumerable) && sameValue(desc1.configurable, desc2.configurable);
  }

  // copied from http://wiki.ecmascript.org/doku.php?id=harmony:egal
  function sameValue(x, y) {
    if (x === y) {
      // 0 === -0, but they are not identical
      return x !== 0 || 1 / x === 1 / y;
    }

    // NaN !== NaN, but they are identical.
    // NaNs are the only non-reflexive value, i.e., if x !== x,
    // then x is a NaN.
    // isNaN is broken: it converts its argument to number, so
    // isNaN("foo") => true
    return x !== x && y !== y;
  }

  /**
   * Returns a fresh property descriptor that is guaranteed
   * to be complete (i.e. contain all the standard attributes).
   * Additionally, any non-standard enumerable properties of
   * attributes are copied over to the fresh descriptor.
   *
   * If attributes is undefined, returns undefined.
   *
   * See also: http://wiki.ecmascript.org/doku.php?id=harmony:proxies_semantics
   */
  function normalizeAndCompletePropertyDescriptor(attributes) {
    if (attributes === undefined) {
      return undefined;
    }
    var desc = toCompletePropertyDescriptor(attributes);
    // Note: no need to call FromPropertyDescriptor(desc), as we represent
    // "internal" property descriptors as proper Objects from the start
    for (var name in attributes) {
      if (!isStandardAttribute(name)) {
        Object.defineProperty(desc, name, { value: attributes[name],
          writable: true,
          enumerable: true,
          configurable: true });
      }
    }
    return desc;
  }

  /**
   * Returns a fresh property descriptor whose standard
   * attributes are guaranteed to be data properties of the right type.
   * Additionally, any non-standard enumerable properties of
   * attributes are copied over to the fresh descriptor.
   *
   * If attributes is undefined, will throw a TypeError.
   *
   * See also: http://wiki.ecmascript.org/doku.php?id=harmony:proxies_semantics
   */
  function normalizePropertyDescriptor(attributes) {
    var desc = toPropertyDescriptor(attributes);
    // Note: no need to call FromGenericPropertyDescriptor(desc), as we represent
    // "internal" property descriptors as proper Objects from the start
    for (var name in attributes) {
      if (!isStandardAttribute(name)) {
        Object.defineProperty(desc, name, { value: attributes[name],
          writable: true,
          enumerable: true,
          configurable: true });
      }
    }
    return desc;
  }

  // store a reference to the real ES5 primitives before patching them later
  var prim_preventExtensions = Object.preventExtensions,
      prim_seal = Object.seal,
      prim_freeze = Object.freeze,
      prim_isExtensible = Object.isExtensible,
      prim_isSealed = Object.isSealed,
      prim_isFrozen = Object.isFrozen,
      prim_getPrototypeOf = Object.getPrototypeOf,
      prim_getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor,
      prim_defineProperty = Object.defineProperty,
      prim_defineProperties = Object.defineProperties,
      prim_keys = Object.keys,
      prim_getOwnPropertyNames = Object.getOwnPropertyNames,
      prim_getOwnPropertySymbols = Object.getOwnPropertySymbols,
      prim_assign = Object.assign,
      prim_isArray = Array.isArray,
      prim_concat = Array.prototype.concat,
      prim_isPrototypeOf = Object.prototype.isPrototypeOf,
      prim_hasOwnProperty = Object.prototype.hasOwnProperty;

  // these will point to the patched versions of the respective methods on
  // Object. They are used within this module as the "intrinsic" bindings
  // of these methods (i.e. the "original" bindings as defined in the spec)
  var Object_isFrozen, Object_isSealed, Object_isExtensible, Object_getPrototypeOf, Object_getOwnPropertyNames;

  /**
   * A property 'name' is fixed if it is an own property of the target.
   */
  function isFixed(name, target) {
    return {}.hasOwnProperty.call(target, name);
  }
  function isSealed(name, target) {
    var desc = Object.getOwnPropertyDescriptor(target, name);
    if (desc === undefined) {
      return false;
    }
    return desc.configurable === false;
  }
  function isSealedDesc(desc) {
    return desc !== undefined && desc.configurable === false;
  }

  /**
   * Performs all validation that Object.defineProperty performs,
   * without actually defining the property. Returns a boolean
   * indicating whether validation succeeded.
   *
   * Implementation transliterated from ES5.1 section 8.12.9
   */
  function isCompatibleDescriptor(extensible, current, desc) {
    if (current === undefined && extensible === false) {
      return false;
    }
    if (current === undefined && extensible === true) {
      return true;
    }
    if (isEmptyDescriptor(desc)) {
      return true;
    }
    if (isEquivalentDescriptor(current, desc)) {
      return true;
    }
    if (current.configurable === false) {
      if (desc.configurable === true) {
        return false;
      }
      if ('enumerable' in desc && desc.enumerable !== current.enumerable) {
        return false;
      }
    }
    if (isGenericDescriptor(desc)) {
      return true;
    }
    if (isDataDescriptor(current) !== isDataDescriptor(desc)) {
      if (current.configurable === false) {
        return false;
      }
      return true;
    }
    if (isDataDescriptor(current) && isDataDescriptor(desc)) {
      if (current.configurable === false) {
        if (current.writable === false && desc.writable === true) {
          return false;
        }
        if (current.writable === false) {
          if ('value' in desc && !sameValue(desc.value, current.value)) {
            return false;
          }
        }
      }
      return true;
    }
    if (isAccessorDescriptor(current) && isAccessorDescriptor(desc)) {
      if (current.configurable === false) {
        if ('set' in desc && !sameValue(desc.set, current.set)) {
          return false;
        }
        if ('get' in desc && !sameValue(desc.get, current.get)) {
          return false;
        }
      }
    }
    return true;
  }

  // ES6 7.3.11 SetIntegrityLevel
  // level is one of "sealed" or "frozen"
  function setIntegrityLevel(target, level) {
    var ownProps = Object_getOwnPropertyNames(target);
    var pendingException = undefined;
    if (level === "sealed") {
      var l = +ownProps.length;
      var k;
      for (var i = 0; i < l; i++) {
        k = String(ownProps[i]);
        try {
          Object.defineProperty(target, k, { configurable: false });
        } catch (e) {
          if (pendingException === undefined) {
            pendingException = e;
          }
        }
      }
    } else {
      // level === "frozen"
      var l = +ownProps.length;
      var k;
      for (var i = 0; i < l; i++) {
        k = String(ownProps[i]);
        try {
          var currentDesc = Object.getOwnPropertyDescriptor(target, k);
          if (currentDesc !== undefined) {
            var desc;
            if (isAccessorDescriptor(currentDesc)) {
              desc = { configurable: false };
            } else {
              desc = { configurable: false, writable: false };
            }
            Object.defineProperty(target, k, desc);
          }
        } catch (e) {
          if (pendingException === undefined) {
            pendingException = e;
          }
        }
      }
    }
    if (pendingException !== undefined) {
      throw pendingException;
    }
    return Reflect.preventExtensions(target);
  }

  // ES6 7.3.12 TestIntegrityLevel
  // level is one of "sealed" or "frozen"
  function testIntegrityLevel(target, level) {
    var isExtensible = Object_isExtensible(target);
    if (isExtensible) return false;

    var ownProps = Object_getOwnPropertyNames(target);
    var pendingException = undefined;
    var configurable = false;
    var writable = false;

    var l = +ownProps.length;
    var k;
    var currentDesc;
    for (var i = 0; i < l; i++) {
      k = String(ownProps[i]);
      try {
        currentDesc = Object.getOwnPropertyDescriptor(target, k);
        configurable = configurable || currentDesc.configurable;
        if (isDataDescriptor(currentDesc)) {
          writable = writable || currentDesc.writable;
        }
      } catch (e) {
        if (pendingException === undefined) {
          pendingException = e;
          configurable = true;
        }
      }
    }
    if (pendingException !== undefined) {
      throw pendingException;
    }
    if (level === "frozen" && writable === true) {
      return false;
    }
    if (configurable === true) {
      return false;
    }
    return true;
  }

  // ---- The Validator handler wrapper around user handlers ----

  /**
   * @param target the object wrapped by this proxy.
   * As long as the proxy is extensible, only non-configurable properties
   * are checked against the target. Once the proxy becomes non-extensible,
   * invariants w.r.t. non-extensibility are also enforced.
   *
   * @param handler the handler of the direct proxy. The object emulated by
   * this handler is validated against the target object of the direct proxy.
   * Any violations that the handler makes against the invariants
   * of the target will cause a TypeError to be thrown.
   *
   * Both target and handler must be proper Objects at initialization time.
   */
  function Validator(target, handler) {
    // for non-revokable proxies, these are const references
    // for revokable proxies, on revocation:
    // - this.target is set to null
    // - this.handler is set to a handler that throws on all traps
    this.target = target;
    this.handler = handler;
  }

  Validator.prototype = {

    /**
     * If getTrap returns undefined, the caller should perform the
     * default forwarding behavior.
     * If getTrap returns normally otherwise, the return value
     * will be a callable trap function. When calling the trap function,
     * the caller is responsible for binding its |this| to |this.handler|.
     */
    getTrap: function getTrap(trapName) {
      var trap = this.handler[trapName];
      if (trap === undefined) {
        // the trap was not defined,
        // perform the default forwarding behavior
        return undefined;
      }

      if (typeof trap !== "function") {
        throw new TypeError(trapName + " trap is not callable: " + trap);
      }

      return trap;
    },

    // === fundamental traps ===

    /**
     * If name denotes a fixed property, check:
     *   - whether targetHandler reports it as existent
     *   - whether the returned descriptor is compatible with the fixed property
     * If the proxy is non-extensible, check:
     *   - whether name is not a new property
     * Additionally, the returned descriptor is normalized and completed.
     */
    getOwnPropertyDescriptor: function getOwnPropertyDescriptor(name) {
      "use strict";

      var trap = this.getTrap("getOwnPropertyDescriptor");
      if (trap === undefined) {
        return Reflect.getOwnPropertyDescriptor(this.target, name);
      }

      name = String(name);
      var desc = trap.call(this.handler, this.target, name);
      desc = normalizeAndCompletePropertyDescriptor(desc);

      var targetDesc = Object.getOwnPropertyDescriptor(this.target, name);
      var extensible = Object.isExtensible(this.target);

      if (desc === undefined) {
        if (isSealedDesc(targetDesc)) {
          throw new TypeError("cannot report non-configurable property '" + name + "' as non-existent");
        }
        if (!extensible && targetDesc !== undefined) {
          // if handler is allowed to return undefined, we cannot guarantee
          // that it will not return a descriptor for this property later.
          // Once a property has been reported as non-existent on a non-extensible
          // object, it should forever be reported as non-existent
          throw new TypeError("cannot report existing own property '" + name + "' as non-existent on a non-extensible object");
        }
        return undefined;
      }

      // at this point, we know (desc !== undefined), i.e.
      // targetHandler reports 'name' as an existing property

      // Note: we could collapse the following two if-tests into a single
      // test. Separating out the cases to improve error reporting.

      if (!extensible) {
        if (targetDesc === undefined) {
          throw new TypeError("cannot report a new own property '" + name + "' on a non-extensible object");
        }
      }

      if (name !== undefined) {
        if (!isCompatibleDescriptor(extensible, targetDesc, desc)) {
          throw new TypeError("cannot report incompatible property descriptor " + "for property '" + name + "'");
        }
      }

      if (desc.configurable === false) {
        if (targetDesc === undefined || targetDesc.configurable === true) {
          // if the property is configurable or non-existent on the target,
          // but is reported as a non-configurable property, it may later be
          // reported as configurable or non-existent, which violates the
          // invariant that if the property might change or disappear, the
          // configurable attribute must be true.
          throw new TypeError("cannot report a non-configurable descriptor " + "for configurable or non-existent property '" + name + "'");
        }
        if ('writable' in desc && desc.writable === false) {
          if (targetDesc.writable === true) {
            // if the property is non-configurable, writable on the target,
            // but is reported as non-configurable, non-writable, it may later
            // be reported as non-configurable, writable again, which violates
            // the invariant that a non-configurable, non-writable property
            // may not change state.
            throw new TypeError("cannot report non-configurable, writable property '" + name + "' as non-configurable, non-writable");
          }
        }
      }

      return desc;
    },

    /**
     * In the direct proxies design with refactored prototype climbing,
     * this trap is deprecated. For proxies-as-prototypes, instead
     * of calling this trap, the get, set, has or enumerate traps are
     * called instead.
     *
     * In this implementation, we "abuse" getPropertyDescriptor to
     * support trapping the get or set traps for proxies-as-prototypes.
     * We do this by returning a getter/setter pair that invokes
     * the corresponding traps.
     *
     * While this hack works for inherited property access, it has some
     * quirks:
     *
     * In Firefox, this trap is only called after a prior invocation
     * of the 'has' trap has returned true. Hence, expect the following
     * behavior:
     * <code>
     * var child = Object.create(Proxy(target, handler));
     * child[name] // triggers handler.has(target, name)
     * // if that returns true, triggers handler.get(target, name, child)
     * </code>
     *
     * On v8, the 'in' operator, when applied to an object that inherits
     * from a proxy, will call getPropertyDescriptor and walk the proto-chain.
     * That calls the below getPropertyDescriptor trap on the proxy. The
     * result of the 'in'-operator is then determined by whether this trap
     * returns undefined or a property descriptor object. That is why
     * we first explicitly trigger the 'has' trap to determine whether
     * the property exists.
     *
     * This has the side-effect that when enumerating properties on
     * an object that inherits from a proxy in v8, only properties
     * for which 'has' returns true are returned:
     *
     * <code>
     * var child = Object.create(Proxy(target, handler));
     * for (var prop in child) {
     *   // only enumerates prop if (prop in child) returns true
     * }
     * </code>
     */
    getPropertyDescriptor: function getPropertyDescriptor(name) {
      var handler = this;

      if (!handler.has(name)) return undefined;

      return {
        get: function get() {
          return handler.get(this, name);
        },
        set: function set(val) {
          if (handler.set(this, name, val)) {
            return val;
          } else {
            throw new TypeError("failed assignment to " + name);
          }
        },
        enumerable: true,
        configurable: true
      };
    },

    /**
     * If name denotes a fixed property, check for incompatible changes.
     * If the proxy is non-extensible, check that new properties are rejected.
     */
    defineProperty: function defineProperty(name, desc) {
      // TODO(tvcutsem): the current tracemonkey implementation of proxies
      // auto-completes 'desc', which is not correct. 'desc' should be
      // normalized, but not completed. Consider:
      // Object.defineProperty(proxy, 'foo', {enumerable:false})
      // This trap will receive desc =
      //  {value:undefined,writable:false,enumerable:false,configurable:false}
      // This will also set all other attributes to their default value,
      // which is unexpected and different from [[DefineOwnProperty]].
      // Bug filed: https://bugzilla.mozilla.org/show_bug.cgi?id=601329

      var trap = this.getTrap("defineProperty");
      if (trap === undefined) {
        // default forwarding behavior
        return Reflect.defineProperty(this.target, name, desc);
      }

      name = String(name);
      var descObj = normalizePropertyDescriptor(desc);
      var success = trap.call(this.handler, this.target, name, descObj);
      success = !!success; // coerce to Boolean

      if (success === true) {

        var targetDesc = Object.getOwnPropertyDescriptor(this.target, name);
        var extensible = Object.isExtensible(this.target);

        // Note: we could collapse the following two if-tests into a single
        // test. Separating out the cases to improve error reporting.

        if (!extensible) {
          if (targetDesc === undefined) {
            throw new TypeError("cannot successfully add a new property '" + name + "' to a non-extensible object");
          }
        }

        if (targetDesc !== undefined) {
          if (!isCompatibleDescriptor(extensible, targetDesc, desc)) {
            throw new TypeError("cannot define incompatible property " + "descriptor for property '" + name + "'");
          }
          if (isDataDescriptor(targetDesc) && targetDesc.configurable === false && targetDesc.writable === true) {
            if (desc.configurable === false && desc.writable === false) {
              // if the property is non-configurable, writable on the target
              // but was successfully reported to be updated to
              // non-configurable, non-writable, it can later be reported
              // again as non-configurable, writable, which violates
              // the invariant that non-configurable, non-writable properties
              // cannot change state
              throw new TypeError("cannot successfully define non-configurable, writable " + " property '" + name + "' as non-configurable, non-writable");
            }
          }
        }

        if (desc.configurable === false && !isSealedDesc(targetDesc)) {
          // if the property is configurable or non-existent on the target,
          // but is successfully being redefined as a non-configurable property,
          // it may later be reported as configurable or non-existent, which violates
          // the invariant that if the property might change or disappear, the
          // configurable attribute must be true.
          throw new TypeError("cannot successfully define a non-configurable " + "descriptor for configurable or non-existent property '" + name + "'");
        }
      }

      return success;
    },

    /**
     * On success, check whether the target object is indeed non-extensible.
     */
    preventExtensions: function preventExtensions() {
      var trap = this.getTrap("preventExtensions");
      if (trap === undefined) {
        // default forwarding behavior
        return Reflect.preventExtensions(this.target);
      }

      var success = trap.call(this.handler, this.target);
      success = !!success; // coerce to Boolean
      if (success) {
        if (Object_isExtensible(this.target)) {
          throw new TypeError("can't report extensible object as non-extensible: " + this.target);
        }
      }
      return success;
    },

    /**
     * If name denotes a sealed property, check whether handler rejects.
     */
    delete: function _delete(name) {
      "use strict";

      var trap = this.getTrap("deleteProperty");
      if (trap === undefined) {
        // default forwarding behavior
        return Reflect.deleteProperty(this.target, name);
      }

      name = String(name);
      var res = trap.call(this.handler, this.target, name);
      res = !!res; // coerce to Boolean

      var targetDesc;
      if (res === true) {
        targetDesc = Object.getOwnPropertyDescriptor(this.target, name);
        if (targetDesc !== undefined && targetDesc.configurable === false) {
          throw new TypeError("property '" + name + "' is non-configurable " + "and can't be deleted");
        }
        if (targetDesc !== undefined && !Object_isExtensible(this.target)) {
          // if the property still exists on a non-extensible target but
          // is reported as successfully deleted, it may later be reported
          // as present, which violates the invariant that an own property,
          // deleted from a non-extensible object cannot reappear.
          throw new TypeError("cannot successfully delete existing property '" + name + "' on a non-extensible object");
        }
      }

      return res;
    },

    /**
     * The getOwnPropertyNames trap was replaced by the ownKeys trap,
     * which now also returns an array (of strings or symbols) and
     * which performs the same rigorous invariant checks as getOwnPropertyNames
     *
     * See issue #48 on how this trap can still get invoked by external libs
     * that don't use the patched Object.getOwnPropertyNames function.
     */
    getOwnPropertyNames: function getOwnPropertyNames() {
      // Note: removed deprecation warning to avoid dependency on 'console'
      // (and on node, should anyway use util.deprecate). Deprecation warnings
      // can also be annoying when they are outside of the user's control, e.g.
      // when an external library calls unpatched Object.getOwnPropertyNames.
      // Since there is a clean fallback to `ownKeys`, the fact that the
      // deprecated method is still called is mostly harmless anyway.
      // See also issues #65 and #66.
      // console.warn("getOwnPropertyNames trap is deprecated. Use ownKeys instead");
      return this.ownKeys();
    },

    /**
     * Checks whether the trap result does not contain any new properties
     * if the proxy is non-extensible.
     *
     * Any own non-configurable properties of the target that are not included
     * in the trap result give rise to a TypeError. As such, we check whether the
     * returned result contains at least all sealed properties of the target
     * object.
     *
     * Additionally, the trap result is normalized.
     * Instead of returning the trap result directly:
     *  - create and return a fresh Array,
     *  - of which each element is coerced to a String
     *
     * This trap is called a.o. by Reflect.ownKeys, Object.getOwnPropertyNames
     * and Object.keys (the latter filters out only the enumerable own properties).
     */
    ownKeys: function ownKeys() {
      var trap = this.getTrap("ownKeys");
      if (trap === undefined) {
        // default forwarding behavior
        return Reflect.ownKeys(this.target);
      }

      var trapResult = trap.call(this.handler, this.target);

      // propNames is used as a set of strings
      var propNames = Object.create(null);
      var numProps = +trapResult.length;
      var result = new Array(numProps);

      for (var i = 0; i < numProps; i++) {
        var s = String(trapResult[i]);
        if (!Object.isExtensible(this.target) && !isFixed(s, this.target)) {
          // non-extensible proxies don't tolerate new own property names
          throw new TypeError("ownKeys trap cannot list a new " + "property '" + s + "' on a non-extensible object");
        }

        propNames[s] = true;
        result[i] = s;
      }

      var ownProps = Object_getOwnPropertyNames(this.target);
      var target = this.target;
      ownProps.forEach(function (ownProp) {
        if (!propNames[ownProp]) {
          if (isSealed(ownProp, target)) {
            throw new TypeError("ownKeys trap failed to include " + "non-configurable property '" + ownProp + "'");
          }
          if (!Object.isExtensible(target) && isFixed(ownProp, target)) {
            // if handler is allowed to report ownProp as non-existent,
            // we cannot guarantee that it will never later report it as
            // existent. Once a property has been reported as non-existent
            // on a non-extensible object, it should forever be reported as
            // non-existent
            throw new TypeError("ownKeys trap cannot report existing own property '" + ownProp + "' as non-existent on a non-extensible object");
          }
        }
      });

      return result;
    },

    /**
     * Checks whether the trap result is consistent with the state of the
     * wrapped target.
     */
    isExtensible: function isExtensible() {
      var trap = this.getTrap("isExtensible");
      if (trap === undefined) {
        // default forwarding behavior
        return Reflect.isExtensible(this.target);
      }

      var result = trap.call(this.handler, this.target);
      result = !!result; // coerce to Boolean
      var state = Object_isExtensible(this.target);
      if (result !== state) {
        if (result) {
          throw new TypeError("cannot report non-extensible object as extensible: " + this.target);
        } else {
          throw new TypeError("cannot report extensible object as non-extensible: " + this.target);
        }
      }
      return state;
    },

    /**
     * Check whether the trap result corresponds to the target's [[Prototype]]
     */
    getPrototypeOf: function getPrototypeOf() {
      var trap = this.getTrap("getPrototypeOf");
      if (trap === undefined) {
        // default forwarding behavior
        return Reflect.getPrototypeOf(this.target);
      }

      var allegedProto = trap.call(this.handler, this.target);

      if (!Object_isExtensible(this.target)) {
        var actualProto = Object_getPrototypeOf(this.target);
        if (!sameValue(allegedProto, actualProto)) {
          throw new TypeError("prototype value does not match: " + this.target);
        }
      }

      return allegedProto;
    },

    /**
     * If target is non-extensible and setPrototypeOf trap returns true,
     * check whether the trap result corresponds to the target's [[Prototype]]
     */
    setPrototypeOf: function setPrototypeOf(newProto) {
      var trap = this.getTrap("setPrototypeOf");
      if (trap === undefined) {
        // default forwarding behavior
        return Reflect.setPrototypeOf(this.target, newProto);
      }

      var success = trap.call(this.handler, this.target, newProto);

      success = !!success;
      if (success && !Object_isExtensible(this.target)) {
        var actualProto = Object_getPrototypeOf(this.target);
        if (!sameValue(newProto, actualProto)) {
          throw new TypeError("prototype value does not match: " + this.target);
        }
      }

      return success;
    },

    /**
     * In the direct proxies design with refactored prototype climbing,
     * this trap is deprecated. For proxies-as-prototypes, for-in will
     * call the enumerate() trap. If that trap is not defined, the
     * operation is forwarded to the target, no more fallback on this
     * fundamental trap.
     */
    getPropertyNames: function getPropertyNames() {
      throw new TypeError("getPropertyNames trap is deprecated");
    },

    // === derived traps ===

    /**
     * If name denotes a fixed property, check whether the trap returns true.
     */
    has: function has(name) {
      var trap = this.getTrap("has");
      if (trap === undefined) {
        // default forwarding behavior
        return Reflect.has(this.target, name);
      }

      name = String(name);
      var res = trap.call(this.handler, this.target, name);
      res = !!res; // coerce to Boolean

      if (res === false) {
        if (isSealed(name, this.target)) {
          throw new TypeError("cannot report existing non-configurable own " + "property '" + name + "' as a non-existent " + "property");
        }
        if (!Object.isExtensible(this.target) && isFixed(name, this.target)) {
          // if handler is allowed to return false, we cannot guarantee
          // that it will not return true for this property later.
          // Once a property has been reported as non-existent on a non-extensible
          // object, it should forever be reported as non-existent
          throw new TypeError("cannot report existing own property '" + name + "' as non-existent on a non-extensible object");
        }
      }

      // if res === true, we don't need to check for extensibility
      // even for a non-extensible proxy that has no own name property,
      // the property may have been inherited

      return res;
    },

    /**
     * If name denotes a fixed non-configurable, non-writable data property,
     * check its return value against the previously asserted value of the
     * fixed property.
     */
    get: function get(receiver, name) {

      // experimental support for invoke() trap on platforms that
      // support __noSuchMethod__
      /*
      if (name === '__noSuchMethod__') {
        var handler = this;
        return function(name, args) {
          return handler.invoke(receiver, name, args);
        }
      }
      */

      var trap = this.getTrap("get");
      if (trap === undefined) {
        // default forwarding behavior
        return Reflect.get(this.target, name, receiver);
      }

      name = String(name);
      var res = trap.call(this.handler, this.target, name, receiver);

      var fixedDesc = Object.getOwnPropertyDescriptor(this.target, name);
      // check consistency of the returned value
      if (fixedDesc !== undefined) {
        // getting an existing property
        if (isDataDescriptor(fixedDesc) && fixedDesc.configurable === false && fixedDesc.writable === false) {
          // own frozen data property
          if (!sameValue(res, fixedDesc.value)) {
            throw new TypeError("cannot report inconsistent value for " + "non-writable, non-configurable property '" + name + "'");
          }
        } else {
          // it's an accessor property
          if (isAccessorDescriptor(fixedDesc) && fixedDesc.configurable === false && fixedDesc.get === undefined) {
            if (res !== undefined) {
              throw new TypeError("must report undefined for non-configurable " + "accessor property '" + name + "' without getter");
            }
          }
        }
      }

      return res;
    },

    /**
     * If name denotes a fixed non-configurable, non-writable data property,
     * check that the trap rejects the assignment.
     */
    set: function set(receiver, name, val) {
      var trap = this.getTrap("set");
      if (trap === undefined) {
        // default forwarding behavior
        return Reflect.set(this.target, name, val, receiver);
      }

      name = String(name);
      var res = trap.call(this.handler, this.target, name, val, receiver);
      res = !!res; // coerce to Boolean

      // if success is reported, check whether property is truly assignable
      if (res === true) {
        var fixedDesc = Object.getOwnPropertyDescriptor(this.target, name);
        if (fixedDesc !== undefined) {
          // setting an existing property
          if (isDataDescriptor(fixedDesc) && fixedDesc.configurable === false && fixedDesc.writable === false) {
            if (!sameValue(val, fixedDesc.value)) {
              throw new TypeError("cannot successfully assign to a " + "non-writable, non-configurable property '" + name + "'");
            }
          } else {
            if (isAccessorDescriptor(fixedDesc) && fixedDesc.configurable === false && // non-configurable
            fixedDesc.set === undefined) {
              // accessor with undefined setter
              throw new TypeError("setting a property '" + name + "' that has " + " only a getter");
            }
          }
        }
      }

      return res;
    },

    /**
     * Any own enumerable non-configurable properties of the target that are not
     * included in the trap result give rise to a TypeError. As such, we check
     * whether the returned result contains at least all sealed enumerable properties
     * of the target object.
     *
     * The trap should return an iterator.
     *
     * However, as implementations of pre-direct proxies still expect enumerate
     * to return an array of strings, we convert the iterator into an array.
     */
    enumerate: function enumerate() {
      var trap = this.getTrap("enumerate");
      if (trap === undefined) {
        // default forwarding behavior
        var trapResult = Reflect.enumerate(this.target);
        var result = [];
        var nxt = trapResult.next();
        while (!nxt.done) {
          result.push(String(nxt.value));
          nxt = trapResult.next();
        }
        return result;
      }

      var trapResult = trap.call(this.handler, this.target);

      if (trapResult === null || trapResult === undefined || trapResult.next === undefined) {
        throw new TypeError("enumerate trap should return an iterator, got: " + trapResult);
      }

      // propNames is used as a set of strings
      var propNames = Object.create(null);

      // var numProps = +trapResult.length;
      var result = []; // new Array(numProps);

      // trapResult is supposed to be an iterator
      // drain iterator to array as current implementations still expect
      // enumerate to return an array of strings
      var nxt = trapResult.next();

      while (!nxt.done) {
        var s = String(nxt.value);
        if (propNames[s]) {
          throw new TypeError("enumerate trap cannot list a " + "duplicate property '" + s + "'");
        }
        propNames[s] = true;
        result.push(s);
        nxt = trapResult.next();
      }

      /*for (var i = 0; i < numProps; i++) {
        var s = String(trapResult[i]);
        if (propNames[s]) {
          throw new TypeError("enumerate trap cannot list a "+
                              "duplicate property '"+s+"'");
        }
         propNames[s] = true;
        result[i] = s;
      } */

      var ownEnumerableProps = Object.keys(this.target);
      var target = this.target;
      ownEnumerableProps.forEach(function (ownEnumerableProp) {
        if (!propNames[ownEnumerableProp]) {
          if (isSealed(ownEnumerableProp, target)) {
            throw new TypeError("enumerate trap failed to include " + "non-configurable enumerable property '" + ownEnumerableProp + "'");
          }
          if (!Object.isExtensible(target) && isFixed(ownEnumerableProp, target)) {
            // if handler is allowed not to report ownEnumerableProp as an own
            // property, we cannot guarantee that it will never report it as
            // an own property later. Once a property has been reported as
            // non-existent on a non-extensible object, it should forever be
            // reported as non-existent
            throw new TypeError("cannot report existing own property '" + ownEnumerableProp + "' as non-existent on a " + "non-extensible object");
          }
        }
      });

      return result;
    },

    /**
     * The iterate trap is deprecated by the enumerate trap.
     */
    iterate: Validator.prototype.enumerate,

    /**
     * Any own non-configurable properties of the target that are not included
     * in the trap result give rise to a TypeError. As such, we check whether the
     * returned result contains at least all sealed properties of the target
     * object.
     *
     * The trap result is normalized.
     * The trap result is not returned directly. Instead:
     *  - create and return a fresh Array,
     *  - of which each element is coerced to String,
     *  - which does not contain duplicates
     *
     * FIXME: keys trap is deprecated
     */
    /*
    keys: function() {
      var trap = this.getTrap("keys");
      if (trap === undefined) {
        // default forwarding behavior
        return Reflect.keys(this.target);
      }
       var trapResult = trap.call(this.handler, this.target);
       // propNames is used as a set of strings
      var propNames = Object.create(null);
      var numProps = +trapResult.length;
      var result = new Array(numProps);
       for (var i = 0; i < numProps; i++) {
       var s = String(trapResult[i]);
       if (propNames[s]) {
         throw new TypeError("keys trap cannot list a "+
                             "duplicate property '"+s+"'");
       }
       if (!Object.isExtensible(this.target) && !isFixed(s, this.target)) {
         // non-extensible proxies don't tolerate new own property names
         throw new TypeError("keys trap cannot list a new "+
                             "property '"+s+"' on a non-extensible object");
       }
        propNames[s] = true;
       result[i] = s;
      }
       var ownEnumerableProps = Object.keys(this.target);
      var target = this.target;
      ownEnumerableProps.forEach(function (ownEnumerableProp) {
        if (!propNames[ownEnumerableProp]) {
          if (isSealed(ownEnumerableProp, target)) {
            throw new TypeError("keys trap failed to include "+
                                "non-configurable enumerable property '"+
                                ownEnumerableProp+"'");
          }
          if (!Object.isExtensible(target) &&
              isFixed(ownEnumerableProp, target)) {
              // if handler is allowed not to report ownEnumerableProp as an own
              // property, we cannot guarantee that it will never report it as
              // an own property later. Once a property has been reported as
              // non-existent on a non-extensible object, it should forever be
              // reported as non-existent
              throw new TypeError("cannot report existing own property '"+
                                  ownEnumerableProp+"' as non-existent on a "+
                                  "non-extensible object");
          }
        }
      });
       return result;
    },
    */

    /**
     * New trap that reifies [[Call]].
     * If the target is a function, then a call to
     *   proxy(...args)
     * Triggers this trap
     */
    apply: function apply(target, thisBinding, args) {
      var trap = this.getTrap("apply");
      if (trap === undefined) {
        return Reflect.apply(target, thisBinding, args);
      }

      if (typeof this.target === "function") {
        return trap.call(this.handler, target, thisBinding, args);
      } else {
        throw new TypeError("apply: " + target + " is not a function");
      }
    },

    /**
     * New trap that reifies [[Construct]].
     * If the target is a function, then a call to
     *   new proxy(...args)
     * Triggers this trap
     */
    construct: function construct(target, args, newTarget) {
      var trap = this.getTrap("construct");
      if (trap === undefined) {
        return Reflect.construct(target, args, newTarget);
      }

      if (typeof target !== "function") {
        throw new TypeError("new: " + target + " is not a function");
      }

      if (newTarget === undefined) {
        newTarget = target;
      } else {
        if (typeof newTarget !== "function") {
          throw new TypeError("new: " + newTarget + " is not a function");
        }
      }
      return trap.call(this.handler, target, args, newTarget);
    }
  };

  // ---- end of the Validator handler wrapper handler ----

  // In what follows, a 'direct proxy' is a proxy
  // whose handler is a Validator. Such proxies can be made non-extensible,
  // sealed or frozen without losing the ability to trap.

  // maps direct proxies to their Validator handlers
  var directProxies = new WeakMap();

  // patch Object.{preventExtensions,seal,freeze} so that
  // they recognize fixable proxies and act accordingly
  Object.preventExtensions = function (subject) {
    var vhandler = directProxies.get(subject);
    if (vhandler !== undefined) {
      if (vhandler.preventExtensions()) {
        return subject;
      } else {
        throw new TypeError("preventExtensions on " + subject + " rejected");
      }
    } else {
      return prim_preventExtensions(subject);
    }
  };
  Object.seal = function (subject) {
    setIntegrityLevel(subject, "sealed");
    return subject;
  };
  Object.freeze = function (subject) {
    setIntegrityLevel(subject, "frozen");
    return subject;
  };
  Object.isExtensible = Object_isExtensible = function Object_isExtensible(subject) {
    var vHandler = directProxies.get(subject);
    if (vHandler !== undefined) {
      return vHandler.isExtensible();
    } else {
      return prim_isExtensible(subject);
    }
  };
  Object.isSealed = Object_isSealed = function Object_isSealed(subject) {
    return testIntegrityLevel(subject, "sealed");
  };
  Object.isFrozen = Object_isFrozen = function Object_isFrozen(subject) {
    return testIntegrityLevel(subject, "frozen");
  };
  Object.getPrototypeOf = Object_getPrototypeOf = function Object_getPrototypeOf(subject) {
    var vHandler = directProxies.get(subject);
    if (vHandler !== undefined) {
      return vHandler.getPrototypeOf();
    } else {
      return prim_getPrototypeOf(subject);
    }
  };

  // patch Object.getOwnPropertyDescriptor to directly call
  // the Validator.prototype.getOwnPropertyDescriptor trap
  // This is to circumvent an assertion in the built-in Proxy
  // trapping mechanism of v8, which disallows that trap to
  // return non-configurable property descriptors (as per the
  // old Proxy design)
  Object.getOwnPropertyDescriptor = function (subject, name) {
    var vhandler = directProxies.get(subject);
    if (vhandler !== undefined) {
      return vhandler.getOwnPropertyDescriptor(name);
    } else {
      return prim_getOwnPropertyDescriptor(subject, name);
    }
  };

  // patch Object.defineProperty to directly call
  // the Validator.prototype.defineProperty trap
  // This is to circumvent two issues with the built-in
  // trap mechanism:
  // 1) the current tracemonkey implementation of proxies
  // auto-completes 'desc', which is not correct. 'desc' should be
  // normalized, but not completed. Consider:
  // Object.defineProperty(proxy, 'foo', {enumerable:false})
  // This trap will receive desc =
  //  {value:undefined,writable:false,enumerable:false,configurable:false}
  // This will also set all other attributes to their default value,
  // which is unexpected and different from [[DefineOwnProperty]].
  // Bug filed: https://bugzilla.mozilla.org/show_bug.cgi?id=601329
  // 2) the current spidermonkey implementation does not
  // throw an exception when this trap returns 'false', but instead silently
  // ignores the operation (this is regardless of strict-mode)
  // 2a) v8 does throw an exception for this case, but includes the rather
  //     unhelpful error message:
  // 'Proxy handler #<Object> returned false from 'defineProperty' trap'
  Object.defineProperty = function (subject, name, desc) {
    var vhandler = directProxies.get(subject);
    if (vhandler !== undefined) {
      var normalizedDesc = normalizePropertyDescriptor(desc);
      var success = vhandler.defineProperty(name, normalizedDesc);
      if (success === false) {
        throw new TypeError("can't redefine property '" + name + "'");
      }
      return subject;
    } else {
      return prim_defineProperty(subject, name, desc);
    }
  };

  Object.defineProperties = function (subject, descs) {
    var vhandler = directProxies.get(subject);
    if (vhandler !== undefined) {
      var names = Object.keys(descs);
      for (var i = 0; i < names.length; i++) {
        var name = names[i];
        var normalizedDesc = normalizePropertyDescriptor(descs[name]);
        var success = vhandler.defineProperty(name, normalizedDesc);
        if (success === false) {
          throw new TypeError("can't redefine property '" + name + "'");
        }
      }
      return subject;
    } else {
      return prim_defineProperties(subject, descs);
    }
  };

  Object.keys = function (subject) {
    var vHandler = directProxies.get(subject);
    if (vHandler !== undefined) {
      var ownKeys = vHandler.ownKeys();
      var result = [];
      for (var i = 0; i < ownKeys.length; i++) {
        var k = String(ownKeys[i]);
        var desc = Object.getOwnPropertyDescriptor(subject, k);
        if (desc !== undefined && desc.enumerable === true) {
          result.push(k);
        }
      }
      return result;
    } else {
      return prim_keys(subject);
    }
  };

  Object.getOwnPropertyNames = Object_getOwnPropertyNames = function Object_getOwnPropertyNames(subject) {
    var vHandler = directProxies.get(subject);
    if (vHandler !== undefined) {
      return vHandler.ownKeys();
    } else {
      return prim_getOwnPropertyNames(subject);
    }
  };

  // fixes issue #71 (Calling Object.getOwnPropertySymbols() on a Proxy
  // throws an error)
  if (prim_getOwnPropertySymbols !== undefined) {
    Object.getOwnPropertySymbols = function (subject) {
      var vHandler = directProxies.get(subject);
      if (vHandler !== undefined) {
        // as this shim does not support symbols, a Proxy never advertises
        // any symbol-valued own properties
        return [];
      } else {
        return prim_getOwnPropertySymbols(subject);
      }
    };
  }

  // fixes issue #72 ('Illegal access' error when using Object.assign)
  // Object.assign polyfill based on a polyfill posted on MDN: 
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/\
  //  Global_Objects/Object/assign
  // Note that this polyfill does not support Symbols, but this Proxy Shim
  // does not support Symbols anyway.
  if (prim_assign !== undefined) {
    Object.assign = function (target) {

      // check if any argument is a proxy object
      var noProxies = true;
      for (var i = 0; i < arguments.length; i++) {
        var vHandler = directProxies.get(arguments[i]);
        if (vHandler !== undefined) {
          noProxies = false;
          break;
        }
      }
      if (noProxies) {
        // not a single argument is a proxy, perform built-in algorithm
        return prim_assign.apply(Object, arguments);
      }

      // there is at least one proxy argument, use the polyfill

      if (target === undefined || target === null) {
        throw new TypeError('Cannot convert undefined or null to object');
      }

      var output = Object(target);
      for (var index = 1; index < arguments.length; index++) {
        var source = arguments[index];
        if (source !== undefined && source !== null) {
          for (var nextKey in source) {
            if (source.hasOwnProperty(nextKey)) {
              output[nextKey] = source[nextKey];
            }
          }
        }
      }
      return output;
    };
  }

  // returns whether an argument is a reference to an object,
  // which is legal as a WeakMap key.
  function isObject(arg) {
    var type = typeof arg === 'undefined' ? 'undefined' : _typeof(arg);
    return type === 'object' && arg !== null || type === 'function';
  };

  // a wrapper for WeakMap.get which returns the undefined value
  // for keys that are not objects (in which case the underlying
  // WeakMap would have thrown a TypeError).
  function safeWeakMapGet(map, key) {
    return isObject(key) ? map.get(key) : undefined;
  };

  // returns a new function of zero arguments that recursively
  // unwraps any proxies specified as the |this|-value.
  // The primitive is assumed to be a zero-argument method
  // that uses its |this|-binding.
  function makeUnwrapping0ArgMethod(primitive) {
    return function builtin() {
      var vHandler = safeWeakMapGet(directProxies, this);
      if (vHandler !== undefined) {
        return builtin.call(vHandler.target);
      } else {
        return primitive.call(this);
      }
    };
  };

  // returns a new function of 1 arguments that recursively
  // unwraps any proxies specified as the |this|-value.
  // The primitive is assumed to be a 1-argument method
  // that uses its |this|-binding.
  function makeUnwrapping1ArgMethod(primitive) {
    return function builtin(arg) {
      var vHandler = safeWeakMapGet(directProxies, this);
      if (vHandler !== undefined) {
        return builtin.call(vHandler.target, arg);
      } else {
        return primitive.call(this, arg);
      }
    };
  };

  Object.prototype.valueOf = makeUnwrapping0ArgMethod(Object.prototype.valueOf);
  Object.prototype.toString = makeUnwrapping0ArgMethod(Object.prototype.toString);
  Function.prototype.toString = makeUnwrapping0ArgMethod(Function.prototype.toString);
  Date.prototype.toString = makeUnwrapping0ArgMethod(Date.prototype.toString);

  Object.prototype.isPrototypeOf = function builtin(arg) {
    // bugfix thanks to Bill Mark:
    // built-in isPrototypeOf does not unwrap proxies used
    // as arguments. So, we implement the builtin ourselves,
    // based on the ECMAScript 6 spec. Our encoding will
    // make sure that if a proxy is used as an argument,
    // its getPrototypeOf trap will be called.
    while (true) {
      var vHandler2 = safeWeakMapGet(directProxies, arg);
      if (vHandler2 !== undefined) {
        arg = vHandler2.getPrototypeOf();
        if (arg === null) {
          return false;
        } else if (sameValue(arg, this)) {
          return true;
        }
      } else {
        return prim_isPrototypeOf.call(this, arg);
      }
    }
  };

  Array.isArray = function (subject) {
    var vHandler = safeWeakMapGet(directProxies, subject);
    if (vHandler !== undefined) {
      return Array.isArray(vHandler.target);
    } else {
      return prim_isArray(subject);
    }
  };

  function isProxyArray(arg) {
    var vHandler = safeWeakMapGet(directProxies, arg);
    if (vHandler !== undefined) {
      return Array.isArray(vHandler.target);
    }
    return false;
  }

  // Array.prototype.concat internally tests whether one of its
  // arguments is an Array, by checking whether [[Class]] == "Array"
  // As such, it will fail to recognize proxies-for-arrays as arrays.
  // We patch Array.prototype.concat so that it "unwraps" proxies-for-arrays
  // by making a copy. This will trigger the exact same sequence of
  // traps on the proxy-for-array as if we would not have unwrapped it.
  // See <https://github.com/tvcutsem/harmony-reflect/issues/19> for more.
  Array.prototype.concat = function () /*...args*/{
    var length;
    for (var i = 0; i < arguments.length; i++) {
      if (isProxyArray(arguments[i])) {
        length = arguments[i].length;
        arguments[i] = Array.prototype.slice.call(arguments[i], 0, length);
      }
    }
    return prim_concat.apply(this, arguments);
  };

  // setPrototypeOf support on platforms that support __proto__

  var prim_setPrototypeOf = Object.setPrototypeOf;

  // patch and extract original __proto__ setter
  var __proto__setter = function () {
    var protoDesc = prim_getOwnPropertyDescriptor(Object.prototype, '__proto__');
    if (protoDesc === undefined || typeof protoDesc.set !== "function") {
      return function () {
        throw new TypeError("setPrototypeOf not supported on this platform");
      };
    }

    // see if we can actually mutate a prototype with the generic setter
    // (e.g. Chrome v28 doesn't allow setting __proto__ via the generic setter)
    try {
      protoDesc.set.call({}, {});
    } catch (e) {
      return function () {
        throw new TypeError("setPrototypeOf not supported on this platform");
      };
    }

    prim_defineProperty(Object.prototype, '__proto__', {
      set: function set(newProto) {
        return Object.setPrototypeOf(this, Object(newProto));
      }
    });

    return protoDesc.set;
  }();

  Object.setPrototypeOf = function (target, newProto) {
    var handler = directProxies.get(target);
    if (handler !== undefined) {
      if (handler.setPrototypeOf(newProto)) {
        return target;
      } else {
        throw new TypeError("proxy rejected prototype mutation");
      }
    } else {
      if (!Object_isExtensible(target)) {
        throw new TypeError("can't set prototype on non-extensible object: " + target);
      }
      if (prim_setPrototypeOf) return prim_setPrototypeOf(target, newProto);

      if (Object(newProto) !== newProto || newProto === null) {
        throw new TypeError("Object prototype may only be an Object or null: " + newProto);
        // throw new TypeError("prototype must be an object or null")
      }
      __proto__setter.call(target, newProto);
      return target;
    }
  };

  Object.prototype.hasOwnProperty = function (name) {
    var handler = safeWeakMapGet(directProxies, this);
    if (handler !== undefined) {
      var desc = handler.getOwnPropertyDescriptor(name);
      return desc !== undefined;
    } else {
      return prim_hasOwnProperty.call(this, name);
    }
  };

  // ============= Reflection module =============
  // see http://wiki.ecmascript.org/doku.php?id=harmony:reflect_api

  var Reflect = global.Reflect = {
    getOwnPropertyDescriptor: function getOwnPropertyDescriptor(target, name) {
      return Object.getOwnPropertyDescriptor(target, name);
    },
    defineProperty: function defineProperty(target, name, desc) {

      // if target is a proxy, invoke its "defineProperty" trap
      var handler = directProxies.get(target);
      if (handler !== undefined) {
        return handler.defineProperty(target, name, desc);
      }

      // Implementation transliterated from [[DefineOwnProperty]]
      // see ES5.1 section 8.12.9
      // this is the _exact same algorithm_ as the isCompatibleDescriptor
      // algorithm defined above, except that at every place it
      // returns true, this algorithm actually does define the property.
      var current = Object.getOwnPropertyDescriptor(target, name);
      var extensible = Object.isExtensible(target);
      if (current === undefined && extensible === false) {
        return false;
      }
      if (current === undefined && extensible === true) {
        Object.defineProperty(target, name, desc); // should never fail
        return true;
      }
      if (isEmptyDescriptor(desc)) {
        return true;
      }
      if (isEquivalentDescriptor(current, desc)) {
        return true;
      }
      if (current.configurable === false) {
        if (desc.configurable === true) {
          return false;
        }
        if ('enumerable' in desc && desc.enumerable !== current.enumerable) {
          return false;
        }
      }
      if (isGenericDescriptor(desc)) {
        // no further validation necessary
      } else if (isDataDescriptor(current) !== isDataDescriptor(desc)) {
        if (current.configurable === false) {
          return false;
        }
      } else if (isDataDescriptor(current) && isDataDescriptor(desc)) {
        if (current.configurable === false) {
          if (current.writable === false && desc.writable === true) {
            return false;
          }
          if (current.writable === false) {
            if ('value' in desc && !sameValue(desc.value, current.value)) {
              return false;
            }
          }
        }
      } else if (isAccessorDescriptor(current) && isAccessorDescriptor(desc)) {
        if (current.configurable === false) {
          if ('set' in desc && !sameValue(desc.set, current.set)) {
            return false;
          }
          if ('get' in desc && !sameValue(desc.get, current.get)) {
            return false;
          }
        }
      }
      Object.defineProperty(target, name, desc); // should never fail
      return true;
    },
    deleteProperty: function deleteProperty(target, name) {
      var handler = directProxies.get(target);
      if (handler !== undefined) {
        return handler.delete(name);
      }

      var desc = Object.getOwnPropertyDescriptor(target, name);
      if (desc === undefined) {
        return true;
      }
      if (desc.configurable === true) {
        delete target[name];
        return true;
      }
      return false;
    },
    getPrototypeOf: function getPrototypeOf(target) {
      return Object.getPrototypeOf(target);
    },
    setPrototypeOf: function setPrototypeOf(target, newProto) {

      var handler = directProxies.get(target);
      if (handler !== undefined) {
        return handler.setPrototypeOf(newProto);
      }

      if (Object(newProto) !== newProto || newProto === null) {
        throw new TypeError("Object prototype may only be an Object or null: " + newProto);
      }

      if (!Object_isExtensible(target)) {
        return false;
      }

      var current = Object.getPrototypeOf(target);
      if (sameValue(current, newProto)) {
        return true;
      }

      if (prim_setPrototypeOf) {
        try {
          prim_setPrototypeOf(target, newProto);
          return true;
        } catch (e) {
          return false;
        }
      }

      __proto__setter.call(target, newProto);
      return true;
    },
    preventExtensions: function preventExtensions(target) {
      var handler = directProxies.get(target);
      if (handler !== undefined) {
        return handler.preventExtensions();
      }
      prim_preventExtensions(target);
      return true;
    },
    isExtensible: function isExtensible(target) {
      return Object.isExtensible(target);
    },
    has: function has(target, name) {
      return name in target;
    },
    get: function get(target, name, receiver) {
      receiver = receiver || target;

      // if target is a proxy, invoke its "get" trap
      var handler = directProxies.get(target);
      if (handler !== undefined) {
        return handler.get(receiver, name);
      }

      var desc = Object.getOwnPropertyDescriptor(target, name);
      if (desc === undefined) {
        var proto = Object.getPrototypeOf(target);
        if (proto === null) {
          return undefined;
        }
        return Reflect.get(proto, name, receiver);
      }
      if (isDataDescriptor(desc)) {
        return desc.value;
      }
      var getter = desc.get;
      if (getter === undefined) {
        return undefined;
      }
      return desc.get.call(receiver);
    },
    // Reflect.set implementation based on latest version of [[SetP]] at
    // http://wiki.ecmascript.org/doku.php?id=harmony:proto_climbing_refactoring
    set: function set(target, name, value, receiver) {
      receiver = receiver || target;

      // if target is a proxy, invoke its "set" trap
      var handler = directProxies.get(target);
      if (handler !== undefined) {
        return handler.set(receiver, name, value);
      }

      // first, check whether target has a non-writable property
      // shadowing name on receiver
      var ownDesc = Object.getOwnPropertyDescriptor(target, name);

      if (ownDesc === undefined) {
        // name is not defined in target, search target's prototype
        var proto = Object.getPrototypeOf(target);

        if (proto !== null) {
          // continue the search in target's prototype
          return Reflect.set(proto, name, value, receiver);
        }

        // Rev16 change. Cf. https://bugs.ecmascript.org/show_bug.cgi?id=1549
        // target was the last prototype, now we know that 'name' is not shadowed
        // by an existing (accessor or data) property, so we can add the property
        // to the initial receiver object
        // (this branch will intentionally fall through to the code below)
        ownDesc = { value: undefined,
          writable: true,
          enumerable: true,
          configurable: true };
      }

      // we now know that ownDesc !== undefined
      if (isAccessorDescriptor(ownDesc)) {
        var setter = ownDesc.set;
        if (setter === undefined) return false;
        setter.call(receiver, value); // assumes Function.prototype.call
        return true;
      }
      // otherwise, isDataDescriptor(ownDesc) must be true
      if (ownDesc.writable === false) return false;
      // we found an existing writable data property on the prototype chain.
      // Now update or add the data property on the receiver, depending on
      // whether the receiver already defines the property or not.
      var existingDesc = Object.getOwnPropertyDescriptor(receiver, name);
      if (existingDesc !== undefined) {
        var updateDesc = { value: value,
          // FIXME: it should not be necessary to describe the following
          // attributes. Added to circumvent a bug in tracemonkey:
          // https://bugzilla.mozilla.org/show_bug.cgi?id=601329
          writable: existingDesc.writable,
          enumerable: existingDesc.enumerable,
          configurable: existingDesc.configurable };
        Object.defineProperty(receiver, name, updateDesc);
        return true;
      } else {
        if (!Object.isExtensible(receiver)) return false;
        var newDesc = { value: value,
          writable: true,
          enumerable: true,
          configurable: true };
        Object.defineProperty(receiver, name, newDesc);
        return true;
      }
    },
    /*invoke: function(target, name, args, receiver) {
      receiver = receiver || target;
       var handler = directProxies.get(target);
      if (handler !== undefined) {
        return handler.invoke(receiver, name, args);
      }
       var fun = Reflect.get(target, name, receiver);
      return Function.prototype.apply.call(fun, receiver, args);
    },*/
    enumerate: function enumerate(target) {
      var handler = directProxies.get(target);
      var result;
      if (handler !== undefined) {
        // handler.enumerate should return an iterator directly, but the
        // iterator gets converted to an array for backward-compat reasons,
        // so we must re-iterate over the array
        result = handler.enumerate(handler.target);
      } else {
        result = [];
        for (var name in target) {
          result.push(name);
        };
      }
      var l = +result.length;
      var idx = 0;
      return {
        next: function next() {
          if (idx === l) return { done: true };
          return { done: false, value: result[idx++] };
        }
      };
    },
    // imperfect ownKeys implementation: in ES6, should also include
    // symbol-keyed properties.
    ownKeys: function ownKeys(target) {
      return Object_getOwnPropertyNames(target);
    },
    apply: function apply(target, receiver, args) {
      // target.apply(receiver, args)
      return Function.prototype.apply.call(target, receiver, args);
    },
    construct: function construct(target, args, newTarget) {
      // return new target(...args);

      // if target is a proxy, invoke its "construct" trap
      var handler = directProxies.get(target);
      if (handler !== undefined) {
        return handler.construct(handler.target, args, newTarget);
      }

      if (typeof target !== "function") {
        throw new TypeError("target is not a function: " + target);
      }
      if (newTarget === undefined) {
        newTarget = target;
      } else {
        if (typeof newTarget !== "function") {
          throw new TypeError("newTarget is not a function: " + target);
        }
      }

      return new (Function.prototype.bind.apply(newTarget, [null].concat(args)))();
    }
  };

  // feature-test whether the Proxy global exists, with
  // the harmony-era Proxy.create API
  if (typeof Proxy !== "undefined" && typeof Proxy.create !== "undefined") {

    var primCreate = Proxy.create,
        primCreateFunction = Proxy.createFunction;

    var revokedHandler = primCreate({
      get: function get() {
        throw new TypeError("proxy is revoked");
      }
    });

    global.Proxy = function (target, handler) {
      // check that target is an Object
      if (Object(target) !== target) {
        throw new TypeError("Proxy target must be an Object, given " + target);
      }
      // check that handler is an Object
      if (Object(handler) !== handler) {
        throw new TypeError("Proxy handler must be an Object, given " + handler);
      }

      var vHandler = new Validator(target, handler);
      var proxy;
      if (typeof target === "function") {
        proxy = primCreateFunction(vHandler,
        // call trap
        function () {
          var args = Array.prototype.slice.call(arguments);
          return vHandler.apply(target, this, args);
        },
        // construct trap
        function () {
          var args = Array.prototype.slice.call(arguments);
          return vHandler.construct(target, args);
        });
      } else {
        proxy = primCreate(vHandler, Object.getPrototypeOf(target));
      }
      directProxies.set(proxy, vHandler);
      return proxy;
    };

    global.Proxy.revocable = function (target, handler) {
      var proxy = new Proxy(target, handler);
      var revoke = function revoke() {
        var vHandler = directProxies.get(proxy);
        if (vHandler !== null) {
          vHandler.target = null;
          vHandler.handler = revokedHandler;
        }
        return undefined;
      };
      return { proxy: proxy, revoke: revoke };
    };

    // add the old Proxy.create and Proxy.createFunction methods
    // so old code that still depends on the harmony-era Proxy object
    // is not broken. Also ensures that multiple versions of this
    // library should load fine
    global.Proxy.create = primCreate;
    global.Proxy.createFunction = primCreateFunction;
  } else {
    // Proxy global not defined, or old API not available
    if (typeof Proxy === "undefined") {
      // Proxy global not defined, add a Proxy function stub
      global.Proxy = function (_target, _handler) {
        throw new Error("proxies not supported on this platform. On v8/node/iojs, make sure to pass the --harmony_proxies flag");
      };
    }
    // Proxy global defined but old API not available
    // presumably Proxy global already supports new API, leave untouched
  }

  // for node.js modules, export every property in the Reflect object
  // as part of the module interface
  if (typeof exports !== 'undefined') {
    Object.keys(Reflect).forEach(function (key) {
      exports[key] = Reflect[key];
    });
  }

  // function-as-module pattern
}(typeof exports !== 'undefined' ? global : undefined);

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9ncnVudC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJkZXYtanMvbWFpbi5lczYiLCJqcy1leHBvcnRzL3BvbHlmaWxscy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDQ0E7O0FBRUEsQ0FBQyxZQUFVO0FBQ1Q7O0FBRUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBOEJBLE1BQUksWUFBWSxJQUFoQjtBQUFBLE1BQ0ksWUFBWSxJQURoQjtBQUFBLE1BRUksU0FBUyxFQUFFO0FBQ1QsU0FBSSxDQURHO0FBRVAsV0FBTSxDQUZDO0FBR1AsWUFBTyxDQUhBO0FBSVAsVUFBSztBQUpFLEdBRmI7QUFBQSxNQVFJLFFBQVEsTUFBTSxPQUFPLEtBQWIsR0FBcUIsT0FBTyxJQVJ4QztBQUFBLE1BU0ksU0FBUyxNQUFNLE9BQU8sR0FBYixHQUFtQixPQUFPLE1BVHZDOztBQVdBLE1BQUksUUFBUSxHQUFHLFlBQUgsQ0FBZ0IsR0FBRyxnQkFBbkIsQ0FBWjs7QUFFQSxNQUFJLFNBQVMsR0FBRyxRQUFILEdBQWMsS0FBZCxDQUFvQixDQUFDLEdBQUQsRUFBSyxDQUFMLENBQXBCLENBQWI7QUFDQSxNQUFJLGdCQUFnQixHQUFHLFdBQUgsR0FBaUIsS0FBakIsQ0FBdUIsQ0FBQyxDQUFELEVBQUcsQ0FBSCxDQUF2QixDQUFwQjtBQUNBLE1BQUksYUFBYSxHQUFHLGVBQUgsR0FDZCxhQURjLENBQ0EsQ0FBQyxHQUFELENBREEsRUFFZCxLQUZjLENBRVIsTUFGUSxFQUVBLEdBQUcsU0FBSCxFQUZBLEVBR2QsS0FIYyxDQUdSLFFBSFEsRUFHRSxHQUFHLGFBQUgsR0FBbUIsUUFBbkIsQ0FBNEIsQ0FBQyxDQUE3QixDQUhGLEVBSWQsS0FKYyxDQUlSLFFBSlEsRUFJRSxHQUFHLFdBQUgsQ0FBZSxRQUFRLENBQXZCLEVBQTBCLFNBQVMsQ0FBbkMsQ0FKRixFQUtkLEtBTGMsQ0FLUixTQUxRLEVBS0csR0FBRyxZQUFILEdBQWtCLE1BQWxCLENBQXlCLFVBQVMsQ0FBVCxFQUFZO0FBQUUsV0FBTyxPQUFPLEVBQUUsS0FBVCxDQUFQO0FBQXlCLEdBQWhFLEVBQWtFLFVBQWxFLENBQTZFLENBQTdFLENBTEgsQ0FBakI7O0FBT0EsS0FBRyxHQUFILENBQU8sb0JBQVAsRUFBNkIsVUFBUyxJQUFULEVBQWM7QUFDekMsWUFBUSxHQUFSLENBQVksSUFBWjtBQUNBLGdCQUFZLElBQVo7QUFDQTtBQUNELEdBSkQ7QUFLQSxLQUFHLEdBQUgsQ0FBTyxxQkFBUCxFQUE4QixVQUFTLElBQVQsRUFBYztBQUMxQyxZQUFRLEdBQVIsQ0FBWSxJQUFaO0FBQ0EsU0FBSyxPQUFMLENBQWEsVUFBUyxJQUFULEVBQWM7QUFDekIsV0FBSyxJQUFJLEdBQVQsSUFBZ0IsSUFBaEIsRUFBcUI7QUFDbkIsWUFBSyxLQUFLLGNBQUwsQ0FBb0IsR0FBcEIsQ0FBTCxFQUErQjtBQUM3QixjQUFLLENBQUMsTUFBTSxDQUFDLEtBQUssR0FBTCxDQUFQLENBQU4sRUFBeUI7QUFDdkIsaUJBQUssR0FBTCxJQUFZLENBQUMsS0FBSyxHQUFMLENBQWI7QUFDRDtBQUNGO0FBQ0Y7QUFDRixLQVJEO0FBU0EsZ0JBQVksSUFBWjtBQUNBO0FBQ0QsR0FiRDs7QUFlQSxXQUFTLE1BQVQsR0FBaUI7QUFDZixRQUFLLGNBQWMsSUFBZCxJQUFzQixjQUFjLElBQXpDLEVBQStDO0FBQzdDO0FBQ0QsS0FGRCxNQUVPO0FBQ0w7QUFDRDtBQUNGOztBQUVELE1BQUksV0FBVyxFQUFmO0FBQUEsTUFDQSxVQUFVLEVBRFY7O0FBR0EsV0FBUyxFQUFULEdBQWE7QUFDWCxhQUFTLE9BQVQsQ0FBaUIsR0FBakIsRUFBcUI7QUFDbkIsYUFBTyxVQUFVLElBQVYsQ0FBZSxVQUFTLEdBQVQsRUFBYTtBQUNqQyxlQUFPLElBQUksRUFBSixLQUFXLEdBQWxCO0FBQ0QsT0FGTSxDQUFQO0FBR0Q7QUFDRCxjQUFVLE9BQVYsQ0FBa0IsVUFBUyxJQUFULEVBQWMsQ0FBZCxFQUFnQjtBQUNoQyxXQUFLLElBQUksR0FBVCxJQUFnQixJQUFoQixFQUFxQjtBQUNuQixZQUFLLEtBQUssY0FBTCxDQUFvQixHQUFwQixDQUFMLEVBQStCO0FBQzdCLGNBQUksUUFBUSxRQUFRLEdBQVIsQ0FBWjtBQUNBLGNBQUksUUFBUSxVQUFVLE9BQVYsQ0FBa0IsS0FBbEIsQ0FBWjtBQUNBLGNBQUksVUFBVSxDQUFWLElBQWUsS0FBSyxHQUFMLE1BQWMsR0FBakMsRUFBc0M7QUFBRTtBQUN0QyxxQkFBUyxJQUFULENBQWM7QUFDWixzQkFBUSxDQURJO0FBRVosc0JBQVEsS0FGSTtBQUdaLHFCQUFPLENBQUMsS0FBSyxHQUFMO0FBSEksYUFBZDtBQUtEO0FBQ0Y7QUFDRjtBQUNGLEtBZEQsRUFOVyxDQW9CUDtBQUNKLFlBQVEsS0FBUixHQUFnQixTQUFoQjtBQUNBLFlBQVEsS0FBUixHQUFnQixRQUFoQjtBQUNBLFlBQVEsR0FBUixDQUFZLE9BQVo7QUFDQSxXQUFPLE9BQVA7QUFDRCxHQS9HUSxDQStHUDs7QUFFRixXQUFTLE1BQVQsQ0FBZ0IsT0FBaEIsRUFBeUI7QUFDeEI7Ozs7QUFJQyxXQUFPLE1BQVAsQ0FBYyxHQUFHLE1BQUgsQ0FBVSxRQUFRLEtBQWxCLEVBQXlCO0FBQUEsYUFBSyxFQUFFLEtBQVA7QUFBQSxLQUF6QixDQUFkO0FBQ0Esa0JBQWMsTUFBZCxDQUFxQixDQUFDLENBQUQsRUFBSSxHQUFHLElBQUgsQ0FBUSxRQUFRLEtBQWhCLEVBQXVCO0FBQUEsYUFBSyxFQUFFLEtBQVA7QUFBQSxLQUF2QixJQUF1QyxHQUFHLFNBQUgsQ0FBYSxRQUFRLEtBQXJCLEVBQTRCO0FBQUEsYUFBSyxFQUFFLEtBQVA7QUFBQSxLQUE1QixJQUE0QyxDQUF2RixDQUFyQjs7QUFFQSxRQUFJLFNBQVMsQ0FBYjtBQUNBLGFBQVMsS0FBVCxDQUFlLElBQWYsRUFBb0I7QUFDbEIsVUFBSSxJQUFJLENBQVI7QUFDQSxjQUFRLEtBQVIsQ0FBYyxPQUFkLENBQXNCLGdCQUFRO0FBQzVCLFlBQUssS0FBSyxNQUFMLEtBQWdCLElBQWhCLElBQXdCLEtBQUssTUFBTCxLQUFnQixJQUE3QyxFQUFtRDtBQUNqRDtBQUNEO0FBQ0YsT0FKRDtBQUtBLGFBQU8sQ0FBUDtBQUNEO0FBQ0QsZUFDSyxLQURMLENBQ1csUUFBUSxLQURuQixFQUVLLEVBRkwsQ0FFUSxNQUZSLEVBRWdCLE1BRmhCOztBQUlBLGVBQVcsS0FBWCxDQUFpQixNQUFqQixFQUNLLEtBREwsQ0FDVyxRQUFRLEtBRG5CLEVBRUssUUFGTCxDQUVjLGFBQUs7QUFDZjtBQUNFLGFBQU8sRUFBRSxNQUFGLENBQVMsT0FBVCxLQUFxQixFQUFFLE1BQUYsQ0FBUyxPQUE5QixHQUF5QyxJQUFJLEtBQUssR0FBTCxDQUFTLE1BQU0sRUFBRSxNQUFSLENBQVQsRUFBMEIsTUFBTSxFQUFFLE1BQVIsQ0FBMUIsQ0FBN0MsR0FBNEYsSUFBSSxLQUFLLEdBQUwsQ0FBUyxNQUFNLEVBQUUsTUFBUixDQUFULEVBQTBCLE1BQU0sRUFBRSxNQUFSLENBQTFCLENBQU4sR0FBcUQsRUFBdEosQ0FGYSxDQUU2STtBQUMzSixLQUxMO0FBTUEsUUFBSSxNQUFNLEdBQUcsTUFBSCxDQUFVLE1BQVYsRUFDUCxNQURPLENBQ0EsS0FEQSxFQUVQLElBRk8sQ0FFRixPQUZFLEVBRU8sTUFGUCxFQUdQLElBSE8sQ0FHRixPQUhFLEVBR00sNEJBSE4sRUFJUCxJQUpPLENBSUYsU0FKRSxFQUlRLEtBSlIsRUFLUCxJQUxPLENBS0YsU0FMRSxFQUtTLGFBTFQsRUFNUCxNQU5PLENBTUEsR0FOQSxFQU9QLElBUE8sQ0FPRixXQVBFLEVBT1csZUFBZSxPQUFPLElBQXRCLEdBQTZCLEdBQTdCLEdBQW1DLE9BQU8sR0FBMUMsR0FBZ0QsR0FQM0QsQ0FBVjs7QUFTQSxRQUFJLE9BQU8sSUFBSSxNQUFKLENBQVcsR0FBWCxFQUNSLElBRFEsQ0FDSCxPQURHLEVBQ00sT0FETixFQUVSLFNBRlEsQ0FFRSxNQUZGLEVBR1IsSUFIUSxDQUdILFFBQVEsS0FITCxFQUlSLEtBSlEsR0FJQSxNQUpBLENBSU8sTUFKUCxFQUtSLElBTFEsQ0FLSCxRQUxHLEVBS08sYUFBSzs7QUFFbkIsYUFBTyxFQUFFLE1BQUYsQ0FBUyxPQUFULEtBQXFCLEVBQUUsTUFBRixDQUFTLE9BQTlCLEdBQXdDLE1BQU0sRUFBRSxNQUFGLENBQVMsT0FBZixDQUF4QyxHQUFrRSxNQUF6RTtBQUNELEtBUlEsRUFTUixJQVRRLENBU0gsY0FURyxFQVNhLFVBQVMsQ0FBVCxFQUFZO0FBQUUsYUFBTyxFQUFFLEtBQUYsR0FBVSxDQUFWLElBQWUsRUFBRSxNQUFGLENBQVMsT0FBVCxLQUFxQixFQUFFLE1BQUYsQ0FBUyxPQUE3QyxHQUF1RCxLQUFLLElBQUwsQ0FBVSxFQUFFLEtBQVosSUFBcUIsRUFBNUUsR0FBaUYsQ0FBeEY7QUFBNEYsS0FUdkgsQ0FBWDs7QUFXQSxRQUFJLE9BQU8sSUFBSSxNQUFKLENBQVcsR0FBWCxFQUNSLElBRFEsQ0FDSCxPQURHLEVBQ00sT0FETixFQUVSLFNBRlEsQ0FFRSxRQUZGLEVBR1IsSUFIUSxDQUdILFFBQVEsS0FITCxFQUlSLEtBSlEsR0FJQSxNQUpBLENBSU8sUUFKUCxFQUtOLElBTE0sQ0FLRCxHQUxDLEVBS0k7QUFBQSxhQUFLLE9BQU8sRUFBRSxLQUFULENBQUw7QUFBQSxLQUxKLEVBTU4sSUFOTSxDQU1ELE1BTkMsRUFNTyxVQUFTLENBQVQsRUFBWTtBQUFFLGFBQU8sTUFBTSxFQUFFLE9BQVIsQ0FBUDtBQUEwQixLQU4vQyxFQU9OLElBUE0sQ0FPRCxHQUFHLElBQUgsR0FDRCxFQURDLENBQ0UsT0FERixFQUNXLFdBRFgsRUFFRCxFQUZDLENBRUUsTUFGRixFQUVVLE9BRlYsRUFHRCxFQUhDLENBR0UsS0FIRixFQUdTLFNBSFQsQ0FQQyxDQUFYOztBQVlGLFNBQUssTUFBTCxDQUFZLE9BQVosRUFDSyxJQURMLENBQ1UsVUFBUyxDQUFULEVBQVk7QUFBRSxhQUFPLEVBQUUsRUFBVDtBQUFjLEtBRHRDOztBQUlBLGFBQVMsTUFBVCxHQUFrQjtBQUNoQixXQUNLLElBREwsQ0FDVSxJQURWLEVBQ2dCLFVBQVMsQ0FBVCxFQUFZO0FBQUUsZUFBTyxFQUFFLE1BQUYsQ0FBUyxDQUFoQjtBQUFvQixPQURsRCxFQUVLLElBRkwsQ0FFVSxJQUZWLEVBRWdCLFVBQVMsQ0FBVCxFQUFZO0FBQUUsZUFBTyxFQUFFLE1BQUYsQ0FBUyxDQUFoQjtBQUFvQixPQUZsRCxFQUdLLElBSEwsQ0FHVSxJQUhWLEVBR2dCLFVBQVMsQ0FBVCxFQUFZO0FBQUUsZUFBTyxFQUFFLE1BQUYsQ0FBUyxDQUFoQjtBQUFvQixPQUhsRCxFQUlLLElBSkwsQ0FJVSxJQUpWLEVBSWdCLFVBQVMsQ0FBVCxFQUFZO0FBQUUsZUFBTyxFQUFFLE1BQUYsQ0FBUyxDQUFoQjtBQUFvQixPQUpsRDs7QUFNQSxXQUNLLElBREwsQ0FDVSxJQURWLEVBQ2dCLFVBQVMsQ0FBVCxFQUFZO0FBQ3RCLFVBQUUsQ0FBRixHQUFNLEtBQUssR0FBTCxDQUFTLE1BQVQsRUFBaUIsS0FBSyxHQUFMLENBQVMsUUFBUSxNQUFqQixFQUF5QixFQUFFLENBQTNCLENBQWpCLENBQU47QUFDQSxlQUFPLEVBQUUsQ0FBVDtBQUNELE9BSkwsRUFLSyxJQUxMLENBS1UsSUFMVixFQUtnQixVQUFTLENBQVQsRUFBWTtBQUN0QixVQUFFLENBQUYsR0FBTSxLQUFLLEdBQUwsQ0FBUyxNQUFULEVBQWlCLEtBQUssR0FBTCxDQUFTLFNBQVMsTUFBbEIsRUFBMEIsRUFBRSxDQUE1QixDQUFqQixDQUFOO0FBQ0EsZUFBTyxFQUFFLENBQVQ7QUFDRCxPQVJMO0FBU0Q7QUFHQSxHQXBNUSxDQW9NUDtBQUNGLFdBQVMsV0FBVCxDQUFxQixDQUFyQixFQUF3QjtBQUN4QixRQUFJLENBQUMsR0FBRyxLQUFILENBQVMsTUFBZCxFQUFzQjtBQUNwQixpQkFBVyxXQUFYLENBQXVCLEdBQXZCLEVBQTRCLE9BQTVCO0FBQ0Q7QUFDRCxNQUFFLEVBQUYsR0FBTyxFQUFFLENBQVQ7QUFDQSxNQUFFLEVBQUYsR0FBTyxFQUFFLENBQVQ7QUFDRDs7QUFFRCxXQUFTLE9BQVQsQ0FBaUIsQ0FBakIsRUFBb0I7QUFDbEIsTUFBRSxFQUFGLEdBQU8sR0FBRyxLQUFILENBQVMsQ0FBaEI7QUFDQSxNQUFFLEVBQUYsR0FBTyxHQUFHLEtBQUgsQ0FBUyxDQUFoQjtBQUNEOztBQUVELFdBQVMsU0FBVCxDQUFtQixDQUFuQixFQUFzQjtBQUNwQixRQUFJLENBQUMsR0FBRyxLQUFILENBQVMsTUFBZCxFQUFzQjtBQUNwQixpQkFBVyxXQUFYLENBQXVCLENBQXZCO0FBQ0Q7QUFDRCxNQUFFLEVBQUYsR0FBTyxJQUFQO0FBQ0EsTUFBRSxFQUFGLEdBQU8sSUFBUDtBQUNEO0FBQ0EsQ0F6TkQsSSxDQUhBOzs7Ozs7Ozs7Ozs7QUNBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQW1CQzs7QUFFTyxJQUFNLDhCQUFZLFlBQVU7QUFDaEMsTUFBSyxXQUFXLFdBQVcsU0FBdEIsS0FBb0MsS0FBekMsRUFBaUQ7QUFDL0MsZUFBVyxTQUFYLENBQXFCLEtBQXJCLEdBQTZCLFlBQVksU0FBWixDQUFzQixLQUFuRDtBQUNEO0FBQ0QsTUFBSyxVQUFVLFdBQVcsU0FBckIsS0FBbUMsS0FBeEMsRUFBZ0Q7QUFDOUMsZUFBVyxTQUFYLENBQXFCLElBQXJCLEdBQTRCLFlBQVksU0FBWixDQUFzQixJQUFsRDtBQUNEO0FBQ0gsQ0FQdUIsRUFBakI7O0FBWVI7Ozs7Ozs7Ozs7OztBQVlBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFTyxJQUFNLHNDQUFnQixZQUFXO0FBQ3RDLE1BQUksZUFBZSxTQUFmLFlBQWUsQ0FBUyxJQUFULEVBQWUsTUFBZixFQUF1QjtBQUN4QyxRQUFJLFdBQVcsS0FBSyxRQUFwQjtBQUNBLFFBQUksWUFBWSxDQUFoQixFQUFtQjtBQUFFO0FBQ25CO0FBQ0EsYUFBTyxJQUFQLENBQVksS0FBSyxXQUFMLENBQWlCLE9BQWpCLENBQXlCLEdBQXpCLEVBQThCLE9BQTlCLEVBQXVDLE9BQXZDLENBQStDLEdBQS9DLEVBQW9ELE1BQXBELEVBQTRELE9BQTVELENBQW9FLEdBQXBFLEVBQXlFLE1BQXpFLENBQVo7QUFDRCxLQUhELE1BR08sSUFBSSxZQUFZLENBQWhCLEVBQW1CO0FBQUU7QUFDMUI7QUFDQSxhQUFPLElBQVAsQ0FBWSxHQUFaLEVBQWlCLEtBQUssT0FBdEI7QUFDQSxVQUFJLEtBQUssYUFBTCxFQUFKLEVBQTBCO0FBQ3hCLFlBQUksVUFBVSxLQUFLLFVBQW5CO0FBQ0EsYUFBSyxJQUFJLElBQUksQ0FBUixFQUFXLE1BQU0sUUFBUSxNQUE5QixFQUFzQyxJQUFJLEdBQTFDLEVBQStDLEVBQUUsQ0FBakQsRUFBb0Q7QUFDbEQsY0FBSSxXQUFXLFFBQVEsSUFBUixDQUFhLENBQWIsQ0FBZjtBQUNBLGlCQUFPLElBQVAsQ0FBWSxHQUFaLEVBQWlCLFNBQVMsSUFBMUIsRUFBZ0MsS0FBaEMsRUFBdUMsU0FBUyxLQUFoRCxFQUF1RCxJQUF2RDtBQUNEO0FBQ0Y7QUFDRCxVQUFJLEtBQUssYUFBTCxFQUFKLEVBQTBCO0FBQ3hCLGVBQU8sSUFBUCxDQUFZLEdBQVo7QUFDQSxZQUFJLGFBQWEsS0FBSyxVQUF0QjtBQUNBLGFBQUssSUFBSSxJQUFJLENBQVIsRUFBVyxNQUFNLFdBQVcsTUFBakMsRUFBeUMsSUFBSSxHQUE3QyxFQUFrRCxFQUFFLENBQXBELEVBQXVEO0FBQ3JELHVCQUFhLFdBQVcsSUFBWCxDQUFnQixDQUFoQixDQUFiLEVBQWlDLE1BQWpDO0FBQ0Q7QUFDRCxlQUFPLElBQVAsQ0FBWSxJQUFaLEVBQWtCLEtBQUssT0FBdkIsRUFBZ0MsR0FBaEM7QUFDRCxPQVBELE1BT087QUFDTCxlQUFPLElBQVAsQ0FBWSxJQUFaO0FBQ0Q7QUFDRixLQXBCTSxNQW9CQSxJQUFJLFlBQVksQ0FBaEIsRUFBbUI7QUFDeEI7QUFDQSxhQUFPLElBQVAsQ0FBWSxNQUFaLEVBQW9CLEtBQUssU0FBekIsRUFBb0MsS0FBcEM7QUFDRCxLQUhNLE1BR0E7QUFDTDtBQUNBO0FBQ0E7QUFDQSxZQUFNLG9EQUFvRCxRQUExRDtBQUNEO0FBQ0YsR0FsQ0Q7QUFtQ0E7QUFDQSxNQUFLLGVBQWUsV0FBVyxTQUExQixLQUF3QyxLQUE3QyxFQUFvRDtBQUNsRCxXQUFPLGNBQVAsQ0FBc0IsV0FBVyxTQUFqQyxFQUE0QyxXQUE1QyxFQUF5RDtBQUN2RCxXQUFLLGVBQVc7QUFDZCxZQUFJLFNBQVMsRUFBYjtBQUNBLFlBQUksWUFBWSxLQUFLLFVBQXJCO0FBQ0EsZUFBTyxTQUFQLEVBQWtCO0FBQ2hCLHVCQUFhLFNBQWIsRUFBd0IsTUFBeEI7QUFDQSxzQkFBWSxVQUFVLFdBQXRCO0FBQ0Q7QUFDRCxlQUFPLE9BQU8sSUFBUCxDQUFZLEVBQVosQ0FBUDtBQUNELE9BVHNEO0FBVXZELFdBQUssYUFBUyxVQUFULEVBQXFCO0FBQ3hCLGdCQUFRLEdBQVIsQ0FBWSxJQUFaO0FBQ0E7QUFDQSxlQUFPLEtBQUssVUFBWixFQUF3QjtBQUN0QixlQUFLLFdBQUwsQ0FBaUIsS0FBSyxVQUF0QjtBQUNEOztBQUVELFlBQUk7QUFDRjtBQUNBLGNBQUksT0FBTyxJQUFJLFNBQUosRUFBWDtBQUNBLGVBQUssS0FBTCxHQUFhLEtBQWI7QUFDQTtBQUNBLGtCQUFRLEdBQVIsQ0FBWSxVQUFaO0FBQ0EsY0FBSSxPQUFPLDZDQUE2QyxVQUE3QyxHQUEwRCxRQUFyRTtBQUNBLGtCQUFRLEdBQVIsQ0FBWSxJQUFaO0FBQ0EsY0FBSSxnQkFBZ0IsS0FBSyxlQUFMLENBQXFCLElBQXJCLEVBQTJCLFVBQTNCLEVBQXVDLGVBQTNEOztBQUVBO0FBQ0EsY0FBSSxZQUFZLGNBQWMsVUFBOUI7QUFDQSxpQkFBTSxTQUFOLEVBQWlCO0FBQ2YsaUJBQUssV0FBTCxDQUFpQixLQUFLLGFBQUwsQ0FBbUIsVUFBbkIsQ0FBOEIsU0FBOUIsRUFBeUMsSUFBekMsQ0FBakI7QUFDQSx3QkFBWSxVQUFVLFdBQXRCO0FBQ0Q7QUFDRixTQWhCRCxDQWdCRSxPQUFNLENBQU4sRUFBUztBQUNULGdCQUFNLElBQUksS0FBSixDQUFVLDBCQUFWLENBQU47QUFDRDtBQUNGO0FBcENzRCxLQUF6RDs7QUF1Q0E7QUFDQSxXQUFPLGNBQVAsQ0FBc0IsV0FBVyxTQUFqQyxFQUE0QyxVQUE1QyxFQUF3RDtBQUN0RCxXQUFLLGVBQVc7QUFDZCxlQUFPLEtBQUssU0FBWjtBQUNELE9BSHFEO0FBSXRELFdBQUssYUFBUyxVQUFULEVBQXFCO0FBQ3hCLGFBQUssU0FBTCxHQUFpQixVQUFqQjtBQUNEO0FBTnFELEtBQXhEO0FBUUQ7QUFDRixDQXZGMkIsRUFBckI7O0FBMEZQO0FBQ08sSUFBTSxnQ0FBYSxZQUFVO0FBQ2xDLE1BQUksQ0FBQyxNQUFNLFNBQU4sQ0FBZ0IsSUFBckIsRUFBMkI7QUFDekIsV0FBTyxjQUFQLENBQXNCLE1BQU0sU0FBNUIsRUFBdUMsTUFBdkMsRUFBK0M7QUFDN0MsYUFBTyxlQUFTLFNBQVQsRUFBb0I7QUFDMUI7QUFDQyxZQUFJLFFBQVEsSUFBWixFQUFrQjtBQUNoQixnQkFBTSxJQUFJLFNBQUosQ0FBYywrQkFBZCxDQUFOO0FBQ0Q7O0FBRUQsWUFBSSxJQUFJLE9BQU8sSUFBUCxDQUFSOztBQUVBO0FBQ0EsWUFBSSxNQUFNLEVBQUUsTUFBRixLQUFhLENBQXZCOztBQUVBO0FBQ0EsWUFBSSxPQUFPLFNBQVAsS0FBcUIsVUFBekIsRUFBcUM7QUFDbkMsZ0JBQU0sSUFBSSxTQUFKLENBQWMsOEJBQWQsQ0FBTjtBQUNEOztBQUVEO0FBQ0EsWUFBSSxVQUFVLFVBQVUsQ0FBVixDQUFkOztBQUVBO0FBQ0EsWUFBSSxJQUFJLENBQVI7O0FBRUE7QUFDQSxlQUFPLElBQUksR0FBWCxFQUFnQjtBQUNkO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBSSxTQUFTLEVBQUUsQ0FBRixDQUFiO0FBQ0EsY0FBSSxVQUFVLElBQVYsQ0FBZSxPQUFmLEVBQXdCLE1BQXhCLEVBQWdDLENBQWhDLEVBQW1DLENBQW5DLENBQUosRUFBMkM7QUFDekMsbUJBQU8sTUFBUDtBQUNEO0FBQ0Q7QUFDQTtBQUNEOztBQUVEO0FBQ0EsZUFBTyxTQUFQO0FBQ0Q7QUF2QzRDLEtBQS9DO0FBeUNEO0FBQ0YsQ0E1Q3dCLEVBQWxCOztBQThDUDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBdUJDOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNEO0FBQ0M7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFTSxJQUFNLDRCQUFXLFVBQVMsTUFBVCxFQUFnQjtBQUFFO0FBQzFDOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFDQSxNQUFJLE9BQU8sT0FBUCxLQUFtQixXQUF2QixFQUFvQztBQUNsQyxXQUFPLE9BQVAsR0FBaUIsWUFBVSxDQUFFLENBQTdCO0FBQ0EsV0FBTyxPQUFQLENBQWUsU0FBZixHQUEyQjtBQUN6QixXQUFLLGFBQVMsQ0FBVCxFQUFZO0FBQUUsZUFBTyxTQUFQO0FBQW1CLE9BRGI7QUFFekIsV0FBSyxhQUFTLENBQVQsRUFBVyxDQUFYLEVBQWM7QUFBRSxjQUFNLElBQUksS0FBSixDQUFVLHVCQUFWLENBQU47QUFBMkM7QUFGdkMsS0FBM0I7QUFJRDs7QUFFRDs7QUFFQSxXQUFTLG1CQUFULENBQTZCLElBQTdCLEVBQW1DO0FBQ2pDLFdBQU8sc0RBQXFELElBQXJELENBQTBELElBQTFEO0FBQVA7QUFDRDs7QUFFRDtBQUNBLFdBQVMsb0JBQVQsQ0FBOEIsR0FBOUIsRUFBbUM7QUFDakMsUUFBSSxPQUFPLEdBQVAsTUFBZ0IsR0FBcEIsRUFBeUI7QUFDdkIsWUFBTSxJQUFJLFNBQUosQ0FBYyxxREFDQSxHQURkLENBQU47QUFFRDtBQUNELFFBQUksT0FBTyxFQUFYO0FBQ0EsUUFBSSxnQkFBZ0IsR0FBcEIsRUFBeUI7QUFBRSxXQUFLLFVBQUwsR0FBa0IsQ0FBQyxDQUFDLElBQUksVUFBeEI7QUFBcUM7QUFDaEUsUUFBSSxrQkFBa0IsR0FBdEIsRUFBMkI7QUFBRSxXQUFLLFlBQUwsR0FBb0IsQ0FBQyxDQUFDLElBQUksWUFBMUI7QUFBeUM7QUFDdEUsUUFBSSxXQUFXLEdBQWYsRUFBb0I7QUFBRSxXQUFLLEtBQUwsR0FBYSxJQUFJLEtBQWpCO0FBQXlCO0FBQy9DLFFBQUksY0FBYyxHQUFsQixFQUF1QjtBQUFFLFdBQUssUUFBTCxHQUFnQixDQUFDLENBQUMsSUFBSSxRQUF0QjtBQUFpQztBQUMxRCxRQUFJLFNBQVMsR0FBYixFQUFrQjtBQUNoQixVQUFJLFNBQVMsSUFBSSxHQUFqQjtBQUNBLFVBQUksV0FBVyxTQUFYLElBQXdCLE9BQU8sTUFBUCxLQUFrQixVQUE5QyxFQUEwRDtBQUN4RCxjQUFNLElBQUksU0FBSixDQUFjLGlEQUNBLGdDQURBLEdBQ2lDLE1BRC9DLENBQU47QUFFRDtBQUNELFdBQUssR0FBTCxHQUFXLE1BQVg7QUFDRDtBQUNELFFBQUksU0FBUyxHQUFiLEVBQWtCO0FBQ2hCLFVBQUksU0FBUyxJQUFJLEdBQWpCO0FBQ0EsVUFBSSxXQUFXLFNBQVgsSUFBd0IsT0FBTyxNQUFQLEtBQWtCLFVBQTlDLEVBQTBEO0FBQ3hELGNBQU0sSUFBSSxTQUFKLENBQWMsaURBQ0EsZ0NBREEsR0FDaUMsTUFEL0MsQ0FBTjtBQUVEO0FBQ0QsV0FBSyxHQUFMLEdBQVcsTUFBWDtBQUNEO0FBQ0QsUUFBSSxTQUFTLElBQVQsSUFBaUIsU0FBUyxJQUE5QixFQUFvQztBQUNsQyxVQUFJLFdBQVcsSUFBWCxJQUFtQixjQUFjLElBQXJDLEVBQTJDO0FBQ3pDLGNBQU0sSUFBSSxTQUFKLENBQWMsc0RBQ0EsdUJBREEsR0FDd0IsR0FEdEMsQ0FBTjtBQUVEO0FBQ0Y7QUFDRCxXQUFPLElBQVA7QUFDRDs7QUFFRCxXQUFTLG9CQUFULENBQThCLElBQTlCLEVBQW9DO0FBQ2xDLFFBQUksU0FBUyxTQUFiLEVBQXdCLE9BQU8sS0FBUDtBQUN4QixXQUFRLFNBQVMsSUFBVCxJQUFpQixTQUFTLElBQWxDO0FBQ0Q7QUFDRCxXQUFTLGdCQUFULENBQTBCLElBQTFCLEVBQWdDO0FBQzlCLFFBQUksU0FBUyxTQUFiLEVBQXdCLE9BQU8sS0FBUDtBQUN4QixXQUFRLFdBQVcsSUFBWCxJQUFtQixjQUFjLElBQXpDO0FBQ0Q7QUFDRCxXQUFTLG1CQUFULENBQTZCLElBQTdCLEVBQW1DO0FBQ2pDLFFBQUksU0FBUyxTQUFiLEVBQXdCLE9BQU8sS0FBUDtBQUN4QixXQUFPLENBQUMscUJBQXFCLElBQXJCLENBQUQsSUFBK0IsQ0FBQyxpQkFBaUIsSUFBakIsQ0FBdkM7QUFDRDs7QUFFRCxXQUFTLDRCQUFULENBQXNDLElBQXRDLEVBQTRDO0FBQzFDLFFBQUksZUFBZSxxQkFBcUIsSUFBckIsQ0FBbkI7QUFDQSxRQUFJLG9CQUFvQixZQUFwQixLQUFxQyxpQkFBaUIsWUFBakIsQ0FBekMsRUFBeUU7QUFDdkUsVUFBSSxFQUFFLFdBQVcsWUFBYixDQUFKLEVBQWdDO0FBQUUscUJBQWEsS0FBYixHQUFxQixTQUFyQjtBQUFpQztBQUNuRSxVQUFJLEVBQUUsY0FBYyxZQUFoQixDQUFKLEVBQW1DO0FBQUUscUJBQWEsUUFBYixHQUF3QixLQUF4QjtBQUFnQztBQUN0RSxLQUhELE1BR087QUFDTCxVQUFJLEVBQUUsU0FBUyxZQUFYLENBQUosRUFBOEI7QUFBRSxxQkFBYSxHQUFiLEdBQW1CLFNBQW5CO0FBQStCO0FBQy9ELFVBQUksRUFBRSxTQUFTLFlBQVgsQ0FBSixFQUE4QjtBQUFFLHFCQUFhLEdBQWIsR0FBbUIsU0FBbkI7QUFBK0I7QUFDaEU7QUFDRCxRQUFJLEVBQUUsZ0JBQWdCLFlBQWxCLENBQUosRUFBcUM7QUFBRSxtQkFBYSxVQUFiLEdBQTBCLEtBQTFCO0FBQWtDO0FBQ3pFLFFBQUksRUFBRSxrQkFBa0IsWUFBcEIsQ0FBSixFQUF1QztBQUFFLG1CQUFhLFlBQWIsR0FBNEIsS0FBNUI7QUFBb0M7QUFDN0UsV0FBTyxZQUFQO0FBQ0Q7O0FBRUQsV0FBUyxpQkFBVCxDQUEyQixJQUEzQixFQUFpQztBQUMvQixXQUFPLEVBQUUsU0FBUyxJQUFYLEtBQ0EsRUFBRSxTQUFTLElBQVgsQ0FEQSxJQUVBLEVBQUUsV0FBVyxJQUFiLENBRkEsSUFHQSxFQUFFLGNBQWMsSUFBaEIsQ0FIQSxJQUlBLEVBQUUsZ0JBQWdCLElBQWxCLENBSkEsSUFLQSxFQUFFLGtCQUFrQixJQUFwQixDQUxQO0FBTUQ7O0FBRUQsV0FBUyxzQkFBVCxDQUFnQyxLQUFoQyxFQUF1QyxLQUF2QyxFQUE4QztBQUM1QyxXQUFPLFVBQVUsTUFBTSxHQUFoQixFQUFxQixNQUFNLEdBQTNCLEtBQ0EsVUFBVSxNQUFNLEdBQWhCLEVBQXFCLE1BQU0sR0FBM0IsQ0FEQSxJQUVBLFVBQVUsTUFBTSxLQUFoQixFQUF1QixNQUFNLEtBQTdCLENBRkEsSUFHQSxVQUFVLE1BQU0sUUFBaEIsRUFBMEIsTUFBTSxRQUFoQyxDQUhBLElBSUEsVUFBVSxNQUFNLFVBQWhCLEVBQTRCLE1BQU0sVUFBbEMsQ0FKQSxJQUtBLFVBQVUsTUFBTSxZQUFoQixFQUE4QixNQUFNLFlBQXBDLENBTFA7QUFNRDs7QUFFRDtBQUNBLFdBQVMsU0FBVCxDQUFtQixDQUFuQixFQUFzQixDQUF0QixFQUF5QjtBQUN2QixRQUFJLE1BQU0sQ0FBVixFQUFhO0FBQ1g7QUFDQSxhQUFPLE1BQU0sQ0FBTixJQUFXLElBQUksQ0FBSixLQUFVLElBQUksQ0FBaEM7QUFDRDs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBTyxNQUFNLENBQU4sSUFBVyxNQUFNLENBQXhCO0FBQ0Q7O0FBRUQ7Ozs7Ozs7Ozs7QUFVQSxXQUFTLHNDQUFULENBQWdELFVBQWhELEVBQTREO0FBQzFELFFBQUksZUFBZSxTQUFuQixFQUE4QjtBQUFFLGFBQU8sU0FBUDtBQUFtQjtBQUNuRCxRQUFJLE9BQU8sNkJBQTZCLFVBQTdCLENBQVg7QUFDQTtBQUNBO0FBQ0EsU0FBSyxJQUFJLElBQVQsSUFBaUIsVUFBakIsRUFBNkI7QUFDM0IsVUFBSSxDQUFDLG9CQUFvQixJQUFwQixDQUFMLEVBQWdDO0FBQzlCLGVBQU8sY0FBUCxDQUFzQixJQUF0QixFQUE0QixJQUE1QixFQUNFLEVBQUUsT0FBTyxXQUFXLElBQVgsQ0FBVDtBQUNFLG9CQUFVLElBRFo7QUFFRSxzQkFBWSxJQUZkO0FBR0Usd0JBQWMsSUFIaEIsRUFERjtBQUtEO0FBQ0Y7QUFDRCxXQUFPLElBQVA7QUFDRDs7QUFFRDs7Ozs7Ozs7OztBQVVBLFdBQVMsMkJBQVQsQ0FBcUMsVUFBckMsRUFBaUQ7QUFDL0MsUUFBSSxPQUFPLHFCQUFxQixVQUFyQixDQUFYO0FBQ0E7QUFDQTtBQUNBLFNBQUssSUFBSSxJQUFULElBQWlCLFVBQWpCLEVBQTZCO0FBQzNCLFVBQUksQ0FBQyxvQkFBb0IsSUFBcEIsQ0FBTCxFQUFnQztBQUM5QixlQUFPLGNBQVAsQ0FBc0IsSUFBdEIsRUFBNEIsSUFBNUIsRUFDRSxFQUFFLE9BQU8sV0FBVyxJQUFYLENBQVQ7QUFDRSxvQkFBVSxJQURaO0FBRUUsc0JBQVksSUFGZDtBQUdFLHdCQUFjLElBSGhCLEVBREY7QUFLRDtBQUNGO0FBQ0QsV0FBTyxJQUFQO0FBQ0Q7O0FBRUQ7QUFDQSxNQUFJLHlCQUFnQyxPQUFPLGlCQUEzQztBQUFBLE1BQ0ksWUFBZ0MsT0FBTyxJQUQzQztBQUFBLE1BRUksY0FBZ0MsT0FBTyxNQUYzQztBQUFBLE1BR0ksb0JBQWdDLE9BQU8sWUFIM0M7QUFBQSxNQUlJLGdCQUFnQyxPQUFPLFFBSjNDO0FBQUEsTUFLSSxnQkFBZ0MsT0FBTyxRQUwzQztBQUFBLE1BTUksc0JBQWdDLE9BQU8sY0FOM0M7QUFBQSxNQU9JLGdDQUFnQyxPQUFPLHdCQVAzQztBQUFBLE1BUUksc0JBQWdDLE9BQU8sY0FSM0M7QUFBQSxNQVNJLHdCQUFnQyxPQUFPLGdCQVQzQztBQUFBLE1BVUksWUFBZ0MsT0FBTyxJQVYzQztBQUFBLE1BV0ksMkJBQWdDLE9BQU8sbUJBWDNDO0FBQUEsTUFZSSw2QkFBZ0MsT0FBTyxxQkFaM0M7QUFBQSxNQWFJLGNBQWdDLE9BQU8sTUFiM0M7QUFBQSxNQWNJLGVBQWdDLE1BQU0sT0FkMUM7QUFBQSxNQWVJLGNBQWdDLE1BQU0sU0FBTixDQUFnQixNQWZwRDtBQUFBLE1BZ0JJLHFCQUFnQyxPQUFPLFNBQVAsQ0FBaUIsYUFoQnJEO0FBQUEsTUFpQkksc0JBQWdDLE9BQU8sU0FBUCxDQUFpQixjQWpCckQ7O0FBbUJBO0FBQ0E7QUFDQTtBQUNBLE1BQUksZUFBSixFQUNJLGVBREosRUFFSSxtQkFGSixFQUdJLHFCQUhKLEVBSUksMEJBSko7O0FBTUE7OztBQUdBLFdBQVMsT0FBVCxDQUFpQixJQUFqQixFQUF1QixNQUF2QixFQUErQjtBQUM3QixXQUFRLEVBQUQsQ0FBSyxjQUFMLENBQW9CLElBQXBCLENBQXlCLE1BQXpCLEVBQWlDLElBQWpDLENBQVA7QUFDRDtBQUNELFdBQVMsUUFBVCxDQUFrQixJQUFsQixFQUF3QixNQUF4QixFQUFnQztBQUM5QixRQUFJLE9BQU8sT0FBTyx3QkFBUCxDQUFnQyxNQUFoQyxFQUF3QyxJQUF4QyxDQUFYO0FBQ0EsUUFBSSxTQUFTLFNBQWIsRUFBd0I7QUFBRSxhQUFPLEtBQVA7QUFBZTtBQUN6QyxXQUFPLEtBQUssWUFBTCxLQUFzQixLQUE3QjtBQUNEO0FBQ0QsV0FBUyxZQUFULENBQXNCLElBQXRCLEVBQTRCO0FBQzFCLFdBQU8sU0FBUyxTQUFULElBQXNCLEtBQUssWUFBTCxLQUFzQixLQUFuRDtBQUNEOztBQUVEOzs7Ozs7O0FBT0EsV0FBUyxzQkFBVCxDQUFnQyxVQUFoQyxFQUE0QyxPQUE1QyxFQUFxRCxJQUFyRCxFQUEyRDtBQUN6RCxRQUFJLFlBQVksU0FBWixJQUF5QixlQUFlLEtBQTVDLEVBQW1EO0FBQ2pELGFBQU8sS0FBUDtBQUNEO0FBQ0QsUUFBSSxZQUFZLFNBQVosSUFBeUIsZUFBZSxJQUE1QyxFQUFrRDtBQUNoRCxhQUFPLElBQVA7QUFDRDtBQUNELFFBQUksa0JBQWtCLElBQWxCLENBQUosRUFBNkI7QUFDM0IsYUFBTyxJQUFQO0FBQ0Q7QUFDRCxRQUFJLHVCQUF1QixPQUF2QixFQUFnQyxJQUFoQyxDQUFKLEVBQTJDO0FBQ3pDLGFBQU8sSUFBUDtBQUNEO0FBQ0QsUUFBSSxRQUFRLFlBQVIsS0FBeUIsS0FBN0IsRUFBb0M7QUFDbEMsVUFBSSxLQUFLLFlBQUwsS0FBc0IsSUFBMUIsRUFBZ0M7QUFDOUIsZUFBTyxLQUFQO0FBQ0Q7QUFDRCxVQUFJLGdCQUFnQixJQUFoQixJQUF3QixLQUFLLFVBQUwsS0FBb0IsUUFBUSxVQUF4RCxFQUFvRTtBQUNsRSxlQUFPLEtBQVA7QUFDRDtBQUNGO0FBQ0QsUUFBSSxvQkFBb0IsSUFBcEIsQ0FBSixFQUErQjtBQUM3QixhQUFPLElBQVA7QUFDRDtBQUNELFFBQUksaUJBQWlCLE9BQWpCLE1BQThCLGlCQUFpQixJQUFqQixDQUFsQyxFQUEwRDtBQUN4RCxVQUFJLFFBQVEsWUFBUixLQUF5QixLQUE3QixFQUFvQztBQUNsQyxlQUFPLEtBQVA7QUFDRDtBQUNELGFBQU8sSUFBUDtBQUNEO0FBQ0QsUUFBSSxpQkFBaUIsT0FBakIsS0FBNkIsaUJBQWlCLElBQWpCLENBQWpDLEVBQXlEO0FBQ3ZELFVBQUksUUFBUSxZQUFSLEtBQXlCLEtBQTdCLEVBQW9DO0FBQ2xDLFlBQUksUUFBUSxRQUFSLEtBQXFCLEtBQXJCLElBQThCLEtBQUssUUFBTCxLQUFrQixJQUFwRCxFQUEwRDtBQUN4RCxpQkFBTyxLQUFQO0FBQ0Q7QUFDRCxZQUFJLFFBQVEsUUFBUixLQUFxQixLQUF6QixFQUFnQztBQUM5QixjQUFJLFdBQVcsSUFBWCxJQUFtQixDQUFDLFVBQVUsS0FBSyxLQUFmLEVBQXNCLFFBQVEsS0FBOUIsQ0FBeEIsRUFBOEQ7QUFDNUQsbUJBQU8sS0FBUDtBQUNEO0FBQ0Y7QUFDRjtBQUNELGFBQU8sSUFBUDtBQUNEO0FBQ0QsUUFBSSxxQkFBcUIsT0FBckIsS0FBaUMscUJBQXFCLElBQXJCLENBQXJDLEVBQWlFO0FBQy9ELFVBQUksUUFBUSxZQUFSLEtBQXlCLEtBQTdCLEVBQW9DO0FBQ2xDLFlBQUksU0FBUyxJQUFULElBQWlCLENBQUMsVUFBVSxLQUFLLEdBQWYsRUFBb0IsUUFBUSxHQUE1QixDQUF0QixFQUF3RDtBQUN0RCxpQkFBTyxLQUFQO0FBQ0Q7QUFDRCxZQUFJLFNBQVMsSUFBVCxJQUFpQixDQUFDLFVBQVUsS0FBSyxHQUFmLEVBQW9CLFFBQVEsR0FBNUIsQ0FBdEIsRUFBd0Q7QUFDdEQsaUJBQU8sS0FBUDtBQUNEO0FBQ0Y7QUFDRjtBQUNELFdBQU8sSUFBUDtBQUNEOztBQUVEO0FBQ0E7QUFDQSxXQUFTLGlCQUFULENBQTJCLE1BQTNCLEVBQW1DLEtBQW5DLEVBQTBDO0FBQ3hDLFFBQUksV0FBVywyQkFBMkIsTUFBM0IsQ0FBZjtBQUNBLFFBQUksbUJBQW1CLFNBQXZCO0FBQ0EsUUFBSSxVQUFVLFFBQWQsRUFBd0I7QUFDdEIsVUFBSSxJQUFJLENBQUMsU0FBUyxNQUFsQjtBQUNBLFVBQUksQ0FBSjtBQUNBLFdBQUssSUFBSSxJQUFJLENBQWIsRUFBZ0IsSUFBSSxDQUFwQixFQUF1QixHQUF2QixFQUE0QjtBQUMxQixZQUFJLE9BQU8sU0FBUyxDQUFULENBQVAsQ0FBSjtBQUNBLFlBQUk7QUFDRixpQkFBTyxjQUFQLENBQXNCLE1BQXRCLEVBQThCLENBQTlCLEVBQWlDLEVBQUUsY0FBYyxLQUFoQixFQUFqQztBQUNELFNBRkQsQ0FFRSxPQUFPLENBQVAsRUFBVTtBQUNWLGNBQUkscUJBQXFCLFNBQXpCLEVBQW9DO0FBQ2xDLCtCQUFtQixDQUFuQjtBQUNEO0FBQ0Y7QUFDRjtBQUNGLEtBYkQsTUFhTztBQUNMO0FBQ0EsVUFBSSxJQUFJLENBQUMsU0FBUyxNQUFsQjtBQUNBLFVBQUksQ0FBSjtBQUNBLFdBQUssSUFBSSxJQUFJLENBQWIsRUFBZ0IsSUFBSSxDQUFwQixFQUF1QixHQUF2QixFQUE0QjtBQUMxQixZQUFJLE9BQU8sU0FBUyxDQUFULENBQVAsQ0FBSjtBQUNBLFlBQUk7QUFDRixjQUFJLGNBQWMsT0FBTyx3QkFBUCxDQUFnQyxNQUFoQyxFQUF3QyxDQUF4QyxDQUFsQjtBQUNBLGNBQUksZ0JBQWdCLFNBQXBCLEVBQStCO0FBQzdCLGdCQUFJLElBQUo7QUFDQSxnQkFBSSxxQkFBcUIsV0FBckIsQ0FBSixFQUF1QztBQUNyQyxxQkFBTyxFQUFFLGNBQWMsS0FBaEIsRUFBUDtBQUNELGFBRkQsTUFFTztBQUNMLHFCQUFPLEVBQUUsY0FBYyxLQUFoQixFQUF1QixVQUFVLEtBQWpDLEVBQVA7QUFDRDtBQUNELG1CQUFPLGNBQVAsQ0FBc0IsTUFBdEIsRUFBOEIsQ0FBOUIsRUFBaUMsSUFBakM7QUFDRDtBQUNGLFNBWEQsQ0FXRSxPQUFPLENBQVAsRUFBVTtBQUNWLGNBQUkscUJBQXFCLFNBQXpCLEVBQW9DO0FBQ2xDLCtCQUFtQixDQUFuQjtBQUNEO0FBQ0Y7QUFDRjtBQUNGO0FBQ0QsUUFBSSxxQkFBcUIsU0FBekIsRUFBb0M7QUFDbEMsWUFBTSxnQkFBTjtBQUNEO0FBQ0QsV0FBTyxRQUFRLGlCQUFSLENBQTBCLE1BQTFCLENBQVA7QUFDRDs7QUFFRDtBQUNBO0FBQ0EsV0FBUyxrQkFBVCxDQUE0QixNQUE1QixFQUFvQyxLQUFwQyxFQUEyQztBQUN6QyxRQUFJLGVBQWUsb0JBQW9CLE1BQXBCLENBQW5CO0FBQ0EsUUFBSSxZQUFKLEVBQWtCLE9BQU8sS0FBUDs7QUFFbEIsUUFBSSxXQUFXLDJCQUEyQixNQUEzQixDQUFmO0FBQ0EsUUFBSSxtQkFBbUIsU0FBdkI7QUFDQSxRQUFJLGVBQWUsS0FBbkI7QUFDQSxRQUFJLFdBQVcsS0FBZjs7QUFFQSxRQUFJLElBQUksQ0FBQyxTQUFTLE1BQWxCO0FBQ0EsUUFBSSxDQUFKO0FBQ0EsUUFBSSxXQUFKO0FBQ0EsU0FBSyxJQUFJLElBQUksQ0FBYixFQUFnQixJQUFJLENBQXBCLEVBQXVCLEdBQXZCLEVBQTRCO0FBQzFCLFVBQUksT0FBTyxTQUFTLENBQVQsQ0FBUCxDQUFKO0FBQ0EsVUFBSTtBQUNGLHNCQUFjLE9BQU8sd0JBQVAsQ0FBZ0MsTUFBaEMsRUFBd0MsQ0FBeEMsQ0FBZDtBQUNBLHVCQUFlLGdCQUFnQixZQUFZLFlBQTNDO0FBQ0EsWUFBSSxpQkFBaUIsV0FBakIsQ0FBSixFQUFtQztBQUNqQyxxQkFBVyxZQUFZLFlBQVksUUFBbkM7QUFDRDtBQUNGLE9BTkQsQ0FNRSxPQUFPLENBQVAsRUFBVTtBQUNWLFlBQUkscUJBQXFCLFNBQXpCLEVBQW9DO0FBQ2xDLDZCQUFtQixDQUFuQjtBQUNBLHlCQUFlLElBQWY7QUFDRDtBQUNGO0FBQ0Y7QUFDRCxRQUFJLHFCQUFxQixTQUF6QixFQUFvQztBQUNsQyxZQUFNLGdCQUFOO0FBQ0Q7QUFDRCxRQUFJLFVBQVUsUUFBVixJQUFzQixhQUFhLElBQXZDLEVBQTZDO0FBQzNDLGFBQU8sS0FBUDtBQUNEO0FBQ0QsUUFBSSxpQkFBaUIsSUFBckIsRUFBMkI7QUFDekIsYUFBTyxLQUFQO0FBQ0Q7QUFDRCxXQUFPLElBQVA7QUFDRDs7QUFFRDs7QUFFQTs7Ozs7Ozs7Ozs7OztBQWFBLFdBQVMsU0FBVCxDQUFtQixNQUFuQixFQUEyQixPQUEzQixFQUFvQztBQUNsQztBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQUssTUFBTCxHQUFlLE1BQWY7QUFDQSxTQUFLLE9BQUwsR0FBZSxPQUFmO0FBQ0Q7O0FBRUQsWUFBVSxTQUFWLEdBQXNCOztBQUVwQjs7Ozs7OztBQU9BLGFBQVMsaUJBQVMsUUFBVCxFQUFtQjtBQUMxQixVQUFJLE9BQU8sS0FBSyxPQUFMLENBQWEsUUFBYixDQUFYO0FBQ0EsVUFBSSxTQUFTLFNBQWIsRUFBd0I7QUFDdEI7QUFDQTtBQUNBLGVBQU8sU0FBUDtBQUNEOztBQUVELFVBQUksT0FBTyxJQUFQLEtBQWdCLFVBQXBCLEVBQWdDO0FBQzlCLGNBQU0sSUFBSSxTQUFKLENBQWMsV0FBVyx5QkFBWCxHQUFxQyxJQUFuRCxDQUFOO0FBQ0Q7O0FBRUQsYUFBTyxJQUFQO0FBQ0QsS0F0Qm1COztBQXdCcEI7O0FBRUE7Ozs7Ozs7O0FBUUEsOEJBQTBCLGtDQUFTLElBQVQsRUFBZTtBQUN2Qzs7QUFFQSxVQUFJLE9BQU8sS0FBSyxPQUFMLENBQWEsMEJBQWIsQ0FBWDtBQUNBLFVBQUksU0FBUyxTQUFiLEVBQXdCO0FBQ3RCLGVBQU8sUUFBUSx3QkFBUixDQUFpQyxLQUFLLE1BQXRDLEVBQThDLElBQTlDLENBQVA7QUFDRDs7QUFFRCxhQUFPLE9BQU8sSUFBUCxDQUFQO0FBQ0EsVUFBSSxPQUFPLEtBQUssSUFBTCxDQUFVLEtBQUssT0FBZixFQUF3QixLQUFLLE1BQTdCLEVBQXFDLElBQXJDLENBQVg7QUFDQSxhQUFPLHVDQUF1QyxJQUF2QyxDQUFQOztBQUVBLFVBQUksYUFBYSxPQUFPLHdCQUFQLENBQWdDLEtBQUssTUFBckMsRUFBNkMsSUFBN0MsQ0FBakI7QUFDQSxVQUFJLGFBQWEsT0FBTyxZQUFQLENBQW9CLEtBQUssTUFBekIsQ0FBakI7O0FBRUEsVUFBSSxTQUFTLFNBQWIsRUFBd0I7QUFDdEIsWUFBSSxhQUFhLFVBQWIsQ0FBSixFQUE4QjtBQUM1QixnQkFBTSxJQUFJLFNBQUosQ0FBYyw4Q0FBNEMsSUFBNUMsR0FDQSxtQkFEZCxDQUFOO0FBRUQ7QUFDRCxZQUFJLENBQUMsVUFBRCxJQUFlLGVBQWUsU0FBbEMsRUFBNkM7QUFDekM7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnQkFBTSxJQUFJLFNBQUosQ0FBYywwQ0FBd0MsSUFBeEMsR0FDQSw4Q0FEZCxDQUFOO0FBRUg7QUFDRCxlQUFPLFNBQVA7QUFDRDs7QUFFRDtBQUNBOztBQUVBO0FBQ0E7O0FBRUEsVUFBSSxDQUFDLFVBQUwsRUFBaUI7QUFDZixZQUFJLGVBQWUsU0FBbkIsRUFBOEI7QUFDNUIsZ0JBQU0sSUFBSSxTQUFKLENBQWMsdUNBQ0EsSUFEQSxHQUNPLDhCQURyQixDQUFOO0FBRUQ7QUFDRjs7QUFFRCxVQUFJLFNBQVMsU0FBYixFQUF3QjtBQUN0QixZQUFJLENBQUMsdUJBQXVCLFVBQXZCLEVBQW1DLFVBQW5DLEVBQStDLElBQS9DLENBQUwsRUFBMkQ7QUFDekQsZ0JBQU0sSUFBSSxTQUFKLENBQWMsb0RBQ0EsZ0JBREEsR0FDaUIsSUFEakIsR0FDc0IsR0FEcEMsQ0FBTjtBQUVEO0FBQ0Y7O0FBRUQsVUFBSSxLQUFLLFlBQUwsS0FBc0IsS0FBMUIsRUFBaUM7QUFDL0IsWUFBSSxlQUFlLFNBQWYsSUFBNEIsV0FBVyxZQUFYLEtBQTRCLElBQTVELEVBQWtFO0FBQ2hFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnQkFBTSxJQUFJLFNBQUosQ0FDSixpREFDQSw2Q0FEQSxHQUNnRCxJQURoRCxHQUN1RCxHQUZuRCxDQUFOO0FBR0Q7QUFDRCxZQUFJLGNBQWMsSUFBZCxJQUFzQixLQUFLLFFBQUwsS0FBa0IsS0FBNUMsRUFBbUQ7QUFDakQsY0FBSSxXQUFXLFFBQVgsS0FBd0IsSUFBNUIsRUFBa0M7QUFDaEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtCQUFNLElBQUksU0FBSixDQUNKLHdEQUF3RCxJQUF4RCxHQUNBLHFDQUZJLENBQU47QUFHRDtBQUNGO0FBQ0Y7O0FBRUQsYUFBTyxJQUFQO0FBQ0QsS0EvR21COztBQWlIcEI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQTBDQSwyQkFBdUIsK0JBQVMsSUFBVCxFQUFlO0FBQ3BDLFVBQUksVUFBVSxJQUFkOztBQUVBLFVBQUksQ0FBQyxRQUFRLEdBQVIsQ0FBWSxJQUFaLENBQUwsRUFBd0IsT0FBTyxTQUFQOztBQUV4QixhQUFPO0FBQ0wsYUFBSyxlQUFXO0FBQ2QsaUJBQU8sUUFBUSxHQUFSLENBQVksSUFBWixFQUFrQixJQUFsQixDQUFQO0FBQ0QsU0FISTtBQUlMLGFBQUssYUFBUyxHQUFULEVBQWM7QUFDakIsY0FBSSxRQUFRLEdBQVIsQ0FBWSxJQUFaLEVBQWtCLElBQWxCLEVBQXdCLEdBQXhCLENBQUosRUFBa0M7QUFDaEMsbUJBQU8sR0FBUDtBQUNELFdBRkQsTUFFTztBQUNMLGtCQUFNLElBQUksU0FBSixDQUFjLDBCQUF3QixJQUF0QyxDQUFOO0FBQ0Q7QUFDRixTQVZJO0FBV0wsb0JBQVksSUFYUDtBQVlMLHNCQUFjO0FBWlQsT0FBUDtBQWNELEtBOUttQjs7QUFnTHBCOzs7O0FBSUEsb0JBQWdCLHdCQUFTLElBQVQsRUFBZSxJQUFmLEVBQXFCO0FBQ25DO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxVQUFJLE9BQU8sS0FBSyxPQUFMLENBQWEsZ0JBQWIsQ0FBWDtBQUNBLFVBQUksU0FBUyxTQUFiLEVBQXdCO0FBQ3RCO0FBQ0EsZUFBTyxRQUFRLGNBQVIsQ0FBdUIsS0FBSyxNQUE1QixFQUFvQyxJQUFwQyxFQUEwQyxJQUExQyxDQUFQO0FBQ0Q7O0FBRUQsYUFBTyxPQUFPLElBQVAsQ0FBUDtBQUNBLFVBQUksVUFBVSw0QkFBNEIsSUFBNUIsQ0FBZDtBQUNBLFVBQUksVUFBVSxLQUFLLElBQUwsQ0FBVSxLQUFLLE9BQWYsRUFBd0IsS0FBSyxNQUE3QixFQUFxQyxJQUFyQyxFQUEyQyxPQUEzQyxDQUFkO0FBQ0EsZ0JBQVUsQ0FBQyxDQUFDLE9BQVosQ0FwQm1DLENBb0JkOztBQUVyQixVQUFJLFlBQVksSUFBaEIsRUFBc0I7O0FBRXBCLFlBQUksYUFBYSxPQUFPLHdCQUFQLENBQWdDLEtBQUssTUFBckMsRUFBNkMsSUFBN0MsQ0FBakI7QUFDQSxZQUFJLGFBQWEsT0FBTyxZQUFQLENBQW9CLEtBQUssTUFBekIsQ0FBakI7O0FBRUE7QUFDQTs7QUFFQSxZQUFJLENBQUMsVUFBTCxFQUFpQjtBQUNmLGNBQUksZUFBZSxTQUFuQixFQUE4QjtBQUM1QixrQkFBTSxJQUFJLFNBQUosQ0FBYyw2Q0FDQSxJQURBLEdBQ08sOEJBRHJCLENBQU47QUFFRDtBQUNGOztBQUVELFlBQUksZUFBZSxTQUFuQixFQUE4QjtBQUM1QixjQUFJLENBQUMsdUJBQXVCLFVBQXZCLEVBQW1DLFVBQW5DLEVBQStDLElBQS9DLENBQUwsRUFBMkQ7QUFDekQsa0JBQU0sSUFBSSxTQUFKLENBQWMseUNBQ0EsMkJBREEsR0FDNEIsSUFENUIsR0FDaUMsR0FEL0MsQ0FBTjtBQUVEO0FBQ0QsY0FBSSxpQkFBaUIsVUFBakIsS0FDQSxXQUFXLFlBQVgsS0FBNEIsS0FENUIsSUFFQSxXQUFXLFFBQVgsS0FBd0IsSUFGNUIsRUFFa0M7QUFDOUIsZ0JBQUksS0FBSyxZQUFMLEtBQXNCLEtBQXRCLElBQStCLEtBQUssUUFBTCxLQUFrQixLQUFyRCxFQUE0RDtBQUMxRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQkFBTSxJQUFJLFNBQUosQ0FDSiwyREFDQSxhQURBLEdBQ2dCLElBRGhCLEdBQ3VCLHFDQUZuQixDQUFOO0FBR0Q7QUFDRjtBQUNKOztBQUVELFlBQUksS0FBSyxZQUFMLEtBQXNCLEtBQXRCLElBQStCLENBQUMsYUFBYSxVQUFiLENBQXBDLEVBQThEO0FBQzVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnQkFBTSxJQUFJLFNBQUosQ0FDSixtREFDQSx3REFEQSxHQUVBLElBRkEsR0FFTyxHQUhILENBQU47QUFJRDtBQUVGOztBQUVELGFBQU8sT0FBUDtBQUNELEtBOVBtQjs7QUFnUXBCOzs7QUFHQSx1QkFBbUIsNkJBQVc7QUFDNUIsVUFBSSxPQUFPLEtBQUssT0FBTCxDQUFhLG1CQUFiLENBQVg7QUFDQSxVQUFJLFNBQVMsU0FBYixFQUF3QjtBQUN0QjtBQUNBLGVBQU8sUUFBUSxpQkFBUixDQUEwQixLQUFLLE1BQS9CLENBQVA7QUFDRDs7QUFFRCxVQUFJLFVBQVUsS0FBSyxJQUFMLENBQVUsS0FBSyxPQUFmLEVBQXdCLEtBQUssTUFBN0IsQ0FBZDtBQUNBLGdCQUFVLENBQUMsQ0FBQyxPQUFaLENBUjRCLENBUVA7QUFDckIsVUFBSSxPQUFKLEVBQWE7QUFDWCxZQUFJLG9CQUFvQixLQUFLLE1BQXpCLENBQUosRUFBc0M7QUFDcEMsZ0JBQU0sSUFBSSxTQUFKLENBQWMsdURBQ0EsS0FBSyxNQURuQixDQUFOO0FBRUQ7QUFDRjtBQUNELGFBQU8sT0FBUDtBQUNELEtBblJtQjs7QUFxUnBCOzs7QUFHQSxZQUFRLGlCQUFTLElBQVQsRUFBZTtBQUNyQjs7QUFDQSxVQUFJLE9BQU8sS0FBSyxPQUFMLENBQWEsZ0JBQWIsQ0FBWDtBQUNBLFVBQUksU0FBUyxTQUFiLEVBQXdCO0FBQ3RCO0FBQ0EsZUFBTyxRQUFRLGNBQVIsQ0FBdUIsS0FBSyxNQUE1QixFQUFvQyxJQUFwQyxDQUFQO0FBQ0Q7O0FBRUQsYUFBTyxPQUFPLElBQVAsQ0FBUDtBQUNBLFVBQUksTUFBTSxLQUFLLElBQUwsQ0FBVSxLQUFLLE9BQWYsRUFBd0IsS0FBSyxNQUE3QixFQUFxQyxJQUFyQyxDQUFWO0FBQ0EsWUFBTSxDQUFDLENBQUMsR0FBUixDQVZxQixDQVVSOztBQUViLFVBQUksVUFBSjtBQUNBLFVBQUksUUFBUSxJQUFaLEVBQWtCO0FBQ2hCLHFCQUFhLE9BQU8sd0JBQVAsQ0FBZ0MsS0FBSyxNQUFyQyxFQUE2QyxJQUE3QyxDQUFiO0FBQ0EsWUFBSSxlQUFlLFNBQWYsSUFBNEIsV0FBVyxZQUFYLEtBQTRCLEtBQTVELEVBQW1FO0FBQ2pFLGdCQUFNLElBQUksU0FBSixDQUFjLGVBQWUsSUFBZixHQUFzQix3QkFBdEIsR0FDQSxzQkFEZCxDQUFOO0FBRUQ7QUFDRCxZQUFJLGVBQWUsU0FBZixJQUE0QixDQUFDLG9CQUFvQixLQUFLLE1BQXpCLENBQWpDLEVBQW1FO0FBQ2pFO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0JBQU0sSUFBSSxTQUFKLENBQ0osbURBQW1ELElBQW5ELEdBQ0EsOEJBRkksQ0FBTjtBQUdEO0FBQ0Y7O0FBRUQsYUFBTyxHQUFQO0FBQ0QsS0F2VG1COztBQXlUcEI7Ozs7Ozs7O0FBUUEseUJBQXFCLCtCQUFXO0FBQzlCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFPLEtBQUssT0FBTCxFQUFQO0FBQ0QsS0EzVW1COztBQTZVcEI7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBaUJBLGFBQVMsbUJBQVc7QUFDbEIsVUFBSSxPQUFPLEtBQUssT0FBTCxDQUFhLFNBQWIsQ0FBWDtBQUNBLFVBQUksU0FBUyxTQUFiLEVBQXdCO0FBQ3RCO0FBQ0EsZUFBTyxRQUFRLE9BQVIsQ0FBZ0IsS0FBSyxNQUFyQixDQUFQO0FBQ0Q7O0FBRUQsVUFBSSxhQUFhLEtBQUssSUFBTCxDQUFVLEtBQUssT0FBZixFQUF3QixLQUFLLE1BQTdCLENBQWpCOztBQUVBO0FBQ0EsVUFBSSxZQUFZLE9BQU8sTUFBUCxDQUFjLElBQWQsQ0FBaEI7QUFDQSxVQUFJLFdBQVcsQ0FBQyxXQUFXLE1BQTNCO0FBQ0EsVUFBSSxTQUFTLElBQUksS0FBSixDQUFVLFFBQVYsQ0FBYjs7QUFFQSxXQUFLLElBQUksSUFBSSxDQUFiLEVBQWdCLElBQUksUUFBcEIsRUFBOEIsR0FBOUIsRUFBbUM7QUFDakMsWUFBSSxJQUFJLE9BQU8sV0FBVyxDQUFYLENBQVAsQ0FBUjtBQUNBLFlBQUksQ0FBQyxPQUFPLFlBQVAsQ0FBb0IsS0FBSyxNQUF6QixDQUFELElBQXFDLENBQUMsUUFBUSxDQUFSLEVBQVcsS0FBSyxNQUFoQixDQUExQyxFQUFtRTtBQUNqRTtBQUNBLGdCQUFNLElBQUksU0FBSixDQUFjLG9DQUNBLFlBREEsR0FDYSxDQURiLEdBQ2UsOEJBRDdCLENBQU47QUFFRDs7QUFFRCxrQkFBVSxDQUFWLElBQWUsSUFBZjtBQUNBLGVBQU8sQ0FBUCxJQUFZLENBQVo7QUFDRDs7QUFFRCxVQUFJLFdBQVcsMkJBQTJCLEtBQUssTUFBaEMsQ0FBZjtBQUNBLFVBQUksU0FBUyxLQUFLLE1BQWxCO0FBQ0EsZUFBUyxPQUFULENBQWlCLFVBQVUsT0FBVixFQUFtQjtBQUNsQyxZQUFJLENBQUMsVUFBVSxPQUFWLENBQUwsRUFBeUI7QUFDdkIsY0FBSSxTQUFTLE9BQVQsRUFBa0IsTUFBbEIsQ0FBSixFQUErQjtBQUM3QixrQkFBTSxJQUFJLFNBQUosQ0FBYyxvQ0FDQSw2QkFEQSxHQUM4QixPQUQ5QixHQUNzQyxHQURwRCxDQUFOO0FBRUQ7QUFDRCxjQUFJLENBQUMsT0FBTyxZQUFQLENBQW9CLE1BQXBCLENBQUQsSUFDQSxRQUFRLE9BQVIsRUFBaUIsTUFBakIsQ0FESixFQUM4QjtBQUMxQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0JBQU0sSUFBSSxTQUFKLENBQWMsdURBQ0EsT0FEQSxHQUNRLDhDQUR0QixDQUFOO0FBRUg7QUFDRjtBQUNGLE9BakJEOztBQW1CQSxhQUFPLE1BQVA7QUFDRCxLQTlZbUI7O0FBZ1pwQjs7OztBQUlBLGtCQUFjLHdCQUFXO0FBQ3ZCLFVBQUksT0FBTyxLQUFLLE9BQUwsQ0FBYSxjQUFiLENBQVg7QUFDQSxVQUFJLFNBQVMsU0FBYixFQUF3QjtBQUN0QjtBQUNBLGVBQU8sUUFBUSxZQUFSLENBQXFCLEtBQUssTUFBMUIsQ0FBUDtBQUNEOztBQUVELFVBQUksU0FBUyxLQUFLLElBQUwsQ0FBVSxLQUFLLE9BQWYsRUFBd0IsS0FBSyxNQUE3QixDQUFiO0FBQ0EsZUFBUyxDQUFDLENBQUMsTUFBWCxDQVJ1QixDQVFKO0FBQ25CLFVBQUksUUFBUSxvQkFBb0IsS0FBSyxNQUF6QixDQUFaO0FBQ0EsVUFBSSxXQUFXLEtBQWYsRUFBc0I7QUFDcEIsWUFBSSxNQUFKLEVBQVk7QUFDVixnQkFBTSxJQUFJLFNBQUosQ0FBYyx3REFDQyxLQUFLLE1BRHBCLENBQU47QUFFRCxTQUhELE1BR087QUFDTCxnQkFBTSxJQUFJLFNBQUosQ0FBYyx3REFDQyxLQUFLLE1BRHBCLENBQU47QUFFRDtBQUNGO0FBQ0QsYUFBTyxLQUFQO0FBQ0QsS0F4YW1COztBQTBhcEI7OztBQUdBLG9CQUFnQiwwQkFBVztBQUN6QixVQUFJLE9BQU8sS0FBSyxPQUFMLENBQWEsZ0JBQWIsQ0FBWDtBQUNBLFVBQUksU0FBUyxTQUFiLEVBQXdCO0FBQ3RCO0FBQ0EsZUFBTyxRQUFRLGNBQVIsQ0FBdUIsS0FBSyxNQUE1QixDQUFQO0FBQ0Q7O0FBRUQsVUFBSSxlQUFlLEtBQUssSUFBTCxDQUFVLEtBQUssT0FBZixFQUF3QixLQUFLLE1BQTdCLENBQW5COztBQUVBLFVBQUksQ0FBQyxvQkFBb0IsS0FBSyxNQUF6QixDQUFMLEVBQXVDO0FBQ3JDLFlBQUksY0FBYyxzQkFBc0IsS0FBSyxNQUEzQixDQUFsQjtBQUNBLFlBQUksQ0FBQyxVQUFVLFlBQVYsRUFBd0IsV0FBeEIsQ0FBTCxFQUEyQztBQUN6QyxnQkFBTSxJQUFJLFNBQUosQ0FBYyxxQ0FBcUMsS0FBSyxNQUF4RCxDQUFOO0FBQ0Q7QUFDRjs7QUFFRCxhQUFPLFlBQVA7QUFDRCxLQTlibUI7O0FBZ2NwQjs7OztBQUlBLG9CQUFnQix3QkFBUyxRQUFULEVBQW1CO0FBQ2pDLFVBQUksT0FBTyxLQUFLLE9BQUwsQ0FBYSxnQkFBYixDQUFYO0FBQ0EsVUFBSSxTQUFTLFNBQWIsRUFBd0I7QUFDdEI7QUFDQSxlQUFPLFFBQVEsY0FBUixDQUF1QixLQUFLLE1BQTVCLEVBQW9DLFFBQXBDLENBQVA7QUFDRDs7QUFFRCxVQUFJLFVBQVUsS0FBSyxJQUFMLENBQVUsS0FBSyxPQUFmLEVBQXdCLEtBQUssTUFBN0IsRUFBcUMsUUFBckMsQ0FBZDs7QUFFQSxnQkFBVSxDQUFDLENBQUMsT0FBWjtBQUNBLFVBQUksV0FBVyxDQUFDLG9CQUFvQixLQUFLLE1BQXpCLENBQWhCLEVBQWtEO0FBQ2hELFlBQUksY0FBYyxzQkFBc0IsS0FBSyxNQUEzQixDQUFsQjtBQUNBLFlBQUksQ0FBQyxVQUFVLFFBQVYsRUFBb0IsV0FBcEIsQ0FBTCxFQUF1QztBQUNyQyxnQkFBTSxJQUFJLFNBQUosQ0FBYyxxQ0FBcUMsS0FBSyxNQUF4RCxDQUFOO0FBQ0Q7QUFDRjs7QUFFRCxhQUFPLE9BQVA7QUFDRCxLQXRkbUI7O0FBd2RwQjs7Ozs7OztBQU9BLHNCQUFrQiw0QkFBVztBQUMzQixZQUFNLElBQUksU0FBSixDQUFjLHFDQUFkLENBQU47QUFDRCxLQWplbUI7O0FBbWVwQjs7QUFFQTs7O0FBR0EsU0FBSyxhQUFTLElBQVQsRUFBZTtBQUNsQixVQUFJLE9BQU8sS0FBSyxPQUFMLENBQWEsS0FBYixDQUFYO0FBQ0EsVUFBSSxTQUFTLFNBQWIsRUFBd0I7QUFDdEI7QUFDQSxlQUFPLFFBQVEsR0FBUixDQUFZLEtBQUssTUFBakIsRUFBeUIsSUFBekIsQ0FBUDtBQUNEOztBQUVELGFBQU8sT0FBTyxJQUFQLENBQVA7QUFDQSxVQUFJLE1BQU0sS0FBSyxJQUFMLENBQVUsS0FBSyxPQUFmLEVBQXdCLEtBQUssTUFBN0IsRUFBcUMsSUFBckMsQ0FBVjtBQUNBLFlBQU0sQ0FBQyxDQUFDLEdBQVIsQ0FUa0IsQ0FTTDs7QUFFYixVQUFJLFFBQVEsS0FBWixFQUFtQjtBQUNqQixZQUFJLFNBQVMsSUFBVCxFQUFlLEtBQUssTUFBcEIsQ0FBSixFQUFpQztBQUMvQixnQkFBTSxJQUFJLFNBQUosQ0FBYyxpREFDQSxZQURBLEdBQ2MsSUFEZCxHQUNxQixzQkFEckIsR0FFQSxVQUZkLENBQU47QUFHRDtBQUNELFlBQUksQ0FBQyxPQUFPLFlBQVAsQ0FBb0IsS0FBSyxNQUF6QixDQUFELElBQ0EsUUFBUSxJQUFSLEVBQWMsS0FBSyxNQUFuQixDQURKLEVBQ2dDO0FBQzVCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0JBQU0sSUFBSSxTQUFKLENBQWMsMENBQXdDLElBQXhDLEdBQ0EsOENBRGQsQ0FBTjtBQUVIO0FBQ0Y7O0FBRUQ7QUFDQTtBQUNBOztBQUVBLGFBQU8sR0FBUDtBQUNELEtBemdCbUI7O0FBMmdCcEI7Ozs7O0FBS0EsU0FBSyxhQUFTLFFBQVQsRUFBbUIsSUFBbkIsRUFBeUI7O0FBRTVCO0FBQ0E7QUFDQTs7Ozs7Ozs7O0FBU0EsVUFBSSxPQUFPLEtBQUssT0FBTCxDQUFhLEtBQWIsQ0FBWDtBQUNBLFVBQUksU0FBUyxTQUFiLEVBQXdCO0FBQ3RCO0FBQ0EsZUFBTyxRQUFRLEdBQVIsQ0FBWSxLQUFLLE1BQWpCLEVBQXlCLElBQXpCLEVBQStCLFFBQS9CLENBQVA7QUFDRDs7QUFFRCxhQUFPLE9BQU8sSUFBUCxDQUFQO0FBQ0EsVUFBSSxNQUFNLEtBQUssSUFBTCxDQUFVLEtBQUssT0FBZixFQUF3QixLQUFLLE1BQTdCLEVBQXFDLElBQXJDLEVBQTJDLFFBQTNDLENBQVY7O0FBRUEsVUFBSSxZQUFZLE9BQU8sd0JBQVAsQ0FBZ0MsS0FBSyxNQUFyQyxFQUE2QyxJQUE3QyxDQUFoQjtBQUNBO0FBQ0EsVUFBSSxjQUFjLFNBQWxCLEVBQTZCO0FBQUU7QUFDN0IsWUFBSSxpQkFBaUIsU0FBakIsS0FDQSxVQUFVLFlBQVYsS0FBMkIsS0FEM0IsSUFFQSxVQUFVLFFBQVYsS0FBdUIsS0FGM0IsRUFFa0M7QUFBRTtBQUNsQyxjQUFJLENBQUMsVUFBVSxHQUFWLEVBQWUsVUFBVSxLQUF6QixDQUFMLEVBQXNDO0FBQ3BDLGtCQUFNLElBQUksU0FBSixDQUFjLDBDQUNBLDJDQURBLEdBRUEsSUFGQSxHQUVLLEdBRm5CLENBQU47QUFHRDtBQUNGLFNBUkQsTUFRTztBQUFFO0FBQ1AsY0FBSSxxQkFBcUIsU0FBckIsS0FDQSxVQUFVLFlBQVYsS0FBMkIsS0FEM0IsSUFFQSxVQUFVLEdBQVYsS0FBa0IsU0FGdEIsRUFFaUM7QUFDL0IsZ0JBQUksUUFBUSxTQUFaLEVBQXVCO0FBQ3JCLG9CQUFNLElBQUksU0FBSixDQUFjLGdEQUNBLHFCQURBLEdBQ3NCLElBRHRCLEdBQzJCLGtCQUR6QyxDQUFOO0FBRUQ7QUFDRjtBQUNGO0FBQ0Y7O0FBRUQsYUFBTyxHQUFQO0FBQ0QsS0E5akJtQjs7QUFna0JwQjs7OztBQUlBLFNBQUssYUFBUyxRQUFULEVBQW1CLElBQW5CLEVBQXlCLEdBQXpCLEVBQThCO0FBQ2pDLFVBQUksT0FBTyxLQUFLLE9BQUwsQ0FBYSxLQUFiLENBQVg7QUFDQSxVQUFJLFNBQVMsU0FBYixFQUF3QjtBQUN0QjtBQUNBLGVBQU8sUUFBUSxHQUFSLENBQVksS0FBSyxNQUFqQixFQUF5QixJQUF6QixFQUErQixHQUEvQixFQUFvQyxRQUFwQyxDQUFQO0FBQ0Q7O0FBRUQsYUFBTyxPQUFPLElBQVAsQ0FBUDtBQUNBLFVBQUksTUFBTSxLQUFLLElBQUwsQ0FBVSxLQUFLLE9BQWYsRUFBd0IsS0FBSyxNQUE3QixFQUFxQyxJQUFyQyxFQUEyQyxHQUEzQyxFQUFnRCxRQUFoRCxDQUFWO0FBQ0EsWUFBTSxDQUFDLENBQUMsR0FBUixDQVRpQyxDQVNwQjs7QUFFYjtBQUNBLFVBQUksUUFBUSxJQUFaLEVBQWtCO0FBQ2hCLFlBQUksWUFBWSxPQUFPLHdCQUFQLENBQWdDLEtBQUssTUFBckMsRUFBNkMsSUFBN0MsQ0FBaEI7QUFDQSxZQUFJLGNBQWMsU0FBbEIsRUFBNkI7QUFBRTtBQUM3QixjQUFJLGlCQUFpQixTQUFqQixLQUNBLFVBQVUsWUFBVixLQUEyQixLQUQzQixJQUVBLFVBQVUsUUFBVixLQUF1QixLQUYzQixFQUVrQztBQUNoQyxnQkFBSSxDQUFDLFVBQVUsR0FBVixFQUFlLFVBQVUsS0FBekIsQ0FBTCxFQUFzQztBQUNwQyxvQkFBTSxJQUFJLFNBQUosQ0FBYyxxQ0FDQSwyQ0FEQSxHQUVBLElBRkEsR0FFSyxHQUZuQixDQUFOO0FBR0Q7QUFDRixXQVJELE1BUU87QUFDTCxnQkFBSSxxQkFBcUIsU0FBckIsS0FDQSxVQUFVLFlBQVYsS0FBMkIsS0FEM0IsSUFDb0M7QUFDcEMsc0JBQVUsR0FBVixLQUFrQixTQUZ0QixFQUVpQztBQUFPO0FBQ3RDLG9CQUFNLElBQUksU0FBSixDQUFjLHlCQUF1QixJQUF2QixHQUE0QixhQUE1QixHQUNBLGdCQURkLENBQU47QUFFRDtBQUNGO0FBQ0Y7QUFDRjs7QUFFRCxhQUFPLEdBQVA7QUFDRCxLQXZtQm1COztBQXltQnBCOzs7Ozs7Ozs7OztBQVdBLGVBQVcscUJBQVc7QUFDcEIsVUFBSSxPQUFPLEtBQUssT0FBTCxDQUFhLFdBQWIsQ0FBWDtBQUNBLFVBQUksU0FBUyxTQUFiLEVBQXdCO0FBQ3RCO0FBQ0EsWUFBSSxhQUFhLFFBQVEsU0FBUixDQUFrQixLQUFLLE1BQXZCLENBQWpCO0FBQ0EsWUFBSSxTQUFTLEVBQWI7QUFDQSxZQUFJLE1BQU0sV0FBVyxJQUFYLEVBQVY7QUFDQSxlQUFPLENBQUMsSUFBSSxJQUFaLEVBQWtCO0FBQ2hCLGlCQUFPLElBQVAsQ0FBWSxPQUFPLElBQUksS0FBWCxDQUFaO0FBQ0EsZ0JBQU0sV0FBVyxJQUFYLEVBQU47QUFDRDtBQUNELGVBQU8sTUFBUDtBQUNEOztBQUVELFVBQUksYUFBYSxLQUFLLElBQUwsQ0FBVSxLQUFLLE9BQWYsRUFBd0IsS0FBSyxNQUE3QixDQUFqQjs7QUFFQSxVQUFJLGVBQWUsSUFBZixJQUNBLGVBQWUsU0FEZixJQUVBLFdBQVcsSUFBWCxLQUFvQixTQUZ4QixFQUVtQztBQUNqQyxjQUFNLElBQUksU0FBSixDQUFjLG9EQUNBLFVBRGQsQ0FBTjtBQUVEOztBQUVEO0FBQ0EsVUFBSSxZQUFZLE9BQU8sTUFBUCxDQUFjLElBQWQsQ0FBaEI7O0FBRUE7QUFDQSxVQUFJLFNBQVMsRUFBYixDQTNCb0IsQ0EyQkg7O0FBRWpCO0FBQ0E7QUFDQTtBQUNBLFVBQUksTUFBTSxXQUFXLElBQVgsRUFBVjs7QUFFQSxhQUFPLENBQUMsSUFBSSxJQUFaLEVBQWtCO0FBQ2hCLFlBQUksSUFBSSxPQUFPLElBQUksS0FBWCxDQUFSO0FBQ0EsWUFBSSxVQUFVLENBQVYsQ0FBSixFQUFrQjtBQUNoQixnQkFBTSxJQUFJLFNBQUosQ0FBYyxrQ0FDQSxzQkFEQSxHQUN1QixDQUR2QixHQUN5QixHQUR2QyxDQUFOO0FBRUQ7QUFDRCxrQkFBVSxDQUFWLElBQWUsSUFBZjtBQUNBLGVBQU8sSUFBUCxDQUFZLENBQVo7QUFDQSxjQUFNLFdBQVcsSUFBWCxFQUFOO0FBQ0Q7O0FBRUQ7Ozs7Ozs7Ozs7QUFXQSxVQUFJLHFCQUFxQixPQUFPLElBQVAsQ0FBWSxLQUFLLE1BQWpCLENBQXpCO0FBQ0EsVUFBSSxTQUFTLEtBQUssTUFBbEI7QUFDQSx5QkFBbUIsT0FBbkIsQ0FBMkIsVUFBVSxpQkFBVixFQUE2QjtBQUN0RCxZQUFJLENBQUMsVUFBVSxpQkFBVixDQUFMLEVBQW1DO0FBQ2pDLGNBQUksU0FBUyxpQkFBVCxFQUE0QixNQUE1QixDQUFKLEVBQXlDO0FBQ3ZDLGtCQUFNLElBQUksU0FBSixDQUFjLHNDQUNBLHdDQURBLEdBRUEsaUJBRkEsR0FFa0IsR0FGaEMsQ0FBTjtBQUdEO0FBQ0QsY0FBSSxDQUFDLE9BQU8sWUFBUCxDQUFvQixNQUFwQixDQUFELElBQ0EsUUFBUSxpQkFBUixFQUEyQixNQUEzQixDQURKLEVBQ3dDO0FBQ3BDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQkFBTSxJQUFJLFNBQUosQ0FBYywwQ0FDQSxpQkFEQSxHQUNrQix5QkFEbEIsR0FFQSx1QkFGZCxDQUFOO0FBR0g7QUFDRjtBQUNGLE9BbkJEOztBQXFCQSxhQUFPLE1BQVA7QUFDRCxLQXBzQm1COztBQXNzQnBCOzs7QUFHQSxhQUFTLFVBQVUsU0FBVixDQUFvQixTQXpzQlQ7O0FBMnNCcEI7Ozs7Ozs7Ozs7Ozs7O0FBY0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUEwREE7Ozs7OztBQU1BLFdBQU8sZUFBUyxNQUFULEVBQWlCLFdBQWpCLEVBQThCLElBQTlCLEVBQW9DO0FBQ3pDLFVBQUksT0FBTyxLQUFLLE9BQUwsQ0FBYSxPQUFiLENBQVg7QUFDQSxVQUFJLFNBQVMsU0FBYixFQUF3QjtBQUN0QixlQUFPLFFBQVEsS0FBUixDQUFjLE1BQWQsRUFBc0IsV0FBdEIsRUFBbUMsSUFBbkMsQ0FBUDtBQUNEOztBQUVELFVBQUksT0FBTyxLQUFLLE1BQVosS0FBdUIsVUFBM0IsRUFBdUM7QUFDckMsZUFBTyxLQUFLLElBQUwsQ0FBVSxLQUFLLE9BQWYsRUFBd0IsTUFBeEIsRUFBZ0MsV0FBaEMsRUFBNkMsSUFBN0MsQ0FBUDtBQUNELE9BRkQsTUFFTztBQUNMLGNBQU0sSUFBSSxTQUFKLENBQWMsWUFBVyxNQUFYLEdBQW9CLG9CQUFsQyxDQUFOO0FBQ0Q7QUFDRixLQXB5Qm1COztBQXN5QnBCOzs7Ozs7QUFNQSxlQUFXLG1CQUFTLE1BQVQsRUFBaUIsSUFBakIsRUFBdUIsU0FBdkIsRUFBa0M7QUFDM0MsVUFBSSxPQUFPLEtBQUssT0FBTCxDQUFhLFdBQWIsQ0FBWDtBQUNBLFVBQUksU0FBUyxTQUFiLEVBQXdCO0FBQ3RCLGVBQU8sUUFBUSxTQUFSLENBQWtCLE1BQWxCLEVBQTBCLElBQTFCLEVBQWdDLFNBQWhDLENBQVA7QUFDRDs7QUFFRCxVQUFJLE9BQU8sTUFBUCxLQUFrQixVQUF0QixFQUFrQztBQUNoQyxjQUFNLElBQUksU0FBSixDQUFjLFVBQVMsTUFBVCxHQUFrQixvQkFBaEMsQ0FBTjtBQUNEOztBQUVELFVBQUksY0FBYyxTQUFsQixFQUE2QjtBQUMzQixvQkFBWSxNQUFaO0FBQ0QsT0FGRCxNQUVPO0FBQ0wsWUFBSSxPQUFPLFNBQVAsS0FBcUIsVUFBekIsRUFBcUM7QUFDbkMsZ0JBQU0sSUFBSSxTQUFKLENBQWMsVUFBUyxTQUFULEdBQXFCLG9CQUFuQyxDQUFOO0FBQ0Q7QUFDRjtBQUNELGFBQU8sS0FBSyxJQUFMLENBQVUsS0FBSyxPQUFmLEVBQXdCLE1BQXhCLEVBQWdDLElBQWhDLEVBQXNDLFNBQXRDLENBQVA7QUFDRDtBQTl6Qm1CLEdBQXRCOztBQWkwQkE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0EsTUFBSSxnQkFBZ0IsSUFBSSxPQUFKLEVBQXBCOztBQUVBO0FBQ0E7QUFDQSxTQUFPLGlCQUFQLEdBQTJCLFVBQVMsT0FBVCxFQUFrQjtBQUMzQyxRQUFJLFdBQVcsY0FBYyxHQUFkLENBQWtCLE9BQWxCLENBQWY7QUFDQSxRQUFJLGFBQWEsU0FBakIsRUFBNEI7QUFDMUIsVUFBSSxTQUFTLGlCQUFULEVBQUosRUFBa0M7QUFDaEMsZUFBTyxPQUFQO0FBQ0QsT0FGRCxNQUVPO0FBQ0wsY0FBTSxJQUFJLFNBQUosQ0FBYywwQkFBd0IsT0FBeEIsR0FBZ0MsV0FBOUMsQ0FBTjtBQUNEO0FBQ0YsS0FORCxNQU1PO0FBQ0wsYUFBTyx1QkFBdUIsT0FBdkIsQ0FBUDtBQUNEO0FBQ0YsR0FYRDtBQVlBLFNBQU8sSUFBUCxHQUFjLFVBQVMsT0FBVCxFQUFrQjtBQUM5QixzQkFBa0IsT0FBbEIsRUFBMkIsUUFBM0I7QUFDQSxXQUFPLE9BQVA7QUFDRCxHQUhEO0FBSUEsU0FBTyxNQUFQLEdBQWdCLFVBQVMsT0FBVCxFQUFrQjtBQUNoQyxzQkFBa0IsT0FBbEIsRUFBMkIsUUFBM0I7QUFDQSxXQUFPLE9BQVA7QUFDRCxHQUhEO0FBSUEsU0FBTyxZQUFQLEdBQXNCLHNCQUFzQiw2QkFBUyxPQUFULEVBQWtCO0FBQzVELFFBQUksV0FBVyxjQUFjLEdBQWQsQ0FBa0IsT0FBbEIsQ0FBZjtBQUNBLFFBQUksYUFBYSxTQUFqQixFQUE0QjtBQUMxQixhQUFPLFNBQVMsWUFBVCxFQUFQO0FBQ0QsS0FGRCxNQUVPO0FBQ0wsYUFBTyxrQkFBa0IsT0FBbEIsQ0FBUDtBQUNEO0FBQ0YsR0FQRDtBQVFBLFNBQU8sUUFBUCxHQUFrQixrQkFBa0IseUJBQVMsT0FBVCxFQUFrQjtBQUNwRCxXQUFPLG1CQUFtQixPQUFuQixFQUE0QixRQUE1QixDQUFQO0FBQ0QsR0FGRDtBQUdBLFNBQU8sUUFBUCxHQUFrQixrQkFBa0IseUJBQVMsT0FBVCxFQUFrQjtBQUNwRCxXQUFPLG1CQUFtQixPQUFuQixFQUE0QixRQUE1QixDQUFQO0FBQ0QsR0FGRDtBQUdBLFNBQU8sY0FBUCxHQUF3Qix3QkFBd0IsK0JBQVMsT0FBVCxFQUFrQjtBQUNoRSxRQUFJLFdBQVcsY0FBYyxHQUFkLENBQWtCLE9BQWxCLENBQWY7QUFDQSxRQUFJLGFBQWEsU0FBakIsRUFBNEI7QUFDMUIsYUFBTyxTQUFTLGNBQVQsRUFBUDtBQUNELEtBRkQsTUFFTztBQUNMLGFBQU8sb0JBQW9CLE9BQXBCLENBQVA7QUFDRDtBQUNGLEdBUEQ7O0FBU0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBTyx3QkFBUCxHQUFrQyxVQUFTLE9BQVQsRUFBa0IsSUFBbEIsRUFBd0I7QUFDeEQsUUFBSSxXQUFXLGNBQWMsR0FBZCxDQUFrQixPQUFsQixDQUFmO0FBQ0EsUUFBSSxhQUFhLFNBQWpCLEVBQTRCO0FBQzFCLGFBQU8sU0FBUyx3QkFBVCxDQUFrQyxJQUFsQyxDQUFQO0FBQ0QsS0FGRCxNQUVPO0FBQ0wsYUFBTyw4QkFBOEIsT0FBOUIsRUFBdUMsSUFBdkMsQ0FBUDtBQUNEO0FBQ0YsR0FQRDs7QUFTQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQU8sY0FBUCxHQUF3QixVQUFTLE9BQVQsRUFBa0IsSUFBbEIsRUFBd0IsSUFBeEIsRUFBOEI7QUFDcEQsUUFBSSxXQUFXLGNBQWMsR0FBZCxDQUFrQixPQUFsQixDQUFmO0FBQ0EsUUFBSSxhQUFhLFNBQWpCLEVBQTRCO0FBQzFCLFVBQUksaUJBQWlCLDRCQUE0QixJQUE1QixDQUFyQjtBQUNBLFVBQUksVUFBVSxTQUFTLGNBQVQsQ0FBd0IsSUFBeEIsRUFBOEIsY0FBOUIsQ0FBZDtBQUNBLFVBQUksWUFBWSxLQUFoQixFQUF1QjtBQUNyQixjQUFNLElBQUksU0FBSixDQUFjLDhCQUE0QixJQUE1QixHQUFpQyxHQUEvQyxDQUFOO0FBQ0Q7QUFDRCxhQUFPLE9BQVA7QUFDRCxLQVBELE1BT087QUFDTCxhQUFPLG9CQUFvQixPQUFwQixFQUE2QixJQUE3QixFQUFtQyxJQUFuQyxDQUFQO0FBQ0Q7QUFDRixHQVpEOztBQWNBLFNBQU8sZ0JBQVAsR0FBMEIsVUFBUyxPQUFULEVBQWtCLEtBQWxCLEVBQXlCO0FBQ2pELFFBQUksV0FBVyxjQUFjLEdBQWQsQ0FBa0IsT0FBbEIsQ0FBZjtBQUNBLFFBQUksYUFBYSxTQUFqQixFQUE0QjtBQUMxQixVQUFJLFFBQVEsT0FBTyxJQUFQLENBQVksS0FBWixDQUFaO0FBQ0EsV0FBSyxJQUFJLElBQUksQ0FBYixFQUFnQixJQUFJLE1BQU0sTUFBMUIsRUFBa0MsR0FBbEMsRUFBdUM7QUFDckMsWUFBSSxPQUFPLE1BQU0sQ0FBTixDQUFYO0FBQ0EsWUFBSSxpQkFBaUIsNEJBQTRCLE1BQU0sSUFBTixDQUE1QixDQUFyQjtBQUNBLFlBQUksVUFBVSxTQUFTLGNBQVQsQ0FBd0IsSUFBeEIsRUFBOEIsY0FBOUIsQ0FBZDtBQUNBLFlBQUksWUFBWSxLQUFoQixFQUF1QjtBQUNyQixnQkFBTSxJQUFJLFNBQUosQ0FBYyw4QkFBNEIsSUFBNUIsR0FBaUMsR0FBL0MsQ0FBTjtBQUNEO0FBQ0Y7QUFDRCxhQUFPLE9BQVA7QUFDRCxLQVhELE1BV087QUFDTCxhQUFPLHNCQUFzQixPQUF0QixFQUErQixLQUEvQixDQUFQO0FBQ0Q7QUFDRixHQWhCRDs7QUFrQkEsU0FBTyxJQUFQLEdBQWMsVUFBUyxPQUFULEVBQWtCO0FBQzlCLFFBQUksV0FBVyxjQUFjLEdBQWQsQ0FBa0IsT0FBbEIsQ0FBZjtBQUNBLFFBQUksYUFBYSxTQUFqQixFQUE0QjtBQUMxQixVQUFJLFVBQVUsU0FBUyxPQUFULEVBQWQ7QUFDQSxVQUFJLFNBQVMsRUFBYjtBQUNBLFdBQUssSUFBSSxJQUFJLENBQWIsRUFBZ0IsSUFBSSxRQUFRLE1BQTVCLEVBQW9DLEdBQXBDLEVBQXlDO0FBQ3ZDLFlBQUksSUFBSSxPQUFPLFFBQVEsQ0FBUixDQUFQLENBQVI7QUFDQSxZQUFJLE9BQU8sT0FBTyx3QkFBUCxDQUFnQyxPQUFoQyxFQUF5QyxDQUF6QyxDQUFYO0FBQ0EsWUFBSSxTQUFTLFNBQVQsSUFBc0IsS0FBSyxVQUFMLEtBQW9CLElBQTlDLEVBQW9EO0FBQ2xELGlCQUFPLElBQVAsQ0FBWSxDQUFaO0FBQ0Q7QUFDRjtBQUNELGFBQU8sTUFBUDtBQUNELEtBWEQsTUFXTztBQUNMLGFBQU8sVUFBVSxPQUFWLENBQVA7QUFDRDtBQUNGLEdBaEJEOztBQWtCQSxTQUFPLG1CQUFQLEdBQTZCLDZCQUE2QixvQ0FBUyxPQUFULEVBQWtCO0FBQzFFLFFBQUksV0FBVyxjQUFjLEdBQWQsQ0FBa0IsT0FBbEIsQ0FBZjtBQUNBLFFBQUksYUFBYSxTQUFqQixFQUE0QjtBQUMxQixhQUFPLFNBQVMsT0FBVCxFQUFQO0FBQ0QsS0FGRCxNQUVPO0FBQ0wsYUFBTyx5QkFBeUIsT0FBekIsQ0FBUDtBQUNEO0FBQ0YsR0FQRDs7QUFTQTtBQUNBO0FBQ0EsTUFBSSwrQkFBK0IsU0FBbkMsRUFBOEM7QUFDNUMsV0FBTyxxQkFBUCxHQUErQixVQUFTLE9BQVQsRUFBa0I7QUFDL0MsVUFBSSxXQUFXLGNBQWMsR0FBZCxDQUFrQixPQUFsQixDQUFmO0FBQ0EsVUFBSSxhQUFhLFNBQWpCLEVBQTRCO0FBQzFCO0FBQ0E7QUFDQSxlQUFPLEVBQVA7QUFDRCxPQUpELE1BSU87QUFDTCxlQUFPLDJCQUEyQixPQUEzQixDQUFQO0FBQ0Q7QUFDRixLQVREO0FBVUQ7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSSxnQkFBZ0IsU0FBcEIsRUFBK0I7QUFDN0IsV0FBTyxNQUFQLEdBQWdCLFVBQVUsTUFBVixFQUFrQjs7QUFFaEM7QUFDQSxVQUFJLFlBQVksSUFBaEI7QUFDQSxXQUFLLElBQUksSUFBSSxDQUFiLEVBQWdCLElBQUksVUFBVSxNQUE5QixFQUFzQyxHQUF0QyxFQUEyQztBQUN6QyxZQUFJLFdBQVcsY0FBYyxHQUFkLENBQWtCLFVBQVUsQ0FBVixDQUFsQixDQUFmO0FBQ0EsWUFBSSxhQUFhLFNBQWpCLEVBQTRCO0FBQzFCLHNCQUFZLEtBQVo7QUFDQTtBQUNEO0FBQ0Y7QUFDRCxVQUFJLFNBQUosRUFBZTtBQUNiO0FBQ0EsZUFBTyxZQUFZLEtBQVosQ0FBa0IsTUFBbEIsRUFBMEIsU0FBMUIsQ0FBUDtBQUNEOztBQUVEOztBQUVBLFVBQUksV0FBVyxTQUFYLElBQXdCLFdBQVcsSUFBdkMsRUFBNkM7QUFDM0MsY0FBTSxJQUFJLFNBQUosQ0FBYyw0Q0FBZCxDQUFOO0FBQ0Q7O0FBRUQsVUFBSSxTQUFTLE9BQU8sTUFBUCxDQUFiO0FBQ0EsV0FBSyxJQUFJLFFBQVEsQ0FBakIsRUFBb0IsUUFBUSxVQUFVLE1BQXRDLEVBQThDLE9BQTlDLEVBQXVEO0FBQ3JELFlBQUksU0FBUyxVQUFVLEtBQVYsQ0FBYjtBQUNBLFlBQUksV0FBVyxTQUFYLElBQXdCLFdBQVcsSUFBdkMsRUFBNkM7QUFDM0MsZUFBSyxJQUFJLE9BQVQsSUFBb0IsTUFBcEIsRUFBNEI7QUFDMUIsZ0JBQUksT0FBTyxjQUFQLENBQXNCLE9BQXRCLENBQUosRUFBb0M7QUFDbEMscUJBQU8sT0FBUCxJQUFrQixPQUFPLE9BQVAsQ0FBbEI7QUFDRDtBQUNGO0FBQ0Y7QUFDRjtBQUNELGFBQU8sTUFBUDtBQUNELEtBbENEO0FBbUNEOztBQUVEO0FBQ0E7QUFDQSxXQUFTLFFBQVQsQ0FBa0IsR0FBbEIsRUFBdUI7QUFDckIsUUFBSSxjQUFjLEdBQWQseUNBQWMsR0FBZCxDQUFKO0FBQ0EsV0FBUSxTQUFTLFFBQVQsSUFBcUIsUUFBUSxJQUE5QixJQUF3QyxTQUFTLFVBQXhEO0FBQ0Q7O0FBRUQ7QUFDQTtBQUNBO0FBQ0EsV0FBUyxjQUFULENBQXdCLEdBQXhCLEVBQTZCLEdBQTdCLEVBQWtDO0FBQ2hDLFdBQU8sU0FBUyxHQUFULElBQWdCLElBQUksR0FBSixDQUFRLEdBQVIsQ0FBaEIsR0FBK0IsU0FBdEM7QUFDRDs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVMsd0JBQVQsQ0FBa0MsU0FBbEMsRUFBNkM7QUFDM0MsV0FBTyxTQUFTLE9BQVQsR0FBbUI7QUFDeEIsVUFBSSxXQUFXLGVBQWUsYUFBZixFQUE4QixJQUE5QixDQUFmO0FBQ0EsVUFBSSxhQUFhLFNBQWpCLEVBQTRCO0FBQzFCLGVBQU8sUUFBUSxJQUFSLENBQWEsU0FBUyxNQUF0QixDQUFQO0FBQ0QsT0FGRCxNQUVPO0FBQ0wsZUFBTyxVQUFVLElBQVYsQ0FBZSxJQUFmLENBQVA7QUFDRDtBQUNGLEtBUEQ7QUFRRDs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVMsd0JBQVQsQ0FBa0MsU0FBbEMsRUFBNkM7QUFDM0MsV0FBTyxTQUFTLE9BQVQsQ0FBaUIsR0FBakIsRUFBc0I7QUFDM0IsVUFBSSxXQUFXLGVBQWUsYUFBZixFQUE4QixJQUE5QixDQUFmO0FBQ0EsVUFBSSxhQUFhLFNBQWpCLEVBQTRCO0FBQzFCLGVBQU8sUUFBUSxJQUFSLENBQWEsU0FBUyxNQUF0QixFQUE4QixHQUE5QixDQUFQO0FBQ0QsT0FGRCxNQUVPO0FBQ0wsZUFBTyxVQUFVLElBQVYsQ0FBZSxJQUFmLEVBQXFCLEdBQXJCLENBQVA7QUFDRDtBQUNGLEtBUEQ7QUFRRDs7QUFFRCxTQUFPLFNBQVAsQ0FBaUIsT0FBakIsR0FDRSx5QkFBeUIsT0FBTyxTQUFQLENBQWlCLE9BQTFDLENBREY7QUFFQSxTQUFPLFNBQVAsQ0FBaUIsUUFBakIsR0FDRSx5QkFBeUIsT0FBTyxTQUFQLENBQWlCLFFBQTFDLENBREY7QUFFQSxXQUFTLFNBQVQsQ0FBbUIsUUFBbkIsR0FDRSx5QkFBeUIsU0FBUyxTQUFULENBQW1CLFFBQTVDLENBREY7QUFFQSxPQUFLLFNBQUwsQ0FBZSxRQUFmLEdBQ0UseUJBQXlCLEtBQUssU0FBTCxDQUFlLFFBQXhDLENBREY7O0FBR0EsU0FBTyxTQUFQLENBQWlCLGFBQWpCLEdBQWlDLFNBQVMsT0FBVCxDQUFpQixHQUFqQixFQUFzQjtBQUNyRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFPLElBQVAsRUFBYTtBQUNYLFVBQUksWUFBWSxlQUFlLGFBQWYsRUFBOEIsR0FBOUIsQ0FBaEI7QUFDQSxVQUFJLGNBQWMsU0FBbEIsRUFBNkI7QUFDM0IsY0FBTSxVQUFVLGNBQVYsRUFBTjtBQUNBLFlBQUksUUFBUSxJQUFaLEVBQWtCO0FBQ2hCLGlCQUFPLEtBQVA7QUFDRCxTQUZELE1BRU8sSUFBSSxVQUFVLEdBQVYsRUFBZSxJQUFmLENBQUosRUFBMEI7QUFDL0IsaUJBQU8sSUFBUDtBQUNEO0FBQ0YsT0FQRCxNQU9PO0FBQ0wsZUFBTyxtQkFBbUIsSUFBbkIsQ0FBd0IsSUFBeEIsRUFBOEIsR0FBOUIsQ0FBUDtBQUNEO0FBQ0Y7QUFDRixHQXBCRDs7QUFzQkEsUUFBTSxPQUFOLEdBQWdCLFVBQVMsT0FBVCxFQUFrQjtBQUNoQyxRQUFJLFdBQVcsZUFBZSxhQUFmLEVBQThCLE9BQTlCLENBQWY7QUFDQSxRQUFJLGFBQWEsU0FBakIsRUFBNEI7QUFDMUIsYUFBTyxNQUFNLE9BQU4sQ0FBYyxTQUFTLE1BQXZCLENBQVA7QUFDRCxLQUZELE1BRU87QUFDTCxhQUFPLGFBQWEsT0FBYixDQUFQO0FBQ0Q7QUFDRixHQVBEOztBQVNBLFdBQVMsWUFBVCxDQUFzQixHQUF0QixFQUEyQjtBQUN6QixRQUFJLFdBQVcsZUFBZSxhQUFmLEVBQThCLEdBQTlCLENBQWY7QUFDQSxRQUFJLGFBQWEsU0FBakIsRUFBNEI7QUFDMUIsYUFBTyxNQUFNLE9BQU4sQ0FBYyxTQUFTLE1BQXZCLENBQVA7QUFDRDtBQUNELFdBQU8sS0FBUDtBQUNEOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBTSxTQUFOLENBQWdCLE1BQWhCLEdBQXlCLFlBQVMsV0FBYTtBQUM3QyxRQUFJLE1BQUo7QUFDQSxTQUFLLElBQUksSUFBSSxDQUFiLEVBQWdCLElBQUksVUFBVSxNQUE5QixFQUFzQyxHQUF0QyxFQUEyQztBQUN6QyxVQUFJLGFBQWEsVUFBVSxDQUFWLENBQWIsQ0FBSixFQUFnQztBQUM5QixpQkFBUyxVQUFVLENBQVYsRUFBYSxNQUF0QjtBQUNBLGtCQUFVLENBQVYsSUFBZSxNQUFNLFNBQU4sQ0FBZ0IsS0FBaEIsQ0FBc0IsSUFBdEIsQ0FBMkIsVUFBVSxDQUFWLENBQTNCLEVBQXlDLENBQXpDLEVBQTRDLE1BQTVDLENBQWY7QUFDRDtBQUNGO0FBQ0QsV0FBTyxZQUFZLEtBQVosQ0FBa0IsSUFBbEIsRUFBd0IsU0FBeEIsQ0FBUDtBQUNELEdBVEQ7O0FBV0E7O0FBRUEsTUFBSSxzQkFBc0IsT0FBTyxjQUFqQzs7QUFFQTtBQUNBLE1BQUksa0JBQW1CLFlBQVc7QUFDaEMsUUFBSSxZQUFZLDhCQUE4QixPQUFPLFNBQXJDLEVBQStDLFdBQS9DLENBQWhCO0FBQ0EsUUFBSSxjQUFjLFNBQWQsSUFDQSxPQUFPLFVBQVUsR0FBakIsS0FBeUIsVUFEN0IsRUFDeUM7QUFDdkMsYUFBTyxZQUFXO0FBQ2hCLGNBQU0sSUFBSSxTQUFKLENBQWMsK0NBQWQsQ0FBTjtBQUNELE9BRkQ7QUFHRDs7QUFFRDtBQUNBO0FBQ0EsUUFBSTtBQUNGLGdCQUFVLEdBQVYsQ0FBYyxJQUFkLENBQW1CLEVBQW5CLEVBQXNCLEVBQXRCO0FBQ0QsS0FGRCxDQUVFLE9BQU8sQ0FBUCxFQUFVO0FBQ1YsYUFBTyxZQUFXO0FBQ2hCLGNBQU0sSUFBSSxTQUFKLENBQWMsK0NBQWQsQ0FBTjtBQUNELE9BRkQ7QUFHRDs7QUFFRCx3QkFBb0IsT0FBTyxTQUEzQixFQUFzQyxXQUF0QyxFQUFtRDtBQUNqRCxXQUFLLGFBQVMsUUFBVCxFQUFtQjtBQUN0QixlQUFPLE9BQU8sY0FBUCxDQUFzQixJQUF0QixFQUE0QixPQUFPLFFBQVAsQ0FBNUIsQ0FBUDtBQUNEO0FBSGdELEtBQW5EOztBQU1BLFdBQU8sVUFBVSxHQUFqQjtBQUNELEdBMUJzQixFQUF2Qjs7QUE0QkEsU0FBTyxjQUFQLEdBQXdCLFVBQVMsTUFBVCxFQUFpQixRQUFqQixFQUEyQjtBQUNqRCxRQUFJLFVBQVUsY0FBYyxHQUFkLENBQWtCLE1BQWxCLENBQWQ7QUFDQSxRQUFJLFlBQVksU0FBaEIsRUFBMkI7QUFDekIsVUFBSSxRQUFRLGNBQVIsQ0FBdUIsUUFBdkIsQ0FBSixFQUFzQztBQUNwQyxlQUFPLE1BQVA7QUFDRCxPQUZELE1BRU87QUFDTCxjQUFNLElBQUksU0FBSixDQUFjLG1DQUFkLENBQU47QUFDRDtBQUNGLEtBTkQsTUFNTztBQUNMLFVBQUksQ0FBQyxvQkFBb0IsTUFBcEIsQ0FBTCxFQUFrQztBQUNoQyxjQUFNLElBQUksU0FBSixDQUFjLG1EQUNBLE1BRGQsQ0FBTjtBQUVEO0FBQ0QsVUFBSSxtQkFBSixFQUNFLE9BQU8sb0JBQW9CLE1BQXBCLEVBQTRCLFFBQTVCLENBQVA7O0FBRUYsVUFBSSxPQUFPLFFBQVAsTUFBcUIsUUFBckIsSUFBaUMsYUFBYSxJQUFsRCxFQUF3RDtBQUN0RCxjQUFNLElBQUksU0FBSixDQUFjLHFEQUNELFFBRGIsQ0FBTjtBQUVBO0FBQ0Q7QUFDRCxzQkFBZ0IsSUFBaEIsQ0FBcUIsTUFBckIsRUFBNkIsUUFBN0I7QUFDQSxhQUFPLE1BQVA7QUFDRDtBQUNGLEdBeEJEOztBQTBCQSxTQUFPLFNBQVAsQ0FBaUIsY0FBakIsR0FBa0MsVUFBUyxJQUFULEVBQWU7QUFDL0MsUUFBSSxVQUFVLGVBQWUsYUFBZixFQUE4QixJQUE5QixDQUFkO0FBQ0EsUUFBSSxZQUFZLFNBQWhCLEVBQTJCO0FBQ3pCLFVBQUksT0FBTyxRQUFRLHdCQUFSLENBQWlDLElBQWpDLENBQVg7QUFDQSxhQUFPLFNBQVMsU0FBaEI7QUFDRCxLQUhELE1BR087QUFDTCxhQUFPLG9CQUFvQixJQUFwQixDQUF5QixJQUF6QixFQUErQixJQUEvQixDQUFQO0FBQ0Q7QUFDRixHQVJEOztBQVVBO0FBQ0E7O0FBRUEsTUFBSSxVQUFVLE9BQU8sT0FBUCxHQUFpQjtBQUM3Qiw4QkFBMEIsa0NBQVMsTUFBVCxFQUFpQixJQUFqQixFQUF1QjtBQUMvQyxhQUFPLE9BQU8sd0JBQVAsQ0FBZ0MsTUFBaEMsRUFBd0MsSUFBeEMsQ0FBUDtBQUNELEtBSDRCO0FBSTdCLG9CQUFnQix3QkFBUyxNQUFULEVBQWlCLElBQWpCLEVBQXVCLElBQXZCLEVBQTZCOztBQUUzQztBQUNBLFVBQUksVUFBVSxjQUFjLEdBQWQsQ0FBa0IsTUFBbEIsQ0FBZDtBQUNBLFVBQUksWUFBWSxTQUFoQixFQUEyQjtBQUN6QixlQUFPLFFBQVEsY0FBUixDQUF1QixNQUF2QixFQUErQixJQUEvQixFQUFxQyxJQUFyQyxDQUFQO0FBQ0Q7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQUksVUFBVSxPQUFPLHdCQUFQLENBQWdDLE1BQWhDLEVBQXdDLElBQXhDLENBQWQ7QUFDQSxVQUFJLGFBQWEsT0FBTyxZQUFQLENBQW9CLE1BQXBCLENBQWpCO0FBQ0EsVUFBSSxZQUFZLFNBQVosSUFBeUIsZUFBZSxLQUE1QyxFQUFtRDtBQUNqRCxlQUFPLEtBQVA7QUFDRDtBQUNELFVBQUksWUFBWSxTQUFaLElBQXlCLGVBQWUsSUFBNUMsRUFBa0Q7QUFDaEQsZUFBTyxjQUFQLENBQXNCLE1BQXRCLEVBQThCLElBQTlCLEVBQW9DLElBQXBDLEVBRGdELENBQ0w7QUFDM0MsZUFBTyxJQUFQO0FBQ0Q7QUFDRCxVQUFJLGtCQUFrQixJQUFsQixDQUFKLEVBQTZCO0FBQzNCLGVBQU8sSUFBUDtBQUNEO0FBQ0QsVUFBSSx1QkFBdUIsT0FBdkIsRUFBZ0MsSUFBaEMsQ0FBSixFQUEyQztBQUN6QyxlQUFPLElBQVA7QUFDRDtBQUNELFVBQUksUUFBUSxZQUFSLEtBQXlCLEtBQTdCLEVBQW9DO0FBQ2xDLFlBQUksS0FBSyxZQUFMLEtBQXNCLElBQTFCLEVBQWdDO0FBQzlCLGlCQUFPLEtBQVA7QUFDRDtBQUNELFlBQUksZ0JBQWdCLElBQWhCLElBQXdCLEtBQUssVUFBTCxLQUFvQixRQUFRLFVBQXhELEVBQW9FO0FBQ2xFLGlCQUFPLEtBQVA7QUFDRDtBQUNGO0FBQ0QsVUFBSSxvQkFBb0IsSUFBcEIsQ0FBSixFQUErQjtBQUM3QjtBQUNELE9BRkQsTUFFTyxJQUFJLGlCQUFpQixPQUFqQixNQUE4QixpQkFBaUIsSUFBakIsQ0FBbEMsRUFBMEQ7QUFDL0QsWUFBSSxRQUFRLFlBQVIsS0FBeUIsS0FBN0IsRUFBb0M7QUFDbEMsaUJBQU8sS0FBUDtBQUNEO0FBQ0YsT0FKTSxNQUlBLElBQUksaUJBQWlCLE9BQWpCLEtBQTZCLGlCQUFpQixJQUFqQixDQUFqQyxFQUF5RDtBQUM5RCxZQUFJLFFBQVEsWUFBUixLQUF5QixLQUE3QixFQUFvQztBQUNsQyxjQUFJLFFBQVEsUUFBUixLQUFxQixLQUFyQixJQUE4QixLQUFLLFFBQUwsS0FBa0IsSUFBcEQsRUFBMEQ7QUFDeEQsbUJBQU8sS0FBUDtBQUNEO0FBQ0QsY0FBSSxRQUFRLFFBQVIsS0FBcUIsS0FBekIsRUFBZ0M7QUFDOUIsZ0JBQUksV0FBVyxJQUFYLElBQW1CLENBQUMsVUFBVSxLQUFLLEtBQWYsRUFBc0IsUUFBUSxLQUE5QixDQUF4QixFQUE4RDtBQUM1RCxxQkFBTyxLQUFQO0FBQ0Q7QUFDRjtBQUNGO0FBQ0YsT0FYTSxNQVdBLElBQUkscUJBQXFCLE9BQXJCLEtBQWlDLHFCQUFxQixJQUFyQixDQUFyQyxFQUFpRTtBQUN0RSxZQUFJLFFBQVEsWUFBUixLQUF5QixLQUE3QixFQUFvQztBQUNsQyxjQUFJLFNBQVMsSUFBVCxJQUFpQixDQUFDLFVBQVUsS0FBSyxHQUFmLEVBQW9CLFFBQVEsR0FBNUIsQ0FBdEIsRUFBd0Q7QUFDdEQsbUJBQU8sS0FBUDtBQUNEO0FBQ0QsY0FBSSxTQUFTLElBQVQsSUFBaUIsQ0FBQyxVQUFVLEtBQUssR0FBZixFQUFvQixRQUFRLEdBQTVCLENBQXRCLEVBQXdEO0FBQ3RELG1CQUFPLEtBQVA7QUFDRDtBQUNGO0FBQ0Y7QUFDRCxhQUFPLGNBQVAsQ0FBc0IsTUFBdEIsRUFBOEIsSUFBOUIsRUFBb0MsSUFBcEMsRUEvRDJDLENBK0RBO0FBQzNDLGFBQU8sSUFBUDtBQUNELEtBckU0QjtBQXNFN0Isb0JBQWdCLHdCQUFTLE1BQVQsRUFBaUIsSUFBakIsRUFBdUI7QUFDckMsVUFBSSxVQUFVLGNBQWMsR0FBZCxDQUFrQixNQUFsQixDQUFkO0FBQ0EsVUFBSSxZQUFZLFNBQWhCLEVBQTJCO0FBQ3pCLGVBQU8sUUFBUSxNQUFSLENBQWUsSUFBZixDQUFQO0FBQ0Q7O0FBRUQsVUFBSSxPQUFPLE9BQU8sd0JBQVAsQ0FBZ0MsTUFBaEMsRUFBd0MsSUFBeEMsQ0FBWDtBQUNBLFVBQUksU0FBUyxTQUFiLEVBQXdCO0FBQ3RCLGVBQU8sSUFBUDtBQUNEO0FBQ0QsVUFBSSxLQUFLLFlBQUwsS0FBc0IsSUFBMUIsRUFBZ0M7QUFDOUIsZUFBTyxPQUFPLElBQVAsQ0FBUDtBQUNBLGVBQU8sSUFBUDtBQUNEO0FBQ0QsYUFBTyxLQUFQO0FBQ0QsS0FyRjRCO0FBc0Y3QixvQkFBZ0Isd0JBQVMsTUFBVCxFQUFpQjtBQUMvQixhQUFPLE9BQU8sY0FBUCxDQUFzQixNQUF0QixDQUFQO0FBQ0QsS0F4RjRCO0FBeUY3QixvQkFBZ0Isd0JBQVMsTUFBVCxFQUFpQixRQUFqQixFQUEyQjs7QUFFekMsVUFBSSxVQUFVLGNBQWMsR0FBZCxDQUFrQixNQUFsQixDQUFkO0FBQ0EsVUFBSSxZQUFZLFNBQWhCLEVBQTJCO0FBQ3pCLGVBQU8sUUFBUSxjQUFSLENBQXVCLFFBQXZCLENBQVA7QUFDRDs7QUFFRCxVQUFJLE9BQU8sUUFBUCxNQUFxQixRQUFyQixJQUFpQyxhQUFhLElBQWxELEVBQXdEO0FBQ3RELGNBQU0sSUFBSSxTQUFKLENBQWMscURBQ0QsUUFEYixDQUFOO0FBRUQ7O0FBRUQsVUFBSSxDQUFDLG9CQUFvQixNQUFwQixDQUFMLEVBQWtDO0FBQ2hDLGVBQU8sS0FBUDtBQUNEOztBQUVELFVBQUksVUFBVSxPQUFPLGNBQVAsQ0FBc0IsTUFBdEIsQ0FBZDtBQUNBLFVBQUksVUFBVSxPQUFWLEVBQW1CLFFBQW5CLENBQUosRUFBa0M7QUFDaEMsZUFBTyxJQUFQO0FBQ0Q7O0FBRUQsVUFBSSxtQkFBSixFQUF5QjtBQUN2QixZQUFJO0FBQ0YsOEJBQW9CLE1BQXBCLEVBQTRCLFFBQTVCO0FBQ0EsaUJBQU8sSUFBUDtBQUNELFNBSEQsQ0FHRSxPQUFPLENBQVAsRUFBVTtBQUNWLGlCQUFPLEtBQVA7QUFDRDtBQUNGOztBQUVELHNCQUFnQixJQUFoQixDQUFxQixNQUFyQixFQUE2QixRQUE3QjtBQUNBLGFBQU8sSUFBUDtBQUNELEtBekg0QjtBQTBIN0IsdUJBQW1CLDJCQUFTLE1BQVQsRUFBaUI7QUFDbEMsVUFBSSxVQUFVLGNBQWMsR0FBZCxDQUFrQixNQUFsQixDQUFkO0FBQ0EsVUFBSSxZQUFZLFNBQWhCLEVBQTJCO0FBQ3pCLGVBQU8sUUFBUSxpQkFBUixFQUFQO0FBQ0Q7QUFDRCw2QkFBdUIsTUFBdkI7QUFDQSxhQUFPLElBQVA7QUFDRCxLQWpJNEI7QUFrSTdCLGtCQUFjLHNCQUFTLE1BQVQsRUFBaUI7QUFDN0IsYUFBTyxPQUFPLFlBQVAsQ0FBb0IsTUFBcEIsQ0FBUDtBQUNELEtBcEk0QjtBQXFJN0IsU0FBSyxhQUFTLE1BQVQsRUFBaUIsSUFBakIsRUFBdUI7QUFDMUIsYUFBTyxRQUFRLE1BQWY7QUFDRCxLQXZJNEI7QUF3STdCLFNBQUssYUFBUyxNQUFULEVBQWlCLElBQWpCLEVBQXVCLFFBQXZCLEVBQWlDO0FBQ3BDLGlCQUFXLFlBQVksTUFBdkI7O0FBRUE7QUFDQSxVQUFJLFVBQVUsY0FBYyxHQUFkLENBQWtCLE1BQWxCLENBQWQ7QUFDQSxVQUFJLFlBQVksU0FBaEIsRUFBMkI7QUFDekIsZUFBTyxRQUFRLEdBQVIsQ0FBWSxRQUFaLEVBQXNCLElBQXRCLENBQVA7QUFDRDs7QUFFRCxVQUFJLE9BQU8sT0FBTyx3QkFBUCxDQUFnQyxNQUFoQyxFQUF3QyxJQUF4QyxDQUFYO0FBQ0EsVUFBSSxTQUFTLFNBQWIsRUFBd0I7QUFDdEIsWUFBSSxRQUFRLE9BQU8sY0FBUCxDQUFzQixNQUF0QixDQUFaO0FBQ0EsWUFBSSxVQUFVLElBQWQsRUFBb0I7QUFDbEIsaUJBQU8sU0FBUDtBQUNEO0FBQ0QsZUFBTyxRQUFRLEdBQVIsQ0FBWSxLQUFaLEVBQW1CLElBQW5CLEVBQXlCLFFBQXpCLENBQVA7QUFDRDtBQUNELFVBQUksaUJBQWlCLElBQWpCLENBQUosRUFBNEI7QUFDMUIsZUFBTyxLQUFLLEtBQVo7QUFDRDtBQUNELFVBQUksU0FBUyxLQUFLLEdBQWxCO0FBQ0EsVUFBSSxXQUFXLFNBQWYsRUFBMEI7QUFDeEIsZUFBTyxTQUFQO0FBQ0Q7QUFDRCxhQUFPLEtBQUssR0FBTCxDQUFTLElBQVQsQ0FBYyxRQUFkLENBQVA7QUFDRCxLQWpLNEI7QUFrSzdCO0FBQ0E7QUFDQSxTQUFLLGFBQVMsTUFBVCxFQUFpQixJQUFqQixFQUF1QixLQUF2QixFQUE4QixRQUE5QixFQUF3QztBQUMzQyxpQkFBVyxZQUFZLE1BQXZCOztBQUVBO0FBQ0EsVUFBSSxVQUFVLGNBQWMsR0FBZCxDQUFrQixNQUFsQixDQUFkO0FBQ0EsVUFBSSxZQUFZLFNBQWhCLEVBQTJCO0FBQ3pCLGVBQU8sUUFBUSxHQUFSLENBQVksUUFBWixFQUFzQixJQUF0QixFQUE0QixLQUE1QixDQUFQO0FBQ0Q7O0FBRUQ7QUFDQTtBQUNBLFVBQUksVUFBVSxPQUFPLHdCQUFQLENBQWdDLE1BQWhDLEVBQXdDLElBQXhDLENBQWQ7O0FBRUEsVUFBSSxZQUFZLFNBQWhCLEVBQTJCO0FBQ3pCO0FBQ0EsWUFBSSxRQUFRLE9BQU8sY0FBUCxDQUFzQixNQUF0QixDQUFaOztBQUVBLFlBQUksVUFBVSxJQUFkLEVBQW9CO0FBQ2xCO0FBQ0EsaUJBQU8sUUFBUSxHQUFSLENBQVksS0FBWixFQUFtQixJQUFuQixFQUF5QixLQUF6QixFQUFnQyxRQUFoQyxDQUFQO0FBQ0Q7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtCQUNFLEVBQUUsT0FBTyxTQUFUO0FBQ0Usb0JBQVUsSUFEWjtBQUVFLHNCQUFZLElBRmQ7QUFHRSx3QkFBYyxJQUhoQixFQURGO0FBS0Q7O0FBRUQ7QUFDQSxVQUFJLHFCQUFxQixPQUFyQixDQUFKLEVBQW1DO0FBQ2pDLFlBQUksU0FBUyxRQUFRLEdBQXJCO0FBQ0EsWUFBSSxXQUFXLFNBQWYsRUFBMEIsT0FBTyxLQUFQO0FBQzFCLGVBQU8sSUFBUCxDQUFZLFFBQVosRUFBc0IsS0FBdEIsRUFIaUMsQ0FHSDtBQUM5QixlQUFPLElBQVA7QUFDRDtBQUNEO0FBQ0EsVUFBSSxRQUFRLFFBQVIsS0FBcUIsS0FBekIsRUFBZ0MsT0FBTyxLQUFQO0FBQ2hDO0FBQ0E7QUFDQTtBQUNBLFVBQUksZUFBZSxPQUFPLHdCQUFQLENBQWdDLFFBQWhDLEVBQTBDLElBQTFDLENBQW5CO0FBQ0EsVUFBSSxpQkFBaUIsU0FBckIsRUFBZ0M7QUFDOUIsWUFBSSxhQUNGLEVBQUUsT0FBTyxLQUFUO0FBQ0U7QUFDQTtBQUNBO0FBQ0Esb0JBQWMsYUFBYSxRQUo3QjtBQUtFLHNCQUFjLGFBQWEsVUFMN0I7QUFNRSx3QkFBYyxhQUFhLFlBTjdCLEVBREY7QUFRQSxlQUFPLGNBQVAsQ0FBc0IsUUFBdEIsRUFBZ0MsSUFBaEMsRUFBc0MsVUFBdEM7QUFDQSxlQUFPLElBQVA7QUFDRCxPQVhELE1BV087QUFDTCxZQUFJLENBQUMsT0FBTyxZQUFQLENBQW9CLFFBQXBCLENBQUwsRUFBb0MsT0FBTyxLQUFQO0FBQ3BDLFlBQUksVUFDRixFQUFFLE9BQU8sS0FBVDtBQUNFLG9CQUFVLElBRFo7QUFFRSxzQkFBWSxJQUZkO0FBR0Usd0JBQWMsSUFIaEIsRUFERjtBQUtBLGVBQU8sY0FBUCxDQUFzQixRQUF0QixFQUFnQyxJQUFoQyxFQUFzQyxPQUF0QztBQUNBLGVBQU8sSUFBUDtBQUNEO0FBQ0YsS0F4TzRCO0FBeU83Qjs7Ozs7Ozs7O0FBV0EsZUFBVyxtQkFBUyxNQUFULEVBQWlCO0FBQzFCLFVBQUksVUFBVSxjQUFjLEdBQWQsQ0FBa0IsTUFBbEIsQ0FBZDtBQUNBLFVBQUksTUFBSjtBQUNBLFVBQUksWUFBWSxTQUFoQixFQUEyQjtBQUN6QjtBQUNBO0FBQ0E7QUFDQSxpQkFBUyxRQUFRLFNBQVIsQ0FBa0IsUUFBUSxNQUExQixDQUFUO0FBQ0QsT0FMRCxNQUtPO0FBQ0wsaUJBQVMsRUFBVDtBQUNBLGFBQUssSUFBSSxJQUFULElBQWlCLE1BQWpCLEVBQXlCO0FBQUUsaUJBQU8sSUFBUCxDQUFZLElBQVo7QUFBb0I7QUFDaEQ7QUFDRCxVQUFJLElBQUksQ0FBQyxPQUFPLE1BQWhCO0FBQ0EsVUFBSSxNQUFNLENBQVY7QUFDQSxhQUFPO0FBQ0wsY0FBTSxnQkFBVztBQUNmLGNBQUksUUFBUSxDQUFaLEVBQWUsT0FBTyxFQUFFLE1BQU0sSUFBUixFQUFQO0FBQ2YsaUJBQU8sRUFBRSxNQUFNLEtBQVIsRUFBZSxPQUFPLE9BQU8sS0FBUCxDQUF0QixFQUFQO0FBQ0Q7QUFKSSxPQUFQO0FBTUQsS0F4UTRCO0FBeVE3QjtBQUNBO0FBQ0EsYUFBUyxpQkFBUyxNQUFULEVBQWlCO0FBQ3hCLGFBQU8sMkJBQTJCLE1BQTNCLENBQVA7QUFDRCxLQTdRNEI7QUE4UTdCLFdBQU8sZUFBUyxNQUFULEVBQWlCLFFBQWpCLEVBQTJCLElBQTNCLEVBQWlDO0FBQ3RDO0FBQ0EsYUFBTyxTQUFTLFNBQVQsQ0FBbUIsS0FBbkIsQ0FBeUIsSUFBekIsQ0FBOEIsTUFBOUIsRUFBc0MsUUFBdEMsRUFBZ0QsSUFBaEQsQ0FBUDtBQUNELEtBalI0QjtBQWtSN0IsZUFBVyxtQkFBUyxNQUFULEVBQWlCLElBQWpCLEVBQXVCLFNBQXZCLEVBQWtDO0FBQzNDOztBQUVBO0FBQ0EsVUFBSSxVQUFVLGNBQWMsR0FBZCxDQUFrQixNQUFsQixDQUFkO0FBQ0EsVUFBSSxZQUFZLFNBQWhCLEVBQTJCO0FBQ3pCLGVBQU8sUUFBUSxTQUFSLENBQWtCLFFBQVEsTUFBMUIsRUFBa0MsSUFBbEMsRUFBd0MsU0FBeEMsQ0FBUDtBQUNEOztBQUVELFVBQUksT0FBTyxNQUFQLEtBQWtCLFVBQXRCLEVBQWtDO0FBQ2hDLGNBQU0sSUFBSSxTQUFKLENBQWMsK0JBQStCLE1BQTdDLENBQU47QUFDRDtBQUNELFVBQUksY0FBYyxTQUFsQixFQUE2QjtBQUMzQixvQkFBWSxNQUFaO0FBQ0QsT0FGRCxNQUVPO0FBQ0wsWUFBSSxPQUFPLFNBQVAsS0FBcUIsVUFBekIsRUFBcUM7QUFDbkMsZ0JBQU0sSUFBSSxTQUFKLENBQWMsa0NBQWtDLE1BQWhELENBQU47QUFDRDtBQUNGOztBQUVELGFBQU8sS0FBSyxTQUFTLFNBQVQsQ0FBbUIsSUFBbkIsQ0FBd0IsS0FBeEIsQ0FBOEIsU0FBOUIsRUFBeUMsQ0FBQyxJQUFELEVBQU8sTUFBUCxDQUFjLElBQWQsQ0FBekMsQ0FBTCxHQUFQO0FBQ0Q7QUF2UzRCLEdBQS9COztBQTBTQTtBQUNBO0FBQ0EsTUFBSSxPQUFPLEtBQVAsS0FBaUIsV0FBakIsSUFDQSxPQUFPLE1BQU0sTUFBYixLQUF3QixXQUQ1QixFQUN5Qzs7QUFFdkMsUUFBSSxhQUFhLE1BQU0sTUFBdkI7QUFBQSxRQUNJLHFCQUFxQixNQUFNLGNBRC9COztBQUdBLFFBQUksaUJBQWlCLFdBQVc7QUFDOUIsV0FBSyxlQUFXO0FBQUUsY0FBTSxJQUFJLFNBQUosQ0FBYyxrQkFBZCxDQUFOO0FBQTBDO0FBRDlCLEtBQVgsQ0FBckI7O0FBSUEsV0FBTyxLQUFQLEdBQWUsVUFBUyxNQUFULEVBQWlCLE9BQWpCLEVBQTBCO0FBQ3ZDO0FBQ0EsVUFBSSxPQUFPLE1BQVAsTUFBbUIsTUFBdkIsRUFBK0I7QUFDN0IsY0FBTSxJQUFJLFNBQUosQ0FBYywyQ0FBeUMsTUFBdkQsQ0FBTjtBQUNEO0FBQ0Q7QUFDQSxVQUFJLE9BQU8sT0FBUCxNQUFvQixPQUF4QixFQUFpQztBQUMvQixjQUFNLElBQUksU0FBSixDQUFjLDRDQUEwQyxPQUF4RCxDQUFOO0FBQ0Q7O0FBRUQsVUFBSSxXQUFXLElBQUksU0FBSixDQUFjLE1BQWQsRUFBc0IsT0FBdEIsQ0FBZjtBQUNBLFVBQUksS0FBSjtBQUNBLFVBQUksT0FBTyxNQUFQLEtBQWtCLFVBQXRCLEVBQWtDO0FBQ2hDLGdCQUFRLG1CQUFtQixRQUFuQjtBQUNOO0FBQ0Esb0JBQVc7QUFDVCxjQUFJLE9BQU8sTUFBTSxTQUFOLENBQWdCLEtBQWhCLENBQXNCLElBQXRCLENBQTJCLFNBQTNCLENBQVg7QUFDQSxpQkFBTyxTQUFTLEtBQVQsQ0FBZSxNQUFmLEVBQXVCLElBQXZCLEVBQTZCLElBQTdCLENBQVA7QUFDRCxTQUxLO0FBTU47QUFDQSxvQkFBVztBQUNULGNBQUksT0FBTyxNQUFNLFNBQU4sQ0FBZ0IsS0FBaEIsQ0FBc0IsSUFBdEIsQ0FBMkIsU0FBM0IsQ0FBWDtBQUNBLGlCQUFPLFNBQVMsU0FBVCxDQUFtQixNQUFuQixFQUEyQixJQUEzQixDQUFQO0FBQ0QsU0FWSyxDQUFSO0FBV0QsT0FaRCxNQVlPO0FBQ0wsZ0JBQVEsV0FBVyxRQUFYLEVBQXFCLE9BQU8sY0FBUCxDQUFzQixNQUF0QixDQUFyQixDQUFSO0FBQ0Q7QUFDRCxvQkFBYyxHQUFkLENBQWtCLEtBQWxCLEVBQXlCLFFBQXpCO0FBQ0EsYUFBTyxLQUFQO0FBQ0QsS0E3QkQ7O0FBK0JBLFdBQU8sS0FBUCxDQUFhLFNBQWIsR0FBeUIsVUFBUyxNQUFULEVBQWlCLE9BQWpCLEVBQTBCO0FBQ2pELFVBQUksUUFBUSxJQUFJLEtBQUosQ0FBVSxNQUFWLEVBQWtCLE9BQWxCLENBQVo7QUFDQSxVQUFJLFNBQVMsU0FBVCxNQUFTLEdBQVc7QUFDdEIsWUFBSSxXQUFXLGNBQWMsR0FBZCxDQUFrQixLQUFsQixDQUFmO0FBQ0EsWUFBSSxhQUFhLElBQWpCLEVBQXVCO0FBQ3JCLG1CQUFTLE1BQVQsR0FBbUIsSUFBbkI7QUFDQSxtQkFBUyxPQUFULEdBQW1CLGNBQW5CO0FBQ0Q7QUFDRCxlQUFPLFNBQVA7QUFDRCxPQVBEO0FBUUEsYUFBTyxFQUFDLE9BQU8sS0FBUixFQUFlLFFBQVEsTUFBdkIsRUFBUDtBQUNELEtBWEQ7O0FBYUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFPLEtBQVAsQ0FBYSxNQUFiLEdBQXNCLFVBQXRCO0FBQ0EsV0FBTyxLQUFQLENBQWEsY0FBYixHQUE4QixrQkFBOUI7QUFFRCxHQTdERCxNQTZETztBQUNMO0FBQ0EsUUFBSSxPQUFPLEtBQVAsS0FBaUIsV0FBckIsRUFBa0M7QUFDaEM7QUFDQSxhQUFPLEtBQVAsR0FBZSxVQUFTLE9BQVQsRUFBa0IsUUFBbEIsRUFBNEI7QUFDekMsY0FBTSxJQUFJLEtBQUosQ0FBVSx1R0FBVixDQUFOO0FBQ0QsT0FGRDtBQUdEO0FBQ0Q7QUFDQTtBQUNEOztBQUVEO0FBQ0E7QUFDQSxNQUFJLE9BQU8sT0FBUCxLQUFtQixXQUF2QixFQUFvQztBQUNsQyxXQUFPLElBQVAsQ0FBWSxPQUFaLEVBQXFCLE9BQXJCLENBQTZCLFVBQVUsR0FBVixFQUFlO0FBQzFDLGNBQVEsR0FBUixJQUFlLFFBQVEsR0FBUixDQUFmO0FBQ0QsS0FGRDtBQUdEOztBQUVEO0FBQ0MsQ0FwaUV1QixDQW9pRXRCLE9BQU8sT0FBUCxLQUFtQixXQUFuQixHQUFpQyxNQUFqQyxZQXBpRXNCLENBQWpCIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiLyogZXhwb3J0ZWQgYXJyYXlGaW5kICovXG5pbXBvcnQgeyBhcnJheUZpbmQgfSBmcm9tICcuLi9qcy1leHBvcnRzL3BvbHlmaWxscyc7XG4gXG4oZnVuY3Rpb24oKXsgXG4gIFwidXNlIHN0cmljdFwiO1xuXG4gIC8qdmFyIHNwZWNpZXMgPSB7XG4gICAgQjogXCJIYWxpYnV0XCIsXG4gICAgQzogXCJTYWJsZWZpc2hcIixcbiAgICBEOiBcIkR1bmdlbmVzcyBjcmFiXCIsXG4gICAgRTogXCJIYWlyIENyYWJcIixcbiAgICBGOiBcIkZyZXNod2F0ZXIgZmlzaFwiLFxuICAgIEc6IFwiSGVycmluZyByb2VcIixcbiAgICBIOiBcIkhlcnJpbmcgKGZvb2QvYmFpdClcIixcbiAgICBJOiBcIkxpbmcgY29kXCIsXG4gICAgSjogXCJHZW9kdWNrIGNsYW1zXCIsXG4gICAgSzogXCJLaW5nIGNyYWJcIixcbiAgICBMOiBcIkhlcnJpbmcgc3Bhd24gb24ga2VscFwiLFxuICAgIE06IFwiTWlzYy4gc2FsdHdhdGVyIGZpbmZpc2hcIixcbiAgICBOOiBcIlNuYWlsc1wiLFxuICAgIE86IFwiT2N0b3B1cy9zcXVpZFwiLFxuICAgIFA6IFwiU2hyaW1wXCIsXG4gICAgUTogXCJTZWEgY3VjdW1iZXJcIixcbiAgICBSOiBcIkNsYW1zXCIsXG4gICAgUzogXCJTYWxtb25cIixcbiAgICBUOiBcIlRhbm5lciBjcmFiXCIsXG4gICAgVEI6IFwiVGFubmVyIEJhaXJkaSBjcmFiXCIsXG4gICAgVTogXCJTZWEgdXJjaGluXCIsXG4gICAgVzogXCJTY2FsbG9wc1wiLFxuICAgIFk6IFwiUm9ja2Zpc2hcIlxuICB9O1xuXG4gIHZhciBnZWFyID0ge1wiMVwiOlwiUFVSU0UgU0VJTkVcIixcIjJcIjpcIlZFU1NFTCBUTyA4MCdcIixcIjRcIjpcIlNFVCBHSUxMTkVUXCIsXCI1XCI6XCJIQU5EIFRST0xMXCIsXCI2XCI6XCJMT05HTElORSBWRVNTRUwgVU5ERVIgNjAnXCIsXCI3XCI6XCJPVFRFUiBUUkFXTFwiLFwiOFwiOlwiRklTSCBXSEVFTFwiLFwiOVwiOlwiUE9UIEdFQVIgVkVTU0VMIFVOREVSIDYwJ1wiLFwiMTBcIjpcIlJJTkcgTkVUXCIsXCIxMVwiOlwiRElWSU5HIEdFQVJcIixcIjEyXCI6XCJESVZFL0hBTkQgUElDS1wiLFwiMTdcIjpcIkJFQU0gVFJBV0xcIixcIjE4XCI6XCJTSE9WRUxcIixcIjIxXCI6XCJQT1VORFwiLFwiMjNcIjpcIk1FQ0hBTklDQUwgRElHR0VSXCIsXCIyNVwiOlwiRElOR0xFQkFSIFRST0xMXCIsXCIyNlwiOlwiTUVDSEFOSUNBTCBKSUdcIixcIjM0XCI6XCJHSUxMTkVUXCIsXCIzN1wiOlwiUEFJUiBUUkFXTFwiLFwiNjFcIjpcIkxPTkdMSU5FIFZFU1NFTCA2MCcgT1IgT1ZFUlwiLFwiNzdcIjpcIkdJTExORVRcIixcIjkxXCI6XCJQT1QgR0VBUiBWRVNTRUwgNjAnIE9SIE9WRVJcIn07XG5cbiAgdmFyIHJlZ2lvbnMgPSB7XCJBXCI6XCJTT1VUSEVBU1RcIixcIkJcIjpcIlNUQVRFV0lERVwiLFwiRFwiOlwiWUFLVVRBVFwiLFwiRVwiOlwiUFJJTkNFIFdJTExJQU0gU09VTkRcIixcIkpcIjpcIldFU1RXQVJEXCIsXCJMXCI6XCJDSElHTklLXCIsXCJNXCI6XCJBTEFTS0EgUEVOSU5TVUxBXCIsXCJRXCI6XCJCRVJJTkcgU0VBXCIsXCJUXCI6XCJCUklTVE9MIEJBWVwiLFwiWFwiOlwiS09UWkVCVUVcIixcIkhcIjpcIkNPT0sgSU5MRVRcIixcIlNcIjpcIlNFQ1VSSVRZIENPVkVcIixcIlZcIjpcIkNBUEUgQVZJTk9GXCIsXCJaXCI6XCJOT1JUT04gU09VTkRcIixcIktcIjpcIktPRElBS1wiLFwiT1wiOlwiRFVUQ0ggSEFSQk9SXCIsXCJPQVwiOlwiQUxFVVRJQU4gQ0RRQVBJQ0RBXCIsXCJPQlwiOlwiQUxFVVRJQU4gQ0RRQkJFRENcIixcIk9DXCI6XCJBTEVVVElBTiBDRFFDQlNGQVwiLFwiT0RcIjpcIkFMRVVUSUFOIENEUUNWUkZcIixcIk9FXCI6XCJBTEVVVElBTiBDRFFOU0VEQ1wiLFwiT0ZcIjpcIkFMRVVUSUFOIENEUVlERkRBXCIsXCJPR1wiOlwiQUxFVVRJQU4gSVNMQU5EUyBBQ0FBQ0RDXCIsXCJRQVwiOlwiQkVSSU5HIFNFQSBDRFFBUElDREFcIixcIlFCXCI6XCJCRVJJTkcgU0VBIENEUUJCRURDXCIsXCJRQ1wiOlwiQkVSSU5HIFNFQSBDRFFDQlNGQVwiLFwiUURcIjpcIkJFUklORyBTRUEgQ0RRQ1ZSRlwiLFwiUUVcIjpcIkJFUklORyBTRUEgQ0RRTlNFRENcIixcIlFGXCI6XCJCRVJJTkcgU0VBIENEUVlERkRBXCIsXCJUQVwiOlwiQlJJU1RPTCBCQVkgQ0RRQVBJQ0RBXCIsXCJUQlwiOlwiQlJJU1RPTCBCQVkgQ0RRQkJFRENcIixcIlRDXCI6XCJCUklTVE9MIEJBWSBDRFFDQlNGQVwiLFwiVERcIjpcIkJSSVNUT0wgQkFZIENEUUNWUkZcIixcIlRFXCI6XCJCUklTVE9MIEJBWSBDRFFOU0VEQ1wiLFwiVEZcIjpcIkJSSVNUT0wgQkFZIENEUVlERkRBXCIsXCJaRVwiOlwiTk9SVE9OIFNPVU5EIENEUU5TRURDXCIsXCJaRlwiOlwiTk9SVE9OIFNPVU5EIENEUVlERkRBXCIsXCJHXCI6XCJHT0FcIixcIkFCXCI6XCJTVEFURVdJREVcIixcIkFHXCI6XCJHT0FcIixcIkJCXCI6XCJTVEFURVdJREVcIixcIkJHXCI6XCJHT0FcIixcIkZCXCI6XCJTVEFURVdJREVcIixcIkZHXCI6XCJHT0FcIixcIkdCXCI6XCJTVEFURVdJREVcIixcIkdHXCI6XCJHT0FcIixcIkhCXCI6XCJTVEFURVdJREVcIixcIkhHXCI6XCJHT0FcIixcIklCXCI6XCJTVEFURVdJREVcIixcIklHXCI6XCJHT0FcIixcIkZcIjpcIkFUS0EvQU1MSUEgSVNMQU5EU1wiLFwiUlwiOlwiQURBS1wiLFwiQUZXXCI6XCJGRURFUkFMIFdBVEVSU1wiLFwiQVNXXCI6XCJTVEFURSBXQVRFUlNcIixcIkJGV1wiOlwiRkVERVJBTCBXQVRFUlNcIixcIkJTV1wiOlwiU1RBVEUgV0FURVJTXCJ9O1xuKi9cbiAgdmFyIGZpc2hOb2RlcyA9IG51bGwsXG4gICAgICBmaXNoTGlua3MgPSBudWxsLFxuICAgICAgbWFyZ2luID0geyAvLyBleHByZXNzZWQgYXMgcGVyY2VudGFnZXNcbiAgICAgICAgdG9wOjAsXG4gICAgICAgIHJpZ2h0OjAsXG4gICAgICAgIGJvdHRvbTowLFxuICAgICAgICBsZWZ0OjBcbiAgICAgIH0sXG4gICAgICB3aWR0aCA9IDEwMCAtIG1hcmdpbi5yaWdodCAtIG1hcmdpbi5sZWZ0LFxuICAgICAgaGVpZ2h0ID0gMTAwIC0gbWFyZ2luLnRvcCAtIG1hcmdpbi5ib3R0b207XG5cbiAgdmFyIGNvbG9yID0gZDMuc2NhbGVPcmRpbmFsKGQzLnNjaGVtZUNhdGVnb3J5MjApO1xuXG4gIHZhciByU2NhbGUgPSBkMy5zY2FsZUxvZygpLnJhbmdlKFswLjMsM10pO1xuICB2YXIgc3RyZW5ndGhTY2FsZSA9IGQzLnNjYWxlTGluZWFyKCkucmFuZ2UoWzEsNV0pO1xuICB2YXIgc2ltdWxhdGlvbiA9IGQzLmZvcmNlU2ltdWxhdGlvbigpXG4gICAgLnZlbG9jaXR5RGVjYXkoWzAuNV0pXG4gICAgLmZvcmNlKFwibGlua1wiLCBkMy5mb3JjZUxpbmsoKSlcbiAgICAuZm9yY2UoXCJjaGFyZ2VcIiwgZDMuZm9yY2VNYW55Qm9keSgpLnN0cmVuZ3RoKC0xKSlcbiAgICAuZm9yY2UoXCJjZW50ZXJcIiwgZDMuZm9yY2VDZW50ZXIod2lkdGggLyAyLCBoZWlnaHQgLyAyKSlcbiAgICAuZm9yY2UoXCJjb2xsaWRlXCIsIGQzLmZvcmNlQ29sbGlkZSgpLnJhZGl1cyhmdW5jdGlvbihkKSB7IHJldHVybiByU2NhbGUoZC5jb3VudCk7IH0pLml0ZXJhdGlvbnMoMikpO1xuXG4gIGQzLmNzdignbWF0cml4LWhlYWRlcnMuY3N2JywgZnVuY3Rpb24oZGF0YSl7XG4gICAgY29uc29sZS5sb2coZGF0YSk7XG4gICAgZmlzaExpbmtzID0gZGF0YTtcbiAgICBnb0dhdGUoKTtcbiAgfSk7XG4gIGQzLmNzdignZmlzaGVyaWVzLW5vZGVzLmNzdicsIGZ1bmN0aW9uKGRhdGEpe1xuICAgIGNvbnNvbGUubG9nKGRhdGEpO1xuICAgIGRhdGEuZm9yRWFjaChmdW5jdGlvbihlYWNoKXtcbiAgICAgIGZvciAodmFyIGtleSBpbiBlYWNoKXtcbiAgICAgICAgaWYgKCBlYWNoLmhhc093blByb3BlcnR5KGtleSkgKXtcbiAgICAgICAgICBpZiAoICFpc05hTigrZWFjaFtrZXldKSApe1xuICAgICAgICAgICAgZWFjaFtrZXldID0gK2VhY2hba2V5XTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgICBmaXNoTm9kZXMgPSBkYXRhO1xuICAgIGdvR2F0ZSgpO1xuICB9KTtcblxuICBmdW5jdGlvbiBnb0dhdGUoKXtcbiAgICBpZiAoIGZpc2hOb2RlcyAhPT0gbnVsbCAmJiBmaXNoTGlua3MgIT09IG51bGwgKXtcbiAgICAgIGdvKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gIH1cblxuICB2YXIgbmV3TGlua3MgPSBbXSxcbiAgbmV0d29yayA9IHt9O1xuICBcbiAgZnVuY3Rpb24gZ28oKXtcbiAgICBmdW5jdGlvbiBpc01hdGNoKGtleSl7XG4gICAgICByZXR1cm4gZmlzaE5vZGVzLmZpbmQoZnVuY3Rpb24ob2JqKXtcbiAgICAgICAgcmV0dXJuIG9iai5pZCA9PT0ga2V5O1xuICAgICAgfSk7XG4gICAgfVxuICAgIGZpc2hMaW5rcy5mb3JFYWNoKGZ1bmN0aW9uKGVhY2gsaSl7XG4gICAgICBmb3IgKHZhciBrZXkgaW4gZWFjaCl7XG4gICAgICAgIGlmICggZWFjaC5oYXNPd25Qcm9wZXJ0eShrZXkpICl7XG4gICAgICAgICAgbGV0IG1hdGNoID0gaXNNYXRjaChrZXkpO1xuICAgICAgICAgIGxldCBpbmRleCA9IGZpc2hOb2Rlcy5pbmRleE9mKG1hdGNoKTtcbiAgICAgICAgICBpZiAoaW5kZXggIT09IGkgJiYgZWFjaFtrZXldICE9PSBcIjBcIiApeyAvLyBpZiBzb3VyY2UgYW5kIHRhcmdldCBhcmUgbm90IHRoZSBzYW1lXG4gICAgICAgICAgICBuZXdMaW5rcy5wdXNoKHtcbiAgICAgICAgICAgICAgc291cmNlOiBpLFxuICAgICAgICAgICAgICB0YXJnZXQ6IGluZGV4LCBcbiAgICAgICAgICAgICAgdmFsdWU6ICtlYWNoW2tleV1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pOyAvLyBlbmQgZm9yRWFjaFxuICAgIG5ldHdvcmsubm9kZXMgPSBmaXNoTm9kZXM7XG4gICAgbmV0d29yay5saW5rcyA9IG5ld0xpbmtzO1xuICAgIGNvbnNvbGUubG9nKG5ldHdvcmspO1xuICAgIHJlbmRlcihuZXR3b3JrKTtcbiAgfSAvLyBlbmQgZ28oKVxuXG4gIGZ1bmN0aW9uIHJlbmRlcihuZXR3b3JrKSB7XG4gICAvKiBpZiAodHJ1ZSl7XG4gICAgICByZXR1cm47XG4gICAgfSovXG5cbiAgICByU2NhbGUuZG9tYWluKGQzLmV4dGVudChuZXR3b3JrLm5vZGVzLCBkID0+IGQuY291bnQpKTtcbiAgICBzdHJlbmd0aFNjYWxlLmRvbWFpbihbMSwgZDMubWVhbihuZXR3b3JrLmxpbmtzLCBkID0+IGQudmFsdWUpICsgZDMuZGV2aWF0aW9uKG5ldHdvcmsubGlua3MsIGQgPT4gZC52YWx1ZSkgKiAyIF0pO1xuXG4gICAgdmFyIHJhZGl1cyA9IDI7XG4gICAgZnVuY3Rpb24gY291bnQobm9kZSl7XG4gICAgICB2YXIgaSA9IDA7XG4gICAgICBuZXR3b3JrLmxpbmtzLmZvckVhY2gobGluayA9PiB7XG4gICAgICAgIGlmICggbGluay5zb3VyY2UgPT09IG5vZGUgfHwgbGluay50YXJnZXQgPT09IG5vZGUgKXtcbiAgICAgICAgICBpKys7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIGk7XG4gICAgfVxuICAgIHNpbXVsYXRpb25cbiAgICAgICAgLm5vZGVzKG5ldHdvcmsubm9kZXMpXG4gICAgICAgIC5vbihcInRpY2tcIiwgdGlja2VkKTtcblxuICAgIHNpbXVsYXRpb24uZm9yY2UoXCJsaW5rXCIpXG4gICAgICAgIC5saW5rcyhuZXR3b3JrLmxpbmtzKVxuICAgICAgICAuc3RyZW5ndGgoZCA9PiB7XG4gICAgICAgIC8vICBjb25zb2xlLmxvZyhkKTtcbiAgICAgICAgICByZXR1cm4gZC50YXJnZXQuY2x1c3RlciA9PT0gZC5zb3VyY2UuY2x1c3RlciA/ICAxIC8gTWF0aC5taW4oY291bnQoZC5zb3VyY2UpLCBjb3VudChkLnRhcmdldCkpIDogKCAxIC8gTWF0aC5taW4oY291bnQoZC5zb3VyY2UpLCBjb3VudChkLnRhcmdldCkpICkgLyAxMDsgLy8gcmVwb3JvZHVjZSB0aGUgZGVmYXVsdCB2YWx1ZSBmb3IgbGlua3MgdGhhdCBtZWV0IHRoZSBjcml0ZXJpYVxuICAgICAgICB9KTtcbiAgICB2YXIgc3ZnID0gZDMuc2VsZWN0KCdib2R5JylcbiAgICAgIC5hcHBlbmQoJ3N2ZycpXG4gICAgICAuYXR0cignd2lkdGgnLCAnMTAwJScpXG4gICAgICAuYXR0cigneG1sbnMnLCdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZycpXG4gICAgICAuYXR0cigndmVyc2lvbicsJzEuMScpXG4gICAgICAuYXR0cigndmlld0JveCcsICcwIDAgMTAwIDEwMCcpXG4gICAgICAuYXBwZW5kKCdnJylcbiAgICAgIC5hdHRyKCd0cmFuc2Zvcm0nLCAndHJhbnNsYXRlKCcgKyBtYXJnaW4ubGVmdCArICcsJyArIG1hcmdpbi50b3AgKyAnKScpO1xuXG4gICAgdmFyIGxpbmsgPSBzdmcuYXBwZW5kKFwiZ1wiKVxuICAgICAgLmF0dHIoXCJjbGFzc1wiLCBcImxpbmtzXCIpXG4gICAgICAuc2VsZWN0QWxsKFwibGluZVwiKVxuICAgICAgLmRhdGEobmV0d29yay5saW5rcylcbiAgICAgIC5lbnRlcigpLmFwcGVuZChcImxpbmVcIilcbiAgICAgIC5hdHRyKCdzdHJva2UnLCBkID0+IHtcbiAgICAgICAgXG4gICAgICAgIHJldHVybiBkLnNvdXJjZS5jbHVzdGVyID09PSBkLnRhcmdldC5jbHVzdGVyID8gY29sb3IoZC50YXJnZXQuY2x1c3RlcikgOiAnIzk5OSc7XG4gICAgICB9KVxuICAgICAgLmF0dHIoXCJzdHJva2Utd2lkdGhcIiwgZnVuY3Rpb24oZCkgeyByZXR1cm4gZC52YWx1ZSA+IDkgfHwgZC5zb3VyY2UuY2x1c3RlciA9PT0gZC50YXJnZXQuY2x1c3RlciA/IE1hdGguc3FydChkLnZhbHVlKSAvIDIwIDogMDsgfSk7IFxuXG4gICAgdmFyIG5vZGUgPSBzdmcuYXBwZW5kKFwiZ1wiKVxuICAgICAgLmF0dHIoXCJjbGFzc1wiLCBcIm5vZGVzXCIpXG4gICAgICAuc2VsZWN0QWxsKFwiY2lyY2xlXCIpXG4gICAgICAuZGF0YShuZXR3b3JrLm5vZGVzKVxuICAgICAgLmVudGVyKCkuYXBwZW5kKFwiY2lyY2xlXCIpXG4gICAgICAgIC5hdHRyKFwiclwiLCBkID0+IHJTY2FsZShkLmNvdW50KSlcbiAgICAgICAgLmF0dHIoXCJmaWxsXCIsIGZ1bmN0aW9uKGQpIHsgcmV0dXJuIGNvbG9yKGQuY2x1c3Rlcik7IH0pXG4gICAgICAgIC5jYWxsKGQzLmRyYWcoKVxuICAgICAgICAgICAgLm9uKFwic3RhcnRcIiwgZHJhZ3N0YXJ0ZWQpXG4gICAgICAgICAgICAub24oXCJkcmFnXCIsIGRyYWdnZWQpXG4gICAgICAgICAgICAub24oXCJlbmRcIiwgZHJhZ2VuZGVkKSk7XG5cbiAgbm9kZS5hcHBlbmQoXCJ0aXRsZVwiKVxuICAgICAgLnRleHQoZnVuY3Rpb24oZCkgeyByZXR1cm4gZC5pZDsgfSk7XG5cblxuICBmdW5jdGlvbiB0aWNrZWQoKSB7XG4gICAgbGlua1xuICAgICAgICAuYXR0cihcIngxXCIsIGZ1bmN0aW9uKGQpIHsgcmV0dXJuIGQuc291cmNlLng7IH0pXG4gICAgICAgIC5hdHRyKFwieTFcIiwgZnVuY3Rpb24oZCkgeyByZXR1cm4gZC5zb3VyY2UueTsgfSlcbiAgICAgICAgLmF0dHIoXCJ4MlwiLCBmdW5jdGlvbihkKSB7IHJldHVybiBkLnRhcmdldC54OyB9KVxuICAgICAgICAuYXR0cihcInkyXCIsIGZ1bmN0aW9uKGQpIHsgcmV0dXJuIGQudGFyZ2V0Lnk7IH0pO1xuXG4gICAgbm9kZVxuICAgICAgICAuYXR0cihcImN4XCIsIGZ1bmN0aW9uKGQpIHtcbiAgICAgICAgICBkLnggPSBNYXRoLm1heChyYWRpdXMsIE1hdGgubWluKHdpZHRoIC0gcmFkaXVzLCBkLngpKTtcbiAgICAgICAgICByZXR1cm4gZC54O1xuICAgICAgICB9KVxuICAgICAgICAuYXR0cihcImN5XCIsIGZ1bmN0aW9uKGQpIHtcbiAgICAgICAgICBkLnkgPSBNYXRoLm1heChyYWRpdXMsIE1hdGgubWluKGhlaWdodCAtIHJhZGl1cywgZC55KSk7XG4gICAgICAgICAgcmV0dXJuIGQueTtcbiAgICAgICAgfSk7XG4gIH1cblxuICAgIFxuICB9IC8vIGVuZCByZW5kZXIoKVxuICBmdW5jdGlvbiBkcmFnc3RhcnRlZChkKSB7XG4gIGlmICghZDMuZXZlbnQuYWN0aXZlKSB7XG4gICAgc2ltdWxhdGlvbi5hbHBoYVRhcmdldCgwLjMpLnJlc3RhcnQoKTtcbiAgfVxuICBkLmZ4ID0gZC54O1xuICBkLmZ5ID0gZC55O1xufVxuXG5mdW5jdGlvbiBkcmFnZ2VkKGQpIHtcbiAgZC5meCA9IGQzLmV2ZW50Lng7XG4gIGQuZnkgPSBkMy5ldmVudC55O1xufVxuXG5mdW5jdGlvbiBkcmFnZW5kZWQoZCkge1xuICBpZiAoIWQzLmV2ZW50LmFjdGl2ZSkge1xuICAgIHNpbXVsYXRpb24uYWxwaGFUYXJnZXQoMCk7XG4gIH1cbiAgZC5meCA9IG51bGw7XG4gIGQuZnkgPSBudWxsO1xufVxufSkoKTsiLCIvKipcbiAqIFNWRyBmb2N1cyBcbiAqIENvcHlyaWdodChjKSAyMDE3LCBKb2huIE9zdGVybWFuXG4gKlxuICogTUlUIExpY2Vuc2VcbiAqXG4gKiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5IG9mIHRoaXMgc29mdHdhcmUgYW5kIFxuICogYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIFxuICogd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBcbiAqIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIFxuICogZm9sbG93aW5nIGNvbmRpdGlvbnM6XG5cbiAqIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgXG4gKiBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gXG4gKiBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgXG4gKiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBcbiAqIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG4gKi9cblxuIC8vIElFL0VkZ2UgKHBlcmhhcHMgb3RoZXJzKSBkb2VzIG5vdCBhbGxvdyBwcm9ncmFtbWF0aWMgZm9jdXNpbmcgb2YgU1ZHIEVsZW1lbnRzICh2aWEgYGZvY3VzKClgKS4gU2FtZSBmb3IgYGJsdXIoKWAuXG5cbiBleHBvcnQgY29uc3QgU1ZHRm9jdXMgPSAoZnVuY3Rpb24oKXtcbiAgICBpZiAoICdmb2N1cycgaW4gU1ZHRWxlbWVudC5wcm90b3R5cGUgPT09IGZhbHNlICkge1xuICAgICAgU1ZHRWxlbWVudC5wcm90b3R5cGUuZm9jdXMgPSBIVE1MRWxlbWVudC5wcm90b3R5cGUuZm9jdXM7XG4gICAgfVxuICAgIGlmICggJ2JsdXInIGluIFNWR0VsZW1lbnQucHJvdG90eXBlID09PSBmYWxzZSApIHtcbiAgICAgIFNWR0VsZW1lbnQucHJvdG90eXBlLmJsdXIgPSBIVE1MRWxlbWVudC5wcm90b3R5cGUuYmx1cjtcbiAgICB9XG4gfSkoKTtcblxuXG5cblxuLyoqXG4gKiBpbm5lckhUTUwgcHJvcGVydHkgZm9yIFNWR0VsZW1lbnRcbiAqIENvcHlyaWdodChjKSAyMDEwLCBKZWZmIFNjaGlsbGVyXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDJcbiAqXG4gKiBXb3JrcyBpbiBhIFNWRyBkb2N1bWVudCBpbiBDaHJvbWUgNissIFNhZmFyaSA1KywgRmlyZWZveCA0KyBhbmQgSUU5Ky5cbiAqIFdvcmtzIGluIGEgSFRNTDUgZG9jdW1lbnQgaW4gQ2hyb21lIDcrLCBGaXJlZm94IDQrIGFuZCBJRTkrLlxuICogRG9lcyBub3Qgd29yayBpbiBPcGVyYSBzaW5jZSBpdCBkb2Vzbid0IHN1cHBvcnQgdGhlIFNWR0VsZW1lbnQgaW50ZXJmYWNlIHlldC5cbiAqXG4gKiBJIGhhdmVuJ3QgZGVjaWRlZCBvbiB0aGUgYmVzdCBuYW1lIGZvciB0aGlzIHByb3BlcnR5IC0gdGh1cyB0aGUgZHVwbGljYXRpb24uXG4gKi9cbi8vIGVkaXRlZCBieSBKb2huIE9zdGVybWFuIHRvIGRlY2xhcmUgdGhlIHZhcmlhYmxlIGBzWE1MYCwgd2hpY2ggd2FzIHJlZmVyZW5jZWQgd2l0aG91dCBiZWluZyBkZWNsYXJlZFxuLy8gd2hpY2ggZmFpbGVkIHNpbGVudGx5IGluIGltcGxpY2l0IHN0cmljdCBtb2RlIG9mIGFuIGV4cG9ydFxuXG4vLyBtb3N0IGJyb3dzZXJzIGFsbG93IHNldHRpbmcgaW5uZXJIVE1MIG9mIHN2ZyBlbGVtZW50cyBidXQgSUUgZG9lcyBub3QgKG5vdCBhbiBIVE1MIGVsZW1lbnQpXG4vLyB0aGlzIHBvbHlmaWxsIHByb3ZpZGVzIHRoYXQuIG5lY2Vzc2FyeSBmb3IgZDMgbWV0aG9kIGAuaHRtbCgpYCBvbiBzdmcgZWxlbWVudHNcblxuZXhwb3J0IGNvbnN0IFNWR0lubmVySFRNTCA9IChmdW5jdGlvbigpIHtcbiAgdmFyIHNlcmlhbGl6ZVhNTCA9IGZ1bmN0aW9uKG5vZGUsIG91dHB1dCkge1xuICAgIHZhciBub2RlVHlwZSA9IG5vZGUubm9kZVR5cGU7XG4gICAgaWYgKG5vZGVUeXBlID09IDMpIHsgLy8gVEVYVCBub2Rlcy5cbiAgICAgIC8vIFJlcGxhY2Ugc3BlY2lhbCBYTUwgY2hhcmFjdGVycyB3aXRoIHRoZWlyIGVudGl0aWVzLlxuICAgICAgb3V0cHV0LnB1c2gobm9kZS50ZXh0Q29udGVudC5yZXBsYWNlKC8mLywgJyZhbXA7JykucmVwbGFjZSgvPC8sICcmbHQ7JykucmVwbGFjZSgnPicsICcmZ3Q7JykpO1xuICAgIH0gZWxzZSBpZiAobm9kZVR5cGUgPT0gMSkgeyAvLyBFTEVNRU5UIG5vZGVzLlxuICAgICAgLy8gU2VyaWFsaXplIEVsZW1lbnQgbm9kZXMuXG4gICAgICBvdXRwdXQucHVzaCgnPCcsIG5vZGUudGFnTmFtZSk7XG4gICAgICBpZiAobm9kZS5oYXNBdHRyaWJ1dGVzKCkpIHtcbiAgICAgICAgdmFyIGF0dHJNYXAgPSBub2RlLmF0dHJpYnV0ZXM7XG4gICAgICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSBhdHRyTWFwLmxlbmd0aDsgaSA8IGxlbjsgKytpKSB7XG4gICAgICAgICAgdmFyIGF0dHJOb2RlID0gYXR0ck1hcC5pdGVtKGkpO1xuICAgICAgICAgIG91dHB1dC5wdXNoKCcgJywgYXR0ck5vZGUubmFtZSwgJz1cXCcnLCBhdHRyTm9kZS52YWx1ZSwgJ1xcJycpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAobm9kZS5oYXNDaGlsZE5vZGVzKCkpIHtcbiAgICAgICAgb3V0cHV0LnB1c2goJz4nKTtcbiAgICAgICAgdmFyIGNoaWxkTm9kZXMgPSBub2RlLmNoaWxkTm9kZXM7XG4gICAgICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSBjaGlsZE5vZGVzLmxlbmd0aDsgaSA8IGxlbjsgKytpKSB7XG4gICAgICAgICAgc2VyaWFsaXplWE1MKGNoaWxkTm9kZXMuaXRlbShpKSwgb3V0cHV0KTtcbiAgICAgICAgfVxuICAgICAgICBvdXRwdXQucHVzaCgnPC8nLCBub2RlLnRhZ05hbWUsICc+Jyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBvdXRwdXQucHVzaCgnLz4nKTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKG5vZGVUeXBlID09IDgpIHtcbiAgICAgIC8vIFRPRE8oY29kZWRyZWFkKTogUmVwbGFjZSBzcGVjaWFsIGNoYXJhY3RlcnMgd2l0aCBYTUwgZW50aXRpZXM/XG4gICAgICBvdXRwdXQucHVzaCgnPCEtLScsIG5vZGUubm9kZVZhbHVlLCAnLS0+Jyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIFRPRE86IEhhbmRsZSBDREFUQSBub2Rlcy5cbiAgICAgIC8vIFRPRE86IEhhbmRsZSBFTlRJVFkgbm9kZXMuXG4gICAgICAvLyBUT0RPOiBIYW5kbGUgRE9DVU1FTlQgbm9kZXMuXG4gICAgICB0aHJvdyAnRXJyb3Igc2VyaWFsaXppbmcgWE1MLiBVbmhhbmRsZWQgbm9kZSBvZiB0eXBlOiAnICsgbm9kZVR5cGU7XG4gICAgfVxuICB9XG4gIC8vIFRoZSBpbm5lckhUTUwgRE9NIHByb3BlcnR5IGZvciBTVkdFbGVtZW50LlxuICBpZiAoICdpbm5lckhUTUwnIGluIFNWR0VsZW1lbnQucHJvdG90eXBlID09PSBmYWxzZSApe1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShTVkdFbGVtZW50LnByb3RvdHlwZSwgJ2lubmVySFRNTCcsIHtcbiAgICAgIGdldDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBvdXRwdXQgPSBbXTtcbiAgICAgICAgdmFyIGNoaWxkTm9kZSA9IHRoaXMuZmlyc3RDaGlsZDtcbiAgICAgICAgd2hpbGUgKGNoaWxkTm9kZSkge1xuICAgICAgICAgIHNlcmlhbGl6ZVhNTChjaGlsZE5vZGUsIG91dHB1dCk7XG4gICAgICAgICAgY2hpbGROb2RlID0gY2hpbGROb2RlLm5leHRTaWJsaW5nO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBvdXRwdXQuam9pbignJyk7XG4gICAgICB9LFxuICAgICAgc2V0OiBmdW5jdGlvbihtYXJrdXBUZXh0KSB7XG4gICAgICAgIGNvbnNvbGUubG9nKHRoaXMpO1xuICAgICAgICAvLyBXaXBlIG91dCB0aGUgY3VycmVudCBjb250ZW50cyBvZiB0aGUgZWxlbWVudC5cbiAgICAgICAgd2hpbGUgKHRoaXMuZmlyc3RDaGlsZCkge1xuICAgICAgICAgIHRoaXMucmVtb3ZlQ2hpbGQodGhpcy5maXJzdENoaWxkKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgLy8gUGFyc2UgdGhlIG1hcmt1cCBpbnRvIHZhbGlkIG5vZGVzLlxuICAgICAgICAgIHZhciBkWE1MID0gbmV3IERPTVBhcnNlcigpO1xuICAgICAgICAgIGRYTUwuYXN5bmMgPSBmYWxzZTtcbiAgICAgICAgICAvLyBXcmFwIHRoZSBtYXJrdXAgaW50byBhIFNWRyBub2RlIHRvIGVuc3VyZSBwYXJzaW5nIHdvcmtzLlxuICAgICAgICAgIGNvbnNvbGUubG9nKG1hcmt1cFRleHQpO1xuICAgICAgICAgIHZhciBzWE1MID0gJzxzdmcgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiPicgKyBtYXJrdXBUZXh0ICsgJzwvc3ZnPic7XG4gICAgICAgICAgY29uc29sZS5sb2coc1hNTCk7XG4gICAgICAgICAgdmFyIHN2Z0RvY0VsZW1lbnQgPSBkWE1MLnBhcnNlRnJvbVN0cmluZyhzWE1MLCAndGV4dC94bWwnKS5kb2N1bWVudEVsZW1lbnQ7XG5cbiAgICAgICAgICAvLyBOb3cgdGFrZSBlYWNoIG5vZGUsIGltcG9ydCBpdCBhbmQgYXBwZW5kIHRvIHRoaXMgZWxlbWVudC5cbiAgICAgICAgICB2YXIgY2hpbGROb2RlID0gc3ZnRG9jRWxlbWVudC5maXJzdENoaWxkO1xuICAgICAgICAgIHdoaWxlKGNoaWxkTm9kZSkge1xuICAgICAgICAgICAgdGhpcy5hcHBlbmRDaGlsZCh0aGlzLm93bmVyRG9jdW1lbnQuaW1wb3J0Tm9kZShjaGlsZE5vZGUsIHRydWUpKTtcbiAgICAgICAgICAgIGNoaWxkTm9kZSA9IGNoaWxkTm9kZS5uZXh0U2libGluZztcbiAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2goZSkge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcignRXJyb3IgcGFyc2luZyBYTUwgc3RyaW5nJyk7XG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICAvLyBUaGUgaW5uZXJTVkcgRE9NIHByb3BlcnR5IGZvciBTVkdFbGVtZW50LlxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShTVkdFbGVtZW50LnByb3RvdHlwZSwgJ2lubmVyU1ZHJywge1xuICAgICAgZ2V0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaW5uZXJIVE1MO1xuICAgICAgfSxcbiAgICAgIHNldDogZnVuY3Rpb24obWFya3VwVGV4dCkge1xuICAgICAgICB0aGlzLmlubmVySFRNTCA9IG1hcmt1cFRleHQ7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbn0pKCk7XG5cblxuLy8gaHR0cHM6Ly90YzM5LmdpdGh1Yi5pby9lY21hMjYyLyNzZWMtYXJyYXkucHJvdG90eXBlLmZpbmRcbmV4cG9ydCBjb25zdCBhcnJheUZpbmQgPSAoZnVuY3Rpb24oKXtcbiAgaWYgKCFBcnJheS5wcm90b3R5cGUuZmluZCkge1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShBcnJheS5wcm90b3R5cGUsICdmaW5kJywge1xuICAgICAgdmFsdWU6IGZ1bmN0aW9uKHByZWRpY2F0ZSkge1xuICAgICAgIC8vIDEuIExldCBPIGJlID8gVG9PYmplY3QodGhpcyB2YWx1ZSkuXG4gICAgICAgIGlmICh0aGlzID09IG51bGwpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdcInRoaXNcIiBpcyBudWxsIG9yIG5vdCBkZWZpbmVkJyk7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgbyA9IE9iamVjdCh0aGlzKTtcblxuICAgICAgICAvLyAyLiBMZXQgbGVuIGJlID8gVG9MZW5ndGgoPyBHZXQoTywgXCJsZW5ndGhcIikpLlxuICAgICAgICB2YXIgbGVuID0gby5sZW5ndGggPj4+IDA7XG5cbiAgICAgICAgLy8gMy4gSWYgSXNDYWxsYWJsZShwcmVkaWNhdGUpIGlzIGZhbHNlLCB0aHJvdyBhIFR5cGVFcnJvciBleGNlcHRpb24uXG4gICAgICAgIGlmICh0eXBlb2YgcHJlZGljYXRlICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcigncHJlZGljYXRlIG11c3QgYmUgYSBmdW5jdGlvbicpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gNC4gSWYgdGhpc0FyZyB3YXMgc3VwcGxpZWQsIGxldCBUIGJlIHRoaXNBcmc7IGVsc2UgbGV0IFQgYmUgdW5kZWZpbmVkLlxuICAgICAgICB2YXIgdGhpc0FyZyA9IGFyZ3VtZW50c1sxXTtcblxuICAgICAgICAvLyA1LiBMZXQgayBiZSAwLlxuICAgICAgICB2YXIgayA9IDA7XG5cbiAgICAgICAgLy8gNi4gUmVwZWF0LCB3aGlsZSBrIDwgbGVuXG4gICAgICAgIHdoaWxlIChrIDwgbGVuKSB7XG4gICAgICAgICAgLy8gYS4gTGV0IFBrIGJlICEgVG9TdHJpbmcoaykuXG4gICAgICAgICAgLy8gYi4gTGV0IGtWYWx1ZSBiZSA/IEdldChPLCBQaykuXG4gICAgICAgICAgLy8gYy4gTGV0IHRlc3RSZXN1bHQgYmUgVG9Cb29sZWFuKD8gQ2FsbChwcmVkaWNhdGUsIFQsIMKrIGtWYWx1ZSwgaywgTyDCuykpLlxuICAgICAgICAgIC8vIGQuIElmIHRlc3RSZXN1bHQgaXMgdHJ1ZSwgcmV0dXJuIGtWYWx1ZS5cbiAgICAgICAgICB2YXIga1ZhbHVlID0gb1trXTtcbiAgICAgICAgICBpZiAocHJlZGljYXRlLmNhbGwodGhpc0FyZywga1ZhbHVlLCBrLCBvKSkge1xuICAgICAgICAgICAgcmV0dXJuIGtWYWx1ZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgLy8gZS4gSW5jcmVhc2UgayBieSAxLlxuICAgICAgICAgIGsrKztcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIDcuIFJldHVybiB1bmRlZmluZWQuXG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbn0pKCk7IFxuXG4vLyBDb3B5cmlnaHQgKEMpIDIwMTEtMjAxMiBTb2Z0d2FyZSBMYW5ndWFnZXMgTGFiLCBWcmlqZSBVbml2ZXJzaXRlaXQgQnJ1c3NlbFxuLy8gVGhpcyBjb2RlIGlzIGR1YWwtbGljZW5zZWQgdW5kZXIgYm90aCB0aGUgQXBhY2hlIExpY2Vuc2UgYW5kIHRoZSBNUExcblxuLy8gTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbi8vIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbi8vIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuLy9cbi8vIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuLy9cbi8vIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbi8vIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbi8vIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuLy8gU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuLy8gbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG5cbi8qIFZlcnNpb246IE1QTCAxLjFcbiAqXG4gKiBUaGUgY29udGVudHMgb2YgdGhpcyBmaWxlIGFyZSBzdWJqZWN0IHRvIHRoZSBNb3ppbGxhIFB1YmxpYyBMaWNlbnNlIFZlcnNpb25cbiAqIDEuMSAodGhlIFwiTGljZW5zZVwiKTsgeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoXG4gKiB0aGUgTGljZW5zZS4gWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKiBodHRwOi8vd3d3Lm1vemlsbGEub3JnL01QTC9cbiAqXG4gKiBTb2Z0d2FyZSBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgYmFzaXMsXG4gKiBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLiBTZWUgdGhlIExpY2Vuc2VcbiAqIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHJpZ2h0cyBhbmQgbGltaXRhdGlvbnMgdW5kZXIgdGhlXG4gKiBMaWNlbnNlLlxuICpcbiAqIFRoZSBPcmlnaW5hbCBDb2RlIGlzIGEgc2hpbSBmb3IgdGhlIEVTLUhhcm1vbnkgcmVmbGVjdGlvbiBtb2R1bGVcbiAqXG4gKiBUaGUgSW5pdGlhbCBEZXZlbG9wZXIgb2YgdGhlIE9yaWdpbmFsIENvZGUgaXNcbiAqIFRvbSBWYW4gQ3V0c2VtLCBWcmlqZSBVbml2ZXJzaXRlaXQgQnJ1c3NlbC5cbiAqIFBvcnRpb25zIGNyZWF0ZWQgYnkgdGhlIEluaXRpYWwgRGV2ZWxvcGVyIGFyZSBDb3B5cmlnaHQgKEMpIDIwMTEtMjAxMlxuICogdGhlIEluaXRpYWwgRGV2ZWxvcGVyLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIENvbnRyaWJ1dG9yKHMpOlxuICpcbiAqL1xuXG4gLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gLy8gVGhpcyBmaWxlIGlzIGEgcG9seWZpbGwgZm9yIHRoZSB1cGNvbWluZyBFQ01BU2NyaXB0IFJlZmxlY3QgQVBJLFxuIC8vIGluY2x1ZGluZyBzdXBwb3J0IGZvciBQcm94aWVzLiBTZWUgdGhlIGRyYWZ0IHNwZWNpZmljYXRpb24gYXQ6XG4gLy8gaHR0cDovL3dpa2kuZWNtYXNjcmlwdC5vcmcvZG9rdS5waHA/aWQ9aGFybW9ueTpyZWZsZWN0X2FwaVxuIC8vIGh0dHA6Ly93aWtpLmVjbWFzY3JpcHQub3JnL2Rva3UucGhwP2lkPWhhcm1vbnk6ZGlyZWN0X3Byb3hpZXNcblxuIC8vIEZvciBhbiBpbXBsZW1lbnRhdGlvbiBvZiB0aGUgSGFuZGxlciBBUEksIHNlZSBoYW5kbGVycy5qcywgd2hpY2ggaW1wbGVtZW50czpcbiAvLyBodHRwOi8vd2lraS5lY21hc2NyaXB0Lm9yZy9kb2t1LnBocD9pZD1oYXJtb255OnZpcnR1YWxfb2JqZWN0X2FwaVxuXG4gLy8gVGhpcyBpbXBsZW1lbnRhdGlvbiBzdXBlcnNlZGVzIHRoZSBlYXJsaWVyIHBvbHlmaWxsIGF0OlxuIC8vIGNvZGUuZ29vZ2xlLmNvbS9wL2VzLWxhYi9zb3VyY2UvYnJvd3NlL3RydW5rL3NyYy9wcm94aWVzL0RpcmVjdFByb3hpZXMuanNcblxuIC8vIFRoaXMgY29kZSB3YXMgdGVzdGVkIG9uIHRyYWNlbW9ua2V5IC8gRmlyZWZveCAxMlxuLy8gIChhbmQgc2hvdWxkIHJ1biBmaW5lIG9uIG9sZGVyIEZpcmVmb3ggdmVyc2lvbnMgc3RhcnRpbmcgd2l0aCBGRjQpXG4gLy8gVGhlIGNvZGUgYWxzbyB3b3JrcyBjb3JyZWN0bHkgb25cbiAvLyAgIHY4IC0taGFybW9ueV9wcm94aWVzIC0taGFybW9ueV93ZWFrbWFwcyAodjMuNi41LjEpXG5cbiAvLyBMYW5ndWFnZSBEZXBlbmRlbmNpZXM6XG4gLy8gIC0gRUNNQVNjcmlwdCA1L3N0cmljdFxuIC8vICAtIFwib2xkXCIgKGkuZS4gbm9uLWRpcmVjdCkgSGFybW9ueSBQcm94aWVzXG4gLy8gIC0gSGFybW9ueSBXZWFrTWFwc1xuIC8vIFBhdGNoZXM6XG4gLy8gIC0gT2JqZWN0LntmcmVlemUsc2VhbCxwcmV2ZW50RXh0ZW5zaW9uc31cbiAvLyAgLSBPYmplY3Que2lzRnJvemVuLGlzU2VhbGVkLGlzRXh0ZW5zaWJsZX1cbiAvLyAgLSBPYmplY3QuZ2V0UHJvdG90eXBlT2ZcbiAvLyAgLSBPYmplY3Qua2V5c1xuIC8vICAtIE9iamVjdC5wcm90b3R5cGUudmFsdWVPZlxuIC8vICAtIE9iamVjdC5wcm90b3R5cGUuaXNQcm90b3R5cGVPZlxuIC8vICAtIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmdcbiAvLyAgLSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5XG4gLy8gIC0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvclxuIC8vICAtIE9iamVjdC5kZWZpbmVQcm9wZXJ0eVxuIC8vICAtIE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzXG4gLy8gIC0gT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXNcbiAvLyAgLSBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzXG4gLy8gIC0gT2JqZWN0LmdldFByb3RvdHlwZU9mXG4gLy8gIC0gT2JqZWN0LnNldFByb3RvdHlwZU9mXG4gLy8gIC0gT2JqZWN0LmFzc2lnblxuIC8vICAtIEZ1bmN0aW9uLnByb3RvdHlwZS50b1N0cmluZ1xuIC8vICAtIERhdGUucHJvdG90eXBlLnRvU3RyaW5nXG4gLy8gIC0gQXJyYXkuaXNBcnJheVxuIC8vICAtIEFycmF5LnByb3RvdHlwZS5jb25jYXRcbiAvLyAgLSBQcm94eVxuIC8vIEFkZHMgbmV3IGdsb2JhbHM6XG4gLy8gIC0gUmVmbGVjdFxuXG4gLy8gRGlyZWN0IHByb3hpZXMgY2FuIGJlIGNyZWF0ZWQgdmlhIFByb3h5KHRhcmdldCwgaGFuZGxlcilcblxuIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuZXhwb3J0IGNvbnN0IHJlZmxlY3QgPSAoZnVuY3Rpb24oZ2xvYmFsKXsgLy8gZnVuY3Rpb24tYXMtbW9kdWxlIHBhdHRlcm5cblwidXNlIHN0cmljdFwiO1xuIFxuLy8gPT09IERpcmVjdCBQcm94aWVzOiBJbnZhcmlhbnQgRW5mb3JjZW1lbnQgPT09XG5cbi8vIERpcmVjdCBwcm94aWVzIGJ1aWxkIG9uIG5vbi1kaXJlY3QgcHJveGllcyBieSBhdXRvbWF0aWNhbGx5IHdyYXBwaW5nXG4vLyBhbGwgdXNlci1kZWZpbmVkIHByb3h5IGhhbmRsZXJzIGluIGEgVmFsaWRhdG9yIGhhbmRsZXIgdGhhdCBjaGVja3MgYW5kXG4vLyBlbmZvcmNlcyBFUzUgaW52YXJpYW50cy5cblxuLy8gQSBkaXJlY3QgcHJveHkgaXMgYSBwcm94eSBmb3IgYW4gZXhpc3Rpbmcgb2JqZWN0IGNhbGxlZCB0aGUgdGFyZ2V0IG9iamVjdC5cblxuLy8gQSBWYWxpZGF0b3IgaGFuZGxlciBpcyBhIHdyYXBwZXIgZm9yIGEgdGFyZ2V0IHByb3h5IGhhbmRsZXIgSC5cbi8vIFRoZSBWYWxpZGF0b3IgZm9yd2FyZHMgYWxsIG9wZXJhdGlvbnMgdG8gSCwgYnV0IGFkZGl0aW9uYWxseVxuLy8gcGVyZm9ybXMgYSBudW1iZXIgb2YgaW50ZWdyaXR5IGNoZWNrcyBvbiB0aGUgcmVzdWx0cyBvZiBzb21lIHRyYXBzLFxuLy8gdG8gbWFrZSBzdXJlIEggZG9lcyBub3QgdmlvbGF0ZSB0aGUgRVM1IGludmFyaWFudHMgdy5yLnQuIG5vbi1jb25maWd1cmFibGVcbi8vIHByb3BlcnRpZXMgYW5kIG5vbi1leHRlbnNpYmxlLCBzZWFsZWQgb3IgZnJvemVuIG9iamVjdHMuXG5cbi8vIEZvciBlYWNoIHByb3BlcnR5IHRoYXQgSCBleHBvc2VzIGFzIG93biwgbm9uLWNvbmZpZ3VyYWJsZVxuLy8gKGUuZy4gYnkgcmV0dXJuaW5nIGEgZGVzY3JpcHRvciBmcm9tIGEgY2FsbCB0byBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IpXG4vLyB0aGUgVmFsaWRhdG9yIGhhbmRsZXIgZGVmaW5lcyB0aG9zZSBwcm9wZXJ0aWVzIG9uIHRoZSB0YXJnZXQgb2JqZWN0LlxuLy8gV2hlbiB0aGUgcHJveHkgYmVjb21lcyBub24tZXh0ZW5zaWJsZSwgYWxzbyBjb25maWd1cmFibGUgb3duIHByb3BlcnRpZXNcbi8vIGFyZSBjaGVja2VkIGFnYWluc3QgdGhlIHRhcmdldC5cbi8vIFdlIHdpbGwgY2FsbCBwcm9wZXJ0aWVzIHRoYXQgYXJlIGRlZmluZWQgb24gdGhlIHRhcmdldCBvYmplY3Rcbi8vIFwiZml4ZWQgcHJvcGVydGllc1wiLlxuXG4vLyBXZSB3aWxsIG5hbWUgZml4ZWQgbm9uLWNvbmZpZ3VyYWJsZSBwcm9wZXJ0aWVzIFwic2VhbGVkIHByb3BlcnRpZXNcIi5cbi8vIFdlIHdpbGwgbmFtZSBmaXhlZCBub24tY29uZmlndXJhYmxlIG5vbi13cml0YWJsZSBwcm9wZXJ0aWVzIFwiZnJvemVuXG4vLyBwcm9wZXJ0aWVzXCIuXG5cbi8vIFRoZSBWYWxpZGF0b3IgaGFuZGxlciB1cGhvbGRzIHRoZSBmb2xsb3dpbmcgaW52YXJpYW50cyB3LnIudC4gbm9uLWNvbmZpZ3VyYWJpbGl0eTpcbi8vIC0gZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yIGNhbm5vdCByZXBvcnQgc2VhbGVkIHByb3BlcnRpZXMgYXMgbm9uLWV4aXN0ZW50XG4vLyAtIGdldE93blByb3BlcnR5RGVzY3JpcHRvciBjYW5ub3QgcmVwb3J0IGluY29tcGF0aWJsZSBjaGFuZ2VzIHRvIHRoZVxuLy8gICBhdHRyaWJ1dGVzIG9mIGEgc2VhbGVkIHByb3BlcnR5IChlLmcuIHJlcG9ydGluZyBhIG5vbi1jb25maWd1cmFibGVcbi8vICAgcHJvcGVydHkgYXMgY29uZmlndXJhYmxlLCBvciByZXBvcnRpbmcgYSBub24tY29uZmlndXJhYmxlLCBub24td3JpdGFibGVcbi8vICAgcHJvcGVydHkgYXMgd3JpdGFibGUpXG4vLyAtIGdldFByb3BlcnR5RGVzY3JpcHRvciBjYW5ub3QgcmVwb3J0IHNlYWxlZCBwcm9wZXJ0aWVzIGFzIG5vbi1leGlzdGVudFxuLy8gLSBnZXRQcm9wZXJ0eURlc2NyaXB0b3IgY2Fubm90IHJlcG9ydCBpbmNvbXBhdGlibGUgY2hhbmdlcyB0byB0aGVcbi8vICAgYXR0cmlidXRlcyBvZiBhIHNlYWxlZCBwcm9wZXJ0eS4gSXQgX2Nhbl8gcmVwb3J0IGluY29tcGF0aWJsZSBjaGFuZ2VzXG4vLyAgIHRvIHRoZSBhdHRyaWJ1dGVzIG9mIG5vbi1vd24sIGluaGVyaXRlZCBwcm9wZXJ0aWVzLlxuLy8gLSBkZWZpbmVQcm9wZXJ0eSBjYW5ub3QgbWFrZSBpbmNvbXBhdGlibGUgY2hhbmdlcyB0byB0aGUgYXR0cmlidXRlcyBvZlxuLy8gICBzZWFsZWQgcHJvcGVydGllc1xuLy8gLSBkZWxldGVQcm9wZXJ0eSBjYW5ub3QgcmVwb3J0IGEgc3VjY2Vzc2Z1bCBkZWxldGlvbiBvZiBhIHNlYWxlZCBwcm9wZXJ0eVxuLy8gLSBoYXNPd24gY2Fubm90IHJlcG9ydCBhIHNlYWxlZCBwcm9wZXJ0eSBhcyBub24tZXhpc3RlbnRcbi8vIC0gaGFzIGNhbm5vdCByZXBvcnQgYSBzZWFsZWQgcHJvcGVydHkgYXMgbm9uLWV4aXN0ZW50XG4vLyAtIGdldCBjYW5ub3QgcmVwb3J0IGluY29uc2lzdGVudCB2YWx1ZXMgZm9yIGZyb3plbiBkYXRhXG4vLyAgIHByb3BlcnRpZXMsIGFuZCBtdXN0IHJlcG9ydCB1bmRlZmluZWQgZm9yIHNlYWxlZCBhY2Nlc3NvcnMgd2l0aCBhblxuLy8gICB1bmRlZmluZWQgZ2V0dGVyXG4vLyAtIHNldCBjYW5ub3QgcmVwb3J0IGEgc3VjY2Vzc2Z1bCBhc3NpZ25tZW50IGZvciBmcm96ZW4gZGF0YVxuLy8gICBwcm9wZXJ0aWVzIG9yIHNlYWxlZCBhY2Nlc3NvcnMgd2l0aCBhbiB1bmRlZmluZWQgc2V0dGVyLlxuLy8gLSBnZXR7T3dufVByb3BlcnR5TmFtZXMgbGlzdHMgYWxsIHNlYWxlZCBwcm9wZXJ0aWVzIG9mIHRoZSB0YXJnZXQuXG4vLyAtIGtleXMgbGlzdHMgYWxsIGVudW1lcmFibGUgc2VhbGVkIHByb3BlcnRpZXMgb2YgdGhlIHRhcmdldC5cbi8vIC0gZW51bWVyYXRlIGxpc3RzIGFsbCBlbnVtZXJhYmxlIHNlYWxlZCBwcm9wZXJ0aWVzIG9mIHRoZSB0YXJnZXQuXG4vLyAtIGlmIGEgcHJvcGVydHkgb2YgYSBub24tZXh0ZW5zaWJsZSBwcm94eSBpcyByZXBvcnRlZCBhcyBub24tZXhpc3RlbnQsXG4vLyAgIHRoZW4gaXQgbXVzdCBmb3JldmVyIGJlIHJlcG9ydGVkIGFzIG5vbi1leGlzdGVudC4gVGhpcyBhcHBsaWVzIHRvXG4vLyAgIG93biBhbmQgaW5oZXJpdGVkIHByb3BlcnRpZXMgYW5kIGlzIGVuZm9yY2VkIGluIHRoZVxuLy8gICBkZWxldGVQcm9wZXJ0eSwgZ2V0e093bn1Qcm9wZXJ0eURlc2NyaXB0b3IsIGhhc3tPd259LFxuLy8gICBnZXR7T3dufVByb3BlcnR5TmFtZXMsIGtleXMgYW5kIGVudW1lcmF0ZSB0cmFwc1xuXG4vLyBWaW9sYXRpb24gb2YgYW55IG9mIHRoZXNlIGludmFyaWFudHMgYnkgSCB3aWxsIHJlc3VsdCBpbiBUeXBlRXJyb3IgYmVpbmdcbi8vIHRocm93bi5cblxuLy8gQWRkaXRpb25hbGx5LCBvbmNlIE9iamVjdC5wcmV2ZW50RXh0ZW5zaW9ucywgT2JqZWN0LnNlYWwgb3IgT2JqZWN0LmZyZWV6ZVxuLy8gaXMgaW52b2tlZCBvbiB0aGUgcHJveHksIHRoZSBzZXQgb2Ygb3duIHByb3BlcnR5IG5hbWVzIGZvciB0aGUgcHJveHkgaXNcbi8vIGZpeGVkLiBBbnkgcHJvcGVydHkgbmFtZSB0aGF0IGlzIG5vdCBmaXhlZCBpcyBjYWxsZWQgYSAnbmV3JyBwcm9wZXJ0eS5cblxuLy8gVGhlIFZhbGlkYXRvciB1cGhvbGRzIHRoZSBmb2xsb3dpbmcgaW52YXJpYW50cyByZWdhcmRpbmcgZXh0ZW5zaWJpbGl0eTpcbi8vIC0gZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yIGNhbm5vdCByZXBvcnQgbmV3IHByb3BlcnRpZXMgYXMgZXhpc3RlbnRcbi8vICAgKGl0IG11c3QgcmVwb3J0IHRoZW0gYXMgbm9uLWV4aXN0ZW50IGJ5IHJldHVybmluZyB1bmRlZmluZWQpXG4vLyAtIGRlZmluZVByb3BlcnR5IGNhbm5vdCBzdWNjZXNzZnVsbHkgYWRkIGEgbmV3IHByb3BlcnR5IChpdCBtdXN0IHJlamVjdClcbi8vIC0gZ2V0T3duUHJvcGVydHlOYW1lcyBjYW5ub3QgbGlzdCBuZXcgcHJvcGVydGllc1xuLy8gLSBoYXNPd24gY2Fubm90IHJlcG9ydCB0cnVlIGZvciBuZXcgcHJvcGVydGllcyAoaXQgbXVzdCByZXBvcnQgZmFsc2UpXG4vLyAtIGtleXMgY2Fubm90IGxpc3QgbmV3IHByb3BlcnRpZXNcblxuLy8gSW52YXJpYW50cyBjdXJyZW50bHkgbm90IGVuZm9yY2VkOlxuLy8gLSBnZXRPd25Qcm9wZXJ0eU5hbWVzIGxpc3RzIG9ubHkgb3duIHByb3BlcnR5IG5hbWVzXG4vLyAtIGtleXMgbGlzdHMgb25seSBlbnVtZXJhYmxlIG93biBwcm9wZXJ0eSBuYW1lc1xuLy8gQm90aCB0cmFwcyBtYXkgbGlzdCBtb3JlIHByb3BlcnR5IG5hbWVzIHRoYW4gYXJlIGFjdHVhbGx5IGRlZmluZWQgb24gdGhlXG4vLyB0YXJnZXQuXG5cbi8vIEludmFyaWFudHMgd2l0aCByZWdhcmQgdG8gaW5oZXJpdGFuY2UgYXJlIGN1cnJlbnRseSBub3QgZW5mb3JjZWQuXG4vLyAtIGEgbm9uLWNvbmZpZ3VyYWJsZSBwb3RlbnRpYWxseSBpbmhlcml0ZWQgcHJvcGVydHkgb24gYSBwcm94eSB3aXRoXG4vLyAgIG5vbi1tdXRhYmxlIGFuY2VzdHJ5IGNhbm5vdCBiZSByZXBvcnRlZCBhcyBub24tZXhpc3RlbnRcbi8vIChBbiBvYmplY3Qgd2l0aCBub24tbXV0YWJsZSBhbmNlc3RyeSBpcyBhIG5vbi1leHRlbnNpYmxlIG9iamVjdCB3aG9zZVxuLy8gW1tQcm90b3R5cGVdXSBpcyBlaXRoZXIgbnVsbCBvciBhbiBvYmplY3Qgd2l0aCBub24tbXV0YWJsZSBhbmNlc3RyeS4pXG5cbi8vIENoYW5nZXMgaW4gSGFuZGxlciBBUEkgY29tcGFyZWQgdG8gcHJldmlvdXMgaGFybW9ueTpwcm94aWVzLCBzZWU6XG4vLyBodHRwOi8vd2lraS5lY21hc2NyaXB0Lm9yZy9kb2t1LnBocD9pZD1zdHJhd21hbjpkaXJlY3RfcHJveGllc1xuLy8gaHR0cDovL3dpa2kuZWNtYXNjcmlwdC5vcmcvZG9rdS5waHA/aWQ9aGFybW9ueTpkaXJlY3RfcHJveGllc1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbi8vIC0tLS0gV2Vha01hcCBwb2x5ZmlsbCAtLS0tXG5cbi8vIFRPRE86IGZpbmQgYSBwcm9wZXIgV2Vha01hcCBwb2x5ZmlsbFxuXG4vLyBkZWZpbmUgYW4gZW1wdHkgV2Vha01hcCBzbyB0aGF0IGF0IGxlYXN0IHRoZSBSZWZsZWN0IG1vZHVsZSBjb2RlXG4vLyB3aWxsIHdvcmsgaW4gdGhlIGFic2VuY2Ugb2YgV2Vha01hcHMuIFByb3h5IGVtdWxhdGlvbiBkZXBlbmRzIG9uXG4vLyBhY3R1YWwgV2Vha01hcHMsIHNvIHdpbGwgbm90IHdvcmsgd2l0aCB0aGlzIGxpdHRsZSBzaGltLlxuaWYgKHR5cGVvZiBXZWFrTWFwID09PSBcInVuZGVmaW5lZFwiKSB7XG4gIGdsb2JhbC5XZWFrTWFwID0gZnVuY3Rpb24oKXt9O1xuICBnbG9iYWwuV2Vha01hcC5wcm90b3R5cGUgPSB7XG4gICAgZ2V0OiBmdW5jdGlvbihrKSB7IHJldHVybiB1bmRlZmluZWQ7IH0sXG4gICAgc2V0OiBmdW5jdGlvbihrLHYpIHsgdGhyb3cgbmV3IEVycm9yKFwiV2Vha01hcCBub3Qgc3VwcG9ydGVkXCIpOyB9XG4gIH07XG59XG5cbi8vIC0tLS0gTm9ybWFsaXphdGlvbiBmdW5jdGlvbnMgZm9yIHByb3BlcnR5IGRlc2NyaXB0b3JzIC0tLS1cblxuZnVuY3Rpb24gaXNTdGFuZGFyZEF0dHJpYnV0ZShuYW1lKSB7XG4gIHJldHVybiAvXihnZXR8c2V0fHZhbHVlfHdyaXRhYmxlfGVudW1lcmFibGV8Y29uZmlndXJhYmxlKSQvLnRlc3QobmFtZSk7XG59XG5cbi8vIEFkYXB0ZWQgZnJvbSBFUzUgc2VjdGlvbiA4LjEwLjVcbmZ1bmN0aW9uIHRvUHJvcGVydHlEZXNjcmlwdG9yKG9iaikge1xuICBpZiAoT2JqZWN0KG9iaikgIT09IG9iaikge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJwcm9wZXJ0eSBkZXNjcmlwdG9yIHNob3VsZCBiZSBhbiBPYmplY3QsIGdpdmVuOiBcIitcbiAgICAgICAgICAgICAgICAgICAgICAgIG9iaik7XG4gIH1cbiAgdmFyIGRlc2MgPSB7fTtcbiAgaWYgKCdlbnVtZXJhYmxlJyBpbiBvYmopIHsgZGVzYy5lbnVtZXJhYmxlID0gISFvYmouZW51bWVyYWJsZTsgfVxuICBpZiAoJ2NvbmZpZ3VyYWJsZScgaW4gb2JqKSB7IGRlc2MuY29uZmlndXJhYmxlID0gISFvYmouY29uZmlndXJhYmxlOyB9XG4gIGlmICgndmFsdWUnIGluIG9iaikgeyBkZXNjLnZhbHVlID0gb2JqLnZhbHVlOyB9XG4gIGlmICgnd3JpdGFibGUnIGluIG9iaikgeyBkZXNjLndyaXRhYmxlID0gISFvYmoud3JpdGFibGU7IH1cbiAgaWYgKCdnZXQnIGluIG9iaikge1xuICAgIHZhciBnZXR0ZXIgPSBvYmouZ2V0O1xuICAgIGlmIChnZXR0ZXIgIT09IHVuZGVmaW5lZCAmJiB0eXBlb2YgZ2V0dGVyICE9PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJwcm9wZXJ0eSBkZXNjcmlwdG9yICdnZXQnIGF0dHJpYnV0ZSBtdXN0IGJlIFwiK1xuICAgICAgICAgICAgICAgICAgICAgICAgICBcImNhbGxhYmxlIG9yIHVuZGVmaW5lZCwgZ2l2ZW46IFwiK2dldHRlcik7XG4gICAgfVxuICAgIGRlc2MuZ2V0ID0gZ2V0dGVyO1xuICB9XG4gIGlmICgnc2V0JyBpbiBvYmopIHtcbiAgICB2YXIgc2V0dGVyID0gb2JqLnNldDtcbiAgICBpZiAoc2V0dGVyICE9PSB1bmRlZmluZWQgJiYgdHlwZW9mIHNldHRlciAhPT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwicHJvcGVydHkgZGVzY3JpcHRvciAnc2V0JyBhdHRyaWJ1dGUgbXVzdCBiZSBcIitcbiAgICAgICAgICAgICAgICAgICAgICAgICAgXCJjYWxsYWJsZSBvciB1bmRlZmluZWQsIGdpdmVuOiBcIitzZXR0ZXIpO1xuICAgIH1cbiAgICBkZXNjLnNldCA9IHNldHRlcjtcbiAgfVxuICBpZiAoJ2dldCcgaW4gZGVzYyB8fCAnc2V0JyBpbiBkZXNjKSB7XG4gICAgaWYgKCd2YWx1ZScgaW4gZGVzYyB8fCAnd3JpdGFibGUnIGluIGRlc2MpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJwcm9wZXJ0eSBkZXNjcmlwdG9yIGNhbm5vdCBiZSBib3RoIGEgZGF0YSBhbmQgYW4gXCIrXG4gICAgICAgICAgICAgICAgICAgICAgICAgIFwiYWNjZXNzb3IgZGVzY3JpcHRvcjogXCIrb2JqKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGRlc2M7XG59XG5cbmZ1bmN0aW9uIGlzQWNjZXNzb3JEZXNjcmlwdG9yKGRlc2MpIHtcbiAgaWYgKGRlc2MgPT09IHVuZGVmaW5lZCkgcmV0dXJuIGZhbHNlO1xuICByZXR1cm4gKCdnZXQnIGluIGRlc2MgfHwgJ3NldCcgaW4gZGVzYyk7XG59XG5mdW5jdGlvbiBpc0RhdGFEZXNjcmlwdG9yKGRlc2MpIHtcbiAgaWYgKGRlc2MgPT09IHVuZGVmaW5lZCkgcmV0dXJuIGZhbHNlO1xuICByZXR1cm4gKCd2YWx1ZScgaW4gZGVzYyB8fCAnd3JpdGFibGUnIGluIGRlc2MpO1xufVxuZnVuY3Rpb24gaXNHZW5lcmljRGVzY3JpcHRvcihkZXNjKSB7XG4gIGlmIChkZXNjID09PSB1bmRlZmluZWQpIHJldHVybiBmYWxzZTtcbiAgcmV0dXJuICFpc0FjY2Vzc29yRGVzY3JpcHRvcihkZXNjKSAmJiAhaXNEYXRhRGVzY3JpcHRvcihkZXNjKTtcbn1cblxuZnVuY3Rpb24gdG9Db21wbGV0ZVByb3BlcnR5RGVzY3JpcHRvcihkZXNjKSB7XG4gIHZhciBpbnRlcm5hbERlc2MgPSB0b1Byb3BlcnR5RGVzY3JpcHRvcihkZXNjKTtcbiAgaWYgKGlzR2VuZXJpY0Rlc2NyaXB0b3IoaW50ZXJuYWxEZXNjKSB8fCBpc0RhdGFEZXNjcmlwdG9yKGludGVybmFsRGVzYykpIHtcbiAgICBpZiAoISgndmFsdWUnIGluIGludGVybmFsRGVzYykpIHsgaW50ZXJuYWxEZXNjLnZhbHVlID0gdW5kZWZpbmVkOyB9XG4gICAgaWYgKCEoJ3dyaXRhYmxlJyBpbiBpbnRlcm5hbERlc2MpKSB7IGludGVybmFsRGVzYy53cml0YWJsZSA9IGZhbHNlOyB9XG4gIH0gZWxzZSB7XG4gICAgaWYgKCEoJ2dldCcgaW4gaW50ZXJuYWxEZXNjKSkgeyBpbnRlcm5hbERlc2MuZ2V0ID0gdW5kZWZpbmVkOyB9XG4gICAgaWYgKCEoJ3NldCcgaW4gaW50ZXJuYWxEZXNjKSkgeyBpbnRlcm5hbERlc2Muc2V0ID0gdW5kZWZpbmVkOyB9XG4gIH1cbiAgaWYgKCEoJ2VudW1lcmFibGUnIGluIGludGVybmFsRGVzYykpIHsgaW50ZXJuYWxEZXNjLmVudW1lcmFibGUgPSBmYWxzZTsgfVxuICBpZiAoISgnY29uZmlndXJhYmxlJyBpbiBpbnRlcm5hbERlc2MpKSB7IGludGVybmFsRGVzYy5jb25maWd1cmFibGUgPSBmYWxzZTsgfVxuICByZXR1cm4gaW50ZXJuYWxEZXNjO1xufVxuXG5mdW5jdGlvbiBpc0VtcHR5RGVzY3JpcHRvcihkZXNjKSB7XG4gIHJldHVybiAhKCdnZXQnIGluIGRlc2MpICYmXG4gICAgICAgICAhKCdzZXQnIGluIGRlc2MpICYmXG4gICAgICAgICAhKCd2YWx1ZScgaW4gZGVzYykgJiZcbiAgICAgICAgICEoJ3dyaXRhYmxlJyBpbiBkZXNjKSAmJlxuICAgICAgICAgISgnZW51bWVyYWJsZScgaW4gZGVzYykgJiZcbiAgICAgICAgICEoJ2NvbmZpZ3VyYWJsZScgaW4gZGVzYyk7XG59XG5cbmZ1bmN0aW9uIGlzRXF1aXZhbGVudERlc2NyaXB0b3IoZGVzYzEsIGRlc2MyKSB7XG4gIHJldHVybiBzYW1lVmFsdWUoZGVzYzEuZ2V0LCBkZXNjMi5nZXQpICYmXG4gICAgICAgICBzYW1lVmFsdWUoZGVzYzEuc2V0LCBkZXNjMi5zZXQpICYmXG4gICAgICAgICBzYW1lVmFsdWUoZGVzYzEudmFsdWUsIGRlc2MyLnZhbHVlKSAmJlxuICAgICAgICAgc2FtZVZhbHVlKGRlc2MxLndyaXRhYmxlLCBkZXNjMi53cml0YWJsZSkgJiZcbiAgICAgICAgIHNhbWVWYWx1ZShkZXNjMS5lbnVtZXJhYmxlLCBkZXNjMi5lbnVtZXJhYmxlKSAmJlxuICAgICAgICAgc2FtZVZhbHVlKGRlc2MxLmNvbmZpZ3VyYWJsZSwgZGVzYzIuY29uZmlndXJhYmxlKTtcbn1cblxuLy8gY29waWVkIGZyb20gaHR0cDovL3dpa2kuZWNtYXNjcmlwdC5vcmcvZG9rdS5waHA/aWQ9aGFybW9ueTplZ2FsXG5mdW5jdGlvbiBzYW1lVmFsdWUoeCwgeSkge1xuICBpZiAoeCA9PT0geSkge1xuICAgIC8vIDAgPT09IC0wLCBidXQgdGhleSBhcmUgbm90IGlkZW50aWNhbFxuICAgIHJldHVybiB4ICE9PSAwIHx8IDEgLyB4ID09PSAxIC8geTtcbiAgfVxuXG4gIC8vIE5hTiAhPT0gTmFOLCBidXQgdGhleSBhcmUgaWRlbnRpY2FsLlxuICAvLyBOYU5zIGFyZSB0aGUgb25seSBub24tcmVmbGV4aXZlIHZhbHVlLCBpLmUuLCBpZiB4ICE9PSB4LFxuICAvLyB0aGVuIHggaXMgYSBOYU4uXG4gIC8vIGlzTmFOIGlzIGJyb2tlbjogaXQgY29udmVydHMgaXRzIGFyZ3VtZW50IHRvIG51bWJlciwgc29cbiAgLy8gaXNOYU4oXCJmb29cIikgPT4gdHJ1ZVxuICByZXR1cm4geCAhPT0geCAmJiB5ICE9PSB5O1xufVxuXG4vKipcbiAqIFJldHVybnMgYSBmcmVzaCBwcm9wZXJ0eSBkZXNjcmlwdG9yIHRoYXQgaXMgZ3VhcmFudGVlZFxuICogdG8gYmUgY29tcGxldGUgKGkuZS4gY29udGFpbiBhbGwgdGhlIHN0YW5kYXJkIGF0dHJpYnV0ZXMpLlxuICogQWRkaXRpb25hbGx5LCBhbnkgbm9uLXN0YW5kYXJkIGVudW1lcmFibGUgcHJvcGVydGllcyBvZlxuICogYXR0cmlidXRlcyBhcmUgY29waWVkIG92ZXIgdG8gdGhlIGZyZXNoIGRlc2NyaXB0b3IuXG4gKlxuICogSWYgYXR0cmlidXRlcyBpcyB1bmRlZmluZWQsIHJldHVybnMgdW5kZWZpbmVkLlxuICpcbiAqIFNlZSBhbHNvOiBodHRwOi8vd2lraS5lY21hc2NyaXB0Lm9yZy9kb2t1LnBocD9pZD1oYXJtb255OnByb3hpZXNfc2VtYW50aWNzXG4gKi9cbmZ1bmN0aW9uIG5vcm1hbGl6ZUFuZENvbXBsZXRlUHJvcGVydHlEZXNjcmlwdG9yKGF0dHJpYnV0ZXMpIHtcbiAgaWYgKGF0dHJpYnV0ZXMgPT09IHVuZGVmaW5lZCkgeyByZXR1cm4gdW5kZWZpbmVkOyB9XG4gIHZhciBkZXNjID0gdG9Db21wbGV0ZVByb3BlcnR5RGVzY3JpcHRvcihhdHRyaWJ1dGVzKTtcbiAgLy8gTm90ZTogbm8gbmVlZCB0byBjYWxsIEZyb21Qcm9wZXJ0eURlc2NyaXB0b3IoZGVzYyksIGFzIHdlIHJlcHJlc2VudFxuICAvLyBcImludGVybmFsXCIgcHJvcGVydHkgZGVzY3JpcHRvcnMgYXMgcHJvcGVyIE9iamVjdHMgZnJvbSB0aGUgc3RhcnRcbiAgZm9yICh2YXIgbmFtZSBpbiBhdHRyaWJ1dGVzKSB7XG4gICAgaWYgKCFpc1N0YW5kYXJkQXR0cmlidXRlKG5hbWUpKSB7XG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoZGVzYywgbmFtZSxcbiAgICAgICAgeyB2YWx1ZTogYXR0cmlidXRlc1tuYW1lXSxcbiAgICAgICAgICB3cml0YWJsZTogdHJ1ZSxcbiAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSB9KTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGRlc2M7XG59XG5cbi8qKlxuICogUmV0dXJucyBhIGZyZXNoIHByb3BlcnR5IGRlc2NyaXB0b3Igd2hvc2Ugc3RhbmRhcmRcbiAqIGF0dHJpYnV0ZXMgYXJlIGd1YXJhbnRlZWQgdG8gYmUgZGF0YSBwcm9wZXJ0aWVzIG9mIHRoZSByaWdodCB0eXBlLlxuICogQWRkaXRpb25hbGx5LCBhbnkgbm9uLXN0YW5kYXJkIGVudW1lcmFibGUgcHJvcGVydGllcyBvZlxuICogYXR0cmlidXRlcyBhcmUgY29waWVkIG92ZXIgdG8gdGhlIGZyZXNoIGRlc2NyaXB0b3IuXG4gKlxuICogSWYgYXR0cmlidXRlcyBpcyB1bmRlZmluZWQsIHdpbGwgdGhyb3cgYSBUeXBlRXJyb3IuXG4gKlxuICogU2VlIGFsc286IGh0dHA6Ly93aWtpLmVjbWFzY3JpcHQub3JnL2Rva3UucGhwP2lkPWhhcm1vbnk6cHJveGllc19zZW1hbnRpY3NcbiAqL1xuZnVuY3Rpb24gbm9ybWFsaXplUHJvcGVydHlEZXNjcmlwdG9yKGF0dHJpYnV0ZXMpIHtcbiAgdmFyIGRlc2MgPSB0b1Byb3BlcnR5RGVzY3JpcHRvcihhdHRyaWJ1dGVzKTtcbiAgLy8gTm90ZTogbm8gbmVlZCB0byBjYWxsIEZyb21HZW5lcmljUHJvcGVydHlEZXNjcmlwdG9yKGRlc2MpLCBhcyB3ZSByZXByZXNlbnRcbiAgLy8gXCJpbnRlcm5hbFwiIHByb3BlcnR5IGRlc2NyaXB0b3JzIGFzIHByb3BlciBPYmplY3RzIGZyb20gdGhlIHN0YXJ0XG4gIGZvciAodmFyIG5hbWUgaW4gYXR0cmlidXRlcykge1xuICAgIGlmICghaXNTdGFuZGFyZEF0dHJpYnV0ZShuYW1lKSkge1xuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGRlc2MsIG5hbWUsXG4gICAgICAgIHsgdmFsdWU6IGF0dHJpYnV0ZXNbbmFtZV0sXG4gICAgICAgICAgd3JpdGFibGU6IHRydWUsXG4gICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgICBjb25maWd1cmFibGU6IHRydWUgfSk7XG4gICAgfVxuICB9XG4gIHJldHVybiBkZXNjO1xufVxuXG4vLyBzdG9yZSBhIHJlZmVyZW5jZSB0byB0aGUgcmVhbCBFUzUgcHJpbWl0aXZlcyBiZWZvcmUgcGF0Y2hpbmcgdGhlbSBsYXRlclxudmFyIHByaW1fcHJldmVudEV4dGVuc2lvbnMgPSAgICAgICAgT2JqZWN0LnByZXZlbnRFeHRlbnNpb25zLFxuICAgIHByaW1fc2VhbCA9ICAgICAgICAgICAgICAgICAgICAgT2JqZWN0LnNlYWwsXG4gICAgcHJpbV9mcmVlemUgPSAgICAgICAgICAgICAgICAgICBPYmplY3QuZnJlZXplLFxuICAgIHByaW1faXNFeHRlbnNpYmxlID0gICAgICAgICAgICAgT2JqZWN0LmlzRXh0ZW5zaWJsZSxcbiAgICBwcmltX2lzU2VhbGVkID0gICAgICAgICAgICAgICAgIE9iamVjdC5pc1NlYWxlZCxcbiAgICBwcmltX2lzRnJvemVuID0gICAgICAgICAgICAgICAgIE9iamVjdC5pc0Zyb3plbixcbiAgICBwcmltX2dldFByb3RvdHlwZU9mID0gICAgICAgICAgIE9iamVjdC5nZXRQcm90b3R5cGVPZixcbiAgICBwcmltX2dldE93blByb3BlcnR5RGVzY3JpcHRvciA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IsXG4gICAgcHJpbV9kZWZpbmVQcm9wZXJ0eSA9ICAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHksXG4gICAgcHJpbV9kZWZpbmVQcm9wZXJ0aWVzID0gICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydGllcyxcbiAgICBwcmltX2tleXMgPSAgICAgICAgICAgICAgICAgICAgIE9iamVjdC5rZXlzLFxuICAgIHByaW1fZ2V0T3duUHJvcGVydHlOYW1lcyA9ICAgICAgT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMsXG4gICAgcHJpbV9nZXRPd25Qcm9wZXJ0eVN5bWJvbHMgPSAgICBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzLFxuICAgIHByaW1fYXNzaWduID0gICAgICAgICAgICAgICAgICAgT2JqZWN0LmFzc2lnbixcbiAgICBwcmltX2lzQXJyYXkgPSAgICAgICAgICAgICAgICAgIEFycmF5LmlzQXJyYXksXG4gICAgcHJpbV9jb25jYXQgPSAgICAgICAgICAgICAgICAgICBBcnJheS5wcm90b3R5cGUuY29uY2F0LFxuICAgIHByaW1faXNQcm90b3R5cGVPZiA9ICAgICAgICAgICAgT2JqZWN0LnByb3RvdHlwZS5pc1Byb3RvdHlwZU9mLFxuICAgIHByaW1faGFzT3duUHJvcGVydHkgPSAgICAgICAgICAgT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eTtcblxuLy8gdGhlc2Ugd2lsbCBwb2ludCB0byB0aGUgcGF0Y2hlZCB2ZXJzaW9ucyBvZiB0aGUgcmVzcGVjdGl2ZSBtZXRob2RzIG9uXG4vLyBPYmplY3QuIFRoZXkgYXJlIHVzZWQgd2l0aGluIHRoaXMgbW9kdWxlIGFzIHRoZSBcImludHJpbnNpY1wiIGJpbmRpbmdzXG4vLyBvZiB0aGVzZSBtZXRob2RzIChpLmUuIHRoZSBcIm9yaWdpbmFsXCIgYmluZGluZ3MgYXMgZGVmaW5lZCBpbiB0aGUgc3BlYylcbnZhciBPYmplY3RfaXNGcm96ZW4sXG4gICAgT2JqZWN0X2lzU2VhbGVkLFxuICAgIE9iamVjdF9pc0V4dGVuc2libGUsXG4gICAgT2JqZWN0X2dldFByb3RvdHlwZU9mLFxuICAgIE9iamVjdF9nZXRPd25Qcm9wZXJ0eU5hbWVzO1xuXG4vKipcbiAqIEEgcHJvcGVydHkgJ25hbWUnIGlzIGZpeGVkIGlmIGl0IGlzIGFuIG93biBwcm9wZXJ0eSBvZiB0aGUgdGFyZ2V0LlxuICovXG5mdW5jdGlvbiBpc0ZpeGVkKG5hbWUsIHRhcmdldCkge1xuICByZXR1cm4gKHt9KS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHRhcmdldCwgbmFtZSk7XG59XG5mdW5jdGlvbiBpc1NlYWxlZChuYW1lLCB0YXJnZXQpIHtcbiAgdmFyIGRlc2MgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHRhcmdldCwgbmFtZSk7XG4gIGlmIChkZXNjID09PSB1bmRlZmluZWQpIHsgcmV0dXJuIGZhbHNlOyB9XG4gIHJldHVybiBkZXNjLmNvbmZpZ3VyYWJsZSA9PT0gZmFsc2U7XG59XG5mdW5jdGlvbiBpc1NlYWxlZERlc2MoZGVzYykge1xuICByZXR1cm4gZGVzYyAhPT0gdW5kZWZpbmVkICYmIGRlc2MuY29uZmlndXJhYmxlID09PSBmYWxzZTtcbn1cblxuLyoqXG4gKiBQZXJmb3JtcyBhbGwgdmFsaWRhdGlvbiB0aGF0IE9iamVjdC5kZWZpbmVQcm9wZXJ0eSBwZXJmb3JtcyxcbiAqIHdpdGhvdXQgYWN0dWFsbHkgZGVmaW5pbmcgdGhlIHByb3BlcnR5LiBSZXR1cm5zIGEgYm9vbGVhblxuICogaW5kaWNhdGluZyB3aGV0aGVyIHZhbGlkYXRpb24gc3VjY2VlZGVkLlxuICpcbiAqIEltcGxlbWVudGF0aW9uIHRyYW5zbGl0ZXJhdGVkIGZyb20gRVM1LjEgc2VjdGlvbiA4LjEyLjlcbiAqL1xuZnVuY3Rpb24gaXNDb21wYXRpYmxlRGVzY3JpcHRvcihleHRlbnNpYmxlLCBjdXJyZW50LCBkZXNjKSB7XG4gIGlmIChjdXJyZW50ID09PSB1bmRlZmluZWQgJiYgZXh0ZW5zaWJsZSA9PT0gZmFsc2UpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgaWYgKGN1cnJlbnQgPT09IHVuZGVmaW5lZCAmJiBleHRlbnNpYmxlID09PSB0cnVlKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgaWYgKGlzRW1wdHlEZXNjcmlwdG9yKGRlc2MpKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgaWYgKGlzRXF1aXZhbGVudERlc2NyaXB0b3IoY3VycmVudCwgZGVzYykpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICBpZiAoY3VycmVudC5jb25maWd1cmFibGUgPT09IGZhbHNlKSB7XG4gICAgaWYgKGRlc2MuY29uZmlndXJhYmxlID09PSB0cnVlKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGlmICgnZW51bWVyYWJsZScgaW4gZGVzYyAmJiBkZXNjLmVudW1lcmFibGUgIT09IGN1cnJlbnQuZW51bWVyYWJsZSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuICBpZiAoaXNHZW5lcmljRGVzY3JpcHRvcihkZXNjKSkge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIGlmIChpc0RhdGFEZXNjcmlwdG9yKGN1cnJlbnQpICE9PSBpc0RhdGFEZXNjcmlwdG9yKGRlc2MpKSB7XG4gICAgaWYgKGN1cnJlbnQuY29uZmlndXJhYmxlID09PSBmYWxzZSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICBpZiAoaXNEYXRhRGVzY3JpcHRvcihjdXJyZW50KSAmJiBpc0RhdGFEZXNjcmlwdG9yKGRlc2MpKSB7XG4gICAgaWYgKGN1cnJlbnQuY29uZmlndXJhYmxlID09PSBmYWxzZSkge1xuICAgICAgaWYgKGN1cnJlbnQud3JpdGFibGUgPT09IGZhbHNlICYmIGRlc2Mud3JpdGFibGUgPT09IHRydWUpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgICAgaWYgKGN1cnJlbnQud3JpdGFibGUgPT09IGZhbHNlKSB7XG4gICAgICAgIGlmICgndmFsdWUnIGluIGRlc2MgJiYgIXNhbWVWYWx1ZShkZXNjLnZhbHVlLCBjdXJyZW50LnZhbHVlKSkge1xuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICBpZiAoaXNBY2Nlc3NvckRlc2NyaXB0b3IoY3VycmVudCkgJiYgaXNBY2Nlc3NvckRlc2NyaXB0b3IoZGVzYykpIHtcbiAgICBpZiAoY3VycmVudC5jb25maWd1cmFibGUgPT09IGZhbHNlKSB7XG4gICAgICBpZiAoJ3NldCcgaW4gZGVzYyAmJiAhc2FtZVZhbHVlKGRlc2Muc2V0LCBjdXJyZW50LnNldCkpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgICAgaWYgKCdnZXQnIGluIGRlc2MgJiYgIXNhbWVWYWx1ZShkZXNjLmdldCwgY3VycmVudC5nZXQpKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIHRydWU7XG59XG5cbi8vIEVTNiA3LjMuMTEgU2V0SW50ZWdyaXR5TGV2ZWxcbi8vIGxldmVsIGlzIG9uZSBvZiBcInNlYWxlZFwiIG9yIFwiZnJvemVuXCJcbmZ1bmN0aW9uIHNldEludGVncml0eUxldmVsKHRhcmdldCwgbGV2ZWwpIHtcbiAgdmFyIG93blByb3BzID0gT2JqZWN0X2dldE93blByb3BlcnR5TmFtZXModGFyZ2V0KTtcbiAgdmFyIHBlbmRpbmdFeGNlcHRpb24gPSB1bmRlZmluZWQ7XG4gIGlmIChsZXZlbCA9PT0gXCJzZWFsZWRcIikge1xuICAgIHZhciBsID0gK293blByb3BzLmxlbmd0aDtcbiAgICB2YXIgaztcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGw7IGkrKykge1xuICAgICAgayA9IFN0cmluZyhvd25Qcm9wc1tpXSk7XG4gICAgICB0cnkge1xuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBrLCB7IGNvbmZpZ3VyYWJsZTogZmFsc2UgfSk7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGlmIChwZW5kaW5nRXhjZXB0aW9uID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICBwZW5kaW5nRXhjZXB0aW9uID0gZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfSBlbHNlIHtcbiAgICAvLyBsZXZlbCA9PT0gXCJmcm96ZW5cIlxuICAgIHZhciBsID0gK293blByb3BzLmxlbmd0aDtcbiAgICB2YXIgaztcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGw7IGkrKykge1xuICAgICAgayA9IFN0cmluZyhvd25Qcm9wc1tpXSk7XG4gICAgICB0cnkge1xuICAgICAgICB2YXIgY3VycmVudERlc2MgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHRhcmdldCwgayk7XG4gICAgICAgIGlmIChjdXJyZW50RGVzYyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgdmFyIGRlc2M7XG4gICAgICAgICAgaWYgKGlzQWNjZXNzb3JEZXNjcmlwdG9yKGN1cnJlbnREZXNjKSkge1xuICAgICAgICAgICAgZGVzYyA9IHsgY29uZmlndXJhYmxlOiBmYWxzZSB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGRlc2MgPSB7IGNvbmZpZ3VyYWJsZTogZmFsc2UsIHdyaXRhYmxlOiBmYWxzZSB9XG4gICAgICAgICAgfVxuICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGssIGRlc2MpO1xuICAgICAgICB9ICAgICAgICBcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgaWYgKHBlbmRpbmdFeGNlcHRpb24gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIHBlbmRpbmdFeGNlcHRpb24gPSBlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG4gIGlmIChwZW5kaW5nRXhjZXB0aW9uICE9PSB1bmRlZmluZWQpIHtcbiAgICB0aHJvdyBwZW5kaW5nRXhjZXB0aW9uO1xuICB9XG4gIHJldHVybiBSZWZsZWN0LnByZXZlbnRFeHRlbnNpb25zKHRhcmdldCk7XG59XG5cbi8vIEVTNiA3LjMuMTIgVGVzdEludGVncml0eUxldmVsXG4vLyBsZXZlbCBpcyBvbmUgb2YgXCJzZWFsZWRcIiBvciBcImZyb3plblwiXG5mdW5jdGlvbiB0ZXN0SW50ZWdyaXR5TGV2ZWwodGFyZ2V0LCBsZXZlbCkge1xuICB2YXIgaXNFeHRlbnNpYmxlID0gT2JqZWN0X2lzRXh0ZW5zaWJsZSh0YXJnZXQpO1xuICBpZiAoaXNFeHRlbnNpYmxlKSByZXR1cm4gZmFsc2U7XG4gIFxuICB2YXIgb3duUHJvcHMgPSBPYmplY3RfZ2V0T3duUHJvcGVydHlOYW1lcyh0YXJnZXQpO1xuICB2YXIgcGVuZGluZ0V4Y2VwdGlvbiA9IHVuZGVmaW5lZDtcbiAgdmFyIGNvbmZpZ3VyYWJsZSA9IGZhbHNlO1xuICB2YXIgd3JpdGFibGUgPSBmYWxzZTtcbiAgXG4gIHZhciBsID0gK293blByb3BzLmxlbmd0aDtcbiAgdmFyIGs7XG4gIHZhciBjdXJyZW50RGVzYztcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsOyBpKyspIHtcbiAgICBrID0gU3RyaW5nKG93blByb3BzW2ldKTtcbiAgICB0cnkge1xuICAgICAgY3VycmVudERlc2MgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHRhcmdldCwgayk7XG4gICAgICBjb25maWd1cmFibGUgPSBjb25maWd1cmFibGUgfHwgY3VycmVudERlc2MuY29uZmlndXJhYmxlO1xuICAgICAgaWYgKGlzRGF0YURlc2NyaXB0b3IoY3VycmVudERlc2MpKSB7XG4gICAgICAgIHdyaXRhYmxlID0gd3JpdGFibGUgfHwgY3VycmVudERlc2Mud3JpdGFibGU7XG4gICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgaWYgKHBlbmRpbmdFeGNlcHRpb24gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICBwZW5kaW5nRXhjZXB0aW9uID0gZTtcbiAgICAgICAgY29uZmlndXJhYmxlID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgaWYgKHBlbmRpbmdFeGNlcHRpb24gIT09IHVuZGVmaW5lZCkge1xuICAgIHRocm93IHBlbmRpbmdFeGNlcHRpb247XG4gIH1cbiAgaWYgKGxldmVsID09PSBcImZyb3plblwiICYmIHdyaXRhYmxlID09PSB0cnVlKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIGlmIChjb25maWd1cmFibGUgPT09IHRydWUpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgcmV0dXJuIHRydWU7XG59XG5cbi8vIC0tLS0gVGhlIFZhbGlkYXRvciBoYW5kbGVyIHdyYXBwZXIgYXJvdW5kIHVzZXIgaGFuZGxlcnMgLS0tLVxuXG4vKipcbiAqIEBwYXJhbSB0YXJnZXQgdGhlIG9iamVjdCB3cmFwcGVkIGJ5IHRoaXMgcHJveHkuXG4gKiBBcyBsb25nIGFzIHRoZSBwcm94eSBpcyBleHRlbnNpYmxlLCBvbmx5IG5vbi1jb25maWd1cmFibGUgcHJvcGVydGllc1xuICogYXJlIGNoZWNrZWQgYWdhaW5zdCB0aGUgdGFyZ2V0LiBPbmNlIHRoZSBwcm94eSBiZWNvbWVzIG5vbi1leHRlbnNpYmxlLFxuICogaW52YXJpYW50cyB3LnIudC4gbm9uLWV4dGVuc2liaWxpdHkgYXJlIGFsc28gZW5mb3JjZWQuXG4gKlxuICogQHBhcmFtIGhhbmRsZXIgdGhlIGhhbmRsZXIgb2YgdGhlIGRpcmVjdCBwcm94eS4gVGhlIG9iamVjdCBlbXVsYXRlZCBieVxuICogdGhpcyBoYW5kbGVyIGlzIHZhbGlkYXRlZCBhZ2FpbnN0IHRoZSB0YXJnZXQgb2JqZWN0IG9mIHRoZSBkaXJlY3QgcHJveHkuXG4gKiBBbnkgdmlvbGF0aW9ucyB0aGF0IHRoZSBoYW5kbGVyIG1ha2VzIGFnYWluc3QgdGhlIGludmFyaWFudHNcbiAqIG9mIHRoZSB0YXJnZXQgd2lsbCBjYXVzZSBhIFR5cGVFcnJvciB0byBiZSB0aHJvd24uXG4gKlxuICogQm90aCB0YXJnZXQgYW5kIGhhbmRsZXIgbXVzdCBiZSBwcm9wZXIgT2JqZWN0cyBhdCBpbml0aWFsaXphdGlvbiB0aW1lLlxuICovXG5mdW5jdGlvbiBWYWxpZGF0b3IodGFyZ2V0LCBoYW5kbGVyKSB7XG4gIC8vIGZvciBub24tcmV2b2thYmxlIHByb3hpZXMsIHRoZXNlIGFyZSBjb25zdCByZWZlcmVuY2VzXG4gIC8vIGZvciByZXZva2FibGUgcHJveGllcywgb24gcmV2b2NhdGlvbjpcbiAgLy8gLSB0aGlzLnRhcmdldCBpcyBzZXQgdG8gbnVsbFxuICAvLyAtIHRoaXMuaGFuZGxlciBpcyBzZXQgdG8gYSBoYW5kbGVyIHRoYXQgdGhyb3dzIG9uIGFsbCB0cmFwc1xuICB0aGlzLnRhcmdldCAgPSB0YXJnZXQ7XG4gIHRoaXMuaGFuZGxlciA9IGhhbmRsZXI7XG59XG5cblZhbGlkYXRvci5wcm90b3R5cGUgPSB7XG5cbiAgLyoqXG4gICAqIElmIGdldFRyYXAgcmV0dXJucyB1bmRlZmluZWQsIHRoZSBjYWxsZXIgc2hvdWxkIHBlcmZvcm0gdGhlXG4gICAqIGRlZmF1bHQgZm9yd2FyZGluZyBiZWhhdmlvci5cbiAgICogSWYgZ2V0VHJhcCByZXR1cm5zIG5vcm1hbGx5IG90aGVyd2lzZSwgdGhlIHJldHVybiB2YWx1ZVxuICAgKiB3aWxsIGJlIGEgY2FsbGFibGUgdHJhcCBmdW5jdGlvbi4gV2hlbiBjYWxsaW5nIHRoZSB0cmFwIGZ1bmN0aW9uLFxuICAgKiB0aGUgY2FsbGVyIGlzIHJlc3BvbnNpYmxlIGZvciBiaW5kaW5nIGl0cyB8dGhpc3wgdG8gfHRoaXMuaGFuZGxlcnwuXG4gICAqL1xuICBnZXRUcmFwOiBmdW5jdGlvbih0cmFwTmFtZSkge1xuICAgIHZhciB0cmFwID0gdGhpcy5oYW5kbGVyW3RyYXBOYW1lXTtcbiAgICBpZiAodHJhcCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAvLyB0aGUgdHJhcCB3YXMgbm90IGRlZmluZWQsXG4gICAgICAvLyBwZXJmb3JtIHRoZSBkZWZhdWx0IGZvcndhcmRpbmcgYmVoYXZpb3JcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZiB0cmFwICE9PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IodHJhcE5hbWUgKyBcIiB0cmFwIGlzIG5vdCBjYWxsYWJsZTogXCIrdHJhcCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRyYXA7XG4gIH0sXG5cbiAgLy8gPT09IGZ1bmRhbWVudGFsIHRyYXBzID09PVxuXG4gIC8qKlxuICAgKiBJZiBuYW1lIGRlbm90ZXMgYSBmaXhlZCBwcm9wZXJ0eSwgY2hlY2s6XG4gICAqICAgLSB3aGV0aGVyIHRhcmdldEhhbmRsZXIgcmVwb3J0cyBpdCBhcyBleGlzdGVudFxuICAgKiAgIC0gd2hldGhlciB0aGUgcmV0dXJuZWQgZGVzY3JpcHRvciBpcyBjb21wYXRpYmxlIHdpdGggdGhlIGZpeGVkIHByb3BlcnR5XG4gICAqIElmIHRoZSBwcm94eSBpcyBub24tZXh0ZW5zaWJsZSwgY2hlY2s6XG4gICAqICAgLSB3aGV0aGVyIG5hbWUgaXMgbm90IGEgbmV3IHByb3BlcnR5XG4gICAqIEFkZGl0aW9uYWxseSwgdGhlIHJldHVybmVkIGRlc2NyaXB0b3IgaXMgbm9ybWFsaXplZCBhbmQgY29tcGxldGVkLlxuICAgKi9cbiAgZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yOiBmdW5jdGlvbihuYW1lKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICB2YXIgdHJhcCA9IHRoaXMuZ2V0VHJhcChcImdldE93blByb3BlcnR5RGVzY3JpcHRvclwiKTtcbiAgICBpZiAodHJhcCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm4gUmVmbGVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodGhpcy50YXJnZXQsIG5hbWUpO1xuICAgIH1cblxuICAgIG5hbWUgPSBTdHJpbmcobmFtZSk7XG4gICAgdmFyIGRlc2MgPSB0cmFwLmNhbGwodGhpcy5oYW5kbGVyLCB0aGlzLnRhcmdldCwgbmFtZSk7XG4gICAgZGVzYyA9IG5vcm1hbGl6ZUFuZENvbXBsZXRlUHJvcGVydHlEZXNjcmlwdG9yKGRlc2MpO1xuXG4gICAgdmFyIHRhcmdldERlc2MgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHRoaXMudGFyZ2V0LCBuYW1lKTtcbiAgICB2YXIgZXh0ZW5zaWJsZSA9IE9iamVjdC5pc0V4dGVuc2libGUodGhpcy50YXJnZXQpO1xuXG4gICAgaWYgKGRlc2MgPT09IHVuZGVmaW5lZCkge1xuICAgICAgaWYgKGlzU2VhbGVkRGVzYyh0YXJnZXREZXNjKSkge1xuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiY2Fubm90IHJlcG9ydCBub24tY29uZmlndXJhYmxlIHByb3BlcnR5ICdcIituYW1lK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiJyBhcyBub24tZXhpc3RlbnRcIik7XG4gICAgICB9XG4gICAgICBpZiAoIWV4dGVuc2libGUgJiYgdGFyZ2V0RGVzYyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgLy8gaWYgaGFuZGxlciBpcyBhbGxvd2VkIHRvIHJldHVybiB1bmRlZmluZWQsIHdlIGNhbm5vdCBndWFyYW50ZWVcbiAgICAgICAgICAvLyB0aGF0IGl0IHdpbGwgbm90IHJldHVybiBhIGRlc2NyaXB0b3IgZm9yIHRoaXMgcHJvcGVydHkgbGF0ZXIuXG4gICAgICAgICAgLy8gT25jZSBhIHByb3BlcnR5IGhhcyBiZWVuIHJlcG9ydGVkIGFzIG5vbi1leGlzdGVudCBvbiBhIG5vbi1leHRlbnNpYmxlXG4gICAgICAgICAgLy8gb2JqZWN0LCBpdCBzaG91bGQgZm9yZXZlciBiZSByZXBvcnRlZCBhcyBub24tZXhpc3RlbnRcbiAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiY2Fubm90IHJlcG9ydCBleGlzdGluZyBvd24gcHJvcGVydHkgJ1wiK25hbWUrXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIicgYXMgbm9uLWV4aXN0ZW50IG9uIGEgbm9uLWV4dGVuc2libGUgb2JqZWN0XCIpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICAvLyBhdCB0aGlzIHBvaW50LCB3ZSBrbm93IChkZXNjICE9PSB1bmRlZmluZWQpLCBpLmUuXG4gICAgLy8gdGFyZ2V0SGFuZGxlciByZXBvcnRzICduYW1lJyBhcyBhbiBleGlzdGluZyBwcm9wZXJ0eVxuXG4gICAgLy8gTm90ZTogd2UgY291bGQgY29sbGFwc2UgdGhlIGZvbGxvd2luZyB0d28gaWYtdGVzdHMgaW50byBhIHNpbmdsZVxuICAgIC8vIHRlc3QuIFNlcGFyYXRpbmcgb3V0IHRoZSBjYXNlcyB0byBpbXByb3ZlIGVycm9yIHJlcG9ydGluZy5cblxuICAgIGlmICghZXh0ZW5zaWJsZSkge1xuICAgICAgaWYgKHRhcmdldERlc2MgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiY2Fubm90IHJlcG9ydCBhIG5ldyBvd24gcHJvcGVydHkgJ1wiK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWUgKyBcIicgb24gYSBub24tZXh0ZW5zaWJsZSBvYmplY3RcIik7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKG5hbWUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgaWYgKCFpc0NvbXBhdGlibGVEZXNjcmlwdG9yKGV4dGVuc2libGUsIHRhcmdldERlc2MsIGRlc2MpKSB7XG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJjYW5ub3QgcmVwb3J0IGluY29tcGF0aWJsZSBwcm9wZXJ0eSBkZXNjcmlwdG9yIFwiK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiZm9yIHByb3BlcnR5ICdcIituYW1lK1wiJ1wiKTtcbiAgICAgIH1cbiAgICB9XG4gICAgXG4gICAgaWYgKGRlc2MuY29uZmlndXJhYmxlID09PSBmYWxzZSkge1xuICAgICAgaWYgKHRhcmdldERlc2MgPT09IHVuZGVmaW5lZCB8fCB0YXJnZXREZXNjLmNvbmZpZ3VyYWJsZSA9PT0gdHJ1ZSkge1xuICAgICAgICAvLyBpZiB0aGUgcHJvcGVydHkgaXMgY29uZmlndXJhYmxlIG9yIG5vbi1leGlzdGVudCBvbiB0aGUgdGFyZ2V0LFxuICAgICAgICAvLyBidXQgaXMgcmVwb3J0ZWQgYXMgYSBub24tY29uZmlndXJhYmxlIHByb3BlcnR5LCBpdCBtYXkgbGF0ZXIgYmVcbiAgICAgICAgLy8gcmVwb3J0ZWQgYXMgY29uZmlndXJhYmxlIG9yIG5vbi1leGlzdGVudCwgd2hpY2ggdmlvbGF0ZXMgdGhlXG4gICAgICAgIC8vIGludmFyaWFudCB0aGF0IGlmIHRoZSBwcm9wZXJ0eSBtaWdodCBjaGFuZ2Ugb3IgZGlzYXBwZWFyLCB0aGVcbiAgICAgICAgLy8gY29uZmlndXJhYmxlIGF0dHJpYnV0ZSBtdXN0IGJlIHRydWUuXG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXG4gICAgICAgICAgXCJjYW5ub3QgcmVwb3J0IGEgbm9uLWNvbmZpZ3VyYWJsZSBkZXNjcmlwdG9yIFwiICtcbiAgICAgICAgICBcImZvciBjb25maWd1cmFibGUgb3Igbm9uLWV4aXN0ZW50IHByb3BlcnR5ICdcIiArIG5hbWUgKyBcIidcIik7XG4gICAgICB9XG4gICAgICBpZiAoJ3dyaXRhYmxlJyBpbiBkZXNjICYmIGRlc2Mud3JpdGFibGUgPT09IGZhbHNlKSB7XG4gICAgICAgIGlmICh0YXJnZXREZXNjLndyaXRhYmxlID09PSB0cnVlKSB7XG4gICAgICAgICAgLy8gaWYgdGhlIHByb3BlcnR5IGlzIG5vbi1jb25maWd1cmFibGUsIHdyaXRhYmxlIG9uIHRoZSB0YXJnZXQsXG4gICAgICAgICAgLy8gYnV0IGlzIHJlcG9ydGVkIGFzIG5vbi1jb25maWd1cmFibGUsIG5vbi13cml0YWJsZSwgaXQgbWF5IGxhdGVyXG4gICAgICAgICAgLy8gYmUgcmVwb3J0ZWQgYXMgbm9uLWNvbmZpZ3VyYWJsZSwgd3JpdGFibGUgYWdhaW4sIHdoaWNoIHZpb2xhdGVzXG4gICAgICAgICAgLy8gdGhlIGludmFyaWFudCB0aGF0IGEgbm9uLWNvbmZpZ3VyYWJsZSwgbm9uLXdyaXRhYmxlIHByb3BlcnR5XG4gICAgICAgICAgLy8gbWF5IG5vdCBjaGFuZ2Ugc3RhdGUuXG4gICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcbiAgICAgICAgICAgIFwiY2Fubm90IHJlcG9ydCBub24tY29uZmlndXJhYmxlLCB3cml0YWJsZSBwcm9wZXJ0eSAnXCIgKyBuYW1lICtcbiAgICAgICAgICAgIFwiJyBhcyBub24tY29uZmlndXJhYmxlLCBub24td3JpdGFibGVcIik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gZGVzYztcbiAgfSxcblxuICAvKipcbiAgICogSW4gdGhlIGRpcmVjdCBwcm94aWVzIGRlc2lnbiB3aXRoIHJlZmFjdG9yZWQgcHJvdG90eXBlIGNsaW1iaW5nLFxuICAgKiB0aGlzIHRyYXAgaXMgZGVwcmVjYXRlZC4gRm9yIHByb3hpZXMtYXMtcHJvdG90eXBlcywgaW5zdGVhZFxuICAgKiBvZiBjYWxsaW5nIHRoaXMgdHJhcCwgdGhlIGdldCwgc2V0LCBoYXMgb3IgZW51bWVyYXRlIHRyYXBzIGFyZVxuICAgKiBjYWxsZWQgaW5zdGVhZC5cbiAgICpcbiAgICogSW4gdGhpcyBpbXBsZW1lbnRhdGlvbiwgd2UgXCJhYnVzZVwiIGdldFByb3BlcnR5RGVzY3JpcHRvciB0b1xuICAgKiBzdXBwb3J0IHRyYXBwaW5nIHRoZSBnZXQgb3Igc2V0IHRyYXBzIGZvciBwcm94aWVzLWFzLXByb3RvdHlwZXMuXG4gICAqIFdlIGRvIHRoaXMgYnkgcmV0dXJuaW5nIGEgZ2V0dGVyL3NldHRlciBwYWlyIHRoYXQgaW52b2tlc1xuICAgKiB0aGUgY29ycmVzcG9uZGluZyB0cmFwcy5cbiAgICpcbiAgICogV2hpbGUgdGhpcyBoYWNrIHdvcmtzIGZvciBpbmhlcml0ZWQgcHJvcGVydHkgYWNjZXNzLCBpdCBoYXMgc29tZVxuICAgKiBxdWlya3M6XG4gICAqXG4gICAqIEluIEZpcmVmb3gsIHRoaXMgdHJhcCBpcyBvbmx5IGNhbGxlZCBhZnRlciBhIHByaW9yIGludm9jYXRpb25cbiAgICogb2YgdGhlICdoYXMnIHRyYXAgaGFzIHJldHVybmVkIHRydWUuIEhlbmNlLCBleHBlY3QgdGhlIGZvbGxvd2luZ1xuICAgKiBiZWhhdmlvcjpcbiAgICogPGNvZGU+XG4gICAqIHZhciBjaGlsZCA9IE9iamVjdC5jcmVhdGUoUHJveHkodGFyZ2V0LCBoYW5kbGVyKSk7XG4gICAqIGNoaWxkW25hbWVdIC8vIHRyaWdnZXJzIGhhbmRsZXIuaGFzKHRhcmdldCwgbmFtZSlcbiAgICogLy8gaWYgdGhhdCByZXR1cm5zIHRydWUsIHRyaWdnZXJzIGhhbmRsZXIuZ2V0KHRhcmdldCwgbmFtZSwgY2hpbGQpXG4gICAqIDwvY29kZT5cbiAgICpcbiAgICogT24gdjgsIHRoZSAnaW4nIG9wZXJhdG9yLCB3aGVuIGFwcGxpZWQgdG8gYW4gb2JqZWN0IHRoYXQgaW5oZXJpdHNcbiAgICogZnJvbSBhIHByb3h5LCB3aWxsIGNhbGwgZ2V0UHJvcGVydHlEZXNjcmlwdG9yIGFuZCB3YWxrIHRoZSBwcm90by1jaGFpbi5cbiAgICogVGhhdCBjYWxscyB0aGUgYmVsb3cgZ2V0UHJvcGVydHlEZXNjcmlwdG9yIHRyYXAgb24gdGhlIHByb3h5LiBUaGVcbiAgICogcmVzdWx0IG9mIHRoZSAnaW4nLW9wZXJhdG9yIGlzIHRoZW4gZGV0ZXJtaW5lZCBieSB3aGV0aGVyIHRoaXMgdHJhcFxuICAgKiByZXR1cm5zIHVuZGVmaW5lZCBvciBhIHByb3BlcnR5IGRlc2NyaXB0b3Igb2JqZWN0LiBUaGF0IGlzIHdoeVxuICAgKiB3ZSBmaXJzdCBleHBsaWNpdGx5IHRyaWdnZXIgdGhlICdoYXMnIHRyYXAgdG8gZGV0ZXJtaW5lIHdoZXRoZXJcbiAgICogdGhlIHByb3BlcnR5IGV4aXN0cy5cbiAgICpcbiAgICogVGhpcyBoYXMgdGhlIHNpZGUtZWZmZWN0IHRoYXQgd2hlbiBlbnVtZXJhdGluZyBwcm9wZXJ0aWVzIG9uXG4gICAqIGFuIG9iamVjdCB0aGF0IGluaGVyaXRzIGZyb20gYSBwcm94eSBpbiB2OCwgb25seSBwcm9wZXJ0aWVzXG4gICAqIGZvciB3aGljaCAnaGFzJyByZXR1cm5zIHRydWUgYXJlIHJldHVybmVkOlxuICAgKlxuICAgKiA8Y29kZT5cbiAgICogdmFyIGNoaWxkID0gT2JqZWN0LmNyZWF0ZShQcm94eSh0YXJnZXQsIGhhbmRsZXIpKTtcbiAgICogZm9yICh2YXIgcHJvcCBpbiBjaGlsZCkge1xuICAgKiAgIC8vIG9ubHkgZW51bWVyYXRlcyBwcm9wIGlmIChwcm9wIGluIGNoaWxkKSByZXR1cm5zIHRydWVcbiAgICogfVxuICAgKiA8L2NvZGU+XG4gICAqL1xuICBnZXRQcm9wZXJ0eURlc2NyaXB0b3I6IGZ1bmN0aW9uKG5hbWUpIHtcbiAgICB2YXIgaGFuZGxlciA9IHRoaXM7XG5cbiAgICBpZiAoIWhhbmRsZXIuaGFzKG5hbWUpKSByZXR1cm4gdW5kZWZpbmVkO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIGdldDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBoYW5kbGVyLmdldCh0aGlzLCBuYW1lKTtcbiAgICAgIH0sXG4gICAgICBzZXQ6IGZ1bmN0aW9uKHZhbCkge1xuICAgICAgICBpZiAoaGFuZGxlci5zZXQodGhpcywgbmFtZSwgdmFsKSkge1xuICAgICAgICAgIHJldHVybiB2YWw7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcImZhaWxlZCBhc3NpZ25tZW50IHRvIFwiK25hbWUpO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgIH07XG4gIH0sXG5cbiAgLyoqXG4gICAqIElmIG5hbWUgZGVub3RlcyBhIGZpeGVkIHByb3BlcnR5LCBjaGVjayBmb3IgaW5jb21wYXRpYmxlIGNoYW5nZXMuXG4gICAqIElmIHRoZSBwcm94eSBpcyBub24tZXh0ZW5zaWJsZSwgY2hlY2sgdGhhdCBuZXcgcHJvcGVydGllcyBhcmUgcmVqZWN0ZWQuXG4gICAqL1xuICBkZWZpbmVQcm9wZXJ0eTogZnVuY3Rpb24obmFtZSwgZGVzYykge1xuICAgIC8vIFRPRE8odHZjdXRzZW0pOiB0aGUgY3VycmVudCB0cmFjZW1vbmtleSBpbXBsZW1lbnRhdGlvbiBvZiBwcm94aWVzXG4gICAgLy8gYXV0by1jb21wbGV0ZXMgJ2Rlc2MnLCB3aGljaCBpcyBub3QgY29ycmVjdC4gJ2Rlc2MnIHNob3VsZCBiZVxuICAgIC8vIG5vcm1hbGl6ZWQsIGJ1dCBub3QgY29tcGxldGVkLiBDb25zaWRlcjpcbiAgICAvLyBPYmplY3QuZGVmaW5lUHJvcGVydHkocHJveHksICdmb28nLCB7ZW51bWVyYWJsZTpmYWxzZX0pXG4gICAgLy8gVGhpcyB0cmFwIHdpbGwgcmVjZWl2ZSBkZXNjID1cbiAgICAvLyAge3ZhbHVlOnVuZGVmaW5lZCx3cml0YWJsZTpmYWxzZSxlbnVtZXJhYmxlOmZhbHNlLGNvbmZpZ3VyYWJsZTpmYWxzZX1cbiAgICAvLyBUaGlzIHdpbGwgYWxzbyBzZXQgYWxsIG90aGVyIGF0dHJpYnV0ZXMgdG8gdGhlaXIgZGVmYXVsdCB2YWx1ZSxcbiAgICAvLyB3aGljaCBpcyB1bmV4cGVjdGVkIGFuZCBkaWZmZXJlbnQgZnJvbSBbW0RlZmluZU93blByb3BlcnR5XV0uXG4gICAgLy8gQnVnIGZpbGVkOiBodHRwczovL2J1Z3ppbGxhLm1vemlsbGEub3JnL3Nob3dfYnVnLmNnaT9pZD02MDEzMjlcblxuICAgIHZhciB0cmFwID0gdGhpcy5nZXRUcmFwKFwiZGVmaW5lUHJvcGVydHlcIik7XG4gICAgaWYgKHRyYXAgPT09IHVuZGVmaW5lZCkge1xuICAgICAgLy8gZGVmYXVsdCBmb3J3YXJkaW5nIGJlaGF2aW9yXG4gICAgICByZXR1cm4gUmVmbGVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLnRhcmdldCwgbmFtZSwgZGVzYyk7XG4gICAgfVxuXG4gICAgbmFtZSA9IFN0cmluZyhuYW1lKTtcbiAgICB2YXIgZGVzY09iaiA9IG5vcm1hbGl6ZVByb3BlcnR5RGVzY3JpcHRvcihkZXNjKTtcbiAgICB2YXIgc3VjY2VzcyA9IHRyYXAuY2FsbCh0aGlzLmhhbmRsZXIsIHRoaXMudGFyZ2V0LCBuYW1lLCBkZXNjT2JqKTtcbiAgICBzdWNjZXNzID0gISFzdWNjZXNzOyAvLyBjb2VyY2UgdG8gQm9vbGVhblxuXG4gICAgaWYgKHN1Y2Nlc3MgPT09IHRydWUpIHtcblxuICAgICAgdmFyIHRhcmdldERlc2MgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHRoaXMudGFyZ2V0LCBuYW1lKTtcbiAgICAgIHZhciBleHRlbnNpYmxlID0gT2JqZWN0LmlzRXh0ZW5zaWJsZSh0aGlzLnRhcmdldCk7XG5cbiAgICAgIC8vIE5vdGU6IHdlIGNvdWxkIGNvbGxhcHNlIHRoZSBmb2xsb3dpbmcgdHdvIGlmLXRlc3RzIGludG8gYSBzaW5nbGVcbiAgICAgIC8vIHRlc3QuIFNlcGFyYXRpbmcgb3V0IHRoZSBjYXNlcyB0byBpbXByb3ZlIGVycm9yIHJlcG9ydGluZy5cblxuICAgICAgaWYgKCFleHRlbnNpYmxlKSB7XG4gICAgICAgIGlmICh0YXJnZXREZXNjID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiY2Fubm90IHN1Y2Nlc3NmdWxseSBhZGQgYSBuZXcgcHJvcGVydHkgJ1wiK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZSArIFwiJyB0byBhIG5vbi1leHRlbnNpYmxlIG9iamVjdFwiKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAodGFyZ2V0RGVzYyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGlmICghaXNDb21wYXRpYmxlRGVzY3JpcHRvcihleHRlbnNpYmxlLCB0YXJnZXREZXNjLCBkZXNjKSkge1xuICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJjYW5ub3QgZGVmaW5lIGluY29tcGF0aWJsZSBwcm9wZXJ0eSBcIitcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiZGVzY3JpcHRvciBmb3IgcHJvcGVydHkgJ1wiK25hbWUrXCInXCIpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChpc0RhdGFEZXNjcmlwdG9yKHRhcmdldERlc2MpICYmXG4gICAgICAgICAgICB0YXJnZXREZXNjLmNvbmZpZ3VyYWJsZSA9PT0gZmFsc2UgJiZcbiAgICAgICAgICAgIHRhcmdldERlc2Mud3JpdGFibGUgPT09IHRydWUpIHtcbiAgICAgICAgICAgIGlmIChkZXNjLmNvbmZpZ3VyYWJsZSA9PT0gZmFsc2UgJiYgZGVzYy53cml0YWJsZSA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgLy8gaWYgdGhlIHByb3BlcnR5IGlzIG5vbi1jb25maWd1cmFibGUsIHdyaXRhYmxlIG9uIHRoZSB0YXJnZXRcbiAgICAgICAgICAgICAgLy8gYnV0IHdhcyBzdWNjZXNzZnVsbHkgcmVwb3J0ZWQgdG8gYmUgdXBkYXRlZCB0b1xuICAgICAgICAgICAgICAvLyBub24tY29uZmlndXJhYmxlLCBub24td3JpdGFibGUsIGl0IGNhbiBsYXRlciBiZSByZXBvcnRlZFxuICAgICAgICAgICAgICAvLyBhZ2FpbiBhcyBub24tY29uZmlndXJhYmxlLCB3cml0YWJsZSwgd2hpY2ggdmlvbGF0ZXNcbiAgICAgICAgICAgICAgLy8gdGhlIGludmFyaWFudCB0aGF0IG5vbi1jb25maWd1cmFibGUsIG5vbi13cml0YWJsZSBwcm9wZXJ0aWVzXG4gICAgICAgICAgICAgIC8vIGNhbm5vdCBjaGFuZ2Ugc3RhdGVcbiAgICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcbiAgICAgICAgICAgICAgICBcImNhbm5vdCBzdWNjZXNzZnVsbHkgZGVmaW5lIG5vbi1jb25maWd1cmFibGUsIHdyaXRhYmxlIFwiICtcbiAgICAgICAgICAgICAgICBcIiBwcm9wZXJ0eSAnXCIgKyBuYW1lICsgXCInIGFzIG5vbi1jb25maWd1cmFibGUsIG5vbi13cml0YWJsZVwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChkZXNjLmNvbmZpZ3VyYWJsZSA9PT0gZmFsc2UgJiYgIWlzU2VhbGVkRGVzYyh0YXJnZXREZXNjKSkge1xuICAgICAgICAvLyBpZiB0aGUgcHJvcGVydHkgaXMgY29uZmlndXJhYmxlIG9yIG5vbi1leGlzdGVudCBvbiB0aGUgdGFyZ2V0LFxuICAgICAgICAvLyBidXQgaXMgc3VjY2Vzc2Z1bGx5IGJlaW5nIHJlZGVmaW5lZCBhcyBhIG5vbi1jb25maWd1cmFibGUgcHJvcGVydHksXG4gICAgICAgIC8vIGl0IG1heSBsYXRlciBiZSByZXBvcnRlZCBhcyBjb25maWd1cmFibGUgb3Igbm9uLWV4aXN0ZW50LCB3aGljaCB2aW9sYXRlc1xuICAgICAgICAvLyB0aGUgaW52YXJpYW50IHRoYXQgaWYgdGhlIHByb3BlcnR5IG1pZ2h0IGNoYW5nZSBvciBkaXNhcHBlYXIsIHRoZVxuICAgICAgICAvLyBjb25maWd1cmFibGUgYXR0cmlidXRlIG11c3QgYmUgdHJ1ZS5cbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcbiAgICAgICAgICBcImNhbm5vdCBzdWNjZXNzZnVsbHkgZGVmaW5lIGEgbm9uLWNvbmZpZ3VyYWJsZSBcIiArXG4gICAgICAgICAgXCJkZXNjcmlwdG9yIGZvciBjb25maWd1cmFibGUgb3Igbm9uLWV4aXN0ZW50IHByb3BlcnR5ICdcIiArXG4gICAgICAgICAgbmFtZSArIFwiJ1wiKTtcbiAgICAgIH1cblxuICAgIH1cblxuICAgIHJldHVybiBzdWNjZXNzO1xuICB9LFxuXG4gIC8qKlxuICAgKiBPbiBzdWNjZXNzLCBjaGVjayB3aGV0aGVyIHRoZSB0YXJnZXQgb2JqZWN0IGlzIGluZGVlZCBub24tZXh0ZW5zaWJsZS5cbiAgICovXG4gIHByZXZlbnRFeHRlbnNpb25zOiBmdW5jdGlvbigpIHtcbiAgICB2YXIgdHJhcCA9IHRoaXMuZ2V0VHJhcChcInByZXZlbnRFeHRlbnNpb25zXCIpO1xuICAgIGlmICh0cmFwID09PSB1bmRlZmluZWQpIHtcbiAgICAgIC8vIGRlZmF1bHQgZm9yd2FyZGluZyBiZWhhdmlvclxuICAgICAgcmV0dXJuIFJlZmxlY3QucHJldmVudEV4dGVuc2lvbnModGhpcy50YXJnZXQpO1xuICAgIH1cblxuICAgIHZhciBzdWNjZXNzID0gdHJhcC5jYWxsKHRoaXMuaGFuZGxlciwgdGhpcy50YXJnZXQpO1xuICAgIHN1Y2Nlc3MgPSAhIXN1Y2Nlc3M7IC8vIGNvZXJjZSB0byBCb29sZWFuXG4gICAgaWYgKHN1Y2Nlc3MpIHtcbiAgICAgIGlmIChPYmplY3RfaXNFeHRlbnNpYmxlKHRoaXMudGFyZ2V0KSkge1xuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiY2FuJ3QgcmVwb3J0IGV4dGVuc2libGUgb2JqZWN0IGFzIG5vbi1leHRlbnNpYmxlOiBcIitcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnRhcmdldCk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBzdWNjZXNzO1xuICB9LFxuXG4gIC8qKlxuICAgKiBJZiBuYW1lIGRlbm90ZXMgYSBzZWFsZWQgcHJvcGVydHksIGNoZWNrIHdoZXRoZXIgaGFuZGxlciByZWplY3RzLlxuICAgKi9cbiAgZGVsZXRlOiBmdW5jdGlvbihuYW1lKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgdmFyIHRyYXAgPSB0aGlzLmdldFRyYXAoXCJkZWxldGVQcm9wZXJ0eVwiKTtcbiAgICBpZiAodHJhcCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAvLyBkZWZhdWx0IGZvcndhcmRpbmcgYmVoYXZpb3JcbiAgICAgIHJldHVybiBSZWZsZWN0LmRlbGV0ZVByb3BlcnR5KHRoaXMudGFyZ2V0LCBuYW1lKTtcbiAgICB9XG5cbiAgICBuYW1lID0gU3RyaW5nKG5hbWUpO1xuICAgIHZhciByZXMgPSB0cmFwLmNhbGwodGhpcy5oYW5kbGVyLCB0aGlzLnRhcmdldCwgbmFtZSk7XG4gICAgcmVzID0gISFyZXM7IC8vIGNvZXJjZSB0byBCb29sZWFuXG5cbiAgICB2YXIgdGFyZ2V0RGVzYztcbiAgICBpZiAocmVzID09PSB0cnVlKSB7XG4gICAgICB0YXJnZXREZXNjID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcih0aGlzLnRhcmdldCwgbmFtZSk7XG4gICAgICBpZiAodGFyZ2V0RGVzYyAhPT0gdW5kZWZpbmVkICYmIHRhcmdldERlc2MuY29uZmlndXJhYmxlID09PSBmYWxzZSkge1xuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwicHJvcGVydHkgJ1wiICsgbmFtZSArIFwiJyBpcyBub24tY29uZmlndXJhYmxlIFwiK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiYW5kIGNhbid0IGJlIGRlbGV0ZWRcIik7XG4gICAgICB9XG4gICAgICBpZiAodGFyZ2V0RGVzYyAhPT0gdW5kZWZpbmVkICYmICFPYmplY3RfaXNFeHRlbnNpYmxlKHRoaXMudGFyZ2V0KSkge1xuICAgICAgICAvLyBpZiB0aGUgcHJvcGVydHkgc3RpbGwgZXhpc3RzIG9uIGEgbm9uLWV4dGVuc2libGUgdGFyZ2V0IGJ1dFxuICAgICAgICAvLyBpcyByZXBvcnRlZCBhcyBzdWNjZXNzZnVsbHkgZGVsZXRlZCwgaXQgbWF5IGxhdGVyIGJlIHJlcG9ydGVkXG4gICAgICAgIC8vIGFzIHByZXNlbnQsIHdoaWNoIHZpb2xhdGVzIHRoZSBpbnZhcmlhbnQgdGhhdCBhbiBvd24gcHJvcGVydHksXG4gICAgICAgIC8vIGRlbGV0ZWQgZnJvbSBhIG5vbi1leHRlbnNpYmxlIG9iamVjdCBjYW5ub3QgcmVhcHBlYXIuXG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXG4gICAgICAgICAgXCJjYW5ub3Qgc3VjY2Vzc2Z1bGx5IGRlbGV0ZSBleGlzdGluZyBwcm9wZXJ0eSAnXCIgKyBuYW1lICtcbiAgICAgICAgICBcIicgb24gYSBub24tZXh0ZW5zaWJsZSBvYmplY3RcIik7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlcztcbiAgfSxcblxuICAvKipcbiAgICogVGhlIGdldE93blByb3BlcnR5TmFtZXMgdHJhcCB3YXMgcmVwbGFjZWQgYnkgdGhlIG93bktleXMgdHJhcCxcbiAgICogd2hpY2ggbm93IGFsc28gcmV0dXJucyBhbiBhcnJheSAob2Ygc3RyaW5ncyBvciBzeW1ib2xzKSBhbmRcbiAgICogd2hpY2ggcGVyZm9ybXMgdGhlIHNhbWUgcmlnb3JvdXMgaW52YXJpYW50IGNoZWNrcyBhcyBnZXRPd25Qcm9wZXJ0eU5hbWVzXG4gICAqXG4gICAqIFNlZSBpc3N1ZSAjNDggb24gaG93IHRoaXMgdHJhcCBjYW4gc3RpbGwgZ2V0IGludm9rZWQgYnkgZXh0ZXJuYWwgbGlic1xuICAgKiB0aGF0IGRvbid0IHVzZSB0aGUgcGF0Y2hlZCBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyBmdW5jdGlvbi5cbiAgICovXG4gIGdldE93blByb3BlcnR5TmFtZXM6IGZ1bmN0aW9uKCkge1xuICAgIC8vIE5vdGU6IHJlbW92ZWQgZGVwcmVjYXRpb24gd2FybmluZyB0byBhdm9pZCBkZXBlbmRlbmN5IG9uICdjb25zb2xlJ1xuICAgIC8vIChhbmQgb24gbm9kZSwgc2hvdWxkIGFueXdheSB1c2UgdXRpbC5kZXByZWNhdGUpLiBEZXByZWNhdGlvbiB3YXJuaW5nc1xuICAgIC8vIGNhbiBhbHNvIGJlIGFubm95aW5nIHdoZW4gdGhleSBhcmUgb3V0c2lkZSBvZiB0aGUgdXNlcidzIGNvbnRyb2wsIGUuZy5cbiAgICAvLyB3aGVuIGFuIGV4dGVybmFsIGxpYnJhcnkgY2FsbHMgdW5wYXRjaGVkIE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzLlxuICAgIC8vIFNpbmNlIHRoZXJlIGlzIGEgY2xlYW4gZmFsbGJhY2sgdG8gYG93bktleXNgLCB0aGUgZmFjdCB0aGF0IHRoZVxuICAgIC8vIGRlcHJlY2F0ZWQgbWV0aG9kIGlzIHN0aWxsIGNhbGxlZCBpcyBtb3N0bHkgaGFybWxlc3MgYW55d2F5LlxuICAgIC8vIFNlZSBhbHNvIGlzc3VlcyAjNjUgYW5kICM2Ni5cbiAgICAvLyBjb25zb2xlLndhcm4oXCJnZXRPd25Qcm9wZXJ0eU5hbWVzIHRyYXAgaXMgZGVwcmVjYXRlZC4gVXNlIG93bktleXMgaW5zdGVhZFwiKTtcbiAgICByZXR1cm4gdGhpcy5vd25LZXlzKCk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIENoZWNrcyB3aGV0aGVyIHRoZSB0cmFwIHJlc3VsdCBkb2VzIG5vdCBjb250YWluIGFueSBuZXcgcHJvcGVydGllc1xuICAgKiBpZiB0aGUgcHJveHkgaXMgbm9uLWV4dGVuc2libGUuXG4gICAqXG4gICAqIEFueSBvd24gbm9uLWNvbmZpZ3VyYWJsZSBwcm9wZXJ0aWVzIG9mIHRoZSB0YXJnZXQgdGhhdCBhcmUgbm90IGluY2x1ZGVkXG4gICAqIGluIHRoZSB0cmFwIHJlc3VsdCBnaXZlIHJpc2UgdG8gYSBUeXBlRXJyb3IuIEFzIHN1Y2gsIHdlIGNoZWNrIHdoZXRoZXIgdGhlXG4gICAqIHJldHVybmVkIHJlc3VsdCBjb250YWlucyBhdCBsZWFzdCBhbGwgc2VhbGVkIHByb3BlcnRpZXMgb2YgdGhlIHRhcmdldFxuICAgKiBvYmplY3QuXG4gICAqXG4gICAqIEFkZGl0aW9uYWxseSwgdGhlIHRyYXAgcmVzdWx0IGlzIG5vcm1hbGl6ZWQuXG4gICAqIEluc3RlYWQgb2YgcmV0dXJuaW5nIHRoZSB0cmFwIHJlc3VsdCBkaXJlY3RseTpcbiAgICogIC0gY3JlYXRlIGFuZCByZXR1cm4gYSBmcmVzaCBBcnJheSxcbiAgICogIC0gb2Ygd2hpY2ggZWFjaCBlbGVtZW50IGlzIGNvZXJjZWQgdG8gYSBTdHJpbmdcbiAgICpcbiAgICogVGhpcyB0cmFwIGlzIGNhbGxlZCBhLm8uIGJ5IFJlZmxlY3Qub3duS2V5cywgT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXNcbiAgICogYW5kIE9iamVjdC5rZXlzICh0aGUgbGF0dGVyIGZpbHRlcnMgb3V0IG9ubHkgdGhlIGVudW1lcmFibGUgb3duIHByb3BlcnRpZXMpLlxuICAgKi9cbiAgb3duS2V5czogZnVuY3Rpb24oKSB7XG4gICAgdmFyIHRyYXAgPSB0aGlzLmdldFRyYXAoXCJvd25LZXlzXCIpO1xuICAgIGlmICh0cmFwID09PSB1bmRlZmluZWQpIHtcbiAgICAgIC8vIGRlZmF1bHQgZm9yd2FyZGluZyBiZWhhdmlvclxuICAgICAgcmV0dXJuIFJlZmxlY3Qub3duS2V5cyh0aGlzLnRhcmdldCk7XG4gICAgfVxuXG4gICAgdmFyIHRyYXBSZXN1bHQgPSB0cmFwLmNhbGwodGhpcy5oYW5kbGVyLCB0aGlzLnRhcmdldCk7XG5cbiAgICAvLyBwcm9wTmFtZXMgaXMgdXNlZCBhcyBhIHNldCBvZiBzdHJpbmdzXG4gICAgdmFyIHByb3BOYW1lcyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gICAgdmFyIG51bVByb3BzID0gK3RyYXBSZXN1bHQubGVuZ3RoO1xuICAgIHZhciByZXN1bHQgPSBuZXcgQXJyYXkobnVtUHJvcHMpO1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBudW1Qcm9wczsgaSsrKSB7XG4gICAgICB2YXIgcyA9IFN0cmluZyh0cmFwUmVzdWx0W2ldKTtcbiAgICAgIGlmICghT2JqZWN0LmlzRXh0ZW5zaWJsZSh0aGlzLnRhcmdldCkgJiYgIWlzRml4ZWQocywgdGhpcy50YXJnZXQpKSB7XG4gICAgICAgIC8vIG5vbi1leHRlbnNpYmxlIHByb3hpZXMgZG9uJ3QgdG9sZXJhdGUgbmV3IG93biBwcm9wZXJ0eSBuYW1lc1xuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwib3duS2V5cyB0cmFwIGNhbm5vdCBsaXN0IGEgbmV3IFwiK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwicHJvcGVydHkgJ1wiK3MrXCInIG9uIGEgbm9uLWV4dGVuc2libGUgb2JqZWN0XCIpO1xuICAgICAgfVxuXG4gICAgICBwcm9wTmFtZXNbc10gPSB0cnVlO1xuICAgICAgcmVzdWx0W2ldID0gcztcbiAgICB9XG5cbiAgICB2YXIgb3duUHJvcHMgPSBPYmplY3RfZ2V0T3duUHJvcGVydHlOYW1lcyh0aGlzLnRhcmdldCk7XG4gICAgdmFyIHRhcmdldCA9IHRoaXMudGFyZ2V0O1xuICAgIG93blByb3BzLmZvckVhY2goZnVuY3Rpb24gKG93blByb3ApIHtcbiAgICAgIGlmICghcHJvcE5hbWVzW293blByb3BdKSB7XG4gICAgICAgIGlmIChpc1NlYWxlZChvd25Qcm9wLCB0YXJnZXQpKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIm93bktleXMgdHJhcCBmYWlsZWQgdG8gaW5jbHVkZSBcIitcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwibm9uLWNvbmZpZ3VyYWJsZSBwcm9wZXJ0eSAnXCIrb3duUHJvcCtcIidcIik7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFPYmplY3QuaXNFeHRlbnNpYmxlKHRhcmdldCkgJiZcbiAgICAgICAgICAgIGlzRml4ZWQob3duUHJvcCwgdGFyZ2V0KSkge1xuICAgICAgICAgICAgLy8gaWYgaGFuZGxlciBpcyBhbGxvd2VkIHRvIHJlcG9ydCBvd25Qcm9wIGFzIG5vbi1leGlzdGVudCxcbiAgICAgICAgICAgIC8vIHdlIGNhbm5vdCBndWFyYW50ZWUgdGhhdCBpdCB3aWxsIG5ldmVyIGxhdGVyIHJlcG9ydCBpdCBhc1xuICAgICAgICAgICAgLy8gZXhpc3RlbnQuIE9uY2UgYSBwcm9wZXJ0eSBoYXMgYmVlbiByZXBvcnRlZCBhcyBub24tZXhpc3RlbnRcbiAgICAgICAgICAgIC8vIG9uIGEgbm9uLWV4dGVuc2libGUgb2JqZWN0LCBpdCBzaG91bGQgZm9yZXZlciBiZSByZXBvcnRlZCBhc1xuICAgICAgICAgICAgLy8gbm9uLWV4aXN0ZW50XG4gICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwib3duS2V5cyB0cmFwIGNhbm5vdCByZXBvcnQgZXhpc3Rpbmcgb3duIHByb3BlcnR5ICdcIitcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3duUHJvcCtcIicgYXMgbm9uLWV4aXN0ZW50IG9uIGEgbm9uLWV4dGVuc2libGUgb2JqZWN0XCIpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9LFxuXG4gIC8qKlxuICAgKiBDaGVja3Mgd2hldGhlciB0aGUgdHJhcCByZXN1bHQgaXMgY29uc2lzdGVudCB3aXRoIHRoZSBzdGF0ZSBvZiB0aGVcbiAgICogd3JhcHBlZCB0YXJnZXQuXG4gICAqL1xuICBpc0V4dGVuc2libGU6IGZ1bmN0aW9uKCkge1xuICAgIHZhciB0cmFwID0gdGhpcy5nZXRUcmFwKFwiaXNFeHRlbnNpYmxlXCIpO1xuICAgIGlmICh0cmFwID09PSB1bmRlZmluZWQpIHtcbiAgICAgIC8vIGRlZmF1bHQgZm9yd2FyZGluZyBiZWhhdmlvclxuICAgICAgcmV0dXJuIFJlZmxlY3QuaXNFeHRlbnNpYmxlKHRoaXMudGFyZ2V0KTtcbiAgICB9XG5cbiAgICB2YXIgcmVzdWx0ID0gdHJhcC5jYWxsKHRoaXMuaGFuZGxlciwgdGhpcy50YXJnZXQpO1xuICAgIHJlc3VsdCA9ICEhcmVzdWx0OyAvLyBjb2VyY2UgdG8gQm9vbGVhblxuICAgIHZhciBzdGF0ZSA9IE9iamVjdF9pc0V4dGVuc2libGUodGhpcy50YXJnZXQpO1xuICAgIGlmIChyZXN1bHQgIT09IHN0YXRlKSB7XG4gICAgICBpZiAocmVzdWx0KSB7XG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJjYW5ub3QgcmVwb3J0IG5vbi1leHRlbnNpYmxlIG9iamVjdCBhcyBleHRlbnNpYmxlOiBcIitcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy50YXJnZXQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcImNhbm5vdCByZXBvcnQgZXh0ZW5zaWJsZSBvYmplY3QgYXMgbm9uLWV4dGVuc2libGU6IFwiK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnRhcmdldCk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBzdGF0ZTtcbiAgfSxcblxuICAvKipcbiAgICogQ2hlY2sgd2hldGhlciB0aGUgdHJhcCByZXN1bHQgY29ycmVzcG9uZHMgdG8gdGhlIHRhcmdldCdzIFtbUHJvdG90eXBlXV1cbiAgICovXG4gIGdldFByb3RvdHlwZU9mOiBmdW5jdGlvbigpIHtcbiAgICB2YXIgdHJhcCA9IHRoaXMuZ2V0VHJhcChcImdldFByb3RvdHlwZU9mXCIpO1xuICAgIGlmICh0cmFwID09PSB1bmRlZmluZWQpIHtcbiAgICAgIC8vIGRlZmF1bHQgZm9yd2FyZGluZyBiZWhhdmlvclxuICAgICAgcmV0dXJuIFJlZmxlY3QuZ2V0UHJvdG90eXBlT2YodGhpcy50YXJnZXQpO1xuICAgIH1cblxuICAgIHZhciBhbGxlZ2VkUHJvdG8gPSB0cmFwLmNhbGwodGhpcy5oYW5kbGVyLCB0aGlzLnRhcmdldCk7XG5cbiAgICBpZiAoIU9iamVjdF9pc0V4dGVuc2libGUodGhpcy50YXJnZXQpKSB7XG4gICAgICB2YXIgYWN0dWFsUHJvdG8gPSBPYmplY3RfZ2V0UHJvdG90eXBlT2YodGhpcy50YXJnZXQpO1xuICAgICAgaWYgKCFzYW1lVmFsdWUoYWxsZWdlZFByb3RvLCBhY3R1YWxQcm90bykpIHtcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcInByb3RvdHlwZSB2YWx1ZSBkb2VzIG5vdCBtYXRjaDogXCIgKyB0aGlzLnRhcmdldCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGFsbGVnZWRQcm90bztcbiAgfSxcblxuICAvKipcbiAgICogSWYgdGFyZ2V0IGlzIG5vbi1leHRlbnNpYmxlIGFuZCBzZXRQcm90b3R5cGVPZiB0cmFwIHJldHVybnMgdHJ1ZSxcbiAgICogY2hlY2sgd2hldGhlciB0aGUgdHJhcCByZXN1bHQgY29ycmVzcG9uZHMgdG8gdGhlIHRhcmdldCdzIFtbUHJvdG90eXBlXV1cbiAgICovXG4gIHNldFByb3RvdHlwZU9mOiBmdW5jdGlvbihuZXdQcm90bykge1xuICAgIHZhciB0cmFwID0gdGhpcy5nZXRUcmFwKFwic2V0UHJvdG90eXBlT2ZcIik7XG4gICAgaWYgKHRyYXAgPT09IHVuZGVmaW5lZCkge1xuICAgICAgLy8gZGVmYXVsdCBmb3J3YXJkaW5nIGJlaGF2aW9yXG4gICAgICByZXR1cm4gUmVmbGVjdC5zZXRQcm90b3R5cGVPZih0aGlzLnRhcmdldCwgbmV3UHJvdG8pO1xuICAgIH1cblxuICAgIHZhciBzdWNjZXNzID0gdHJhcC5jYWxsKHRoaXMuaGFuZGxlciwgdGhpcy50YXJnZXQsIG5ld1Byb3RvKTtcblxuICAgIHN1Y2Nlc3MgPSAhIXN1Y2Nlc3M7XG4gICAgaWYgKHN1Y2Nlc3MgJiYgIU9iamVjdF9pc0V4dGVuc2libGUodGhpcy50YXJnZXQpKSB7XG4gICAgICB2YXIgYWN0dWFsUHJvdG8gPSBPYmplY3RfZ2V0UHJvdG90eXBlT2YodGhpcy50YXJnZXQpO1xuICAgICAgaWYgKCFzYW1lVmFsdWUobmV3UHJvdG8sIGFjdHVhbFByb3RvKSkge1xuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwicHJvdG90eXBlIHZhbHVlIGRvZXMgbm90IG1hdGNoOiBcIiArIHRoaXMudGFyZ2V0KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gc3VjY2VzcztcbiAgfSxcblxuICAvKipcbiAgICogSW4gdGhlIGRpcmVjdCBwcm94aWVzIGRlc2lnbiB3aXRoIHJlZmFjdG9yZWQgcHJvdG90eXBlIGNsaW1iaW5nLFxuICAgKiB0aGlzIHRyYXAgaXMgZGVwcmVjYXRlZC4gRm9yIHByb3hpZXMtYXMtcHJvdG90eXBlcywgZm9yLWluIHdpbGxcbiAgICogY2FsbCB0aGUgZW51bWVyYXRlKCkgdHJhcC4gSWYgdGhhdCB0cmFwIGlzIG5vdCBkZWZpbmVkLCB0aGVcbiAgICogb3BlcmF0aW9uIGlzIGZvcndhcmRlZCB0byB0aGUgdGFyZ2V0LCBubyBtb3JlIGZhbGxiYWNrIG9uIHRoaXNcbiAgICogZnVuZGFtZW50YWwgdHJhcC5cbiAgICovXG4gIGdldFByb3BlcnR5TmFtZXM6IGZ1bmN0aW9uKCkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJnZXRQcm9wZXJ0eU5hbWVzIHRyYXAgaXMgZGVwcmVjYXRlZFwiKTtcbiAgfSxcblxuICAvLyA9PT0gZGVyaXZlZCB0cmFwcyA9PT1cblxuICAvKipcbiAgICogSWYgbmFtZSBkZW5vdGVzIGEgZml4ZWQgcHJvcGVydHksIGNoZWNrIHdoZXRoZXIgdGhlIHRyYXAgcmV0dXJucyB0cnVlLlxuICAgKi9cbiAgaGFzOiBmdW5jdGlvbihuYW1lKSB7XG4gICAgdmFyIHRyYXAgPSB0aGlzLmdldFRyYXAoXCJoYXNcIik7XG4gICAgaWYgKHRyYXAgPT09IHVuZGVmaW5lZCkge1xuICAgICAgLy8gZGVmYXVsdCBmb3J3YXJkaW5nIGJlaGF2aW9yXG4gICAgICByZXR1cm4gUmVmbGVjdC5oYXModGhpcy50YXJnZXQsIG5hbWUpO1xuICAgIH1cblxuICAgIG5hbWUgPSBTdHJpbmcobmFtZSk7XG4gICAgdmFyIHJlcyA9IHRyYXAuY2FsbCh0aGlzLmhhbmRsZXIsIHRoaXMudGFyZ2V0LCBuYW1lKTtcbiAgICByZXMgPSAhIXJlczsgLy8gY29lcmNlIHRvIEJvb2xlYW5cblxuICAgIGlmIChyZXMgPT09IGZhbHNlKSB7XG4gICAgICBpZiAoaXNTZWFsZWQobmFtZSwgdGhpcy50YXJnZXQpKSB7XG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJjYW5ub3QgcmVwb3J0IGV4aXN0aW5nIG5vbi1jb25maWd1cmFibGUgb3duIFwiK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwicHJvcGVydHkgJ1wiKyBuYW1lICsgXCInIGFzIGEgbm9uLWV4aXN0ZW50IFwiK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwicHJvcGVydHlcIik7XG4gICAgICB9XG4gICAgICBpZiAoIU9iamVjdC5pc0V4dGVuc2libGUodGhpcy50YXJnZXQpICYmXG4gICAgICAgICAgaXNGaXhlZChuYW1lLCB0aGlzLnRhcmdldCkpIHtcbiAgICAgICAgICAvLyBpZiBoYW5kbGVyIGlzIGFsbG93ZWQgdG8gcmV0dXJuIGZhbHNlLCB3ZSBjYW5ub3QgZ3VhcmFudGVlXG4gICAgICAgICAgLy8gdGhhdCBpdCB3aWxsIG5vdCByZXR1cm4gdHJ1ZSBmb3IgdGhpcyBwcm9wZXJ0eSBsYXRlci5cbiAgICAgICAgICAvLyBPbmNlIGEgcHJvcGVydHkgaGFzIGJlZW4gcmVwb3J0ZWQgYXMgbm9uLWV4aXN0ZW50IG9uIGEgbm9uLWV4dGVuc2libGVcbiAgICAgICAgICAvLyBvYmplY3QsIGl0IHNob3VsZCBmb3JldmVyIGJlIHJlcG9ydGVkIGFzIG5vbi1leGlzdGVudFxuICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJjYW5ub3QgcmVwb3J0IGV4aXN0aW5nIG93biBwcm9wZXJ0eSAnXCIrbmFtZStcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiJyBhcyBub24tZXhpc3RlbnQgb24gYSBub24tZXh0ZW5zaWJsZSBvYmplY3RcIik7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gaWYgcmVzID09PSB0cnVlLCB3ZSBkb24ndCBuZWVkIHRvIGNoZWNrIGZvciBleHRlbnNpYmlsaXR5XG4gICAgLy8gZXZlbiBmb3IgYSBub24tZXh0ZW5zaWJsZSBwcm94eSB0aGF0IGhhcyBubyBvd24gbmFtZSBwcm9wZXJ0eSxcbiAgICAvLyB0aGUgcHJvcGVydHkgbWF5IGhhdmUgYmVlbiBpbmhlcml0ZWRcblxuICAgIHJldHVybiByZXM7XG4gIH0sXG5cbiAgLyoqXG4gICAqIElmIG5hbWUgZGVub3RlcyBhIGZpeGVkIG5vbi1jb25maWd1cmFibGUsIG5vbi13cml0YWJsZSBkYXRhIHByb3BlcnR5LFxuICAgKiBjaGVjayBpdHMgcmV0dXJuIHZhbHVlIGFnYWluc3QgdGhlIHByZXZpb3VzbHkgYXNzZXJ0ZWQgdmFsdWUgb2YgdGhlXG4gICAqIGZpeGVkIHByb3BlcnR5LlxuICAgKi9cbiAgZ2V0OiBmdW5jdGlvbihyZWNlaXZlciwgbmFtZSkge1xuXG4gICAgLy8gZXhwZXJpbWVudGFsIHN1cHBvcnQgZm9yIGludm9rZSgpIHRyYXAgb24gcGxhdGZvcm1zIHRoYXRcbiAgICAvLyBzdXBwb3J0IF9fbm9TdWNoTWV0aG9kX19cbiAgICAvKlxuICAgIGlmIChuYW1lID09PSAnX19ub1N1Y2hNZXRob2RfXycpIHtcbiAgICAgIHZhciBoYW5kbGVyID0gdGhpcztcbiAgICAgIHJldHVybiBmdW5jdGlvbihuYW1lLCBhcmdzKSB7XG4gICAgICAgIHJldHVybiBoYW5kbGVyLmludm9rZShyZWNlaXZlciwgbmFtZSwgYXJncyk7XG4gICAgICB9XG4gICAgfVxuICAgICovXG5cbiAgICB2YXIgdHJhcCA9IHRoaXMuZ2V0VHJhcChcImdldFwiKTtcbiAgICBpZiAodHJhcCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAvLyBkZWZhdWx0IGZvcndhcmRpbmcgYmVoYXZpb3JcbiAgICAgIHJldHVybiBSZWZsZWN0LmdldCh0aGlzLnRhcmdldCwgbmFtZSwgcmVjZWl2ZXIpO1xuICAgIH1cblxuICAgIG5hbWUgPSBTdHJpbmcobmFtZSk7XG4gICAgdmFyIHJlcyA9IHRyYXAuY2FsbCh0aGlzLmhhbmRsZXIsIHRoaXMudGFyZ2V0LCBuYW1lLCByZWNlaXZlcik7XG5cbiAgICB2YXIgZml4ZWREZXNjID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcih0aGlzLnRhcmdldCwgbmFtZSk7XG4gICAgLy8gY2hlY2sgY29uc2lzdGVuY3kgb2YgdGhlIHJldHVybmVkIHZhbHVlXG4gICAgaWYgKGZpeGVkRGVzYyAhPT0gdW5kZWZpbmVkKSB7IC8vIGdldHRpbmcgYW4gZXhpc3RpbmcgcHJvcGVydHlcbiAgICAgIGlmIChpc0RhdGFEZXNjcmlwdG9yKGZpeGVkRGVzYykgJiZcbiAgICAgICAgICBmaXhlZERlc2MuY29uZmlndXJhYmxlID09PSBmYWxzZSAmJlxuICAgICAgICAgIGZpeGVkRGVzYy53cml0YWJsZSA9PT0gZmFsc2UpIHsgLy8gb3duIGZyb3plbiBkYXRhIHByb3BlcnR5XG4gICAgICAgIGlmICghc2FtZVZhbHVlKHJlcywgZml4ZWREZXNjLnZhbHVlKSkge1xuICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJjYW5ub3QgcmVwb3J0IGluY29uc2lzdGVudCB2YWx1ZSBmb3IgXCIrXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIm5vbi13cml0YWJsZSwgbm9uLWNvbmZpZ3VyYWJsZSBwcm9wZXJ0eSAnXCIrXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lK1wiJ1wiKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHsgLy8gaXQncyBhbiBhY2Nlc3NvciBwcm9wZXJ0eVxuICAgICAgICBpZiAoaXNBY2Nlc3NvckRlc2NyaXB0b3IoZml4ZWREZXNjKSAmJlxuICAgICAgICAgICAgZml4ZWREZXNjLmNvbmZpZ3VyYWJsZSA9PT0gZmFsc2UgJiZcbiAgICAgICAgICAgIGZpeGVkRGVzYy5nZXQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIGlmIChyZXMgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIm11c3QgcmVwb3J0IHVuZGVmaW5lZCBmb3Igbm9uLWNvbmZpZ3VyYWJsZSBcIitcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJhY2Nlc3NvciBwcm9wZXJ0eSAnXCIrbmFtZStcIicgd2l0aG91dCBnZXR0ZXJcIik7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlcztcbiAgfSxcblxuICAvKipcbiAgICogSWYgbmFtZSBkZW5vdGVzIGEgZml4ZWQgbm9uLWNvbmZpZ3VyYWJsZSwgbm9uLXdyaXRhYmxlIGRhdGEgcHJvcGVydHksXG4gICAqIGNoZWNrIHRoYXQgdGhlIHRyYXAgcmVqZWN0cyB0aGUgYXNzaWdubWVudC5cbiAgICovXG4gIHNldDogZnVuY3Rpb24ocmVjZWl2ZXIsIG5hbWUsIHZhbCkge1xuICAgIHZhciB0cmFwID0gdGhpcy5nZXRUcmFwKFwic2V0XCIpO1xuICAgIGlmICh0cmFwID09PSB1bmRlZmluZWQpIHtcbiAgICAgIC8vIGRlZmF1bHQgZm9yd2FyZGluZyBiZWhhdmlvclxuICAgICAgcmV0dXJuIFJlZmxlY3Quc2V0KHRoaXMudGFyZ2V0LCBuYW1lLCB2YWwsIHJlY2VpdmVyKTtcbiAgICB9XG5cbiAgICBuYW1lID0gU3RyaW5nKG5hbWUpO1xuICAgIHZhciByZXMgPSB0cmFwLmNhbGwodGhpcy5oYW5kbGVyLCB0aGlzLnRhcmdldCwgbmFtZSwgdmFsLCByZWNlaXZlcik7XG4gICAgcmVzID0gISFyZXM7IC8vIGNvZXJjZSB0byBCb29sZWFuXG5cbiAgICAvLyBpZiBzdWNjZXNzIGlzIHJlcG9ydGVkLCBjaGVjayB3aGV0aGVyIHByb3BlcnR5IGlzIHRydWx5IGFzc2lnbmFibGVcbiAgICBpZiAocmVzID09PSB0cnVlKSB7XG4gICAgICB2YXIgZml4ZWREZXNjID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcih0aGlzLnRhcmdldCwgbmFtZSk7XG4gICAgICBpZiAoZml4ZWREZXNjICE9PSB1bmRlZmluZWQpIHsgLy8gc2V0dGluZyBhbiBleGlzdGluZyBwcm9wZXJ0eVxuICAgICAgICBpZiAoaXNEYXRhRGVzY3JpcHRvcihmaXhlZERlc2MpICYmXG4gICAgICAgICAgICBmaXhlZERlc2MuY29uZmlndXJhYmxlID09PSBmYWxzZSAmJlxuICAgICAgICAgICAgZml4ZWREZXNjLndyaXRhYmxlID09PSBmYWxzZSkge1xuICAgICAgICAgIGlmICghc2FtZVZhbHVlKHZhbCwgZml4ZWREZXNjLnZhbHVlKSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcImNhbm5vdCBzdWNjZXNzZnVsbHkgYXNzaWduIHRvIGEgXCIrXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwibm9uLXdyaXRhYmxlLCBub24tY29uZmlndXJhYmxlIHByb3BlcnR5ICdcIitcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZStcIidcIik7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlmIChpc0FjY2Vzc29yRGVzY3JpcHRvcihmaXhlZERlc2MpICYmXG4gICAgICAgICAgICAgIGZpeGVkRGVzYy5jb25maWd1cmFibGUgPT09IGZhbHNlICYmIC8vIG5vbi1jb25maWd1cmFibGVcbiAgICAgICAgICAgICAgZml4ZWREZXNjLnNldCA9PT0gdW5kZWZpbmVkKSB7ICAgICAgLy8gYWNjZXNzb3Igd2l0aCB1bmRlZmluZWQgc2V0dGVyXG4gICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwic2V0dGluZyBhIHByb3BlcnR5ICdcIituYW1lK1wiJyB0aGF0IGhhcyBcIitcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCIgb25seSBhIGdldHRlclwiKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gcmVzO1xuICB9LFxuXG4gIC8qKlxuICAgKiBBbnkgb3duIGVudW1lcmFibGUgbm9uLWNvbmZpZ3VyYWJsZSBwcm9wZXJ0aWVzIG9mIHRoZSB0YXJnZXQgdGhhdCBhcmUgbm90XG4gICAqIGluY2x1ZGVkIGluIHRoZSB0cmFwIHJlc3VsdCBnaXZlIHJpc2UgdG8gYSBUeXBlRXJyb3IuIEFzIHN1Y2gsIHdlIGNoZWNrXG4gICAqIHdoZXRoZXIgdGhlIHJldHVybmVkIHJlc3VsdCBjb250YWlucyBhdCBsZWFzdCBhbGwgc2VhbGVkIGVudW1lcmFibGUgcHJvcGVydGllc1xuICAgKiBvZiB0aGUgdGFyZ2V0IG9iamVjdC5cbiAgICpcbiAgICogVGhlIHRyYXAgc2hvdWxkIHJldHVybiBhbiBpdGVyYXRvci5cbiAgICpcbiAgICogSG93ZXZlciwgYXMgaW1wbGVtZW50YXRpb25zIG9mIHByZS1kaXJlY3QgcHJveGllcyBzdGlsbCBleHBlY3QgZW51bWVyYXRlXG4gICAqIHRvIHJldHVybiBhbiBhcnJheSBvZiBzdHJpbmdzLCB3ZSBjb252ZXJ0IHRoZSBpdGVyYXRvciBpbnRvIGFuIGFycmF5LlxuICAgKi9cbiAgZW51bWVyYXRlOiBmdW5jdGlvbigpIHtcbiAgICB2YXIgdHJhcCA9IHRoaXMuZ2V0VHJhcChcImVudW1lcmF0ZVwiKTtcbiAgICBpZiAodHJhcCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAvLyBkZWZhdWx0IGZvcndhcmRpbmcgYmVoYXZpb3JcbiAgICAgIHZhciB0cmFwUmVzdWx0ID0gUmVmbGVjdC5lbnVtZXJhdGUodGhpcy50YXJnZXQpO1xuICAgICAgdmFyIHJlc3VsdCA9IFtdO1xuICAgICAgdmFyIG54dCA9IHRyYXBSZXN1bHQubmV4dCgpO1xuICAgICAgd2hpbGUgKCFueHQuZG9uZSkge1xuICAgICAgICByZXN1bHQucHVzaChTdHJpbmcobnh0LnZhbHVlKSk7XG4gICAgICAgIG54dCA9IHRyYXBSZXN1bHQubmV4dCgpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cbiAgICB2YXIgdHJhcFJlc3VsdCA9IHRyYXAuY2FsbCh0aGlzLmhhbmRsZXIsIHRoaXMudGFyZ2V0KTtcbiAgICBcbiAgICBpZiAodHJhcFJlc3VsdCA9PT0gbnVsbCB8fFxuICAgICAgICB0cmFwUmVzdWx0ID09PSB1bmRlZmluZWQgfHxcbiAgICAgICAgdHJhcFJlc3VsdC5uZXh0ID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJlbnVtZXJhdGUgdHJhcCBzaG91bGQgcmV0dXJuIGFuIGl0ZXJhdG9yLCBnb3Q6IFwiK1xuICAgICAgICAgICAgICAgICAgICAgICAgICB0cmFwUmVzdWx0KTsgICAgXG4gICAgfVxuICAgIFxuICAgIC8vIHByb3BOYW1lcyBpcyB1c2VkIGFzIGEgc2V0IG9mIHN0cmluZ3NcbiAgICB2YXIgcHJvcE5hbWVzID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiAgICBcbiAgICAvLyB2YXIgbnVtUHJvcHMgPSArdHJhcFJlc3VsdC5sZW5ndGg7XG4gICAgdmFyIHJlc3VsdCA9IFtdOyAvLyBuZXcgQXJyYXkobnVtUHJvcHMpO1xuICAgIFxuICAgIC8vIHRyYXBSZXN1bHQgaXMgc3VwcG9zZWQgdG8gYmUgYW4gaXRlcmF0b3JcbiAgICAvLyBkcmFpbiBpdGVyYXRvciB0byBhcnJheSBhcyBjdXJyZW50IGltcGxlbWVudGF0aW9ucyBzdGlsbCBleHBlY3RcbiAgICAvLyBlbnVtZXJhdGUgdG8gcmV0dXJuIGFuIGFycmF5IG9mIHN0cmluZ3NcbiAgICB2YXIgbnh0ID0gdHJhcFJlc3VsdC5uZXh0KCk7XG4gICAgXG4gICAgd2hpbGUgKCFueHQuZG9uZSkge1xuICAgICAgdmFyIHMgPSBTdHJpbmcobnh0LnZhbHVlKTtcbiAgICAgIGlmIChwcm9wTmFtZXNbc10pIHtcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcImVudW1lcmF0ZSB0cmFwIGNhbm5vdCBsaXN0IGEgXCIrXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJkdXBsaWNhdGUgcHJvcGVydHkgJ1wiK3MrXCInXCIpO1xuICAgICAgfVxuICAgICAgcHJvcE5hbWVzW3NdID0gdHJ1ZTtcbiAgICAgIHJlc3VsdC5wdXNoKHMpO1xuICAgICAgbnh0ID0gdHJhcFJlc3VsdC5uZXh0KCk7XG4gICAgfVxuICAgIFxuICAgIC8qZm9yICh2YXIgaSA9IDA7IGkgPCBudW1Qcm9wczsgaSsrKSB7XG4gICAgICB2YXIgcyA9IFN0cmluZyh0cmFwUmVzdWx0W2ldKTtcbiAgICAgIGlmIChwcm9wTmFtZXNbc10pIHtcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcImVudW1lcmF0ZSB0cmFwIGNhbm5vdCBsaXN0IGEgXCIrXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJkdXBsaWNhdGUgcHJvcGVydHkgJ1wiK3MrXCInXCIpO1xuICAgICAgfVxuXG4gICAgICBwcm9wTmFtZXNbc10gPSB0cnVlO1xuICAgICAgcmVzdWx0W2ldID0gcztcbiAgICB9ICovXG5cbiAgICB2YXIgb3duRW51bWVyYWJsZVByb3BzID0gT2JqZWN0LmtleXModGhpcy50YXJnZXQpO1xuICAgIHZhciB0YXJnZXQgPSB0aGlzLnRhcmdldDtcbiAgICBvd25FbnVtZXJhYmxlUHJvcHMuZm9yRWFjaChmdW5jdGlvbiAob3duRW51bWVyYWJsZVByb3ApIHtcbiAgICAgIGlmICghcHJvcE5hbWVzW293bkVudW1lcmFibGVQcm9wXSkge1xuICAgICAgICBpZiAoaXNTZWFsZWQob3duRW51bWVyYWJsZVByb3AsIHRhcmdldCkpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiZW51bWVyYXRlIHRyYXAgZmFpbGVkIHRvIGluY2x1ZGUgXCIrXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIm5vbi1jb25maWd1cmFibGUgZW51bWVyYWJsZSBwcm9wZXJ0eSAnXCIrXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvd25FbnVtZXJhYmxlUHJvcCtcIidcIik7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFPYmplY3QuaXNFeHRlbnNpYmxlKHRhcmdldCkgJiZcbiAgICAgICAgICAgIGlzRml4ZWQob3duRW51bWVyYWJsZVByb3AsIHRhcmdldCkpIHtcbiAgICAgICAgICAgIC8vIGlmIGhhbmRsZXIgaXMgYWxsb3dlZCBub3QgdG8gcmVwb3J0IG93bkVudW1lcmFibGVQcm9wIGFzIGFuIG93blxuICAgICAgICAgICAgLy8gcHJvcGVydHksIHdlIGNhbm5vdCBndWFyYW50ZWUgdGhhdCBpdCB3aWxsIG5ldmVyIHJlcG9ydCBpdCBhc1xuICAgICAgICAgICAgLy8gYW4gb3duIHByb3BlcnR5IGxhdGVyLiBPbmNlIGEgcHJvcGVydHkgaGFzIGJlZW4gcmVwb3J0ZWQgYXNcbiAgICAgICAgICAgIC8vIG5vbi1leGlzdGVudCBvbiBhIG5vbi1leHRlbnNpYmxlIG9iamVjdCwgaXQgc2hvdWxkIGZvcmV2ZXIgYmVcbiAgICAgICAgICAgIC8vIHJlcG9ydGVkIGFzIG5vbi1leGlzdGVudFxuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcImNhbm5vdCByZXBvcnQgZXhpc3Rpbmcgb3duIHByb3BlcnR5ICdcIitcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3duRW51bWVyYWJsZVByb3ArXCInIGFzIG5vbi1leGlzdGVudCBvbiBhIFwiK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIm5vbi1leHRlbnNpYmxlIG9iamVjdFwiKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfSxcblxuICAvKipcbiAgICogVGhlIGl0ZXJhdGUgdHJhcCBpcyBkZXByZWNhdGVkIGJ5IHRoZSBlbnVtZXJhdGUgdHJhcC5cbiAgICovXG4gIGl0ZXJhdGU6IFZhbGlkYXRvci5wcm90b3R5cGUuZW51bWVyYXRlLFxuXG4gIC8qKlxuICAgKiBBbnkgb3duIG5vbi1jb25maWd1cmFibGUgcHJvcGVydGllcyBvZiB0aGUgdGFyZ2V0IHRoYXQgYXJlIG5vdCBpbmNsdWRlZFxuICAgKiBpbiB0aGUgdHJhcCByZXN1bHQgZ2l2ZSByaXNlIHRvIGEgVHlwZUVycm9yLiBBcyBzdWNoLCB3ZSBjaGVjayB3aGV0aGVyIHRoZVxuICAgKiByZXR1cm5lZCByZXN1bHQgY29udGFpbnMgYXQgbGVhc3QgYWxsIHNlYWxlZCBwcm9wZXJ0aWVzIG9mIHRoZSB0YXJnZXRcbiAgICogb2JqZWN0LlxuICAgKlxuICAgKiBUaGUgdHJhcCByZXN1bHQgaXMgbm9ybWFsaXplZC5cbiAgICogVGhlIHRyYXAgcmVzdWx0IGlzIG5vdCByZXR1cm5lZCBkaXJlY3RseS4gSW5zdGVhZDpcbiAgICogIC0gY3JlYXRlIGFuZCByZXR1cm4gYSBmcmVzaCBBcnJheSxcbiAgICogIC0gb2Ygd2hpY2ggZWFjaCBlbGVtZW50IGlzIGNvZXJjZWQgdG8gU3RyaW5nLFxuICAgKiAgLSB3aGljaCBkb2VzIG5vdCBjb250YWluIGR1cGxpY2F0ZXNcbiAgICpcbiAgICogRklYTUU6IGtleXMgdHJhcCBpcyBkZXByZWNhdGVkXG4gICAqL1xuICAvKlxuICBrZXlzOiBmdW5jdGlvbigpIHtcbiAgICB2YXIgdHJhcCA9IHRoaXMuZ2V0VHJhcChcImtleXNcIik7XG4gICAgaWYgKHRyYXAgPT09IHVuZGVmaW5lZCkge1xuICAgICAgLy8gZGVmYXVsdCBmb3J3YXJkaW5nIGJlaGF2aW9yXG4gICAgICByZXR1cm4gUmVmbGVjdC5rZXlzKHRoaXMudGFyZ2V0KTtcbiAgICB9XG5cbiAgICB2YXIgdHJhcFJlc3VsdCA9IHRyYXAuY2FsbCh0aGlzLmhhbmRsZXIsIHRoaXMudGFyZ2V0KTtcblxuICAgIC8vIHByb3BOYW1lcyBpcyB1c2VkIGFzIGEgc2V0IG9mIHN0cmluZ3NcbiAgICB2YXIgcHJvcE5hbWVzID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiAgICB2YXIgbnVtUHJvcHMgPSArdHJhcFJlc3VsdC5sZW5ndGg7XG4gICAgdmFyIHJlc3VsdCA9IG5ldyBBcnJheShudW1Qcm9wcyk7XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IG51bVByb3BzOyBpKyspIHtcbiAgICAgdmFyIHMgPSBTdHJpbmcodHJhcFJlc3VsdFtpXSk7XG4gICAgIGlmIChwcm9wTmFtZXNbc10pIHtcbiAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwia2V5cyB0cmFwIGNhbm5vdCBsaXN0IGEgXCIrXG4gICAgICAgICAgICAgICAgICAgICAgICAgICBcImR1cGxpY2F0ZSBwcm9wZXJ0eSAnXCIrcytcIidcIik7XG4gICAgIH1cbiAgICAgaWYgKCFPYmplY3QuaXNFeHRlbnNpYmxlKHRoaXMudGFyZ2V0KSAmJiAhaXNGaXhlZChzLCB0aGlzLnRhcmdldCkpIHtcbiAgICAgICAvLyBub24tZXh0ZW5zaWJsZSBwcm94aWVzIGRvbid0IHRvbGVyYXRlIG5ldyBvd24gcHJvcGVydHkgbmFtZXNcbiAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwia2V5cyB0cmFwIGNhbm5vdCBsaXN0IGEgbmV3IFwiK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJwcm9wZXJ0eSAnXCIrcytcIicgb24gYSBub24tZXh0ZW5zaWJsZSBvYmplY3RcIik7XG4gICAgIH1cblxuICAgICBwcm9wTmFtZXNbc10gPSB0cnVlO1xuICAgICByZXN1bHRbaV0gPSBzO1xuICAgIH1cblxuICAgIHZhciBvd25FbnVtZXJhYmxlUHJvcHMgPSBPYmplY3Qua2V5cyh0aGlzLnRhcmdldCk7XG4gICAgdmFyIHRhcmdldCA9IHRoaXMudGFyZ2V0O1xuICAgIG93bkVudW1lcmFibGVQcm9wcy5mb3JFYWNoKGZ1bmN0aW9uIChvd25FbnVtZXJhYmxlUHJvcCkge1xuICAgICAgaWYgKCFwcm9wTmFtZXNbb3duRW51bWVyYWJsZVByb3BdKSB7XG4gICAgICAgIGlmIChpc1NlYWxlZChvd25FbnVtZXJhYmxlUHJvcCwgdGFyZ2V0KSkge1xuICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJrZXlzIHRyYXAgZmFpbGVkIHRvIGluY2x1ZGUgXCIrXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIm5vbi1jb25maWd1cmFibGUgZW51bWVyYWJsZSBwcm9wZXJ0eSAnXCIrXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvd25FbnVtZXJhYmxlUHJvcCtcIidcIik7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFPYmplY3QuaXNFeHRlbnNpYmxlKHRhcmdldCkgJiZcbiAgICAgICAgICAgIGlzRml4ZWQob3duRW51bWVyYWJsZVByb3AsIHRhcmdldCkpIHtcbiAgICAgICAgICAgIC8vIGlmIGhhbmRsZXIgaXMgYWxsb3dlZCBub3QgdG8gcmVwb3J0IG93bkVudW1lcmFibGVQcm9wIGFzIGFuIG93blxuICAgICAgICAgICAgLy8gcHJvcGVydHksIHdlIGNhbm5vdCBndWFyYW50ZWUgdGhhdCBpdCB3aWxsIG5ldmVyIHJlcG9ydCBpdCBhc1xuICAgICAgICAgICAgLy8gYW4gb3duIHByb3BlcnR5IGxhdGVyLiBPbmNlIGEgcHJvcGVydHkgaGFzIGJlZW4gcmVwb3J0ZWQgYXNcbiAgICAgICAgICAgIC8vIG5vbi1leGlzdGVudCBvbiBhIG5vbi1leHRlbnNpYmxlIG9iamVjdCwgaXQgc2hvdWxkIGZvcmV2ZXIgYmVcbiAgICAgICAgICAgIC8vIHJlcG9ydGVkIGFzIG5vbi1leGlzdGVudFxuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcImNhbm5vdCByZXBvcnQgZXhpc3Rpbmcgb3duIHByb3BlcnR5ICdcIitcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3duRW51bWVyYWJsZVByb3ArXCInIGFzIG5vbi1leGlzdGVudCBvbiBhIFwiK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIm5vbi1leHRlbnNpYmxlIG9iamVjdFwiKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfSxcbiAgKi9cbiAgXG4gIC8qKlxuICAgKiBOZXcgdHJhcCB0aGF0IHJlaWZpZXMgW1tDYWxsXV0uXG4gICAqIElmIHRoZSB0YXJnZXQgaXMgYSBmdW5jdGlvbiwgdGhlbiBhIGNhbGwgdG9cbiAgICogICBwcm94eSguLi5hcmdzKVxuICAgKiBUcmlnZ2VycyB0aGlzIHRyYXBcbiAgICovXG4gIGFwcGx5OiBmdW5jdGlvbih0YXJnZXQsIHRoaXNCaW5kaW5nLCBhcmdzKSB7XG4gICAgdmFyIHRyYXAgPSB0aGlzLmdldFRyYXAoXCJhcHBseVwiKTtcbiAgICBpZiAodHJhcCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm4gUmVmbGVjdC5hcHBseSh0YXJnZXQsIHRoaXNCaW5kaW5nLCBhcmdzKTtcbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIHRoaXMudGFyZ2V0ID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgIHJldHVybiB0cmFwLmNhbGwodGhpcy5oYW5kbGVyLCB0YXJnZXQsIHRoaXNCaW5kaW5nLCBhcmdzKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcImFwcGx5OiBcIisgdGFyZ2V0ICsgXCIgaXMgbm90IGEgZnVuY3Rpb25cIik7XG4gICAgfVxuICB9LFxuXG4gIC8qKlxuICAgKiBOZXcgdHJhcCB0aGF0IHJlaWZpZXMgW1tDb25zdHJ1Y3RdXS5cbiAgICogSWYgdGhlIHRhcmdldCBpcyBhIGZ1bmN0aW9uLCB0aGVuIGEgY2FsbCB0b1xuICAgKiAgIG5ldyBwcm94eSguLi5hcmdzKVxuICAgKiBUcmlnZ2VycyB0aGlzIHRyYXBcbiAgICovXG4gIGNvbnN0cnVjdDogZnVuY3Rpb24odGFyZ2V0LCBhcmdzLCBuZXdUYXJnZXQpIHtcbiAgICB2YXIgdHJhcCA9IHRoaXMuZ2V0VHJhcChcImNvbnN0cnVjdFwiKTtcbiAgICBpZiAodHJhcCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm4gUmVmbGVjdC5jb25zdHJ1Y3QodGFyZ2V0LCBhcmdzLCBuZXdUYXJnZXQpO1xuICAgIH1cblxuICAgIGlmICh0eXBlb2YgdGFyZ2V0ICE9PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJuZXc6IFwiKyB0YXJnZXQgKyBcIiBpcyBub3QgYSBmdW5jdGlvblwiKTtcbiAgICB9XG5cbiAgICBpZiAobmV3VGFyZ2V0ID09PSB1bmRlZmluZWQpIHtcbiAgICAgIG5ld1RhcmdldCA9IHRhcmdldDtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKHR5cGVvZiBuZXdUYXJnZXQgIT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwibmV3OiBcIisgbmV3VGFyZ2V0ICsgXCIgaXMgbm90IGEgZnVuY3Rpb25cIik7XG4gICAgICB9ICAgICAgXG4gICAgfVxuICAgIHJldHVybiB0cmFwLmNhbGwodGhpcy5oYW5kbGVyLCB0YXJnZXQsIGFyZ3MsIG5ld1RhcmdldCk7XG4gIH1cbn07XG5cbi8vIC0tLS0gZW5kIG9mIHRoZSBWYWxpZGF0b3IgaGFuZGxlciB3cmFwcGVyIGhhbmRsZXIgLS0tLVxuXG4vLyBJbiB3aGF0IGZvbGxvd3MsIGEgJ2RpcmVjdCBwcm94eScgaXMgYSBwcm94eVxuLy8gd2hvc2UgaGFuZGxlciBpcyBhIFZhbGlkYXRvci4gU3VjaCBwcm94aWVzIGNhbiBiZSBtYWRlIG5vbi1leHRlbnNpYmxlLFxuLy8gc2VhbGVkIG9yIGZyb3plbiB3aXRob3V0IGxvc2luZyB0aGUgYWJpbGl0eSB0byB0cmFwLlxuXG4vLyBtYXBzIGRpcmVjdCBwcm94aWVzIHRvIHRoZWlyIFZhbGlkYXRvciBoYW5kbGVyc1xudmFyIGRpcmVjdFByb3hpZXMgPSBuZXcgV2Vha01hcCgpO1xuXG4vLyBwYXRjaCBPYmplY3Que3ByZXZlbnRFeHRlbnNpb25zLHNlYWwsZnJlZXplfSBzbyB0aGF0XG4vLyB0aGV5IHJlY29nbml6ZSBmaXhhYmxlIHByb3hpZXMgYW5kIGFjdCBhY2NvcmRpbmdseVxuT2JqZWN0LnByZXZlbnRFeHRlbnNpb25zID0gZnVuY3Rpb24oc3ViamVjdCkge1xuICB2YXIgdmhhbmRsZXIgPSBkaXJlY3RQcm94aWVzLmdldChzdWJqZWN0KTtcbiAgaWYgKHZoYW5kbGVyICE9PSB1bmRlZmluZWQpIHtcbiAgICBpZiAodmhhbmRsZXIucHJldmVudEV4dGVuc2lvbnMoKSkge1xuICAgICAgcmV0dXJuIHN1YmplY3Q7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJwcmV2ZW50RXh0ZW5zaW9ucyBvbiBcIitzdWJqZWN0K1wiIHJlamVjdGVkXCIpO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gcHJpbV9wcmV2ZW50RXh0ZW5zaW9ucyhzdWJqZWN0KTtcbiAgfVxufTtcbk9iamVjdC5zZWFsID0gZnVuY3Rpb24oc3ViamVjdCkge1xuICBzZXRJbnRlZ3JpdHlMZXZlbChzdWJqZWN0LCBcInNlYWxlZFwiKTtcbiAgcmV0dXJuIHN1YmplY3Q7XG59O1xuT2JqZWN0LmZyZWV6ZSA9IGZ1bmN0aW9uKHN1YmplY3QpIHtcbiAgc2V0SW50ZWdyaXR5TGV2ZWwoc3ViamVjdCwgXCJmcm96ZW5cIik7XG4gIHJldHVybiBzdWJqZWN0O1xufTtcbk9iamVjdC5pc0V4dGVuc2libGUgPSBPYmplY3RfaXNFeHRlbnNpYmxlID0gZnVuY3Rpb24oc3ViamVjdCkge1xuICB2YXIgdkhhbmRsZXIgPSBkaXJlY3RQcm94aWVzLmdldChzdWJqZWN0KTtcbiAgaWYgKHZIYW5kbGVyICE9PSB1bmRlZmluZWQpIHtcbiAgICByZXR1cm4gdkhhbmRsZXIuaXNFeHRlbnNpYmxlKCk7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIHByaW1faXNFeHRlbnNpYmxlKHN1YmplY3QpO1xuICB9XG59O1xuT2JqZWN0LmlzU2VhbGVkID0gT2JqZWN0X2lzU2VhbGVkID0gZnVuY3Rpb24oc3ViamVjdCkge1xuICByZXR1cm4gdGVzdEludGVncml0eUxldmVsKHN1YmplY3QsIFwic2VhbGVkXCIpO1xufTtcbk9iamVjdC5pc0Zyb3plbiA9IE9iamVjdF9pc0Zyb3plbiA9IGZ1bmN0aW9uKHN1YmplY3QpIHtcbiAgcmV0dXJuIHRlc3RJbnRlZ3JpdHlMZXZlbChzdWJqZWN0LCBcImZyb3plblwiKTtcbn07XG5PYmplY3QuZ2V0UHJvdG90eXBlT2YgPSBPYmplY3RfZ2V0UHJvdG90eXBlT2YgPSBmdW5jdGlvbihzdWJqZWN0KSB7XG4gIHZhciB2SGFuZGxlciA9IGRpcmVjdFByb3hpZXMuZ2V0KHN1YmplY3QpO1xuICBpZiAodkhhbmRsZXIgIT09IHVuZGVmaW5lZCkge1xuICAgIHJldHVybiB2SGFuZGxlci5nZXRQcm90b3R5cGVPZigpO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBwcmltX2dldFByb3RvdHlwZU9mKHN1YmplY3QpO1xuICB9XG59O1xuXG4vLyBwYXRjaCBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yIHRvIGRpcmVjdGx5IGNhbGxcbi8vIHRoZSBWYWxpZGF0b3IucHJvdG90eXBlLmdldE93blByb3BlcnR5RGVzY3JpcHRvciB0cmFwXG4vLyBUaGlzIGlzIHRvIGNpcmN1bXZlbnQgYW4gYXNzZXJ0aW9uIGluIHRoZSBidWlsdC1pbiBQcm94eVxuLy8gdHJhcHBpbmcgbWVjaGFuaXNtIG9mIHY4LCB3aGljaCBkaXNhbGxvd3MgdGhhdCB0cmFwIHRvXG4vLyByZXR1cm4gbm9uLWNvbmZpZ3VyYWJsZSBwcm9wZXJ0eSBkZXNjcmlwdG9ycyAoYXMgcGVyIHRoZVxuLy8gb2xkIFByb3h5IGRlc2lnbilcbk9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IgPSBmdW5jdGlvbihzdWJqZWN0LCBuYW1lKSB7XG4gIHZhciB2aGFuZGxlciA9IGRpcmVjdFByb3hpZXMuZ2V0KHN1YmplY3QpO1xuICBpZiAodmhhbmRsZXIgIT09IHVuZGVmaW5lZCkge1xuICAgIHJldHVybiB2aGFuZGxlci5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IobmFtZSk7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIHByaW1fZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHN1YmplY3QsIG5hbWUpO1xuICB9XG59O1xuXG4vLyBwYXRjaCBPYmplY3QuZGVmaW5lUHJvcGVydHkgdG8gZGlyZWN0bHkgY2FsbFxuLy8gdGhlIFZhbGlkYXRvci5wcm90b3R5cGUuZGVmaW5lUHJvcGVydHkgdHJhcFxuLy8gVGhpcyBpcyB0byBjaXJjdW12ZW50IHR3byBpc3N1ZXMgd2l0aCB0aGUgYnVpbHQtaW5cbi8vIHRyYXAgbWVjaGFuaXNtOlxuLy8gMSkgdGhlIGN1cnJlbnQgdHJhY2Vtb25rZXkgaW1wbGVtZW50YXRpb24gb2YgcHJveGllc1xuLy8gYXV0by1jb21wbGV0ZXMgJ2Rlc2MnLCB3aGljaCBpcyBub3QgY29ycmVjdC4gJ2Rlc2MnIHNob3VsZCBiZVxuLy8gbm9ybWFsaXplZCwgYnV0IG5vdCBjb21wbGV0ZWQuIENvbnNpZGVyOlxuLy8gT2JqZWN0LmRlZmluZVByb3BlcnR5KHByb3h5LCAnZm9vJywge2VudW1lcmFibGU6ZmFsc2V9KVxuLy8gVGhpcyB0cmFwIHdpbGwgcmVjZWl2ZSBkZXNjID1cbi8vICB7dmFsdWU6dW5kZWZpbmVkLHdyaXRhYmxlOmZhbHNlLGVudW1lcmFibGU6ZmFsc2UsY29uZmlndXJhYmxlOmZhbHNlfVxuLy8gVGhpcyB3aWxsIGFsc28gc2V0IGFsbCBvdGhlciBhdHRyaWJ1dGVzIHRvIHRoZWlyIGRlZmF1bHQgdmFsdWUsXG4vLyB3aGljaCBpcyB1bmV4cGVjdGVkIGFuZCBkaWZmZXJlbnQgZnJvbSBbW0RlZmluZU93blByb3BlcnR5XV0uXG4vLyBCdWcgZmlsZWQ6IGh0dHBzOi8vYnVnemlsbGEubW96aWxsYS5vcmcvc2hvd19idWcuY2dpP2lkPTYwMTMyOVxuLy8gMikgdGhlIGN1cnJlbnQgc3BpZGVybW9ua2V5IGltcGxlbWVudGF0aW9uIGRvZXMgbm90XG4vLyB0aHJvdyBhbiBleGNlcHRpb24gd2hlbiB0aGlzIHRyYXAgcmV0dXJucyAnZmFsc2UnLCBidXQgaW5zdGVhZCBzaWxlbnRseVxuLy8gaWdub3JlcyB0aGUgb3BlcmF0aW9uICh0aGlzIGlzIHJlZ2FyZGxlc3Mgb2Ygc3RyaWN0LW1vZGUpXG4vLyAyYSkgdjggZG9lcyB0aHJvdyBhbiBleGNlcHRpb24gZm9yIHRoaXMgY2FzZSwgYnV0IGluY2x1ZGVzIHRoZSByYXRoZXJcbi8vICAgICB1bmhlbHBmdWwgZXJyb3IgbWVzc2FnZTpcbi8vICdQcm94eSBoYW5kbGVyICM8T2JqZWN0PiByZXR1cm5lZCBmYWxzZSBmcm9tICdkZWZpbmVQcm9wZXJ0eScgdHJhcCdcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eSA9IGZ1bmN0aW9uKHN1YmplY3QsIG5hbWUsIGRlc2MpIHtcbiAgdmFyIHZoYW5kbGVyID0gZGlyZWN0UHJveGllcy5nZXQoc3ViamVjdCk7XG4gIGlmICh2aGFuZGxlciAhPT0gdW5kZWZpbmVkKSB7XG4gICAgdmFyIG5vcm1hbGl6ZWREZXNjID0gbm9ybWFsaXplUHJvcGVydHlEZXNjcmlwdG9yKGRlc2MpO1xuICAgIHZhciBzdWNjZXNzID0gdmhhbmRsZXIuZGVmaW5lUHJvcGVydHkobmFtZSwgbm9ybWFsaXplZERlc2MpO1xuICAgIGlmIChzdWNjZXNzID09PSBmYWxzZSkge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcImNhbid0IHJlZGVmaW5lIHByb3BlcnR5ICdcIituYW1lK1wiJ1wiKTtcbiAgICB9XG4gICAgcmV0dXJuIHN1YmplY3Q7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIHByaW1fZGVmaW5lUHJvcGVydHkoc3ViamVjdCwgbmFtZSwgZGVzYyk7XG4gIH1cbn07XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzID0gZnVuY3Rpb24oc3ViamVjdCwgZGVzY3MpIHtcbiAgdmFyIHZoYW5kbGVyID0gZGlyZWN0UHJveGllcy5nZXQoc3ViamVjdCk7XG4gIGlmICh2aGFuZGxlciAhPT0gdW5kZWZpbmVkKSB7XG4gICAgdmFyIG5hbWVzID0gT2JqZWN0LmtleXMoZGVzY3MpO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbmFtZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBuYW1lID0gbmFtZXNbaV07XG4gICAgICB2YXIgbm9ybWFsaXplZERlc2MgPSBub3JtYWxpemVQcm9wZXJ0eURlc2NyaXB0b3IoZGVzY3NbbmFtZV0pO1xuICAgICAgdmFyIHN1Y2Nlc3MgPSB2aGFuZGxlci5kZWZpbmVQcm9wZXJ0eShuYW1lLCBub3JtYWxpemVkRGVzYyk7XG4gICAgICBpZiAoc3VjY2VzcyA9PT0gZmFsc2UpIHtcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcImNhbid0IHJlZGVmaW5lIHByb3BlcnR5ICdcIituYW1lK1wiJ1wiKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHN1YmplY3Q7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIHByaW1fZGVmaW5lUHJvcGVydGllcyhzdWJqZWN0LCBkZXNjcyk7XG4gIH1cbn07XG5cbk9iamVjdC5rZXlzID0gZnVuY3Rpb24oc3ViamVjdCkge1xuICB2YXIgdkhhbmRsZXIgPSBkaXJlY3RQcm94aWVzLmdldChzdWJqZWN0KTtcbiAgaWYgKHZIYW5kbGVyICE9PSB1bmRlZmluZWQpIHtcbiAgICB2YXIgb3duS2V5cyA9IHZIYW5kbGVyLm93bktleXMoKTtcbiAgICB2YXIgcmVzdWx0ID0gW107XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBvd25LZXlzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgayA9IFN0cmluZyhvd25LZXlzW2ldKTtcbiAgICAgIHZhciBkZXNjID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihzdWJqZWN0LCBrKTtcbiAgICAgIGlmIChkZXNjICE9PSB1bmRlZmluZWQgJiYgZGVzYy5lbnVtZXJhYmxlID09PSB0cnVlKSB7XG4gICAgICAgIHJlc3VsdC5wdXNoKGspO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBwcmltX2tleXMoc3ViamVjdCk7XG4gIH1cbn1cblxuT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMgPSBPYmplY3RfZ2V0T3duUHJvcGVydHlOYW1lcyA9IGZ1bmN0aW9uKHN1YmplY3QpIHtcbiAgdmFyIHZIYW5kbGVyID0gZGlyZWN0UHJveGllcy5nZXQoc3ViamVjdCk7XG4gIGlmICh2SGFuZGxlciAhPT0gdW5kZWZpbmVkKSB7XG4gICAgcmV0dXJuIHZIYW5kbGVyLm93bktleXMoKTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gcHJpbV9nZXRPd25Qcm9wZXJ0eU5hbWVzKHN1YmplY3QpO1xuICB9XG59XG5cbi8vIGZpeGVzIGlzc3VlICM3MSAoQ2FsbGluZyBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzKCkgb24gYSBQcm94eVxuLy8gdGhyb3dzIGFuIGVycm9yKVxuaWYgKHByaW1fZ2V0T3duUHJvcGVydHlTeW1ib2xzICE9PSB1bmRlZmluZWQpIHtcbiAgT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyA9IGZ1bmN0aW9uKHN1YmplY3QpIHtcbiAgICB2YXIgdkhhbmRsZXIgPSBkaXJlY3RQcm94aWVzLmdldChzdWJqZWN0KTtcbiAgICBpZiAodkhhbmRsZXIgIT09IHVuZGVmaW5lZCkge1xuICAgICAgLy8gYXMgdGhpcyBzaGltIGRvZXMgbm90IHN1cHBvcnQgc3ltYm9scywgYSBQcm94eSBuZXZlciBhZHZlcnRpc2VzXG4gICAgICAvLyBhbnkgc3ltYm9sLXZhbHVlZCBvd24gcHJvcGVydGllc1xuICAgICAgcmV0dXJuIFtdO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gcHJpbV9nZXRPd25Qcm9wZXJ0eVN5bWJvbHMoc3ViamVjdCk7XG4gICAgfVxuICB9O1xufVxuXG4vLyBmaXhlcyBpc3N1ZSAjNzIgKCdJbGxlZ2FsIGFjY2VzcycgZXJyb3Igd2hlbiB1c2luZyBPYmplY3QuYXNzaWduKVxuLy8gT2JqZWN0LmFzc2lnbiBwb2x5ZmlsbCBiYXNlZCBvbiBhIHBvbHlmaWxsIHBvc3RlZCBvbiBNRE46IFxuLy8gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvSmF2YVNjcmlwdC9SZWZlcmVuY2UvXFxcbi8vICBHbG9iYWxfT2JqZWN0cy9PYmplY3QvYXNzaWduXG4vLyBOb3RlIHRoYXQgdGhpcyBwb2x5ZmlsbCBkb2VzIG5vdCBzdXBwb3J0IFN5bWJvbHMsIGJ1dCB0aGlzIFByb3h5IFNoaW1cbi8vIGRvZXMgbm90IHN1cHBvcnQgU3ltYm9scyBhbnl3YXkuXG5pZiAocHJpbV9hc3NpZ24gIT09IHVuZGVmaW5lZCkge1xuICBPYmplY3QuYXNzaWduID0gZnVuY3Rpb24gKHRhcmdldCkge1xuICAgIFxuICAgIC8vIGNoZWNrIGlmIGFueSBhcmd1bWVudCBpcyBhIHByb3h5IG9iamVjdFxuICAgIHZhciBub1Byb3hpZXMgPSB0cnVlO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgdkhhbmRsZXIgPSBkaXJlY3RQcm94aWVzLmdldChhcmd1bWVudHNbaV0pO1xuICAgICAgaWYgKHZIYW5kbGVyICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgbm9Qcm94aWVzID0gZmFsc2U7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAobm9Qcm94aWVzKSB7XG4gICAgICAvLyBub3QgYSBzaW5nbGUgYXJndW1lbnQgaXMgYSBwcm94eSwgcGVyZm9ybSBidWlsdC1pbiBhbGdvcml0aG1cbiAgICAgIHJldHVybiBwcmltX2Fzc2lnbi5hcHBseShPYmplY3QsIGFyZ3VtZW50cyk7XG4gICAgfVxuICAgIFxuICAgIC8vIHRoZXJlIGlzIGF0IGxlYXN0IG9uZSBwcm94eSBhcmd1bWVudCwgdXNlIHRoZSBwb2x5ZmlsbFxuICAgIFxuICAgIGlmICh0YXJnZXQgPT09IHVuZGVmaW5lZCB8fCB0YXJnZXQgPT09IG51bGwpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0Nhbm5vdCBjb252ZXJ0IHVuZGVmaW5lZCBvciBudWxsIHRvIG9iamVjdCcpO1xuICAgIH1cblxuICAgIHZhciBvdXRwdXQgPSBPYmplY3QodGFyZ2V0KTtcbiAgICBmb3IgKHZhciBpbmRleCA9IDE7IGluZGV4IDwgYXJndW1lbnRzLmxlbmd0aDsgaW5kZXgrKykge1xuICAgICAgdmFyIHNvdXJjZSA9IGFyZ3VtZW50c1tpbmRleF07XG4gICAgICBpZiAoc291cmNlICE9PSB1bmRlZmluZWQgJiYgc291cmNlICE9PSBudWxsKSB7XG4gICAgICAgIGZvciAodmFyIG5leHRLZXkgaW4gc291cmNlKSB7XG4gICAgICAgICAgaWYgKHNvdXJjZS5oYXNPd25Qcm9wZXJ0eShuZXh0S2V5KSkge1xuICAgICAgICAgICAgb3V0cHV0W25leHRLZXldID0gc291cmNlW25leHRLZXldO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gb3V0cHV0O1xuICB9O1xufVxuXG4vLyByZXR1cm5zIHdoZXRoZXIgYW4gYXJndW1lbnQgaXMgYSByZWZlcmVuY2UgdG8gYW4gb2JqZWN0LFxuLy8gd2hpY2ggaXMgbGVnYWwgYXMgYSBXZWFrTWFwIGtleS5cbmZ1bmN0aW9uIGlzT2JqZWN0KGFyZykge1xuICB2YXIgdHlwZSA9IHR5cGVvZiBhcmc7XG4gIHJldHVybiAodHlwZSA9PT0gJ29iamVjdCcgJiYgYXJnICE9PSBudWxsKSB8fCAodHlwZSA9PT0gJ2Z1bmN0aW9uJyk7XG59O1xuXG4vLyBhIHdyYXBwZXIgZm9yIFdlYWtNYXAuZ2V0IHdoaWNoIHJldHVybnMgdGhlIHVuZGVmaW5lZCB2YWx1ZVxuLy8gZm9yIGtleXMgdGhhdCBhcmUgbm90IG9iamVjdHMgKGluIHdoaWNoIGNhc2UgdGhlIHVuZGVybHlpbmdcbi8vIFdlYWtNYXAgd291bGQgaGF2ZSB0aHJvd24gYSBUeXBlRXJyb3IpLlxuZnVuY3Rpb24gc2FmZVdlYWtNYXBHZXQobWFwLCBrZXkpIHtcbiAgcmV0dXJuIGlzT2JqZWN0KGtleSkgPyBtYXAuZ2V0KGtleSkgOiB1bmRlZmluZWQ7XG59O1xuXG4vLyByZXR1cm5zIGEgbmV3IGZ1bmN0aW9uIG9mIHplcm8gYXJndW1lbnRzIHRoYXQgcmVjdXJzaXZlbHlcbi8vIHVud3JhcHMgYW55IHByb3hpZXMgc3BlY2lmaWVkIGFzIHRoZSB8dGhpc3wtdmFsdWUuXG4vLyBUaGUgcHJpbWl0aXZlIGlzIGFzc3VtZWQgdG8gYmUgYSB6ZXJvLWFyZ3VtZW50IG1ldGhvZFxuLy8gdGhhdCB1c2VzIGl0cyB8dGhpc3wtYmluZGluZy5cbmZ1bmN0aW9uIG1ha2VVbndyYXBwaW5nMEFyZ01ldGhvZChwcmltaXRpdmUpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIGJ1aWx0aW4oKSB7XG4gICAgdmFyIHZIYW5kbGVyID0gc2FmZVdlYWtNYXBHZXQoZGlyZWN0UHJveGllcywgdGhpcyk7XG4gICAgaWYgKHZIYW5kbGVyICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybiBidWlsdGluLmNhbGwodkhhbmRsZXIudGFyZ2V0KTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHByaW1pdGl2ZS5jYWxsKHRoaXMpO1xuICAgIH1cbiAgfVxufTtcblxuLy8gcmV0dXJucyBhIG5ldyBmdW5jdGlvbiBvZiAxIGFyZ3VtZW50cyB0aGF0IHJlY3Vyc2l2ZWx5XG4vLyB1bndyYXBzIGFueSBwcm94aWVzIHNwZWNpZmllZCBhcyB0aGUgfHRoaXN8LXZhbHVlLlxuLy8gVGhlIHByaW1pdGl2ZSBpcyBhc3N1bWVkIHRvIGJlIGEgMS1hcmd1bWVudCBtZXRob2Rcbi8vIHRoYXQgdXNlcyBpdHMgfHRoaXN8LWJpbmRpbmcuXG5mdW5jdGlvbiBtYWtlVW53cmFwcGluZzFBcmdNZXRob2QocHJpbWl0aXZlKSB7XG4gIHJldHVybiBmdW5jdGlvbiBidWlsdGluKGFyZykge1xuICAgIHZhciB2SGFuZGxlciA9IHNhZmVXZWFrTWFwR2V0KGRpcmVjdFByb3hpZXMsIHRoaXMpO1xuICAgIGlmICh2SGFuZGxlciAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm4gYnVpbHRpbi5jYWxsKHZIYW5kbGVyLnRhcmdldCwgYXJnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHByaW1pdGl2ZS5jYWxsKHRoaXMsIGFyZyk7XG4gICAgfVxuICB9XG59O1xuXG5PYmplY3QucHJvdG90eXBlLnZhbHVlT2YgPVxuICBtYWtlVW53cmFwcGluZzBBcmdNZXRob2QoT2JqZWN0LnByb3RvdHlwZS52YWx1ZU9mKTtcbk9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcgPVxuICBtYWtlVW53cmFwcGluZzBBcmdNZXRob2QoT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZyk7XG5GdW5jdGlvbi5wcm90b3R5cGUudG9TdHJpbmcgPVxuICBtYWtlVW53cmFwcGluZzBBcmdNZXRob2QoRnVuY3Rpb24ucHJvdG90eXBlLnRvU3RyaW5nKTtcbkRhdGUucHJvdG90eXBlLnRvU3RyaW5nID1cbiAgbWFrZVVud3JhcHBpbmcwQXJnTWV0aG9kKERhdGUucHJvdG90eXBlLnRvU3RyaW5nKTtcblxuT2JqZWN0LnByb3RvdHlwZS5pc1Byb3RvdHlwZU9mID0gZnVuY3Rpb24gYnVpbHRpbihhcmcpIHtcbiAgLy8gYnVnZml4IHRoYW5rcyB0byBCaWxsIE1hcms6XG4gIC8vIGJ1aWx0LWluIGlzUHJvdG90eXBlT2YgZG9lcyBub3QgdW53cmFwIHByb3hpZXMgdXNlZFxuICAvLyBhcyBhcmd1bWVudHMuIFNvLCB3ZSBpbXBsZW1lbnQgdGhlIGJ1aWx0aW4gb3Vyc2VsdmVzLFxuICAvLyBiYXNlZCBvbiB0aGUgRUNNQVNjcmlwdCA2IHNwZWMuIE91ciBlbmNvZGluZyB3aWxsXG4gIC8vIG1ha2Ugc3VyZSB0aGF0IGlmIGEgcHJveHkgaXMgdXNlZCBhcyBhbiBhcmd1bWVudCxcbiAgLy8gaXRzIGdldFByb3RvdHlwZU9mIHRyYXAgd2lsbCBiZSBjYWxsZWQuXG4gIHdoaWxlICh0cnVlKSB7XG4gICAgdmFyIHZIYW5kbGVyMiA9IHNhZmVXZWFrTWFwR2V0KGRpcmVjdFByb3hpZXMsIGFyZyk7XG4gICAgaWYgKHZIYW5kbGVyMiAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBhcmcgPSB2SGFuZGxlcjIuZ2V0UHJvdG90eXBlT2YoKTtcbiAgICAgIGlmIChhcmcgPT09IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfSBlbHNlIGlmIChzYW1lVmFsdWUoYXJnLCB0aGlzKSkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHByaW1faXNQcm90b3R5cGVPZi5jYWxsKHRoaXMsIGFyZyk7XG4gICAgfVxuICB9XG59O1xuXG5BcnJheS5pc0FycmF5ID0gZnVuY3Rpb24oc3ViamVjdCkge1xuICB2YXIgdkhhbmRsZXIgPSBzYWZlV2Vha01hcEdldChkaXJlY3RQcm94aWVzLCBzdWJqZWN0KTtcbiAgaWYgKHZIYW5kbGVyICE9PSB1bmRlZmluZWQpIHtcbiAgICByZXR1cm4gQXJyYXkuaXNBcnJheSh2SGFuZGxlci50YXJnZXQpO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBwcmltX2lzQXJyYXkoc3ViamVjdCk7XG4gIH1cbn07XG5cbmZ1bmN0aW9uIGlzUHJveHlBcnJheShhcmcpIHtcbiAgdmFyIHZIYW5kbGVyID0gc2FmZVdlYWtNYXBHZXQoZGlyZWN0UHJveGllcywgYXJnKTtcbiAgaWYgKHZIYW5kbGVyICE9PSB1bmRlZmluZWQpIHtcbiAgICByZXR1cm4gQXJyYXkuaXNBcnJheSh2SGFuZGxlci50YXJnZXQpO1xuICB9XG4gIHJldHVybiBmYWxzZTtcbn1cblxuLy8gQXJyYXkucHJvdG90eXBlLmNvbmNhdCBpbnRlcm5hbGx5IHRlc3RzIHdoZXRoZXIgb25lIG9mIGl0c1xuLy8gYXJndW1lbnRzIGlzIGFuIEFycmF5LCBieSBjaGVja2luZyB3aGV0aGVyIFtbQ2xhc3NdXSA9PSBcIkFycmF5XCJcbi8vIEFzIHN1Y2gsIGl0IHdpbGwgZmFpbCB0byByZWNvZ25pemUgcHJveGllcy1mb3ItYXJyYXlzIGFzIGFycmF5cy5cbi8vIFdlIHBhdGNoIEFycmF5LnByb3RvdHlwZS5jb25jYXQgc28gdGhhdCBpdCBcInVud3JhcHNcIiBwcm94aWVzLWZvci1hcnJheXNcbi8vIGJ5IG1ha2luZyBhIGNvcHkuIFRoaXMgd2lsbCB0cmlnZ2VyIHRoZSBleGFjdCBzYW1lIHNlcXVlbmNlIG9mXG4vLyB0cmFwcyBvbiB0aGUgcHJveHktZm9yLWFycmF5IGFzIGlmIHdlIHdvdWxkIG5vdCBoYXZlIHVud3JhcHBlZCBpdC5cbi8vIFNlZSA8aHR0cHM6Ly9naXRodWIuY29tL3R2Y3V0c2VtL2hhcm1vbnktcmVmbGVjdC9pc3N1ZXMvMTk+IGZvciBtb3JlLlxuQXJyYXkucHJvdG90eXBlLmNvbmNhdCA9IGZ1bmN0aW9uKC8qLi4uYXJncyovKSB7XG4gIHZhciBsZW5ndGg7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKGlzUHJveHlBcnJheShhcmd1bWVudHNbaV0pKSB7XG4gICAgICBsZW5ndGggPSBhcmd1bWVudHNbaV0ubGVuZ3RoO1xuICAgICAgYXJndW1lbnRzW2ldID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzW2ldLCAwLCBsZW5ndGgpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcHJpbV9jb25jYXQuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbn07XG5cbi8vIHNldFByb3RvdHlwZU9mIHN1cHBvcnQgb24gcGxhdGZvcm1zIHRoYXQgc3VwcG9ydCBfX3Byb3RvX19cblxudmFyIHByaW1fc2V0UHJvdG90eXBlT2YgPSBPYmplY3Quc2V0UHJvdG90eXBlT2Y7XG5cbi8vIHBhdGNoIGFuZCBleHRyYWN0IG9yaWdpbmFsIF9fcHJvdG9fXyBzZXR0ZXJcbnZhciBfX3Byb3RvX19zZXR0ZXIgPSAoZnVuY3Rpb24oKSB7XG4gIHZhciBwcm90b0Rlc2MgPSBwcmltX2dldE93blByb3BlcnR5RGVzY3JpcHRvcihPYmplY3QucHJvdG90eXBlLCdfX3Byb3RvX18nKTtcbiAgaWYgKHByb3RvRGVzYyA9PT0gdW5kZWZpbmVkIHx8XG4gICAgICB0eXBlb2YgcHJvdG9EZXNjLnNldCAhPT0gXCJmdW5jdGlvblwiKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcInNldFByb3RvdHlwZU9mIG5vdCBzdXBwb3J0ZWQgb24gdGhpcyBwbGF0Zm9ybVwiKTtcbiAgICB9XG4gIH1cblxuICAvLyBzZWUgaWYgd2UgY2FuIGFjdHVhbGx5IG11dGF0ZSBhIHByb3RvdHlwZSB3aXRoIHRoZSBnZW5lcmljIHNldHRlclxuICAvLyAoZS5nLiBDaHJvbWUgdjI4IGRvZXNuJ3QgYWxsb3cgc2V0dGluZyBfX3Byb3RvX18gdmlhIHRoZSBnZW5lcmljIHNldHRlcilcbiAgdHJ5IHtcbiAgICBwcm90b0Rlc2Muc2V0LmNhbGwoe30se30pO1xuICB9IGNhdGNoIChlKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcInNldFByb3RvdHlwZU9mIG5vdCBzdXBwb3J0ZWQgb24gdGhpcyBwbGF0Zm9ybVwiKTtcbiAgICB9XG4gIH1cblxuICBwcmltX2RlZmluZVByb3BlcnR5KE9iamVjdC5wcm90b3R5cGUsICdfX3Byb3RvX18nLCB7XG4gICAgc2V0OiBmdW5jdGlvbihuZXdQcm90bykge1xuICAgICAgcmV0dXJuIE9iamVjdC5zZXRQcm90b3R5cGVPZih0aGlzLCBPYmplY3QobmV3UHJvdG8pKTtcbiAgICB9XG4gIH0pO1xuXG4gIHJldHVybiBwcm90b0Rlc2Muc2V0O1xufSgpKTtcblxuT2JqZWN0LnNldFByb3RvdHlwZU9mID0gZnVuY3Rpb24odGFyZ2V0LCBuZXdQcm90bykge1xuICB2YXIgaGFuZGxlciA9IGRpcmVjdFByb3hpZXMuZ2V0KHRhcmdldCk7XG4gIGlmIChoYW5kbGVyICE9PSB1bmRlZmluZWQpIHtcbiAgICBpZiAoaGFuZGxlci5zZXRQcm90b3R5cGVPZihuZXdQcm90bykpIHtcbiAgICAgIHJldHVybiB0YXJnZXQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJwcm94eSByZWplY3RlZCBwcm90b3R5cGUgbXV0YXRpb25cIik7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGlmICghT2JqZWN0X2lzRXh0ZW5zaWJsZSh0YXJnZXQpKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiY2FuJ3Qgc2V0IHByb3RvdHlwZSBvbiBub24tZXh0ZW5zaWJsZSBvYmplY3Q6IFwiICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0KTtcbiAgICB9XG4gICAgaWYgKHByaW1fc2V0UHJvdG90eXBlT2YpXG4gICAgICByZXR1cm4gcHJpbV9zZXRQcm90b3R5cGVPZih0YXJnZXQsIG5ld1Byb3RvKTtcblxuICAgIGlmIChPYmplY3QobmV3UHJvdG8pICE9PSBuZXdQcm90byB8fCBuZXdQcm90byA9PT0gbnVsbCkge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIk9iamVjdCBwcm90b3R5cGUgbWF5IG9ubHkgYmUgYW4gT2JqZWN0IG9yIG51bGw6IFwiICtcbiAgICAgICAgICAgICAgICAgICAgICAgICBuZXdQcm90byk7XG4gICAgICAvLyB0aHJvdyBuZXcgVHlwZUVycm9yKFwicHJvdG90eXBlIG11c3QgYmUgYW4gb2JqZWN0IG9yIG51bGxcIilcbiAgICB9XG4gICAgX19wcm90b19fc2V0dGVyLmNhbGwodGFyZ2V0LCBuZXdQcm90byk7XG4gICAgcmV0dXJuIHRhcmdldDtcbiAgfVxufVxuXG5PYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5ID0gZnVuY3Rpb24obmFtZSkge1xuICB2YXIgaGFuZGxlciA9IHNhZmVXZWFrTWFwR2V0KGRpcmVjdFByb3hpZXMsIHRoaXMpO1xuICBpZiAoaGFuZGxlciAhPT0gdW5kZWZpbmVkKSB7XG4gICAgdmFyIGRlc2MgPSBoYW5kbGVyLmdldE93blByb3BlcnR5RGVzY3JpcHRvcihuYW1lKTtcbiAgICByZXR1cm4gZGVzYyAhPT0gdW5kZWZpbmVkO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBwcmltX2hhc093blByb3BlcnR5LmNhbGwodGhpcywgbmFtZSk7XG4gIH1cbn1cblxuLy8gPT09PT09PT09PT09PSBSZWZsZWN0aW9uIG1vZHVsZSA9PT09PT09PT09PT09XG4vLyBzZWUgaHR0cDovL3dpa2kuZWNtYXNjcmlwdC5vcmcvZG9rdS5waHA/aWQ9aGFybW9ueTpyZWZsZWN0X2FwaVxuXG52YXIgUmVmbGVjdCA9IGdsb2JhbC5SZWZsZWN0ID0ge1xuICBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3I6IGZ1bmN0aW9uKHRhcmdldCwgbmFtZSkge1xuICAgIHJldHVybiBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHRhcmdldCwgbmFtZSk7XG4gIH0sXG4gIGRlZmluZVByb3BlcnR5OiBmdW5jdGlvbih0YXJnZXQsIG5hbWUsIGRlc2MpIHtcblxuICAgIC8vIGlmIHRhcmdldCBpcyBhIHByb3h5LCBpbnZva2UgaXRzIFwiZGVmaW5lUHJvcGVydHlcIiB0cmFwXG4gICAgdmFyIGhhbmRsZXIgPSBkaXJlY3RQcm94aWVzLmdldCh0YXJnZXQpO1xuICAgIGlmIChoYW5kbGVyICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybiBoYW5kbGVyLmRlZmluZVByb3BlcnR5KHRhcmdldCwgbmFtZSwgZGVzYyk7XG4gICAgfVxuXG4gICAgLy8gSW1wbGVtZW50YXRpb24gdHJhbnNsaXRlcmF0ZWQgZnJvbSBbW0RlZmluZU93blByb3BlcnR5XV1cbiAgICAvLyBzZWUgRVM1LjEgc2VjdGlvbiA4LjEyLjlcbiAgICAvLyB0aGlzIGlzIHRoZSBfZXhhY3Qgc2FtZSBhbGdvcml0aG1fIGFzIHRoZSBpc0NvbXBhdGlibGVEZXNjcmlwdG9yXG4gICAgLy8gYWxnb3JpdGhtIGRlZmluZWQgYWJvdmUsIGV4Y2VwdCB0aGF0IGF0IGV2ZXJ5IHBsYWNlIGl0XG4gICAgLy8gcmV0dXJucyB0cnVlLCB0aGlzIGFsZ29yaXRobSBhY3R1YWxseSBkb2VzIGRlZmluZSB0aGUgcHJvcGVydHkuXG4gICAgdmFyIGN1cnJlbnQgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHRhcmdldCwgbmFtZSk7XG4gICAgdmFyIGV4dGVuc2libGUgPSBPYmplY3QuaXNFeHRlbnNpYmxlKHRhcmdldCk7XG4gICAgaWYgKGN1cnJlbnQgPT09IHVuZGVmaW5lZCAmJiBleHRlbnNpYmxlID09PSBmYWxzZSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBpZiAoY3VycmVudCA9PT0gdW5kZWZpbmVkICYmIGV4dGVuc2libGUgPT09IHRydWUpIHtcbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIG5hbWUsIGRlc2MpOyAvLyBzaG91bGQgbmV2ZXIgZmFpbFxuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIGlmIChpc0VtcHR5RGVzY3JpcHRvcihkZXNjKSkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIGlmIChpc0VxdWl2YWxlbnREZXNjcmlwdG9yKGN1cnJlbnQsIGRlc2MpKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgaWYgKGN1cnJlbnQuY29uZmlndXJhYmxlID09PSBmYWxzZSkge1xuICAgICAgaWYgKGRlc2MuY29uZmlndXJhYmxlID09PSB0cnVlKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICAgIGlmICgnZW51bWVyYWJsZScgaW4gZGVzYyAmJiBkZXNjLmVudW1lcmFibGUgIT09IGN1cnJlbnQuZW51bWVyYWJsZSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChpc0dlbmVyaWNEZXNjcmlwdG9yKGRlc2MpKSB7XG4gICAgICAvLyBubyBmdXJ0aGVyIHZhbGlkYXRpb24gbmVjZXNzYXJ5XG4gICAgfSBlbHNlIGlmIChpc0RhdGFEZXNjcmlwdG9yKGN1cnJlbnQpICE9PSBpc0RhdGFEZXNjcmlwdG9yKGRlc2MpKSB7XG4gICAgICBpZiAoY3VycmVudC5jb25maWd1cmFibGUgPT09IGZhbHNlKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGlzRGF0YURlc2NyaXB0b3IoY3VycmVudCkgJiYgaXNEYXRhRGVzY3JpcHRvcihkZXNjKSkge1xuICAgICAgaWYgKGN1cnJlbnQuY29uZmlndXJhYmxlID09PSBmYWxzZSkge1xuICAgICAgICBpZiAoY3VycmVudC53cml0YWJsZSA9PT0gZmFsc2UgJiYgZGVzYy53cml0YWJsZSA9PT0gdHJ1ZSkge1xuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoY3VycmVudC53cml0YWJsZSA9PT0gZmFsc2UpIHtcbiAgICAgICAgICBpZiAoJ3ZhbHVlJyBpbiBkZXNjICYmICFzYW1lVmFsdWUoZGVzYy52YWx1ZSwgY3VycmVudC52YWx1ZSkpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGlzQWNjZXNzb3JEZXNjcmlwdG9yKGN1cnJlbnQpICYmIGlzQWNjZXNzb3JEZXNjcmlwdG9yKGRlc2MpKSB7XG4gICAgICBpZiAoY3VycmVudC5jb25maWd1cmFibGUgPT09IGZhbHNlKSB7XG4gICAgICAgIGlmICgnc2V0JyBpbiBkZXNjICYmICFzYW1lVmFsdWUoZGVzYy5zZXQsIGN1cnJlbnQuc2V0KSkge1xuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoJ2dldCcgaW4gZGVzYyAmJiAhc2FtZVZhbHVlKGRlc2MuZ2V0LCBjdXJyZW50LmdldCkpIHtcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwgbmFtZSwgZGVzYyk7IC8vIHNob3VsZCBuZXZlciBmYWlsXG4gICAgcmV0dXJuIHRydWU7XG4gIH0sXG4gIGRlbGV0ZVByb3BlcnR5OiBmdW5jdGlvbih0YXJnZXQsIG5hbWUpIHtcbiAgICB2YXIgaGFuZGxlciA9IGRpcmVjdFByb3hpZXMuZ2V0KHRhcmdldCk7XG4gICAgaWYgKGhhbmRsZXIgIT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuIGhhbmRsZXIuZGVsZXRlKG5hbWUpO1xuICAgIH1cbiAgICBcbiAgICB2YXIgZGVzYyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodGFyZ2V0LCBuYW1lKTtcbiAgICBpZiAoZGVzYyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgaWYgKGRlc2MuY29uZmlndXJhYmxlID09PSB0cnVlKSB7XG4gICAgICBkZWxldGUgdGFyZ2V0W25hbWVdO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTsgICAgXG4gIH0sXG4gIGdldFByb3RvdHlwZU9mOiBmdW5jdGlvbih0YXJnZXQpIHtcbiAgICByZXR1cm4gT2JqZWN0LmdldFByb3RvdHlwZU9mKHRhcmdldCk7XG4gIH0sXG4gIHNldFByb3RvdHlwZU9mOiBmdW5jdGlvbih0YXJnZXQsIG5ld1Byb3RvKSB7XG4gICAgXG4gICAgdmFyIGhhbmRsZXIgPSBkaXJlY3RQcm94aWVzLmdldCh0YXJnZXQpO1xuICAgIGlmIChoYW5kbGVyICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybiBoYW5kbGVyLnNldFByb3RvdHlwZU9mKG5ld1Byb3RvKTtcbiAgICB9XG4gICAgXG4gICAgaWYgKE9iamVjdChuZXdQcm90bykgIT09IG5ld1Byb3RvIHx8IG5ld1Byb3RvID09PSBudWxsKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiT2JqZWN0IHByb3RvdHlwZSBtYXkgb25seSBiZSBhbiBPYmplY3Qgb3IgbnVsbDogXCIgK1xuICAgICAgICAgICAgICAgICAgICAgICAgIG5ld1Byb3RvKTtcbiAgICB9XG4gICAgXG4gICAgaWYgKCFPYmplY3RfaXNFeHRlbnNpYmxlKHRhcmdldCkpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgXG4gICAgdmFyIGN1cnJlbnQgPSBPYmplY3QuZ2V0UHJvdG90eXBlT2YodGFyZ2V0KTtcbiAgICBpZiAoc2FtZVZhbHVlKGN1cnJlbnQsIG5ld1Byb3RvKSkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIFxuICAgIGlmIChwcmltX3NldFByb3RvdHlwZU9mKSB7XG4gICAgICB0cnkge1xuICAgICAgICBwcmltX3NldFByb3RvdHlwZU9mKHRhcmdldCwgbmV3UHJvdG8pO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH1cblxuICAgIF9fcHJvdG9fX3NldHRlci5jYWxsKHRhcmdldCwgbmV3UHJvdG8pO1xuICAgIHJldHVybiB0cnVlO1xuICB9LFxuICBwcmV2ZW50RXh0ZW5zaW9uczogZnVuY3Rpb24odGFyZ2V0KSB7XG4gICAgdmFyIGhhbmRsZXIgPSBkaXJlY3RQcm94aWVzLmdldCh0YXJnZXQpO1xuICAgIGlmIChoYW5kbGVyICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybiBoYW5kbGVyLnByZXZlbnRFeHRlbnNpb25zKCk7XG4gICAgfVxuICAgIHByaW1fcHJldmVudEV4dGVuc2lvbnModGFyZ2V0KTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfSxcbiAgaXNFeHRlbnNpYmxlOiBmdW5jdGlvbih0YXJnZXQpIHtcbiAgICByZXR1cm4gT2JqZWN0LmlzRXh0ZW5zaWJsZSh0YXJnZXQpO1xuICB9LFxuICBoYXM6IGZ1bmN0aW9uKHRhcmdldCwgbmFtZSkge1xuICAgIHJldHVybiBuYW1lIGluIHRhcmdldDtcbiAgfSxcbiAgZ2V0OiBmdW5jdGlvbih0YXJnZXQsIG5hbWUsIHJlY2VpdmVyKSB7XG4gICAgcmVjZWl2ZXIgPSByZWNlaXZlciB8fCB0YXJnZXQ7XG5cbiAgICAvLyBpZiB0YXJnZXQgaXMgYSBwcm94eSwgaW52b2tlIGl0cyBcImdldFwiIHRyYXBcbiAgICB2YXIgaGFuZGxlciA9IGRpcmVjdFByb3hpZXMuZ2V0KHRhcmdldCk7XG4gICAgaWYgKGhhbmRsZXIgIT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuIGhhbmRsZXIuZ2V0KHJlY2VpdmVyLCBuYW1lKTtcbiAgICB9XG5cbiAgICB2YXIgZGVzYyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodGFyZ2V0LCBuYW1lKTtcbiAgICBpZiAoZGVzYyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICB2YXIgcHJvdG8gPSBPYmplY3QuZ2V0UHJvdG90eXBlT2YodGFyZ2V0KTtcbiAgICAgIGlmIChwcm90byA9PT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgfVxuICAgICAgcmV0dXJuIFJlZmxlY3QuZ2V0KHByb3RvLCBuYW1lLCByZWNlaXZlcik7XG4gICAgfVxuICAgIGlmIChpc0RhdGFEZXNjcmlwdG9yKGRlc2MpKSB7XG4gICAgICByZXR1cm4gZGVzYy52YWx1ZTtcbiAgICB9XG4gICAgdmFyIGdldHRlciA9IGRlc2MuZ2V0O1xuICAgIGlmIChnZXR0ZXIgPT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG4gICAgcmV0dXJuIGRlc2MuZ2V0LmNhbGwocmVjZWl2ZXIpO1xuICB9LFxuICAvLyBSZWZsZWN0LnNldCBpbXBsZW1lbnRhdGlvbiBiYXNlZCBvbiBsYXRlc3QgdmVyc2lvbiBvZiBbW1NldFBdXSBhdFxuICAvLyBodHRwOi8vd2lraS5lY21hc2NyaXB0Lm9yZy9kb2t1LnBocD9pZD1oYXJtb255OnByb3RvX2NsaW1iaW5nX3JlZmFjdG9yaW5nXG4gIHNldDogZnVuY3Rpb24odGFyZ2V0LCBuYW1lLCB2YWx1ZSwgcmVjZWl2ZXIpIHtcbiAgICByZWNlaXZlciA9IHJlY2VpdmVyIHx8IHRhcmdldDtcblxuICAgIC8vIGlmIHRhcmdldCBpcyBhIHByb3h5LCBpbnZva2UgaXRzIFwic2V0XCIgdHJhcFxuICAgIHZhciBoYW5kbGVyID0gZGlyZWN0UHJveGllcy5nZXQodGFyZ2V0KTtcbiAgICBpZiAoaGFuZGxlciAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm4gaGFuZGxlci5zZXQocmVjZWl2ZXIsIG5hbWUsIHZhbHVlKTtcbiAgICB9XG5cbiAgICAvLyBmaXJzdCwgY2hlY2sgd2hldGhlciB0YXJnZXQgaGFzIGEgbm9uLXdyaXRhYmxlIHByb3BlcnR5XG4gICAgLy8gc2hhZG93aW5nIG5hbWUgb24gcmVjZWl2ZXJcbiAgICB2YXIgb3duRGVzYyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodGFyZ2V0LCBuYW1lKTtcblxuICAgIGlmIChvd25EZXNjID09PSB1bmRlZmluZWQpIHtcbiAgICAgIC8vIG5hbWUgaXMgbm90IGRlZmluZWQgaW4gdGFyZ2V0LCBzZWFyY2ggdGFyZ2V0J3MgcHJvdG90eXBlXG4gICAgICB2YXIgcHJvdG8gPSBPYmplY3QuZ2V0UHJvdG90eXBlT2YodGFyZ2V0KTtcblxuICAgICAgaWYgKHByb3RvICE9PSBudWxsKSB7XG4gICAgICAgIC8vIGNvbnRpbnVlIHRoZSBzZWFyY2ggaW4gdGFyZ2V0J3MgcHJvdG90eXBlXG4gICAgICAgIHJldHVybiBSZWZsZWN0LnNldChwcm90bywgbmFtZSwgdmFsdWUsIHJlY2VpdmVyKTtcbiAgICAgIH1cblxuICAgICAgLy8gUmV2MTYgY2hhbmdlLiBDZi4gaHR0cHM6Ly9idWdzLmVjbWFzY3JpcHQub3JnL3Nob3dfYnVnLmNnaT9pZD0xNTQ5XG4gICAgICAvLyB0YXJnZXQgd2FzIHRoZSBsYXN0IHByb3RvdHlwZSwgbm93IHdlIGtub3cgdGhhdCAnbmFtZScgaXMgbm90IHNoYWRvd2VkXG4gICAgICAvLyBieSBhbiBleGlzdGluZyAoYWNjZXNzb3Igb3IgZGF0YSkgcHJvcGVydHksIHNvIHdlIGNhbiBhZGQgdGhlIHByb3BlcnR5XG4gICAgICAvLyB0byB0aGUgaW5pdGlhbCByZWNlaXZlciBvYmplY3RcbiAgICAgIC8vICh0aGlzIGJyYW5jaCB3aWxsIGludGVudGlvbmFsbHkgZmFsbCB0aHJvdWdoIHRvIHRoZSBjb2RlIGJlbG93KVxuICAgICAgb3duRGVzYyA9XG4gICAgICAgIHsgdmFsdWU6IHVuZGVmaW5lZCxcbiAgICAgICAgICB3cml0YWJsZTogdHJ1ZSxcbiAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSB9O1xuICAgIH1cblxuICAgIC8vIHdlIG5vdyBrbm93IHRoYXQgb3duRGVzYyAhPT0gdW5kZWZpbmVkXG4gICAgaWYgKGlzQWNjZXNzb3JEZXNjcmlwdG9yKG93bkRlc2MpKSB7XG4gICAgICB2YXIgc2V0dGVyID0gb3duRGVzYy5zZXQ7XG4gICAgICBpZiAoc2V0dGVyID09PSB1bmRlZmluZWQpIHJldHVybiBmYWxzZTtcbiAgICAgIHNldHRlci5jYWxsKHJlY2VpdmVyLCB2YWx1ZSk7IC8vIGFzc3VtZXMgRnVuY3Rpb24ucHJvdG90eXBlLmNhbGxcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICAvLyBvdGhlcndpc2UsIGlzRGF0YURlc2NyaXB0b3Iob3duRGVzYykgbXVzdCBiZSB0cnVlXG4gICAgaWYgKG93bkRlc2Mud3JpdGFibGUgPT09IGZhbHNlKSByZXR1cm4gZmFsc2U7XG4gICAgLy8gd2UgZm91bmQgYW4gZXhpc3Rpbmcgd3JpdGFibGUgZGF0YSBwcm9wZXJ0eSBvbiB0aGUgcHJvdG90eXBlIGNoYWluLlxuICAgIC8vIE5vdyB1cGRhdGUgb3IgYWRkIHRoZSBkYXRhIHByb3BlcnR5IG9uIHRoZSByZWNlaXZlciwgZGVwZW5kaW5nIG9uXG4gICAgLy8gd2hldGhlciB0aGUgcmVjZWl2ZXIgYWxyZWFkeSBkZWZpbmVzIHRoZSBwcm9wZXJ0eSBvciBub3QuXG4gICAgdmFyIGV4aXN0aW5nRGVzYyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IocmVjZWl2ZXIsIG5hbWUpO1xuICAgIGlmIChleGlzdGluZ0Rlc2MgIT09IHVuZGVmaW5lZCkge1xuICAgICAgdmFyIHVwZGF0ZURlc2MgPVxuICAgICAgICB7IHZhbHVlOiB2YWx1ZSxcbiAgICAgICAgICAvLyBGSVhNRTogaXQgc2hvdWxkIG5vdCBiZSBuZWNlc3NhcnkgdG8gZGVzY3JpYmUgdGhlIGZvbGxvd2luZ1xuICAgICAgICAgIC8vIGF0dHJpYnV0ZXMuIEFkZGVkIHRvIGNpcmN1bXZlbnQgYSBidWcgaW4gdHJhY2Vtb25rZXk6XG4gICAgICAgICAgLy8gaHR0cHM6Ly9idWd6aWxsYS5tb3ppbGxhLm9yZy9zaG93X2J1Zy5jZ2k/aWQ9NjAxMzI5XG4gICAgICAgICAgd3JpdGFibGU6ICAgICBleGlzdGluZ0Rlc2Mud3JpdGFibGUsXG4gICAgICAgICAgZW51bWVyYWJsZTogICBleGlzdGluZ0Rlc2MuZW51bWVyYWJsZSxcbiAgICAgICAgICBjb25maWd1cmFibGU6IGV4aXN0aW5nRGVzYy5jb25maWd1cmFibGUgfTtcbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShyZWNlaXZlciwgbmFtZSwgdXBkYXRlRGVzYyk7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKCFPYmplY3QuaXNFeHRlbnNpYmxlKHJlY2VpdmVyKSkgcmV0dXJuIGZhbHNlO1xuICAgICAgdmFyIG5ld0Rlc2MgPVxuICAgICAgICB7IHZhbHVlOiB2YWx1ZSxcbiAgICAgICAgICB3cml0YWJsZTogdHJ1ZSxcbiAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSB9O1xuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHJlY2VpdmVyLCBuYW1lLCBuZXdEZXNjKTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgfSxcbiAgLyppbnZva2U6IGZ1bmN0aW9uKHRhcmdldCwgbmFtZSwgYXJncywgcmVjZWl2ZXIpIHtcbiAgICByZWNlaXZlciA9IHJlY2VpdmVyIHx8IHRhcmdldDtcblxuICAgIHZhciBoYW5kbGVyID0gZGlyZWN0UHJveGllcy5nZXQodGFyZ2V0KTtcbiAgICBpZiAoaGFuZGxlciAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm4gaGFuZGxlci5pbnZva2UocmVjZWl2ZXIsIG5hbWUsIGFyZ3MpO1xuICAgIH1cblxuICAgIHZhciBmdW4gPSBSZWZsZWN0LmdldCh0YXJnZXQsIG5hbWUsIHJlY2VpdmVyKTtcbiAgICByZXR1cm4gRnVuY3Rpb24ucHJvdG90eXBlLmFwcGx5LmNhbGwoZnVuLCByZWNlaXZlciwgYXJncyk7XG4gIH0sKi9cbiAgZW51bWVyYXRlOiBmdW5jdGlvbih0YXJnZXQpIHtcbiAgICB2YXIgaGFuZGxlciA9IGRpcmVjdFByb3hpZXMuZ2V0KHRhcmdldCk7XG4gICAgdmFyIHJlc3VsdDtcbiAgICBpZiAoaGFuZGxlciAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAvLyBoYW5kbGVyLmVudW1lcmF0ZSBzaG91bGQgcmV0dXJuIGFuIGl0ZXJhdG9yIGRpcmVjdGx5LCBidXQgdGhlXG4gICAgICAvLyBpdGVyYXRvciBnZXRzIGNvbnZlcnRlZCB0byBhbiBhcnJheSBmb3IgYmFja3dhcmQtY29tcGF0IHJlYXNvbnMsXG4gICAgICAvLyBzbyB3ZSBtdXN0IHJlLWl0ZXJhdGUgb3ZlciB0aGUgYXJyYXlcbiAgICAgIHJlc3VsdCA9IGhhbmRsZXIuZW51bWVyYXRlKGhhbmRsZXIudGFyZ2V0KTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmVzdWx0ID0gW107XG4gICAgICBmb3IgKHZhciBuYW1lIGluIHRhcmdldCkgeyByZXN1bHQucHVzaChuYW1lKTsgfTsgICAgICBcbiAgICB9XG4gICAgdmFyIGwgPSArcmVzdWx0Lmxlbmd0aDtcbiAgICB2YXIgaWR4ID0gMDtcbiAgICByZXR1cm4ge1xuICAgICAgbmV4dDogZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmIChpZHggPT09IGwpIHJldHVybiB7IGRvbmU6IHRydWUgfTtcbiAgICAgICAgcmV0dXJuIHsgZG9uZTogZmFsc2UsIHZhbHVlOiByZXN1bHRbaWR4KytdIH07XG4gICAgICB9XG4gICAgfTtcbiAgfSxcbiAgLy8gaW1wZXJmZWN0IG93bktleXMgaW1wbGVtZW50YXRpb246IGluIEVTNiwgc2hvdWxkIGFsc28gaW5jbHVkZVxuICAvLyBzeW1ib2wta2V5ZWQgcHJvcGVydGllcy5cbiAgb3duS2V5czogZnVuY3Rpb24odGFyZ2V0KSB7XG4gICAgcmV0dXJuIE9iamVjdF9nZXRPd25Qcm9wZXJ0eU5hbWVzKHRhcmdldCk7XG4gIH0sXG4gIGFwcGx5OiBmdW5jdGlvbih0YXJnZXQsIHJlY2VpdmVyLCBhcmdzKSB7XG4gICAgLy8gdGFyZ2V0LmFwcGx5KHJlY2VpdmVyLCBhcmdzKVxuICAgIHJldHVybiBGdW5jdGlvbi5wcm90b3R5cGUuYXBwbHkuY2FsbCh0YXJnZXQsIHJlY2VpdmVyLCBhcmdzKTtcbiAgfSxcbiAgY29uc3RydWN0OiBmdW5jdGlvbih0YXJnZXQsIGFyZ3MsIG5ld1RhcmdldCkge1xuICAgIC8vIHJldHVybiBuZXcgdGFyZ2V0KC4uLmFyZ3MpO1xuXG4gICAgLy8gaWYgdGFyZ2V0IGlzIGEgcHJveHksIGludm9rZSBpdHMgXCJjb25zdHJ1Y3RcIiB0cmFwXG4gICAgdmFyIGhhbmRsZXIgPSBkaXJlY3RQcm94aWVzLmdldCh0YXJnZXQpO1xuICAgIGlmIChoYW5kbGVyICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybiBoYW5kbGVyLmNvbnN0cnVjdChoYW5kbGVyLnRhcmdldCwgYXJncywgbmV3VGFyZ2V0KTtcbiAgICB9XG4gICAgXG4gICAgaWYgKHR5cGVvZiB0YXJnZXQgIT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcInRhcmdldCBpcyBub3QgYSBmdW5jdGlvbjogXCIgKyB0YXJnZXQpO1xuICAgIH1cbiAgICBpZiAobmV3VGFyZ2V0ID09PSB1bmRlZmluZWQpIHtcbiAgICAgIG5ld1RhcmdldCA9IHRhcmdldDtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKHR5cGVvZiBuZXdUYXJnZXQgIT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwibmV3VGFyZ2V0IGlzIG5vdCBhIGZ1bmN0aW9uOiBcIiArIHRhcmdldCk7XG4gICAgICB9ICAgICAgXG4gICAgfVxuXG4gICAgcmV0dXJuIG5ldyAoRnVuY3Rpb24ucHJvdG90eXBlLmJpbmQuYXBwbHkobmV3VGFyZ2V0LCBbbnVsbF0uY29uY2F0KGFyZ3MpKSk7XG4gIH1cbn07XG5cbi8vIGZlYXR1cmUtdGVzdCB3aGV0aGVyIHRoZSBQcm94eSBnbG9iYWwgZXhpc3RzLCB3aXRoXG4vLyB0aGUgaGFybW9ueS1lcmEgUHJveHkuY3JlYXRlIEFQSVxuaWYgKHR5cGVvZiBQcm94eSAhPT0gXCJ1bmRlZmluZWRcIiAmJlxuICAgIHR5cGVvZiBQcm94eS5jcmVhdGUgIT09IFwidW5kZWZpbmVkXCIpIHtcblxuICB2YXIgcHJpbUNyZWF0ZSA9IFByb3h5LmNyZWF0ZSxcbiAgICAgIHByaW1DcmVhdGVGdW5jdGlvbiA9IFByb3h5LmNyZWF0ZUZ1bmN0aW9uO1xuXG4gIHZhciByZXZva2VkSGFuZGxlciA9IHByaW1DcmVhdGUoe1xuICAgIGdldDogZnVuY3Rpb24oKSB7IHRocm93IG5ldyBUeXBlRXJyb3IoXCJwcm94eSBpcyByZXZva2VkXCIpOyB9XG4gIH0pO1xuXG4gIGdsb2JhbC5Qcm94eSA9IGZ1bmN0aW9uKHRhcmdldCwgaGFuZGxlcikge1xuICAgIC8vIGNoZWNrIHRoYXQgdGFyZ2V0IGlzIGFuIE9iamVjdFxuICAgIGlmIChPYmplY3QodGFyZ2V0KSAhPT0gdGFyZ2V0KSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiUHJveHkgdGFyZ2V0IG11c3QgYmUgYW4gT2JqZWN0LCBnaXZlbiBcIit0YXJnZXQpO1xuICAgIH1cbiAgICAvLyBjaGVjayB0aGF0IGhhbmRsZXIgaXMgYW4gT2JqZWN0XG4gICAgaWYgKE9iamVjdChoYW5kbGVyKSAhPT0gaGFuZGxlcikge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlByb3h5IGhhbmRsZXIgbXVzdCBiZSBhbiBPYmplY3QsIGdpdmVuIFwiK2hhbmRsZXIpO1xuICAgIH1cblxuICAgIHZhciB2SGFuZGxlciA9IG5ldyBWYWxpZGF0b3IodGFyZ2V0LCBoYW5kbGVyKTtcbiAgICB2YXIgcHJveHk7XG4gICAgaWYgKHR5cGVvZiB0YXJnZXQgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgcHJveHkgPSBwcmltQ3JlYXRlRnVuY3Rpb24odkhhbmRsZXIsXG4gICAgICAgIC8vIGNhbGwgdHJhcFxuICAgICAgICBmdW5jdGlvbigpIHtcbiAgICAgICAgICB2YXIgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cyk7XG4gICAgICAgICAgcmV0dXJuIHZIYW5kbGVyLmFwcGx5KHRhcmdldCwgdGhpcywgYXJncyk7XG4gICAgICAgIH0sXG4gICAgICAgIC8vIGNvbnN0cnVjdCB0cmFwXG4gICAgICAgIGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHZhciBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzKTtcbiAgICAgICAgICByZXR1cm4gdkhhbmRsZXIuY29uc3RydWN0KHRhcmdldCwgYXJncyk7XG4gICAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBwcm94eSA9IHByaW1DcmVhdGUodkhhbmRsZXIsIE9iamVjdC5nZXRQcm90b3R5cGVPZih0YXJnZXQpKTtcbiAgICB9XG4gICAgZGlyZWN0UHJveGllcy5zZXQocHJveHksIHZIYW5kbGVyKTtcbiAgICByZXR1cm4gcHJveHk7XG4gIH07XG5cbiAgZ2xvYmFsLlByb3h5LnJldm9jYWJsZSA9IGZ1bmN0aW9uKHRhcmdldCwgaGFuZGxlcikge1xuICAgIHZhciBwcm94eSA9IG5ldyBQcm94eSh0YXJnZXQsIGhhbmRsZXIpO1xuICAgIHZhciByZXZva2UgPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciB2SGFuZGxlciA9IGRpcmVjdFByb3hpZXMuZ2V0KHByb3h5KTtcbiAgICAgIGlmICh2SGFuZGxlciAhPT0gbnVsbCkge1xuICAgICAgICB2SGFuZGxlci50YXJnZXQgID0gbnVsbDtcbiAgICAgICAgdkhhbmRsZXIuaGFuZGxlciA9IHJldm9rZWRIYW5kbGVyO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9O1xuICAgIHJldHVybiB7cHJveHk6IHByb3h5LCByZXZva2U6IHJldm9rZX07XG4gIH1cbiAgXG4gIC8vIGFkZCB0aGUgb2xkIFByb3h5LmNyZWF0ZSBhbmQgUHJveHkuY3JlYXRlRnVuY3Rpb24gbWV0aG9kc1xuICAvLyBzbyBvbGQgY29kZSB0aGF0IHN0aWxsIGRlcGVuZHMgb24gdGhlIGhhcm1vbnktZXJhIFByb3h5IG9iamVjdFxuICAvLyBpcyBub3QgYnJva2VuLiBBbHNvIGVuc3VyZXMgdGhhdCBtdWx0aXBsZSB2ZXJzaW9ucyBvZiB0aGlzXG4gIC8vIGxpYnJhcnkgc2hvdWxkIGxvYWQgZmluZVxuICBnbG9iYWwuUHJveHkuY3JlYXRlID0gcHJpbUNyZWF0ZTtcbiAgZ2xvYmFsLlByb3h5LmNyZWF0ZUZ1bmN0aW9uID0gcHJpbUNyZWF0ZUZ1bmN0aW9uO1xuXG59IGVsc2Uge1xuICAvLyBQcm94eSBnbG9iYWwgbm90IGRlZmluZWQsIG9yIG9sZCBBUEkgbm90IGF2YWlsYWJsZVxuICBpZiAodHlwZW9mIFByb3h5ID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgLy8gUHJveHkgZ2xvYmFsIG5vdCBkZWZpbmVkLCBhZGQgYSBQcm94eSBmdW5jdGlvbiBzdHViXG4gICAgZ2xvYmFsLlByb3h5ID0gZnVuY3Rpb24oX3RhcmdldCwgX2hhbmRsZXIpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcInByb3hpZXMgbm90IHN1cHBvcnRlZCBvbiB0aGlzIHBsYXRmb3JtLiBPbiB2OC9ub2RlL2lvanMsIG1ha2Ugc3VyZSB0byBwYXNzIHRoZSAtLWhhcm1vbnlfcHJveGllcyBmbGFnXCIpO1xuICAgIH07XG4gIH1cbiAgLy8gUHJveHkgZ2xvYmFsIGRlZmluZWQgYnV0IG9sZCBBUEkgbm90IGF2YWlsYWJsZVxuICAvLyBwcmVzdW1hYmx5IFByb3h5IGdsb2JhbCBhbHJlYWR5IHN1cHBvcnRzIG5ldyBBUEksIGxlYXZlIHVudG91Y2hlZFxufVxuXG4vLyBmb3Igbm9kZS5qcyBtb2R1bGVzLCBleHBvcnQgZXZlcnkgcHJvcGVydHkgaW4gdGhlIFJlZmxlY3Qgb2JqZWN0XG4vLyBhcyBwYXJ0IG9mIHRoZSBtb2R1bGUgaW50ZXJmYWNlXG5pZiAodHlwZW9mIGV4cG9ydHMgIT09ICd1bmRlZmluZWQnKSB7XG4gIE9iamVjdC5rZXlzKFJlZmxlY3QpLmZvckVhY2goZnVuY3Rpb24gKGtleSkge1xuICAgIGV4cG9ydHNba2V5XSA9IFJlZmxlY3Rba2V5XTtcbiAgfSk7XG59XG5cbi8vIGZ1bmN0aW9uLWFzLW1vZHVsZSBwYXR0ZXJuXG59KHR5cGVvZiBleHBvcnRzICE9PSAndW5kZWZpbmVkJyA/IGdsb2JhbCA6IHRoaXMpKTsiXX0=
