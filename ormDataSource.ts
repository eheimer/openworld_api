import { DataSource } from 'typeorm'
import dbconfig from './ormconfig.js'

export const connectionSource = new DataSource(dbconfig)
