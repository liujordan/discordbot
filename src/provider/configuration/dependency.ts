import {DependencyContainer} from "tsyringe";
import {
  AwsAppConfigProvider,
  ConfigProvider,
  EnvironmentConfigProvider,
  JsonConfigProvider
} from "./configProvider";

export class DependencyInjection {
  public static register(container: DependencyContainer, options?) {
    switch (process.env['CONFIG_SOURCE']) {
      case "aws":
        container.register<ConfigProvider>("ConfigProvider", {useClass: AwsAppConfigProvider})
        break
      case "json":
        container.register<ConfigProvider>("ConfigProvider", {useClass: JsonConfigProvider})
        break
      case "env":
        container.register<ConfigProvider>("ConfigProvider", {useClass: EnvironmentConfigProvider})
    }
  }
}
