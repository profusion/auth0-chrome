import PKCEClient from './PKCEClient';

class ChromeClient extends PKCEClient {
  getAuthResult (url, interactive) {
    return new Promise((resolve, reject) => {
      console.log("inside webflow");
      chrome.identity.launchWebAuthFlow({url, interactive}, (callbackURL) => {
        if ( chrome.runtime.lastError ) {
          return reject(new Error(chrome.runtime.lastError.message))
        }
        resolve(callbackURL);
      });
    });
  }

  getRedirectURL () {
    return chrome.identity.getRedirectURL('auth');
  }
}

export default ChromeClient;
