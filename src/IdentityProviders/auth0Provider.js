import IDProvider from "./IdentityProvider";

export default class Auth0IDProvider extends IDProvider {
  processHeaders(headers, appKey = null, appSecret = null){
    return headers;
  }
  exchangeCodeUrl(baseUrl){
    return baseUrl;
  }
  filterFields(parameters){
    return parameters;
  }
  authType() {
    return "authorize";
  }
  generatePayload(parameters){
    return JSON.stringify(parameters);
  }
  authVersion() {
    return "";
  }
  contentType() {
    return "application/json";
  }
}
