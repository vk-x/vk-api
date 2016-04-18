## Driver API

- [`vk.authUrl(appId, permissions, [version="5.50"], [windowStyle="popup"])`](#vkauthurlappid-permissions-version550-windowstylepopup)
- [`vk.method(methodName, params, [callback=noop])`](#vkmethodmethodname-params-callbacknoop)
- [Aliases](#aliases)


## `vk.authUrl(appId, permissions, [version="5.50"], [windowStyle="popup"])`

Suggests a URL for app authentication.
See [Client Application Authorization](https://new.vk.com/dev/auth_mobile).

This method uses `https://oauth.vk.com/blank.html` as `redirect_uri`.

This method is an optional utility. Skip it if you use a different auth flow
or prefer to create a custom auth URL.

##### Arguments

1. **`appId`** *(number|string)*: ID of your VK application. See [My Applications](https://new.vk.com/apps?act=manage).
1. **`permissions`** *(Array)*: Permissions for your VK application. See [My Applications](https://new.vk.com/apps?act=manage).
1. **`[version="5.50"]`** *(string)*: API version to use when calling api.vk.com. `vk.version` is set to this value and used in other methods.
1. **`[windowStyle="popup"]`** *(string)*: Auth window style. See [OAuth Authorization Dialog](https://new.vk.com/dev/oauth_dialog).

##### Returns

*(string)*: Returns a URL to use in `window.open()`. Obtaining access token is out of the scope of this library.

##### Examples

```JavaScript

vk.authUrl("12345", ["audio", "photos"], "4.10")
// "https://oauth.vk.com/authorize?client_id=12345&scope=audio,photos&redirect_uri=https%3A%2F%2Foauth.vk.com%2Fblank.html&display=popup&v=4.10&response_type=token"

vk.authUrl("12345", ["friends"], vk.version, "page")
// "https://oauth.vk.com/authorize?client_id=12345&scope=friends&redirect_uri=https%3A%2F%2Foauth.vk.com%2Fblank.html&display=page&v=5.50&response_type=token"

```


## `vk.method(methodName, params, [callback=noop])`

Calls the specified API method and returns its result. See [API Requests](https://new.vk.com/dev/api_requests).

Supports both callbacks and promises.

This method uses `vk.request()` for performing actual network requests. Override `vk.request` to change the behavior of this library.

##### Arguments

1. **`methodName`** *(string)*: the name of the API method. See [API Methods](https://new.vk.com/dev/methods).
1. **`params`** *(Object)*: Parameters to pass to the API.
1. **`[callback=noop]`** *(Function|null)*: optional callback with signature `callback(error, response)`.

##### Returns

*(Promise)*: Returns a promise that resolves whis the result from the API or rejects with the error if it exists.

##### Examples

```JavaScript

vk.accessToken = "your-token"

vk.method("users.get", {fields: "online"}).then(function(result) {
  console.log(result.online)

}, function(error) {
  console.log(error)
})

vk.method("users.get", {fields: "online"}, function(error, result) {
  console.log(error || result.online)
})

```


## Aliases

The `vk` object has built-in aliases for most API methods. Each alias is a transparent wrapper around `vk.method`.

For an exhaustive list of available aliases please refer to [`src/method-list.coffee`](../src/method-list.coffee).

##### Arguments

1. **`params`** *(Object)*: Parameters to pass to the API.
1. **`[callback=noop]`** *(Function|null)*: optional callback with signature `callback(error, response)`.

##### Returns

*(Promise)*: Returns a promise that resolves whis the result from the API or rejects with the error if it exists.

##### Examples

```JavaScript

vk.accessToken = "your-token"

vk.users.get({fields: "online"}).then(function(result) {})
// Same as vk.method("users.get", ...)

vk.execute({...}, function(error, result) {})
// Same as vk.method("execute", ...)

```