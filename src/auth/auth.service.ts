import { createHash } from 'node:crypto';

import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/sqlite';
import { Injectable } from '@nestjs/common';

import { User } from './entities/user.entity';
import { CreateUserDTO } from './data-objects/create-user.dto';
import { UpdateUserDTO } from './data-objects/update-user.dto';
import { ListUsersQueryDTO } from './data-objects/list-users-query.dto';


@Injectable()
export class AuthService
{
    constructor(
        @InjectRepository(User) private userRepo: EntityRepository<User>,
        private jwtService: JwtService
    ) {}

    public async findAll(query: ListUsersQueryDTO): Promise<Partial<User>[]>
    {
        let { page = 1, limit = 10, q } = query;

        if (q !== undefined) {
            q = q.trim();
        }

        const offset = (page - 1) * limit;

        const where: any = {};

        if (q !== '') {
            where.$or = [
                { name: { $like: `%${q}%` } },
                { email: { $like: `%${q}%` } }
            ];
        }

        const users = await this.userRepo.findAll({ fields: ['id', 'name', 'email'], offset, limit, where });

        return users;
    }

    public async findOne(id: number): Promise<User | null>
    {
        const user = await this.userRepo.findOne(id);
        return user;
    }

    public async create(data: CreateUserDTO): Promise<void>
    {
        data.createdAt = new Date();
        data.password = this.hashPassword(data.password);
        await this.userRepo.insert(data);
    }

    public async update(id: number, data: UpdateUserDTO): Promise<void>
    {
        if (data.password !== undefined) {
            data.password = this.hashPassword(data.password);
        }

        await this.userRepo.nativeUpdate({ id }, data);
    }

    public async delete(id: number): Promise<void>
    {
        await this.userRepo.nativeDelete(id);
    }

    public async authenticate(email: string, password: string): Promise<User | null>
    {
        const user = await this.userRepo.findOne({ email });

        if (user === null) {
            return null;
        }

        const isPasswordValid = user.password === this.hashPassword(password);

        if (!isPasswordValid) {
            return null;
        }

        return user;
    }

    public async generateJWT(user: User): Promise<string>
    {
        const payload = { sub: user.id, email: user.email };
        return this.jwtService.signAsync(payload);
    }

    protected hashPassword(password: string): string
    {
        return createHash('sha256').update(password).digest('hex');
    }
}
