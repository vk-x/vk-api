/*! vk-api v0.1.1 (c) Nikita Litvin, git.io/vwqn6 */
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