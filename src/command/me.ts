import {BaseCommand} from "./baseCommand";
import {RedisCommand} from "../utils/redisConnector";
import {TextChannel} from "discord.js";
import {Avatar2, MaplestoryApi, renderLink} from "../maplestory/maplestoryApi";

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

const ms: MaplestoryApi = MaplestoryApi.getInstance();

export class Me extends BaseCommand {

  execute(rc: RedisCommand) {
    this.getChannel(rc).then((channel: TextChannel) => {
      ms.getItemCategories().then(() => {
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