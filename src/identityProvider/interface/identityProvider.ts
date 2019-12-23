import PayloadParameters from './payloadParameters'


export default interface IdentityProvider {
    generatePayload(parameters: PayloadParameters): string;
    authVersion(): string;
    contentType(): string;
    authType(): string;
}

