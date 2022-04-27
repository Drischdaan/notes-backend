import { IsNumber, IsOptional, Min } from "class-validator";
import { IPaginationOptions } from "../models/pagination.models";

export class PaginationDto implements IPaginationOptions {

  @IsOptional()
  @IsNumber()
  @Min(1)
  page?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  limit?: number;
  
}