import {BaseCommand} from "./baseCommand";
import {Avatar2} from "../maplestory/interfaces";

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
  //
  // execute(rc: RedisCommand) {
  //   rc.user.getAvatar().then(a => a.render()).then(buff => {
  //     let embed = new MessageEmbed()
  //       .attachFiles([{attachment: buff, name: rc.user._id + ".png"}])
  //       .setImage(`attachment://${rc.user._id}.png`);
  //     rc.channel.send(embed);
  //   });
  // }
}
