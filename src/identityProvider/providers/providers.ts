import CognitoIDProvider from "./cognito";
import Auth0IDProvider from "./auth0";
import IProvider from "./../interface/identityProvider"

export const ProviderNames = {
    AWS_COGNITO: "AWS_COGNITO",
    AUTH0: "AUTH0"
};


export const Providers:  { [name: string]: IProvider}  = {
    "AWS_COGNITO" : new CognitoIDProvider(),
    "AUTH0" : new Auth0IDProvider()
};
