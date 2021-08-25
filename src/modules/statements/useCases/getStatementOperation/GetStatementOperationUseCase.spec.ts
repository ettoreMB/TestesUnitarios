import { GetStatementOperationError } from "./GetStatementOperationError";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";


let statementsRepositoryInMemory: InMemoryStatementsRepository;
let usersRepositoryInMemory: InMemoryUsersRepository;
let getStatementOperationUseCase: GetStatementOperationUseCase;

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

describe("Get Statement Operation", () => {
  beforeEach(() => {
    statementsRepositoryInMemory = new InMemoryStatementsRepository();
    usersRepositoryInMemory = new InMemoryUsersRepository();
    getStatementOperationUseCase = new GetStatementOperationUseCase(
      usersRepositoryInMemory,
      statementsRepositoryInMemory,
    );
  });
  it("Should be able to get a statement operation", async () => {
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

    const response =  await getStatementOperationUseCase.execute(
      {
        user_id: user.id as string,
        statement_id: statement.id as string
      }
    );

    expect(response.amount).toBe(300);
    expect(response.description).toBe("fake deposit");
  });

  it("Shouldn't be able to get statement operation of a non-existent user", async () => {
    expect(async () => {

      const statement = await statementsRepositoryInMemory.create({
        user_id: "fakeuserId",
        type: OperationType.DEPOSIT,
        description: "fake deposit",
        amount: 300,
      });

      await getStatementOperationUseCase.execute({user_id: "fake_id", statement_id: statement.id as string})
    }).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound);
  });
  it("Shouldn't be able to get statement operation of a non-existent statement", async () => {
    expect(async () => {

      const user = await usersRepositoryInMemory.create({
        name: 'Fake User',
        email: 'fake@fake.com',
        password: '123'
      });

      const statement = await statementsRepositoryInMemory.create({
        user_id: "fakeuserId",
        type: OperationType.DEPOSIT,
        description: "fake deposit",
        amount: 300,
      });


      await getStatementOperationUseCase.execute({user_id: user.id as string, statement_id: "fake_id"})
    }).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound);
  });
});
