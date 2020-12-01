import {BaseCommand} from "./baseCommand";
import {ParsedMessage} from "discord-command-parser";
import {injectable} from "tsyringe";

@injectable()
export class Inv extends BaseCommand {
  name = "inv"
  helpString = "View your inventory"

  async execute(rc: ParsedMessage<any>): Promise<void> {
    // rc.user
    // .getAvatar()
    // .then(a => a.getInventory())
    // .then(inv => {
    //   const page = parseInt(rc.arguments[0]) - 1 || 0;
    //   if (rc.arguments.length === 2) {
    //     // check for x:y format
    //     if (!/^[0-9]+:[0-9]+$/g.test(rc.arguments[1])) return;
    //
    //     let coords = rc.arguments[1].split(":");
    //     let item = inv.getItem(page, parseInt(coords[0]) - 1, parseInt(coords[1]) - 1);
    //
    //     return item.getEmbed().then(i => rc.channel.send(i));
    //   } else {
    //     inv.renderPage(page).then(invImage => {
    //       let embed = new MessageEmbed()
    //         .attachFiles([{attachment: invImage, name: `${rc.data.user_id}_inv_0.png`}])
    //         .setImage(`attachment://${rc.data.user_id}_inv_0.png`);
    //       rc.channel.send(embed).catch(this.logger.error);
    //     });
    //   }
    // });
  }
}
