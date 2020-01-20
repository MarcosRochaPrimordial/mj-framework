import { Id, NotNull, MongoDocument } from 'decorated-mongo';

export class User extends MongoDocument {

    @Id()
    id: string;

    @NotNull()
    email: string;

    @NotNull()
    password: string;
}