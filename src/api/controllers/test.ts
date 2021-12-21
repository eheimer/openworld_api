import * as express from 'express'

import * as respond from '../../utils/express'

/**
 * The purpose of this route is to serve up the socket.io client for browsers to be able to test the socket.io functionality
 *
 * @param req
 * @param res
 */
export async function socketTest(req: express.Request, res: express.Response): Promise<void> {
  try {
    console.log('Socket test')
    respond.HTML_OK(
      res,
      `
<!DOCTYPE html>
<html>
   <head>
      <title>Hello world</title>
   </head>
   <script src = "/socket.io/socket.io.js"></script>
   
   <script>
      var socket = io();
      socket.on('test', (arg)=>{
        console.log('Test message received: ', arg);
      })
   </script>
   <body>Hello world</body>
</html>`
    )
  } catch (err) {
    return respond.INTERNAL_SERVER_ERROR(res, 'Internal Server Error')
  }
}
