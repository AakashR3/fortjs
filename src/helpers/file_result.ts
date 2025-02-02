
import { HTTP_STATUS_CODE } from "../enums/http_status_code";
import { HttpResult } from "../types/http_result";

export const fileResult = (filePath: string) => {
    return {
        statusCode: HTTP_STATUS_CODE.Ok,
        file: {
            filePath: filePath
        }
    } as HttpResult;
};