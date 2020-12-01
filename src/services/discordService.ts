import {Client} from "discord.js";
import {getLogger} from "../utils/logger";
import {BaseService} from "./BaseService";
import {ConfigProvider} from "../provider/configuration";
import {container} from "tsyringe";

const logger = getLogger('discord');
export class DiscordService extends BaseService {
  client: Client;
  protected configProvider: ConfigProvider = container.resolve("ConfigProvider")

  constructor() {
    super();
    this.client = new Client();
    this.client.on('ready', () => {
      this.client.user.setActivity("%help").catch(logger.error);
      logger.info("Ready");
    });
    this.login()
  }

  login() {
    this.configProvider.getConfig().then(config => {
      this.client.login(config.discord.auth.token).catch(logger.error);
    });
  }
}
