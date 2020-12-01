import {DependencyContainer, Lifecycle} from "tsyringe";
import {RapidApi} from "./rapidApi";

export class DependencyInjection {
  public static register(container: DependencyContainer, options?) {
    container.register<RapidApi>(RapidApi, RapidApi, {lifecycle: Lifecycle.Singleton});
  }
}
