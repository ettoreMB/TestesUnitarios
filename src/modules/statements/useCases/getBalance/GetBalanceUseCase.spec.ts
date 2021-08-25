import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { GetBalanceUseCase } from "./GetBalanceUseCase";

let statementsRepositoryInMemory: InMemoryStatementsRepository;
let usersRepositoryInMemory: InMemoryUsersRepository;
let getBalanceUseCase: GetBalanceUseCase;

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

describe('Get Balance Test', () => {
  beforeEach(() => {

    statementsRepositoryInMemory = new InMemoryStatementsRepository();

    usersRepositoryInMemory = new InMemoryUsersRepository();

    getBalanceUseCase = new GetBalanceUseCase(
      statementsRepositoryInMemory,
      usersRepositoryInMemory,
    );
  })

  it('Should be able to  get balance', async () => {
    const user = await usersRepositoryInMemory.create({
      name: 'Fake User',
      email: 'fake@fake.com',
      password: '123'
    });

    const statement = await statementsRepositoryInMemory.create({
      user_id: user.id as string,
      type: OperationType.DEPOSIT,
      description: "fake deposit",
      amount: 300,
    });

    const response = await getBalanceUseCase.execute({user_id: user.id as string})

    expect(response.balance).toBe(300)
  });

  it("Shouldn't be able to get balance of a non-existent user", async () => {
    expect(async () => {
      await getBalanceUseCase.execute({user_id: "fake_id"})
    }).rejects.toBeInstanceOf(AppError);
  });
})
