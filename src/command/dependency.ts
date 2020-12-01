import {DependencyContainer} from "tsyringe";
import {BaseCommand} from "./commands/baseCommand";
import {Define, Inv, Me, Ndefine, Shop} from "./commands";

export class DependencyInjection {
    public static register(container: DependencyContainer, options?) {
        container
            .register<BaseCommand>("Command", {useClass: Ndefine})
            .register<BaseCommand>("Command", {useClass: Define})
            // .register<BaseCommand>("Command", {useClass: Inv})
            // .register<BaseCommand>("Command", {useClass: Me})
            // .register<BaseCommand>("Command", {useClass: Shop})
    }
}
