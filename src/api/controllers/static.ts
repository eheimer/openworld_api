import * as express from 'express'

import * as respond from '../../utils/express'

/**
 * The purpose of this route is to serve up the compiled client files for download
 *
 * @param req
 * @param res
 */
export async function clientFiles(req: express.Request, res: express.Response): Promise<void> {
  try {
    respond.HTML_OK(
      res,
      `
<!DOCTYPE html>
<html>
   <head>
      <title>Hello world</title>
   </head>
   
   <body>
    <p>Click link below to download:</p>
    <a href='/files/openworld_android.apk'>Android</a><br />
   </body>
</html>`
    )
  } catch (err) {
    return respond.INTERNAL_SERVER_ERROR(res, 'Internal Server Error')
  }
}
