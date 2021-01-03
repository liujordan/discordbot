import {BaseService} from "./BaseService";
import {Express} from 'express';
import {getLogger} from "../utils";
const logger = getLogger('express')

export class ExpressService extends BaseService {
  port = '80'
  host = '0.0.0.0'
  constructor() {
    super();
    const port = process.env.PORT || this.port
    const host = process.env.HOST || this.host
    const app = Express();
    app.get('/', (req, res) => {
      res.send("hello world!")
    })
    app.listen(port, host, () => {
      logger.info(`Example app listening at http://localhost:${port}`)
    })
  }
}
