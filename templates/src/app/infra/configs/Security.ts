import * as jwt from 'jsonwebtoken';

export class Security {
    public static sign(word: string, expiresIn: number): string {
        return jwt.sign({ word }, process.env.TOKEN, {
            expiresIn
        });
    }

    public static verify(token: string) {
        return jwt.verify(token, process.env.TOKEN);
    }
}