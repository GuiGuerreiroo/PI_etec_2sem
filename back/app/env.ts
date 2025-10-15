import {config} from "dotenv";

// le o .env file
config()

export enum StageEnum {
    TEST= "test",
    DEV= "dev",
    ERROR= "error"
}

export class Env {
    static readonly STAGE: StageEnum =
        (process.env.STAGE as StageEnum) || StageEnum.ERROR;
}