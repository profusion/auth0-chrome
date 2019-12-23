import '@babel/runtime/regenerator'
import generateRandomChallengePair from './generateRandomChallengePair';
import parse from 'url-parse';
import { boundMethod } from 'autobind-decorator'
import { Providers } from './IdentityProviders/providerConstants'

const qs = parse.qs;

/*
  Generic JavaScript PKCE Client, you can subclass this for React-Native,
  Cordova, Chrome, Some Other Environment which has its own handling for
  OAuth flows (like Windows?)
*/

class PKCEClient{
  // These params will never change
  constructor (domain, clientId,appSecret = null) {
    this.domain = domain;
    this.clientId = clientId;
    this.appKey = clientId;
    this.appSecret = appSecret
  }

  async getAuthResult (url, interactive) {
    throw new Error('Must be implemented by a sub-class');
  }

  getRedirectURL () {
    throw new Error('Must be implemented by a sub-class');
  }

  @boundMethod
  async exchangeCodeForToken (code, verifier, provider) {
    const {domain, clientId, appKey, appSecret} = this;
    const params = ({
      redirect_uri: this.getRedirectURL(),
      grant_type: 'authorization_code',
      code_verifier: verifier,
      client_id: clientId,
      code
    });
    
    
    const body = provider.generatePayload(params);
    const authVersion = provider.authVersion();
    const headers  = {
      'Content-Type': provider.contentType()
    }
    const processedHeaders = provider.processHeaders(headers, appKey, appSecret);
    const exchangeCodeDomain = provider.exchangeCodeUrl(domain);
    const result = await fetch(`https://${exchangeCodeDomain}/oauth${authVersion}/token`, {
      method: 'POST',
      headers: processedHeaders,
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
  async authenticate (options = {}, interactive = true, providerName) {
    const {domain, clientId, appKey, appSecret} = this;
    const {secret, hashed} = generateRandomChallengePair();
    console.log("inside authenticate");
    if(! (providerName in Providers)){
      throw new Error(`there's no such provider: ${providerName}`);
    }

    const provider = new Providers[providerName];

    Object.assign(options, {
      client_id: clientId,
      code_challenge: hashed,
      redirect_uri: this.getRedirectURL(),
      code_challenge_method: 'S256',
      response_type: 'code',
    });

    const filteredOpt = provider.filterFields(options);
    const authType = provider.authType()
    const url = `https://${domain}/${authType}?${qs.stringify(filteredOpt)}`;
    const resultUrl = await this.getAuthResult(url, interactive);
    const code = this.extractCode(resultUrl);
    return this.exchangeCodeForToken(code, secret, provider);
  }
}

export default PKCEClient;
