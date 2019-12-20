import '@babel/runtime/regenerator'
import generateRandomChallengePair from './generateRandomChallengePair';
import parse from 'url-parse';
import { boundMethod } from 'autobind-decorator'

const qs = parse.qs;
/*
  Generic JavaScript PKCE Client, you can subclass this for React-Native,
  Cordova, Chrome, Some Other Environment which has its own handling for
  OAuth flows (like Windows?)
*/

class PKCEClient{
  // These params will never change
  constructor (domain, clientId) {
    this.domain = domain;
    this.clientId = clientId;
  }

  async getAuthResult (url, interactive) {
    throw new Error('Must be implemented by a sub-class');
  }

  getRedirectURL () {
    throw new Error('Must be implemented by a sub-class');
  }

  @boundMethod
  async exchangeCodeForToken (code, verifier, awsCognito = false) {
    const {domain, clientId} = this;
    const params = ({
      redirect_uri: this.getRedirectURL(),
      grant_type: 'authorization_code',
      code_verifier: verifier,
      client_id: clientId,
      code
    });

    let body;

    if(awsCognito){
      body =  Object.keys(params).map((key) => {
        return encodeURIComponent(key) + '=' + encodeURIComponent(params[key]);
      }).join('&');
    }

    else{
      body = JSON.stringify(params);      
    }

    let authVersion = awsCognito ? "2" : "";

    const result = await fetch(`https://${domain}/oauth${authVersion}/token`, {
      method: 'POST',
      headers: {
        'Content-Type': awsCognito ? 'application/x-www-form-urlencoded' : 'application/json'
      },
      body: body
    });

    if(result.ok)
     return result.json();

    throw Error(result.statusText);
  }

  extractCode (resultUrl) {
    const response = parse(resultUrl, true).query;

    if (response.error) {
      throw new Error(response.error_description || response.error);
    }

    return response.code;
  }

  @boundMethod
  async authenticate (options = {}, interactive = true, awsCognito = false) {
    const {domain, clientId} = this;
    const {secret, hashed} = generateRandomChallengePair();

    Object.assign(options, {
      client_id: clientId,
      code_challenge: hashed,
      redirect_uri: this.getRedirectURL(),
      code_challenge_method: 'S256',
      response_type: 'code',
    });

    const authenticationType = awsCognito ? 'login' : 'authorize';
    const url = `https://${domain}/${authenticationType}?${qs.stringify(options)}`;
    const resultUrl = await this.getAuthResult(url, interactive);
    const code = this.extractCode(resultUrl);
    return this.exchangeCodeForToken(code, secret, awsCognito);
  }
}

export default PKCEClient;
