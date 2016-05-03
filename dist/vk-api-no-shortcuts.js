/*! vk-api v0.3.2 (c) Nikita Litvin, git.io/vwqn6 */
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

	var ERROR_TOO_MANY_REQUESTS,
	  hasProp = {}.hasOwnProperty;

	ERROR_TOO_MANY_REQUESTS = 6;

	module.exports = {
	  version: "5.50",
	  getAuthUrl: function(appId1, permissions, arg) {
	    var redirectUrl, ref, ref1, ref2, ref3, windowStyle;
	    this.appId = appId1 != null ? appId1 : this.appId;
	    if (permissions == null) {
	      permissions = [];
	    }
	    ref = arg != null ? arg : {}, this.version = (ref1 = ref.version) != null ? ref1 : this.version, windowStyle = (ref2 = ref.windowStyle) != null ? ref2 : "popup", redirectUrl = (ref3 = ref.redirectUrl) != null ? ref3 : "https://oauth.vk.com/blank.html";
	    return ("https://oauth.vk.com/authorize?client_id=" + this.appId + "&scope=" + (permissions.join(',')) + "&redirect_uri=" + (encodeURIComponent(redirectUrl)) + "&") + ("display=" + windowStyle + "&v=" + this.version + "&response_type=token");
	  },
	  authWebsite: function(appId, permissions, windowStyle, callback) {
	    if (windowStyle == null) {
	      windowStyle = "popup";
	    }
	    if (callback == null) {
	      callback = function() {};
	    }
	    return new Promise((function(_this) {
	      return function(resolve, reject) {
	        return _this.getAccessToken(appId).then(function(accessToken) {
	          var authUrl, intervalHandler, popup;
	          if (accessToken) {
	            callback(accessToken);
	            return resolve(accessToken);
	          } else {
	            authUrl = _this.getAuthUrl(appId, permissions, {
	              windowStyle: windowStyle,
	              redirectUrl: "close.html"
	            });
	            popup = window.open(authUrl);
	            return intervalHandler = window.setInterval(function() {
	              if (popup.closed) {
	                window.clearInterval(intervalHandler);
	                return _this.getAccessToken(appId).then(function(accessToken) {
	                  callback(accessToken);
	                  return resolve(accessToken);
	                });
	              }
	            }, 100);
	          }
	        });
	      };
	    })(this));
	  },
	  getAccessToken: function(appId1, callback) {
	    this.appId = appId1 != null ? appId1 : this.appId;
	    if (callback == null) {
	      callback = function() {};
	    }
	    return new Promise((function(_this) {
	      return function(resolve, reject) {
	        return _this.request({
	          method: "GET",
	          url: "https://login.vk.com/",
	          params: {
	            act: "openapi",
	            oauth: 1,
	            "new": 1,
	            aid: _this.appId,
	            location: window.document.location.hostname
	          },
	          callback: function(arg) {
	            var access_token;
	            access_token = arg.access_token;
	            _this.accessToken = access_token != null ? access_token : null;
	            callback(_this.accessToken);
	            return resolve(_this.accessToken);
	          },
	          withCredentials: true
	        });
	      };
	    })(this));
	  },
	  request: function(arg) {
	    var callback, key, method, params, ref, serializedParams, url, val, withCredentials, xhr;
	    method = arg.method, url = arg.url, params = arg.params, callback = arg.callback, withCredentials = (ref = arg.withCredentials) != null ? ref : false;
	    xhr = new XMLHttpRequest;
	    xhr.withCredentials = withCredentials;
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
	    switch (method) {
	      case "GET":
	        xhr.open(method, url + "?" + serializedParams);
	        return xhr.send();
	      case "POST":
	        xhr.open(method, url);
	        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	        return xhr.send(serializedParams);
	    }
	  },
	  method: function(methodName, params, callback) {
	    if (params == null) {
	      params = {};
	    }
	    if (callback == null) {
	      callback = function() {};
	    }
	    params.access_token = this.accessToken;
	    params.v = this.version;
	    return new Promise((function(_this) {
	      return function(resolve, reject) {
	        var retry;
	        return (retry = function() {
	          return _this.request({
	            method: "POST",
	            url: "https://api.vk.com/method/" + methodName,
	            params: params,
	            callback: function(arg) {
	              var error, response;
	              error = arg.error, response = arg.response;
	              if (error != null) {
	                if (error.error_code === ERROR_TOO_MANY_REQUESTS) {
	                  return setTimeout(retry, 300);
	                } else {
	                  callback(error, response);
	                  return reject(error);
	                }
	              } else {
	                callback(error, response);
	                return resolve(response);
	              }
	            }
	          });
	        })();
	      };
	    })(this));
	  }
	};


/***/ }
/******/ ])
});
;