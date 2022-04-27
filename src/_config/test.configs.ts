import faker from "@faker-js/faker";

export default () => ({
  'ACCESS_TOKEN_SECRET': faker.datatype.uuid(),
  'REFRESH_TOKEN_SECRET': faker.datatype.uuid(),
  'ACCESS_TOKEN_EXPIRATION': '1m',
  'REFRESH_TOKEN_EXPIRATION': '1m',
});