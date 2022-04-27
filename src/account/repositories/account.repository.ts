import { EntityRepository, Repository } from "typeorm";
import { AccountEntity } from "../entities/account.entity";

@EntityRepository(AccountEntity)
export class AccountRepository extends Repository<AccountEntity> {

}