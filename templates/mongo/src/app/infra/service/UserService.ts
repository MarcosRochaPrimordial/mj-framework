import { Injectable } from 'decorated-router';
import { MongoCRUD, Fndr } from 'decorated-mongo';

import { UserDTO } from '../../domain/dto/UserDTO';
import { User } from '../../domain/entity/User';
import { Encrypt } from '../configs/Encrypt';
import { ResultNotification } from '../../domain/notification/ResultNotification';
import { Security } from '../configs/Security';

@Injectable()
export class UserService {

    doLogin(userDto: UserDTO): Promise<ResultNotification<UserDTO>> {
        return new Promise((resolve, reject) => {
            let resultNotification: ResultNotification<UserDTO> = new ResultNotification();

            this.findForEmail(userDto.email)
                .then((results: User[]) => {
                    if (results.length) {
                        const result = results[0];
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
                })
                .catch(err => {
                    resultNotification.addError('Service unavailable');
                    reject(resultNotification);
                });
        });
    }

    signUp(userDto: UserDTO): Promise<ResultNotification<boolean>> {
        return new Promise((resolve, reject) => {
            let resultNotification: ResultNotification<boolean> = new ResultNotification();
            let user: User = userDto.toEntity();

            this.findForEmail(userDto.email)
                .then((results: User[]) => {
                    if (!results.length) {
                        user.password = Encrypt.genHash(user.password);
                        user.save()
                            .then(() => {
                                resultNotification.setSuccess(true);
                                resolve(resultNotification);
                            })
                            .catch(err => {
                                resultNotification.addError('Service unavailable');
                                reject(resultNotification);
                            });
                    } else {
                        resultNotification.addError('Email already registered');
                        resolve(resultNotification);
                    }
                })
                .catch(err => {
                    resultNotification.addError('Service unavailable');
                    reject(resultNotification);
                })
        });
    }

    private findForEmail(email: string) {
        const find = Fndr.where('email').equals(email);

        return MongoCRUD.findWhere(User, find);
    }
}