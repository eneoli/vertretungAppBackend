import * as crypto from 'crypto';

export class Crypt {
    public static encrypt(publicKey: string, data: string): string {
        const encrypted = crypto.publicEncrypt({
            key: publicKey,
            padding: crypto.constants.RSA_PKCS1_PADDING,
        }, Buffer.from(data));

        return encrypted.toString('base64');
    }

    public static decrypt(privateKey: string, data: string) {
        const decrypted = crypto.privateDecrypt({
            key: privateKey,
            padding: crypto.constants.RSA_PKCS1_PADDING,
        }, Buffer.from(data, 'base64'));

        return decrypted.toString('utf-8');
    }
}