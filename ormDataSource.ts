import { DataSource } from 'typeorm'
import dbconfig from './ormconfig'

export const connectionSource = new DataSource(dbconfig)
