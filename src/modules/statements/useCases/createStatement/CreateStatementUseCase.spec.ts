import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "./CreateStatementUseCase";

let statementsRepositoryInMemory: InMemoryStatementsRepository;
let usersRepositoryInMemory: InMemoryUsersRepository;
let createStatementUseCase: CreateStatementUseCase;;

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

describe('Create Statement Tests', () => {
  beforeEach(() => {
    statementsRepositoryInMemory = new InMemoryStatementsRepository();
    usersRepositoryInMemory = new InMemoryUsersRepository();
    createStatementUseCase = new CreateStatementUseCase(
      usersRepositoryInMemory,
      statementsRepositoryInMemory,
    );
  })

  it('should be able to create a new statement', async () => {
    const user = await usersRepositoryInMemory.create({
      name: 'Fake User',
      email: 'fake@fake.com',
      password: '123'
    });

    const statement = await createStatementUseCase.execute({
      user_id: user.id as string,
      type: OperationType.DEPOSIT,
      description: "fake deposit",
      amount: 300,
    })

    expect(statement).toHaveProperty('user_id');
    expect(statement).toHaveProperty('id');

  })

  it('should not be able to crate a statement for  nonexisting user',() => {
   expect(async () => {
    const statement = await createStatementUseCase.execute({
      user_id: 'fakeuser',
      type: OperationType.DEPOSIT,
      description: "fake deposit",
      amount: 300,
    })
   }).rejects.toBeInstanceOf(AppError)

  })

  it('should not be able to withdraw amount grater than the balance', () => {
    expect(async() => {
      const user = await usersRepositoryInMemory.create({
        name: 'Fake User',
        email: 'fake@fake.com',
        password: '123'
      });

      const statement = {
        user_id: user.id as string,
        type: OperationType.WITHDRAW,
        description: "fake withdraw",
        amount: 10,
      }

      await createStatementUseCase.execute(statement)
    }).rejects.toBeInstanceOf(AppError)
  })
})
