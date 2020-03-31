import {BaseCommand} from "./baseCommand";
import {RedisCommand} from "../services/redisService";
import {TextChannel} from "discord.js";
import {renderLink} from "../maplestory/maplestoryApi";
import {Avatar2} from "../maplestory/interfaces";
import {MaplestoryApi} from "../services/maplestoryService";

const defaultAvatar: Avatar2 = {
  items: [
    {id: 2000},
    {id: 12000},
    {id: 31231},
    {id: 1041142},
    {id: 1062231},
    {id: 1072324},
    {id: 20038}
  ]
};

export class Me extends BaseCommand {

  helpString = "Shows of your current character";

  execute(rc: RedisCommand) {
    this.getChannel(rc).then((channel: TextChannel) => {
      this.ms.getItemCategories().then(() => {
        this.mc.getAvatar(rc.data.user_id).then(av => {
          let asdf = (av2) => {
            channel.send("", {
              "embed": {
                image: {
                  url: renderLink(av2.items)
                }
              }
            }).catch(this.logger.error);
          };

          if (av == null) {
            this.mc.addAvatar(rc.data.user_id, defaultAvatar).then(asdf);
          } else {
            asdf(av);
          }
        });
      });
    });
  }
}