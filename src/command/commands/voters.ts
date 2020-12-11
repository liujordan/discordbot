import {BaseCommand} from "./baseCommand";
import {ParsedMessage} from "discord-command-parser";
import {Message} from "discord.js";
import * as Topgg from "@top-gg/sdk";
import {container} from "tsyringe";
import {ConfigProvider} from "../../provider/configuration";

export class Voters extends BaseCommand {
  name: string = "voters";
  helpString: string = "A message to all the supporters on top.gg";

  protected configProvider: ConfigProvider = container.resolve("ConfigProvider")

  async execute(pm: ParsedMessage<Message>) {
    const config = await this.configProvider.getConfig()
    const api = new Topgg.Api(config.topggApi.key)
    const users = await api.getVotes()

    let message = `Hey ${users.map(u => u.username).join(", ")}!\nThank you for voting!`
    this.send(pm, message)
  }
}
