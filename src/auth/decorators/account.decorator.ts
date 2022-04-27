import { createParamDecorator, ExecutionContext, HttpException, HttpStatus } from "@nestjs/common";
import { Request } from "express";
import { IAccountEntity } from "../../account/models/account.models";

export const CurrentAccount = createParamDecorator((data: any, context: ExecutionContext) => {
  const account: IAccountEntity = context.switchToHttp().getRequest().user;
  if(account === undefined)
    throw new HttpException('Internal authentication error', HttpStatus.INTERNAL_SERVER_ERROR);
  return account;
});