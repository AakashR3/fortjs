import { HttpRequest, HttpResponse, HttpResult } from "../types";
import { CookieManager, FileManager, Logger } from "../models";
import { Controller } from "./controller";
import { SessionProvider } from "./session_provider";
import { GuardTestData, initGuard } from "../test_helpers";
import { FortGlobal } from "../fort_global";

export abstract class Guard implements Controller {
    request: HttpRequest;
    response: HttpResponse;
    query: { [key: string]: any };
    body: { [key: string]: any };
    session: SessionProvider;
    cookie: CookieManager;
    param?: { [key: string]: string };
    data: { [key: string]: any };
    file: FileManager;
    abstract check(...args): Promise<HttpResult | void>;

    get logger(): Logger {
        return FortGlobal.logger;
    }

    get option() {
        return FortGlobal.componentOption;
    }
    
    // eslint-disable-next-line
    constructor(...args) {

    }

    initialize(data?: GuardTestData) {
        return initGuard(this, data);
    }
}