import { AppConfig, DatabaseConfig, RedisConfig } from "./appConfig";
import dotenv from "dotenv"

import {IConfig} from "config"
import { logger } from "./observability";

export const getConfig:()=>Promise<AppConfig> = async () =>{

    // Load any ENV vars from local .env file
    if (process.env.NODE_ENV !== "production") {
        dotenv.config();
    }

    // Load configuration after Azure KeyVault population is complete
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const config: IConfig = require("config") as IConfig;
    const databaseConfig = config.get<DatabaseConfig>("database");
    const redisConfig = config.get<RedisConfig>("cache")

    if (!databaseConfig.connectionString) {
        logger.warn("database.connectionString is required but has not been set. Ensure environment variable 'AZURE_COSMOS_CONNECTION_STRING' has been set");
    }

    return{
        database:{
            connectionString:databaseConfig.connectionString,
            databaseName:databaseConfig.databaseName,
            collection:databaseConfig.collection
        },
        cache:{
            connectionString: redisConfig.connectionString,
            connectionPort: redisConfig.connectionPort,
            username: redisConfig.username,
            password: redisConfig.password,
        }
    }
};