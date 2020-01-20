import { Controller, Post, RequestBody } from 'decorated-router';

import { UserService } from '../infra/service/UserService';
import { UserDTO } from '../domain/dto/UserDTO';

@Controller({
    url: '/login',
    cors: '*',
    auth: null
})
export class LoginController {

    constructor(
        private userService: UserService
    ) { }

    @Post()
    doLogin(@RequestBody() userDto: UserDTO) {
        return this.userService.doLogin(userDto);
    }
    
    @Post('/signup')
    signUp(@RequestBody() userDto: UserDTO) {
        return this.userService.signUp(userDto);
    }
}