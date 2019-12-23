import IDProvider from "./../interface/identityProvider";
import payloadParameters from "./../interface/payloadParameters"


export default class Auth0IDProvider implements IDProvider {
  authType(): string {
    return "authorize";
  }
  generatePayload(parameters: payloadParameters): string {
    return JSON.stringify(parameters);
  }
  authVersion(): string {
      return '';
  }
  contentType(): string {
      return 'application/json'
  }
}
