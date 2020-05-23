import { DataObject } from 'decorated-router';
import { Mapper } from './../../domain/utils/Mapper';
import { User } from './../../domain/entity/User';

@DataObject()
export class UserDTO {

    user_id: string;
    email: string;
    password: string;
    token: string;

    public static fromEntity(entity: User): UserDTO {
        if (!entity) {
            return null;
        }

        const user = Mapper.map<UserDTO>(entity, new UserDTO());
        delete user.password;
        return user;
    }

    public toEntity(): User {
        return Mapper.map<User>(this, new User());
    }
}