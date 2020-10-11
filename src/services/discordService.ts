import {Service} from "../di/serviceDecorator";
import {Client} from "discord.js";
import {environmentAsync} from "../config/environment";
import {getLogger} from "../utils/logger";
import {BaseService} from "./BaseService";

const logger = getLogger('discord');

@Service()
export class DiscordService extends BaseService {
  client: Client;

  async setup() {
    this.client = new Client();
    this.client.on('ready', () => {
      this.client.user.setActivity("%help").catch(logger.error);
      logger.info("Ready");
    });
  }

  login() {
    environmentAsync.then(config => {
      this.client.login(config.discord.auth.token).catch(logger.error);
    });
  }
}
