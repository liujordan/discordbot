import {AwsAppConfigProvider} from "../src/provider/configuration/configProvider";

describe("aws appconfig configuration provider", () => {
  it("credentials", async () => {
    const asdf = new AwsAppConfigProvider();
    const asdf2 = await asdf.getConfig();
    console.log(asdf2);
  });
});
