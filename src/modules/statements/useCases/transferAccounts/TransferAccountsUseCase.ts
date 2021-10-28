import { inject, injectable } from "tsyringe";
import { AppError } from "../../../../shared/errors/AppError";
import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { OperationType, Statement } from "../../entities/Statement";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { ITransferAccountsDTO } from "./ITransferAccountsDTO";


@injectable()
export class TransferAccountsUseCase {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository,

    @inject("StatementsRepository")
    private statementsRepository: IStatementsRepository
  ) {}

  async execute({
    user_id,
    sender_id,
    description,
    amount,
  }: ITransferAccountsDTO): Promise<Statement> {
    const senderExists = await this.usersRepository.findById(sender_id);

    if (!senderExists) {
      throw new AppError("Sender Not exist")
    }

    const recipientExists = await this.usersRepository.findById(user_id);

    if (!recipientExists) {
      throw new AppError("user not exists")
    }

    const currentBalance = await this.statementsRepository.getUserBalance({
      user_id: sender_id,
      with_statement: false,
    });

    if (currentBalance.balance < amount) {
      throw new AppError('Insuficient Funds')
    }

    const transfer = await this.statementsRepository.create({
      user_id,
      sender_id,
      description,
      amount,
      type: OperationType.TRANSFER,
    });

    return transfer;
  }
}
