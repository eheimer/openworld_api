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
      <title>Openworld client</title>
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
   </head>
   
   <body>
    <p>Click link below to download:</p>
    <a href='/files/openworld_android.apk'>Android</a><br />
    <p>Or run the <a href='/run'>web client</a> in your browser.
   </body>
</html>`
    )
  } catch (err) {
    return respond.INTERNAL_SERVER_ERROR(res, 'Internal Server Error')
  }
}
