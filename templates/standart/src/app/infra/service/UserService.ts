import { Injectable } from 'decorated-router';

import { UserDTO } from '../../domain/dto/UserDTO';
import { User } from '../../domain/entity/User';
import { Encrypt } from '../configs/Encrypt';
import { ResultNotification } from '../../domain/notification/ResultNotification';
import { Security } from '../configs/Security';

@Injectable()
export class UserService {

    users: User[] = [];

    doLogin(userDto: UserDTO): Promise<ResultNotification<UserDTO>> {
        return new Promise((resolve, reject) => {
            let resultNotification: ResultNotification<UserDTO> = new ResultNotification();

            const result = this.findForEmail(userDto.email);
            if (result) {
                if (Encrypt.compareHash(userDto.password, result.password)) {
                    let returnedUserDto = new UserDTO();
                    returnedUserDto.id = result.id;
                    returnedUserDto.email = result.email;
                    returnedUserDto.token = Security.sign(userDto.email, 86400);
                    resultNotification.setResult(returnedUserDto);
                } else {
                    resultNotification.addError('Invalid login');
                }
            } else {
                resultNotification.addError('Invalid login');
            }

            resolve(resultNotification);
        });
    }

    signUp(userDto: UserDTO): Promise<ResultNotification<boolean>> {
        return new Promise((resolve, reject) => {
            let resultNotification: ResultNotification<boolean> = new ResultNotification();
            let user: User = userDto.toEntity();

            const result = this.findForEmail(userDto.email);
            if (!result) {
                user.password = Encrypt.genHash(user.password);
                user.id = (this.users.length + 1).toString();
                this.users.push(user);
                resultNotification.setSuccess(true);
                resolve(resultNotification);
            } else {
                resultNotification.addError('Email already registered');
                resolve(resultNotification);
            }
        });
    }

    private findForEmail(email: string): User {
        return this.users.find(u => u.email === email);
    }
}