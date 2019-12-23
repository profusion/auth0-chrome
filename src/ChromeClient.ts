import PKCEClient from './PKCEClient';

class ChromeClient extends PKCEClient {
  getAuthResult (url: string , interactive: boolean): Promise<string> {
    return new Promise((resolve, reject) => {
      chrome.identity.launchWebAuthFlow({url, interactive}, (callbackURL) => {
        if ( chrome.runtime.lastError ) {
          return reject(new Error(chrome.runtime.lastError.message))
        }
        resolve(callbackURL);
      });
    });
  }

  getRedirectURL (): string {
    return chrome.identity.getRedirectURL('auth0');
  }
}

export default ChromeClient;
