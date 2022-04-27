import { FindManyOptions, Repository } from "typeorm";
import { IPaginationOptions } from "../models/pagination.models";

export abstract class PaginationService<T> {

  constructor(
    private readonly repository: Repository<T>,
  ) {}

  public async getPaginated(query?: FindManyOptions<T>, options?: IPaginationOptions): Promise<T[]> {
    const findOptions: FindManyOptions<T> = query ?? {};
    if(options !== undefined) {
      if(options.page !== undefined)
        findOptions.skip = (options.page - 1) * (options.limit ?? 10);
      if(options.limit !== undefined)
        findOptions.take = options.limit;
    }
    return this.repository.find(findOptions);
  }

}