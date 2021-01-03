import {DiscordService} from "./discordService";
import {RedisService} from "./caching/redisService";
import {MaplestoryApi} from "./maplestoryService";
import {MemoryCache} from "./caching/memoryCache";
import {DependencyContainer, Lifecycle} from "tsyringe";
import {DynamoDb} from "./dynamo";
import {NWord} from "./nword";
import {ExpressService} from "./expressService";

export class DependencyInjection {
    public static register(container: DependencyContainer, options?) {
        container.register<MemoryCache>(MemoryCache, {useClass: MemoryCache}, {lifecycle: Lifecycle.Singleton})
        container.register<DiscordService>(DiscordService, {useClass: DiscordService}, {lifecycle: Lifecycle.Singleton})
        container.register<RedisService>(RedisService, {useClass: RedisService}, {lifecycle: Lifecycle.Singleton})
        container.register<MaplestoryApi>(MaplestoryApi, {useClass: MaplestoryApi}, {lifecycle: Lifecycle.Singleton})
        container.register<DynamoDb>(DynamoDb, DynamoDb, {lifecycle: Lifecycle.Singleton})
        container.register<ExpressService>(ExpressService, ExpressService, {lifecycle: Lifecycle.Singleton})
        // container.register<NWord>(NWord, NWord, {lifecycle: Lifecycle.Singleton})
    }
}
