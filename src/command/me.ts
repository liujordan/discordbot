import {BaseCommand} from "./baseCommand";
import {RedisCommand} from "../utils/redisConnector";
import {TextChannel} from "discord.js";
import {Avatar, getItemCategories, render} from "../utils/maplestoryApi";

const data = {
  "id": 1584088799827,
  "type": "character",
  "action": "stand1",
  "emotion": "blink",
  "skin": 2000,
  "zoom": 1,
  "frame": 0,
  "mercEars": false,
  "illiumEars": false,
  "selectedItems": {
    "Body": {
      "name": "Body",
      "noIcon": true,
      "id": 2000,
      "region": "GMS",
      "version": "211.1.0",
      "typeInfo": {
        "overallCategory": "Character",
        "category": "Character",
        "subCategory": "Body",
        "lowItemId": 2000,
        "highItemId": 2999
      }
    },
    "Head": {
      "name": "Head",
      "noIcon": true,
      "id": 12000,
      "region": "GMS",
      "version": "211.1.0",
      "typeInfo": {
        "overallCategory": "Character",
        "category": "Character",
        "subCategory": "Head",
        "lowItemId": 12000,
        "highItemId": 12999
      }
    },
    "Face": {
      "requiredJobs": [
        "Beginner"
      ],
      "isCash": true,
      "requiredGender": 2,
      "name": "Marble Eyes (Black)",
      "desc": "",
      "id": 20038,
      "typeInfo": {
        "overallCategory": "Equip",
        "category": "Character",
        "subCategory": "Face",
        "lowItemId": 20000,
        "highItemId": 29999
      },
      "region": "GMS",
      "version": "211.1.0"
    },
    "Hair": {
      "requiredJobs": [
        "Beginner"
      ],
      "isCash": false,
      "requiredGender": 2,
      "name": "Red Rose",
      "desc": "",
      "id": 31231,
      "typeInfo": {
        "overallCategory": "Equip",
        "category": "Character",
        "subCategory": "Hair",
        "lowItemId": 30000,
        "highItemId": 49999
      },
      "region": "GMS",
      "version": "211.1.0"
    },
    "Top": {
      "requiredJobs": [
        "Beginner"
      ],
      "requiredLevel": 0,
      "isCash": true,
      "requiredGender": 1,
      "name": "Ribbon Frilled top",
      "desc": "",
      "id": 1041142,
      "typeInfo": {
        "overallCategory": "Equip",
        "category": "Armor",
        "subCategory": "Top",
        "lowItemId": 1040000,
        "highItemId": 1050000
      },
      "region": "GMS",
      "version": "211.1.0"
    },
    "Bottom": {
      "requiredJobs": [
        "Beginner"
      ],
      "requiredLevel": 0,
      "isCash": true,
      "requiredGender": 2,
      "name": "All About Jeans",
      "desc": "",
      "id": 1062231,
      "typeInfo": {
        "overallCategory": "Equip",
        "category": "Armor",
        "subCategory": "Bottom",
        "lowItemId": 1060000,
        "highItemId": 1070000
      },
      "region": "GMS",
      "version": "211.1.0"
    },
    "Shoes": {
      "requiredJobs": [
        "Beginner"
      ],
      "requiredLevel": 0,
      "isCash": true,
      "requiredGender": 2,
      "name": "Piggy Slippers",
      "desc": "",
      "id": 1072324,
      "typeInfo": {
        "overallCategory": "Equip",
        "category": "Armor",
        "subCategory": "Shoes",
        "lowItemId": 1070000,
        "highItemId": 1080000
      },
      "region": "GMS",
      "version": "211.1.0"
    },
    "Ring": {
      "requiredJobs": [
        "Beginner"
      ],
      "requiredLevel": 0,
      "isCash": true,
      "requiredGender": 2,
      "name": "Blue Shooting Star Ring",
      "desc": "",
      "id": 1112925,
      "typeInfo": {
        "overallCategory": "Equip",
        "category": "Accessory",
        "subCategory": "Ring",
        "lowItemId": 1110000,
        "highItemId": 1120000
      },
      "region": "GMS",
      "version": "211.1.0"
    },
    "Cash": {
      "requiredJobs": [
        "Beginner"
      ],
      "requiredLevel": 0,
      "isCash": true,
      "requiredGender": 2,
      "name": "[MS Special] Tedimus Beartaculous",
      "desc": "A weapon skin that can be equipped over#c any weapon.#",
      "id": 1702388,
      "typeInfo": {
        "overallCategory": "Equip",
        "category": "One-Handed Weapon",
        "subCategory": "Cash",
        "lowItemId": 1701000,
        "highItemId": 1703000
      },
      "region": "GMS",
      "version": "211.1.0"
    }
  },
  "visible": true,
  "position": {
    "x": 0,
    "y": 0
  },
  "fhSnap": true,
  "animating": false
};

const defaultAvatar: Avatar = {
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

  execute(rc: RedisCommand) {
    this.getChannel(rc).then((channel: TextChannel) => {
      getItemCategories().then(resp => {
        let out = Object.keys(resp.data);
        this.mc.getAvatar(rc.data.user_id).then(av => {
          let asdf = (av2) => {
            channel.send("", {
              "embed": {
                image: {
                  url: render(av2.items)
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