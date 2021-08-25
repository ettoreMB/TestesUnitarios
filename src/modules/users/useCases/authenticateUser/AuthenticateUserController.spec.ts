import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { ICreateUserDTO } from "../createUser/ICreateUserDTO";
import {AuthenticateUserUseCase} from "./AuthenticateUserUseCase";
import {CreateUserUseCase} from "../createUser/CreateUserUseCase";
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";

let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let authenticateUserCase: AuthenticateUserUseCase;


describe("Authenticate User", () => {


      beforeEach(() => {
          inMemoryUsersRepository = new InMemoryUsersRepository();
          createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
          authenticateUserCase = new AuthenticateUserUseCase(inMemoryUsersRepository);
      });


      it("Should be able to authenticate a user", async () => {
        const user = {
          name: "Fake User",
          email: "fake@email.com",
          password: "123",
        };
        await createUserUseCase.execute(user);

        expect(async () => {
          await authenticateUserCase.execute({
            email: "fake@email.com",
            password: "123",
          });
        });
      });

      it("should not be able to authenticate an user with an incorrect email", async () => {
        expect(async ()=> {
          const user: ICreateUserDTO = {
            name: "Fake User",
            email: "fake@email.com",
            password: "123",
      };

      await createUserUseCase.execute(user);

      await authenticateUserCase.execute({
        email: "fake Incorrect email",
        password: user.password,
      });
        }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
      });

      it("should not be able to authenticate an user with an incorrect password", async () => {
        expect(async ()=> {
          const user: ICreateUserDTO = {
            name: "Fake User",
            email: "fake@email.com",
            password: "123",
      };

      await createUserUseCase.execute(user);

      await authenticateUserCase.execute({
        email: user.email,
        password: "password test",
      });
        }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
      });
});
