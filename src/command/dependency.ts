import {DependencyContainer} from "tsyringe";
import {BaseCommand} from "./commands/baseCommand";
import {Define, Inv, Me, Ndefine, Shop} from "./commands";
import {Top} from "./commands/top";
import {Voters} from "./commands/voters";

export class DependencyInjection {
    public static register(container: DependencyContainer, options?) {
        container
            .register<BaseCommand>("Command", {useClass: Ndefine})
            .register<BaseCommand>("Command", {useClass: Define})
            .register<BaseCommand>("Command", Voters)
            // .register<BaseCommand>("Command", Top)
            // .register<BaseCommand>("Command", {useClass: Inv})
            // .register<BaseCommand>("Command", {useClass: Me})
            // .register<BaseCommand>("Command", {useClass: Shop})
    }
}
