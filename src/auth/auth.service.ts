import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/sqlite';
import { Injectable } from '@nestjs/common';

import { User } from './entities/user.entity';
import { CreateUserDTO } from './data-objects/create-user.dto';
import { UpdateUserDTO } from './data-objects/update-user.dto';


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

    async create(data: CreateUserDTO): Promise<void>
    {
        data.createdAt = new Date();
        await this.userRepo.insert(data);
    }

    async update(id: number, data: UpdateUserDTO): Promise<void>
    {
        await this.userRepo.nativeUpdate({ id }, data);
    }

    async delete(id: number): Promise<void>
    {
        await this.userRepo.nativeDelete(id);
    }
}
