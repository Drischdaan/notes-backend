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

  @Exclude()
  @Column({ nullable: true })
  accessToken: string;

  @Exclude()
  @Column({ nullable: true })
  refreshToken: string;

  @BeforeInsert()
  @BeforeUpdate()
  public async beforeHook(): Promise<void> {
    if(this.password !== undefined)
      this.password = await bcrypt.hash(this.password, 10);
    if(this.refreshToken !== undefined)
      this.refreshToken = await bcrypt.hash(this.refreshToken, 10);
    if(this.accessToken !== undefined)
      this.accessToken = await bcrypt.hash(this.accessToken, 10);
  }

}