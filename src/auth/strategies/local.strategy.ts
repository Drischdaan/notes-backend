import { HttpException, HttpStatus, Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { AuthService } from "../services/auth.service";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {

  constructor(
    private readonly authService: AuthService,
  ) {
    super();
  }

  public async validate(username: string, password: string): Promise<any> {
    const account = await this.authService.validateAccount({ username, password });
    if(account === undefined)
      throw new HttpException('Wrong username or password!', HttpStatus.UNAUTHORIZED);
    return account;
  }

}