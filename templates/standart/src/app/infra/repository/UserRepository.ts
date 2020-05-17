import { User } from './../../domain/entity/User';

export class UserRepository {

    users: User[] = [];

    public insert(user: User): Promise<number> {
        return new Promise((resolve, reject) => {
            user.user_id = this.users.length;
            this.users.push(user);
            resolve(user.user_id);
        });
    }

    public findForEmail(email: string): Promise<User> {
        return new Promise((resolve, reject) => {
            resolve(this.users.find(user => user.email === email));
        });
    }
}