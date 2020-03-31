import {MaplestoryItem, TypeInfo} from "./maplestoryItem";

export interface Avatar2 {
  items: MaplestoryItem[]
}

export interface Accessory {
  item1: string;
  item2: number;
  item3: number;
}

export interface Armor {
  item1: string;
  item2: number;
  item3: number;
}

export interface Other {
  item1: string;
  item2: number;
  item3: number;
}

export interface OneHandedWeapon {
  item1: string;
  item2: number;
  item3: number;
}

export interface SecondaryWeapon {
  item1: string;
  item2: number;
  item3: number;
}

export interface TwoHandedWeapon {
  item1: string;
  item2: number;
  item3: number;
}

export interface Character {
  item1: string;
  item2: number;
  item3: number;
}

export interface Monster {
  item1: string;
  item2: number;
  item3: number;
}

export interface Mount {
  item1: string;
  item2: number;
  item3: number;
}

export interface Equip {
  Accessory: Accessory[];
  Armor: Armor[];
  Other: Other[];
  "One-Handed Weapon": OneHandedWeapon[];
  "Secondary Weapon": SecondaryWeapon[];
  "Two-Handed Weapon": TwoHandedWeapon[];
  Character: Character[];
  Monster: Monster[];
  Mount: Mount[];
}

export interface Consumable {
  item1: string;
  item2: number;
  item3: number;
}

export interface ArmorScroll {
  item1: string;
  item2: number;
  item3: number;
}

export interface WeaponScroll {
  item1: string;
  item2: number;
  item3: number;
}

export interface SpecialScroll {
  item1: string;
  item2: number;
  item3: number;
}

export interface CharacterModification {
  item1: string;
  item2: number;
  item3: number;
}

export interface Tablet {
  item1: string;
  item2: number;
  item3: number;
}

export interface Projectile {
  item1: string;
  item2: number;
  item3: number;
}

export interface MonsterFamiliar {
  item1: string;
  item2: number;
  item3: number;
}

export interface Recipe {
  item1: string;
  item2: number;
  item3: number;
}

export interface Other2 {
  item1: string;
  item2: number;
  item3: number;
}

export interface Use {
  Consumable: Consumable[];
  "Armor Scroll": ArmorScroll[];
  "Weapon Scroll": WeaponScroll[];
  "Special Scroll": SpecialScroll[];
  "Character Modification": CharacterModification[];
  Tablet: Tablet[];
  Projectile: Projectile[];
  "Monster/Familiar": MonsterFamiliar[];
  Recipe: Recipe[];
  Other: Other2[];
}

export interface Other3 {
  item1: string;
  item2: number;
  item3: number;
}

export interface Commerci {
  item1: string;
  item2: number;
  item3: number;
}

export interface EvolutionLab {
  item1: string;
  item2: number;
  item3: number;
}

export interface Nebulite {
  item1: string;
  item2: number;
  item3: number;
}

export interface Setup {
  Other: Other3[];
  Commerci: Commerci[];
  "Evolution Lab": EvolutionLab[];
  Nebulite: Nebulite[];
}

export interface Other4 {
  item1: string;
  item2: number;
  item3: number;
}

export interface CashShop {
  item1: string;
  item2: number;
  item3: number;
}

export interface Crafting {
  item1: string;
  item2: number;
  item3: number;
}

export interface Etc {
  Other: Other4[];
  "Cash Shop": CashShop[];
  Crafting: Crafting[];
}

export interface TimeSaver {
  item1: string;
  item2: number;
  item3: number;
}

export interface RandomReward {
  item1: string;
  item2: number;
  item3: number;
}

export interface EquipmentModification {
  item1: string;
  item2: number;
  item3: number;
}

export interface CharacterModification2 {
  item1: string;
  item2: number;
  item3: number;
}

export interface Weapon {
  item1: string;
  item2: number;
  item3: number;
}

export interface Accessory2 {
  item1: string;
  item2: number;
  item3: number;
}

export interface Appearance {
  item1: string;
  item2: number;
  item3: number;
}

export interface Pet {
  item1: string;
  item2: number;
  item3: number;
}

export interface FreeMarket {
  item1: string;
  item2: number;
  item3: number;
}

export interface MessengerAndSocial {
  item1: string;
  item2: number;
  item3: number;
}

export interface Miscellaneous {
  item1: string;
  item2: number;
  item3: number;
}

export interface Cash {
  "Time Saver": TimeSaver[];
  "Random Reward": RandomReward[];
  "Equipment Modification": EquipmentModification[];
  "Character Modification": CharacterModification2[];
  Weapon: Weapon[];
  Accessory: Accessory2[];
  Appearance: Appearance[];
  Pet: Pet[];
  "Free Market": FreeMarket[];
  "Messenger and Social": MessengerAndSocial[];
  Miscellaneous: Miscellaneous[];
}

export interface Category {
  Equip: Equip;
  Use: Use;
  Setup: Setup;
  Etc: Etc;
  Cash: Cash;
}

export interface CategoryItem {
  isCash: boolean;
  name: string;
  desc: string;
  id: number;
  typeInfo: TypeInfo;
}

export interface ItemsManager {
  equip?: CategoryItem[]
  use?: CategoryItem[]
  setup?: CategoryItem[]
  etc?: CategoryItem[]
  cash?: CategoryItem[]
}