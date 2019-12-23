import IDProvider from "./IdentityProvider";

export default class CognitoIDProvider extends IDProvider {
  processHeaders(headers, appKey = null, appSecret = null){
    return headers;
  }
  exchangeCodeUrl(baseUrl){
    return baseUrl;
  }
  filterFields(parameters) {
    return parameters;
  }
  authType() {
    return "login";
  }
  generatePayload(parameters){
    return Object.keys(parameters)
      .map(key => {
        return (
          encodeURIComponent(key) + "=" + encodeURIComponent(parameters[key])
        );
      })
      .join("&");
  }

  authVersion() {
    return "2";
  }
  contentType() {
    return "application/x-www-form-urlencoded";
  }
}
