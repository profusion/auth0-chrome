
export default class IdentityProvider {
    processHeaders(headers, appKey = null, appSecret = null){
        throw new Error('Must be implemented by a sub-class');
    }
    exchangeCodeUrl(baseUrl){
        throw new Error('Must be implemented by a sub-class');
    }
    filterFields(parameters){
        throw new Error('Must be implemented by a sub-class');
    }
    generatePayload(parameters){
        throw new Error('Must be implemented by a sub-class');
    }
    authVersion(){
        throw new Error('Must be implemented by a sub-class');
    };
    contentType(){
        throw new Error('Must be implemented by a sub-class');
    };
    authType(){
        throw new Error('Must be implemented by a sub-class');
    };
}
