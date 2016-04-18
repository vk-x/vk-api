/*! vk-api v0.1.0 (c) Nikita Litvin, git.io/vwqn6 */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["vk"] = factory();
	else
		root["vk"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var vk;

	vk = __webpack_require__(1);

	module.exports = vk;


/***/ },
/* 1 */
/***/ function(module, exports) {

	var DEFAULT_API_VERSION, DEFAULT_WINDOW_STYLE, REDIRECT_URI,
	  hasProp = {}.hasOwnProperty;

	DEFAULT_API_VERSION = "5.50";

	DEFAULT_WINDOW_STYLE = "popup";

	REDIRECT_URI = "https%3A%2F%2Foauth.vk.com%2Fblank.html";

	module.exports = {
	  version: DEFAULT_API_VERSION,
	  authUrl: function(appId, permissions, version, windowStyle) {
	    this.version = version != null ? version : DEFAULT_API_VERSION;
	    if (windowStyle == null) {
	      windowStyle = DEFAULT_WINDOW_STYLE;
	    }
	    return ("https://oauth.vk.com/authorize?client_id=" + appId + "&scope=" + (permissions.join(',')) + "&redirect_uri=" + REDIRECT_URI + "&") + ("display=" + windowStyle + "&v=" + this.version + "&response_type=token");
	  },
	  request: function(url, params, callback) {
	    var key, serializedParams, val, xhr;
	    xhr = new XMLHttpRequest;
	    xhr.onload = function() {
	      return callback(JSON.parse(this.responseText));
	    };
	    serializedParams = ((function() {
	      var results;
	      results = [];
	      for (key in params) {
	        if (!hasProp.call(params, key)) continue;
	        val = params[key];
	        results.push((encodeURIComponent(key)) + "=" + (encodeURIComponent(val)));
	      }
	      return results;
	    })()).join("&");
	    xhr.open("POST", url);
	    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	    return xhr.send(serializedParams);
	  },
	  method: function(methodName, params, callback) {
	    if (callback == null) {
	      callback = function() {};
	    }
	    params.access_token = this.accessToken;
	    params.v = this.version;
	    return new Promise((function(_this) {
	      return function(resolve, reject) {
	        return _this.request("https://api.vk.com/method/" + methodName, params, function(arg) {
	          var error, response;
	          error = arg.error, response = arg.response;
	          callback(error, response);
	          if (error != null) {
	            return reject(error);
	          } else {
	            return resolve(response);
	          }
	        });
	      };
	    })(this));
	  }
	};


/***/ }
/******/ ])
});
;