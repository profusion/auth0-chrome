import IDProvider from "./IdentityProvider";
import Base64 from "base-64"
export default class DropboxIDProvider extends IDProvider {
  processHeaders(headers, appKey = null, appSecret = null) {
      const authHeader =  `Basic ${Base64.encode(`${appKey}:${appSecret}`)}`;
      headers.Authorization = authHeader;
      return headers;
  }
  exchangeCodeUrl(baseUrl) {
    return "api.dropbox.com";
  }
  filterFields(parameters) {
    if ("code_challenge" in parameters) {
      delete parameters.code_challenge;
    }
    if ("code_challenge_method" in parameters) {
      delete parameters.code_challenge_method;
    }
    return parameters;
  }
  authType() {
    return "authorize";
  }
  generatePayload(parameters) {
    
    if ("code_verifier" in parameters){
        delete parameters.code_verifier;
    }

    if ("client_id" in parameters){
        delete parameters.client_id;
    }
    
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
