import { IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class AccountUpdateDto {

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(36)
  username?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(100)
  password?: string;

}