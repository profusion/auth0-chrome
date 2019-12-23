import IDProvider from "./../interface/identityProvider";
import payloadParameters from "./../interface/payloadParameters"

export default class CognitoIDProvider implements IDProvider {
  authType(): string {
    return "login";
  }
  generatePayload(parameters: payloadParameters): string {
    return Object.keys(parameters)
    .map(key => {
      return (
        encodeURIComponent(key) + "=" + encodeURIComponent(parameters[key])
      );
    })
    .join("&");
  }
    
  authVersion(): string {
    return "2";
  }
  contentType(): string {
    return "application/x-www-form-urlencoded";
  }
}
