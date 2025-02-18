import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/sqlite';
import { Injectable } from '@nestjs/common';

import User from './entities/user';

@Injectable()
export class AuthService
{
    constructor(
        @InjectRepository(User) private userRepo: EntityRepository<User>
    ) {}

    async findAll(): Promise<User[]>
    {
        const users = await this.userRepo.findAll();
        return users;
    }

    async findOne(id: number): Promise<User | null>
    {
        const user = await this.userRepo.findOne(id);
        return user;
    }

    async create(user: User): Promise<void>
    {
        this.userRepo.create(user);
    }

    async update(id: number, user: User): Promise<void>
    {
        await this.userRepo.nativeUpdate({ id }, user);
    }

    async delete(id: number): Promise<void>
    {
        await this.userRepo.nativeDelete(id);
    }
}
