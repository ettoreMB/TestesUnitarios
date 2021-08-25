import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository"
import { CreateUserUseCase } from "./CreateUserUseCase";

let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;

describe('Create User', ()=> {

  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  })

  it('Should be able to create a new user', async () => {
    const user = await createUserUseCase.execute({
      name: 'Fake User',
      email: 'fake@fake.com',
      password: '123'
    })


    expect(user).toHaveProperty('id')
  });

  it('Should not be able to create a new user if email already exists', () => {
    expect(async () => {
      await createUserUseCase.execute({
        name: 'Fake User',
        email: 'fake@fake.com',
        password: '123'
      });

      const user = await createUserUseCase.execute({
        name: 'Fake User',
        email: 'fake@fake.com',
        password: '123'
      })
    }).rejects.toBeInstanceOf(AppError)

  })
})
