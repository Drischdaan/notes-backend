import { BeforeInsert, BeforeUpdate, Column, Entity } from "typeorm";
import { ApiEntity } from "../../_common/entities/api.entity";
import { IAccountEntity } from "../models/account.models";
import { Exclude } from "class-transformer";
import * as bcrypt from 'bcrypt';


@Entity('accounts')
export class AccountEntity extends ApiEntity implements IAccountEntity {
  
  @Column({ unique: true })
  username: string;

  @Exclude()
  @Column()
  password: string;

  @Column({ nullable: true })
  avatar: string;

  @BeforeInsert()
  @BeforeUpdate()
  public async beforeHook(): Promise<void> {
    if(this.password !== undefined)
      this.password = await bcrypt.hash(this.password, 10);
  }

  public async comparePassword(password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.password);
  }

}