import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class AccountCreateDto {
  
  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(36)
  username: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(100)
  password: string;

}