import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';

describe('UsersController', () => {
  let controller: UsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getUsers', () => {
    it('debería retornar "Get all"', () => {
      expect(controller.getUsers()).toBe('Get all');
    });
  });

  describe('getUser', () => {
    it('debería retornar el id del usuario solicitado', () => {
      const id = '1';
      expect(controller.getUser(id)).toBe(`Get ${id}`);
    });
  });

  describe('createUser', () => {
    it('debería retornar el body enviado', () => {
      const body = { name: 'Test User' };
      expect(controller.createUser(body)).toBe(`Post ${body}`);
    });
  });

  describe('updateUser', () => {
    it('debería retornar el id y body actualizados', () => {
      const id = '1';
      const body = { name: 'Updated User' };
      expect(controller.updateUser(id, body)).toBe(`Put ${id} ${body}`);
    });
  });

  describe('deleteUser', () => {
    it('debería retornar el id del usuario eliminado', () => {
      const id = '1';
      expect(controller.deleteUser(id)).toBe(`Delete ${id}`);
    });
  });

});
