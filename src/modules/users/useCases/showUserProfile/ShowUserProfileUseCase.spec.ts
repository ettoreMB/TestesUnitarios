import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../createUser/ICreateUserDTO";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

let usersRepositoryInMemory: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let showUserProfileUseCase: ShowUserProfileUseCase;

describe('Show User Profile tests', () => {
  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
    showUserProfileUseCase = new ShowUserProfileUseCase(usersRepositoryInMemory);
  })

  it('Should be able to list an UserProfile', async () => {
    const user = await createUserUseCase.execute({
      name: 'Fake User',
      email: 'fake@fake.com',
      password: '123'
    })

    const response = await showUserProfileUseCase.execute(user.id || 'test')

    expect(response.name).toBe('Fake User');
  })

  it('Should not be able to show a nonexisting user', () => {
    expect(async () => {
      const user = await createUserUseCase.execute({
        name: 'Fake User',
        email: 'fake@fake.com',
        password: '123'
      })

      const response = await showUserProfileUseCase.execute('wrong user' || 'test')
    }).rejects.toBeInstanceOf(AppError)
  })
})
