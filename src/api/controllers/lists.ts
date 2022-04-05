import * as express from 'express'
import * as respond from '../../utils/express'
import Skill from '../models/Skill'
import { getRepo } from '../../utils/db'

/**
 * get all available skills
 */
export async function getSkills(req: express.Request, res: express.Response): Promise<void> {
  try {
    const response = await getRepo('Skill', Skill).find()
    // 200: Success
    return respond.OK(res, response)
  } catch (err) {
    return respond.INTERNAL_SERVER_ERROR(res, 'Internal Server Error')
  }
}
