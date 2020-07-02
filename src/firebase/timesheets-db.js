import GenericDB from './generic-db'

export default class TimesheetsDB extends GenericDB {
  constructor() {
    super(`timesheets`)
  }
}
