/* eslint-disable @typescript-eslint/camelcase */
import '@babel/runtime/regenerator'
import generateRandomChallengePair from './generateRandomChallengePair';
import parse from 'url-parse';
import { boundMethod } from 'autobind-decorator';
import { Providers } from "./identityProvider/providers/providers";
import IProvider from "./identityProvider/interface/identityProvider";

const qs = parse.qs;
/*
  Generic JavaScript PKCE Client, you can subclass this for React-Native,
  Cordova, Chrome, Some Other Environment which has its own handling for
  OAuth flows (like Windows?)
*/

class PKCEClient{
  domain: string;
  clientId: string;
  // These params will never change
  constructor (domain: string, clientId: string) {
    this.domain = domain;
    this.clientId = clientId;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async getAuthResult (url: string, interactive: boolean): Promise <string> {
    throw new Error('Must be implemented by a sub-class');
  }

  getRedirectURL (): string {
    throw new Error('Must be implemented by a sub-class');
  }

  @boundMethod
  async exchangeCodeForToken (code: string, verifier: string, idProvider: IProvider): Promise<Response> {
    const {domain, clientId} = this;
    const params = ({
      redirect_uri: this.getRedirectURL(),
      grant_type: 'authorization_code',
      code_verifier: verifier,
      client_id: clientId,
      code
    });

    const body = idProvider.generatePayload(params);
    const authVersion = idProvider.authVersion();

    const result = await fetch(`https://${domain}/oauth${authVersion}/token`, {
      method: 'POST',
      headers: {
        'Content-Type':idProvider.contentType()
      },
      body: body
    });

    if(result.ok)
     return result.json();

    throw Error(result.statusText);
  }

  extractCode (resultUrl: string): string | undefined {
    const response = parse(resultUrl, true).query;

    if (response.error) {
      throw new Error(response.error_description || response.error);
    }

    return response.code;
  }

  @boundMethod
  async authenticate (options = {}, interactive = true, providerName: string): Promise<Response> {
    const {domain, clientId} = this;
    const {secret, hashed} = generateRandomChallengePair();
    if(! (providerName in Providers)){
      throw new Error(`there's no such provider: ${providerName}`);
    }
    
    const idProvider = Providers[providerName];
    Object.assign(options, {
      client_id: clientId,
      code_challenge: hashed,
      redirect_uri: this.getRedirectURL(),
      code_challenge_method: 'S256',
      response_type: 'code',
    });

    const authenticationType = idProvider.authType()
    const url = `https://${domain}/${authenticationType}?${qs.stringify(options)}`;
    const resultUrl = await this.getAuthResult(url, interactive);
    let code = this.extractCode(resultUrl);
    if(code === undefined){
      code = "";
    }
    return this.exchangeCodeForToken(code, secret, idProvider);
  }
}

export default PKCEClient;
