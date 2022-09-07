import { dbconfig } from './ormconfig'
import { DataSource } from 'typeorm'

/**
 * @description This file is required for the TypeOrm cli to work. It is not
 * used by the application.
 */
export const connectionSource = new DataSource(dbconfig)
