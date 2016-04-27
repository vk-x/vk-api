describe "vk", ->

  vk = null
  cleanVk = require "inject!../src/vk"

  beforeEach ->
    vk = cleanVk {}


  describe "getAuthUrl", ->

    it "should use passed app id, permissions and options", ->
      url = vk.getAuthUrl "12345", [ "audio", "photos" ],
        version: "5.10"
        windowStyle: "popup"
        redirectUrl: "close.html"

      url.should.equal "https://oauth.vk.com/authorize?client_id=12345&scope=audio,photos&" +
      "redirect_uri=close.html&display=popup&v=5.10&response_type=token"


    it "should use correct redirect url for standalone apps", ->
      url = vk.getAuthUrl "12345", [ "audio", "photos" ],
        version: "5.10"
        windowStyle: "popup"
        redirectUrl: "https://oauth.vk.com/blank.html"

      url.should.equal "https://oauth.vk.com/authorize?client_id=12345&scope=audio,photos&" +
      "redirect_uri=https%3A%2F%2Foauth.vk.com%2Fblank.html&display=popup&v=5.10&response_type=token"


    it "should use sensible defaults", ->
      url = vk.getAuthUrl "12345"

      expect( vk.version ).to.equal "5.50"
      url.should.equal "https://oauth.vk.com/authorize?client_id=12345&scope=&" +
      "redirect_uri=https%3A%2F%2Foauth.vk.com%2Fblank.html&display=popup&v=5.50&response_type=token"


    it "should set vk.version", ->
      vk.getAuthUrl "12345", [ "audio", "photos" ],
        version: "4.4"

      expect( vk.version ).to.equal "4.4"


    it "should default to vk.version when version is not specified", ->
      vk.version = "1.2.3"
      url = vk.getAuthUrl "12345"

      expect( vk.version ).to.equal "1.2.3"
      url.should.equal "https://oauth.vk.com/authorize?client_id=12345&scope=&" +
      "redirect_uri=https%3A%2F%2Foauth.vk.com%2Fblank.html&display=popup&v=1.2.3&response_type=token"


    it "should set vk.appId", ->
      vk.getAuthUrl "12345"

      expect( vk.appId ).to.equal "12345"


    it "should default to vk.appId when appId is not specified", ->
      vk.appId = "12345"
      url = vk.getAuthUrl()

      url.should.equal "https://oauth.vk.com/authorize?client_id=12345&scope=&" +
      "redirect_uri=https%3A%2F%2Foauth.vk.com%2Fblank.html&display=popup&v=5.50&response_type=token"


    it "vk.version should be initially set to default", ->
      expect( vk.version ).to.equal "5.50"


  describe "method", ->

    fakeMethod = "fake-method"
    fakeUrl = "https://api.vk.com/method/fake-method"

    beforeEach ->
      vk.accessToken = "fake-token"
      vk.version = "fake-version"

    it "should call @request and then callback(error, data)", ( done ) ->
      fakeData =
        error: "fake error"
        response:
          foo: "bar"

      vk.request = ( method, url, params, callback ) ->
        method.should.equal "POST"
        url.should.equal fakeUrl
        params.should.deep.equal
          foo: "bar"
          access_token: "fake-token"
          v: "fake-version"

        callback fakeData

      vk.method fakeMethod, foo: "bar", ( error, response ) ->
        expect( error ).to.equal fakeData.error
        response.should.equal fakeData.response

        done()


    it "should support promises", ( done ) ->
      vk.request = ( method, url, params, callback ) ->
        callback response: "foo"

      vk.method fakeMethod, foo: "bar"
      .then ( response ) ->
        response.should.equal "foo"
        done()

      , ( error ) ->
        done "rejected!"


    it "should reject promise when data.error exists", ( done ) ->
      vk.request = ( method, url, params, callback ) ->
        callback response: "foo", error: "exists"

      vk.method fakeMethod, foo: "bar"
      .then ( response ) ->
        done "resolved!"

      , ( error ) ->
        expect( error ).to.equal "exists"
        done()


    it "should auto-retry on 'too many requests' error", ( done ) ->
      clock = sinon.useFakeTimers()

      ERROR_TOO_MANY_REQUESTS = 6
      calls = 0
      vk.request = ( method, url, params, callback ) ->
        calls += 1
        if calls < 3
          callback error: error_code: ERROR_TOO_MANY_REQUESTS
          clock.tick 310
        else
          callback response: "success"

      vk.method fakeMethod, foo: "bar"
      .then ( response ) ->
        clock.restore()
        response.should.equal "success"
        done()

      , ( error ) ->
        clock.restore()
        done "rejected!"


  describe "request", ->

    fakeUrl = "https://api.vk.com/method/fake-method"

    fakeXhr = null

    fakeParams =
      foo: "foo 2"
      bar: "bar/2"

    fakeData =
      error: "fake error"
      response:
        foo: "bar"

    beforeEach ->
      fakeXhr = sinon.useFakeXMLHttpRequest()
      fakeXhr.requests = []
      fakeXhr.onCreate = ( xhr ) ->
        fakeXhr.requests.push xhr

    afterEach ->
      fakeXhr.restore()


    it "should make a get xhr and call back with parsed json", ( done ) ->
      vk.request "GET", fakeUrl, fakeParams, ( data ) ->
        data.should.deep.equal fakeData

        done()

      fakeXhr.requests.length.should.equal 1
      expect( fakeXhr.requests[ 0 ].method ).to.equal "GET"
      expect( fakeXhr.requests[ 0 ].url ).to.equal fakeUrl + "?foo=foo%202&bar=bar%2F2"

      fakeXhr.requests[ 0 ].respond 200, {}, JSON.stringify fakeData


    it "should make a post xhr and call back with parsed json", ( done ) ->
      vk.request "POST", fakeUrl, fakeParams, ( data ) ->
        data.should.deep.equal fakeData

        done()

      fakeXhr.requests.length.should.equal 1
      expect( fakeXhr.requests[ 0 ].method ).to.equal "POST"
      expect( fakeXhr.requests[ 0 ].url ).to.equal fakeUrl
      expect( fakeXhr.requests[ 0 ].requestHeaders ).to.have.property "Content-Type"
      expect( fakeXhr.requests[ 0 ].requestHeaders[ "Content-Type"] ).to.contain "application/x-www-form-urlencoded"
      expect( fakeXhr.requests[ 0 ].requestBody ).to.equal "foo=foo%202&bar=bar%2F2"

      fakeXhr.requests[ 0 ].respond 200, {}, JSON.stringify fakeData
