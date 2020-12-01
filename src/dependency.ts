import {DependencyContainer} from "tsyringe";
import * as services from "./services";
import * as command from "./command";
import * as config from "./provider/configuration";
import * as utils from "./utils";
export class DependencyInjection {
    public static register(container: DependencyContainer, options?) {
        services.DependencyInjection.register(container)
        config.DependencyInjection.register(container)
        utils.DependencyInjection.register(container)
        command.DependencyInjection.register(container)
    }
}
