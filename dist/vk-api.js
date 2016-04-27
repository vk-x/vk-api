/*! vk-api v0.3.0 (c) Nikita Litvin, git.io/vwqn6 */
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

	var shortcuts, vk;

	vk = __webpack_require__(1);

	shortcuts = __webpack_require__(2);

	shortcuts(vk, vk.method);

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
	            authUrl = this.getAuthUrl(appId, permissions, {
	              windowStyle: windowStyle,
	              redirectUrl: "close.html"
	            });
	            popup = window.open(authUrl);
	            return intervalHandler = window.setInterval((function(_this) {
	              return function() {
	                if (popup.closed) {
	                  window.clearInterval(intervalHandler);
	                  return _this.getAccessToken(appId).then(function(accessToken) {
	                    callback(accessToken);
	                    return resolve(accessToken);
	                  });
	                }
	              };
	            })(this), 100);
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
	        return _this.request("GET", "https://login.vk.com/", {
	          act: "openapi",
	          oauth: 1,
	          "new": 1,
	          aid: _this.appId,
	          location: window.document.location.hostname
	        }, function(arg) {
	          var access_token;
	          access_token = arg.access_token;
	          _this.accessToken = access_token != null ? access_token : null;
	          callback(_this.accessToken);
	          return resolve(_this.accessToken);
	        });
	      };
	    })(this));
	  },
	  request: function(method, url, params, callback) {
	    var key, serializedParams, val, xhr;
	    xhr = new XMLHttpRequest;
	    xhr.withCredentials = true;
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
	          return _this.request("POST", "https://api.vk.com/method/" + methodName, params, function(arg) {
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
	          });
	        })();
	      };
	    })(this));
	  }
	};


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var shortcuts,
	  hasProp = {}.hasOwnProperty;

	shortcuts = function(base, baseMethod) {
	  var addShortcutMethod, i, len, list, methodList, methodName, namespace;
	  methodList = __webpack_require__(3);
	  addShortcutMethod = function(namespace, methodName) {
	    return base[namespace][methodName] = function(params, callback) {
	      return baseMethod.call(base, namespace + "." + methodName, params, callback);
	    };
	  };
	  for (namespace in methodList) {
	    if (!hasProp.call(methodList, namespace)) continue;
	    list = methodList[namespace];
	    base[namespace] = {};
	    for (i = 0, len = list.length; i < len; i++) {
	      methodName = list[i];
	      addShortcutMethod(namespace, methodName);
	    }
	  }
	  return base["execute"] = function(params, callback) {
	    return baseMethod.call(base, "execute", params, callback);
	  };
	};

	module.exports = shortcuts;


/***/ },
/* 3 */
/***/ function(module, exports) {

	var methodList;

	methodList = {
	  users: ["get", "search", "isAppUser", "getSubscriptions", "getFollowers", "report", "getNearby"],
	  auth: ["checkPhone", "signup", "confirm", "restore"],
	  wall: ["get", "search", "getById", "post", "repost", "getReposts", "edit", "delete", "restore", "pin", "unpin", "getComments", "addComment", "editComment", "deleteComment", "restoreComment", "reportPost", "reportComment"],
	  photos: ["createAlbum", "editAlbum", "getAlbums", "get", "getAlbumsCount", "getById", "getUploadServer", "getOwnerPhotoUploadServer", "getChatUploadServer", "getMarketUploadServer", "getMarketAlbumUploadServer", "saveMarketPhoto", "saveMarketAlbumPhoto", "saveOwnerPhoto", "saveWallPhoto", "getWallUploadServer", "getMessagesUploadServer", "saveMessagesPhoto", "report", "reportComment", "search", "save", "copy", "edit", "move", "makeCover", "reorderAlbums", "reorderPhotos", "getAll", "getUserPhotos", "deleteAlbum", "delete", "restore", "confirmTag", "getComments", "getAllComments", "createComment", "deleteComment", "restoreComment", "editComment", "getTags", "putTag", "removeTag", "getNewTags"],
	  friends: ["get", "getOnline", "getMutual", "getRecent", "getRequests", "add", "edit", "delete", "getLists", "addList", "editList", "deleteList", "getAppUsers", "getByPhones", "deleteAllRequests", "getSuggestions", "areFriends", "getAvailableForCall", "search"],
	  widgets: ["getComments", "getPages"],
	  storage: ["get", "set", "getKeys"],
	  status: ["get", "set"],
	  audio: ["get", "getById", "getLyrics", "search", "getUploadServer", "save", "add", "delete", "edit", "reorder", "restore", "getAlbums", "addAlbum", "editAlbum", "deleteAlbum", "moveToAlbum", "setBroadcast", "getBroadcastList", "getRecommendations", "getPopular", "getCount"],
	  pages: ["get", "save", "saveAccess", "getHistory", "getTitles", "getVersion", "parseWiki", "clearCache"],
	  groups: ["isMember", "getById", "get", "getMembers", "join", "leave", "search", "getCatalog", "getCatalogInfo", "getInvites", "getInvitedUsers", "banUser", "unbanUser", "getBanned", "create", "edit", "editPlace", "getSettings", "getRequests", "editManager", "invite", "addLink", "deleteLink", "editLink", "reorderLink", "removeUser", "approveRequest"],
	  board: ["getTopics", "getComments", "addTopic", "addComment", "deleteTopic", "editTopic", "editComment", "restoreComment", "deleteComment", "openTopic", "closeTopic", "fixTopic", "unfixTopic"],
	  video: ["get", "edit", "add", "save", "delete", "restore", "search", "getUserVideos", "getAlbums", "getAlbumById", "addAlbum", "editAlbum", "deleteAlbum", "reorderAlbums", "reorderVideos", "addToAlbum", "removeFromAlbum", "getAlbumsByVideo", "getComments", "createComment", "deleteComment", "restoreComment", "editComment", "getTags", "putTag", "removeTag", "getNewTags", "report", "reportComment", "getCatalog", "getCatalogSection", "hideCatalogSection"],
	  notes: ["get", "getById", "add", "edit", "delete", "getComments", "createComment", "editComment", "deleteComment", "restoreComment"],
	  places: ["add", "getById", "search", "checkin", "getCheckins", "getTypes"],
	  account: ["getCounters", "setNameInMenu", "setOnline", "setOffline", "lookupContacts", "registerDevice", "unregisterDevice", "setSilenceMode", "getPushSettings", "setPushSettings", "getAppPermissions", "getActiveOffers", "banUser", "unbanUser", "getBanned", "getInfo", "setInfo", "changePassword", "getProfileInfo", "saveProfileInfo"],
	  messages: ["get", "getDialogs", "getById", "search", "getHistory", "getHistoryAttachments", "send", "delete", "deleteDialog", "restore", "markAsRead", "markAsImportant", "getLongPollServer", "getLongPollHistory", "getChat", "createChat", "editChat", "getChatUsers", "setActivity", "searchDialogs", "addChatUser", "removeChatUser", "getLastActivity", "setChatPhoto", "deleteChatPhoto"],
	  newsfeed: ["get", "getRecommended", "getComments", "getMentions", "getBanned", "addBan", "deleteBan", "ignoreItem", "unignoreItem", "search", "getLists", "saveList", "deleteList", "unsubscribe", "getSuggestedSources"],
	  likes: ["getList", "add", "delete", "isLiked"],
	  polls: ["getById", "addVote", "deleteVote", "getVoters", "create", "edit"],
	  docs: ["get", "getById", "getUploadServer", "getWallUploadServer", "save", "delete", "add", "getTypes", "search", "edit"],
	  fave: ["getUsers", "getPhotos", "getPosts", "getVideos", "getLinks", "getMarketItems", "addUser", "removeUser", "addGroup", "removeGroup", "addLink", "removeLink"],
	  notifications: ["get", "markAsViewed"],
	  stats: ["get", "trackVisitor", "getPostReach"],
	  search: ["getHints"],
	  apps: ["getCatalog", "get", "sendRequest", "deleteAppRequests", "getFriendsList", "getLeaderboard", "getScore"],
	  utils: ["checkLink", "resolveScreenName", "getServerTime"],
	  database: ["getCountries", "getRegions", "getStreetsById", "getCountriesById", "getCities", "getCitiesById", "getUniversities", "getSchools", "getSchoolClasses", "getFaculties", "getChairs"],
	  gifts: ["get"],
	  market: ["get", "getById", "search", "getAlbums", "getAlbumById", "createComment", "getComments", "deleteComment", "restoreComment", "editComment", "reportComment", "getCategories", "report", "add", "edit", "delete", "restore", "reorderItems", "reorderAlbums", "addAlbum", "editAlbum", "deleteAlbum", "removeFromAlbum", "addToAlbum"],
	  ads: ["getAccounts", "getClients", "createClients", "updateClients", "deleteClients", "getCampaigns", "createCampaigns", "updateCampaigns", "deleteCampaigns", "getAds", "getAdsLayout", "getAdsTargeting", "createAds", "updateAds", "deleteAds", "checkLink", "getStatistics", "getDemographics", "getAdsPostsReach", "getBudget", "getOfficeUsers", "addOfficeUsers", "removeOfficeUsers", "getTargetingStats", "getSuggestions", "getCategories", "getUploadURL", "getVideoUploadURL", "getFloodStats", "getRejectionReason", "createTargetGroup", "updateTargetGroup", "deleteTargetGroup", "getTargetGroups", "importTargetContacts"]
	};

	module.exports = methodList;


/***/ }
/******/ ])
});
;