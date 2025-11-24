import {config as dotenvConfig} from "dotenv";

// le o .env file
dotenvConfig();

export enum StageEnum {
    TEST= "test",
    DEV= "dev",
    ERROR= "error"
}

export class Env {
    static readonly STAGE: StageEnum = 
        (process.env.STAGE as StageEnum) || StageEnum.ERROR;
}