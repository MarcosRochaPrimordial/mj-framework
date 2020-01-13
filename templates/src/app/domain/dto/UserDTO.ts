import { DataObject } from 'decorated-router';
import { Mapper } from './../../../utils/Mapper';
import { User } from './../entity/User';

@DataObject()
export class UserDTO {

    id: string;
    email: string;
    password: string;
    token: string;

    public static fromEntity(entity: User): UserDTO {
        if (!entity) {
            return null;
        }

        return Mapper.map<UserDTO>(entity, new UserDTO());
    }

    public toEntity(): User {
        return Mapper.map<User>(this, new User());
    }
}