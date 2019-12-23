import CognitoIDProvider from "./cognitoProvider";
import Auth0IDProvider from "./auth0Provider";
import DropboxIDProvider from "./dropboxProvider";


export const ProviderNames = {
    AWS_COGNITO: "AWS_COGNITO",
    AUTH0: "AUTH0",
    DROP_BOX: "DROP_BOX"
};


export const Providers =  {
    AWS_COGNITO : CognitoIDProvider,
    AUTH0: Auth0IDProvider,
    DROP_BOX: DropboxIDProvider,
};
