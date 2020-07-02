import GenericDB from './generic-db'

export default class ClientsDB extends GenericDB {
  constructor() {
    super(`clients`)
  }
}
