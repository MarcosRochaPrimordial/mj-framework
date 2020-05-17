import { Controller, Post, Body } from 'decorated-router';

import { UserService } from './../../domain/service/UserService';
import { UserDTO } from './../../domain/dto/UserDTO';

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
    doLogin(@Body() userDto: UserDTO) {
        return this.userService.doLogin(userDto);
    }
    
    @Post('/signup')
    signUp(@Body() userDto: UserDTO) {
        return this.userService.signUp(userDto);
    }
}