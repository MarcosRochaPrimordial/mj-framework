import { Injectable } from 'decorated-router';

import { UserDTO } from './../../application/dto/UserDTO';
import { User } from './../entity/User';
import { Encrypt } from './../../infra/configs/Encrypt';
import { Notification } from './../../application/notification/Notification';
import { Security } from './../../infra/configs/Security';
import { UserRepository } from './../../infra/repository/UserRepository';

@Injectable()
export class UserService {

    constructor(
        private userRepository: UserRepository
    ) { }

    public doLogin(userDto: UserDTO): Promise<Notification<UserDTO>> {
        let resultNotification: Notification<UserDTO> = new Notification();
        return this.userRepository.findForEmail(userDto.email)
            .then((user: User) => {
                if (user && Encrypt.compareHash(userDto.password, user.password)) {
                    userDto = UserDTO.fromEntity(user);
                    userDto.token = Security.sign(userDto.email, 86400);
                    return resultNotification.setResult(userDto);
                } else {
                    return resultNotification.addError('Invalid login');
                }
            })
            .catch(err => resultNotification.addError(err));
    }

    public signUp(userDto: UserDTO): Promise<Notification<number>> {
        let resultNotification: Notification<number> = new Notification();

        return this.userRepository.findForEmail(userDto.email)
            .then((data: User) => {
                if (!data) {
                    const user = userDto.toEntity();
                    user.password = Encrypt.genHash(user.password);
                    return this.userRepository.insert(user)
                        .then((insertedId: number) => {
                            return resultNotification.setResult(insertedId);
                        })
                        .catch(err => resultNotification.addError(err));
                } else {
                    return resultNotification.addError('Email already registered');
                }
            })
            .catch((err) => resultNotification.addError(err));
    }
}