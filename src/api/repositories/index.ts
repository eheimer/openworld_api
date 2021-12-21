import { getCustomRepository } from 'typeorm';

import UserRepository from './UserRepository';

export class RepoContainer {
  User: UserRepository;

  constructor(connection: string) {
    this.User = getCustomRepository(UserRepository, connection);
  }
}

export default RepoContainer;
