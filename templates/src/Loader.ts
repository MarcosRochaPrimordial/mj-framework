import { LoadApp, METHOD, HEADER } from 'decorated-router';
import { LoginController } from './app/application/controller/LoginController';
require('dotenv').config();

@LoadApp({
    controllers: [
        LoginController
    ],
    server: {
        port: 3001,
        methods: [METHOD.GET, METHOD.POST, METHOD.PUT, METHOD.DELETE, METHOD.PATCH, METHOD.OPTIONS],
        headers: [HEADER.ORIGIN, HEADER.XREQUESTEDWITH, HEADER.CONTENTTYPE, HEADER.ACCEPT, HEADER.AUTHORIZATION]
    }
})
class Loader { }