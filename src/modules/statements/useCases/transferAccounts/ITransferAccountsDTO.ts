import { Statement } from "../../entities/Statement";

export type ITransferAccountsDTO =
  Pick<
    Statement,
    'user_id' |
    'sender_id' |
    'description' |
    'amount'
  >
