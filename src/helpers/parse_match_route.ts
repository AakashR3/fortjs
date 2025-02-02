import { RouteHandler } from "../handlers/route_handler";
import { RouteMatch } from "../types/route_match";
import { HTTP_METHOD } from "../enums";
import { removeLastSlash } from ".";
import { RouteInfo } from "../models";

const regex1 = /{(.*)}(?!.)/;
// for extension - e.g - {{file}}.js
const regex2 = /{(.*)}\.(\w+)(?!.)/;

const checkRouteInWorker = (route: RouteInfo, httpMethod: HTTP_METHOD, urlParts: string[]) => {
    const matchedRoute: RouteMatch = {
        allowedHttpMethod: [],
        controller: route.controller,
        controllerName: route.controllerName
    } as RouteMatch;

    const urlPartLength = urlParts.length;
    for (const workerName in route.workers) {
        const worker = route.workers[workerName];
        const patternSplit = worker.pattern.split("/");
        if (urlPartLength === patternSplit.length) {
            let isMatched = true;
            const params = {};
            urlParts.every((urlPart, i) => {
                // if not equal then check for regex match
                if (urlPart !== patternSplit[i]) {
                    const regMatch1 = patternSplit[i].match(regex1);
                    const regMatch2 = patternSplit[i].match(regex2);
                    if (regMatch1 != null) {
                        params[regMatch1[1]] = urlPart;
                    }
                    else if (regMatch2 != null) {
                        const splitByDot = urlPart.split(".");
                        if (splitByDot[1] === regMatch2[2]) {
                            params[regMatch2[1]] = splitByDot[0];
                        }
                        else {
                            isMatched = false;
                        }
                    }
                    else {
                        isMatched = false;
                    }
                }
                // means its direct match
                return isMatched;
            });
            if (isMatched === true) {
                if (worker.methodsAllowed.indexOf(httpMethod) >= 0) {
                    matchedRoute.workerInfo = worker;
                    matchedRoute.params = params;
                    matchedRoute.shields = route.shields;
                    break;
                }
                else {
                    matchedRoute.allowedHttpMethod = [...matchedRoute.allowedHttpMethod, ...worker.methodsAllowed];
                }
            }
        }
    }
    if (matchedRoute.workerInfo == null && matchedRoute.allowedHttpMethod.length === 0) {
        return null;
    }
    return matchedRoute;

};

export function parseAndMatchRoute(url: string, httpMethod: HTTP_METHOD) {
    url = removeLastSlash(url);
    const urlParts = url.split("/");
    const route = RouteHandler.findControllerFromPath(urlParts);
    return route == null ? checkRouteInWorker(RouteHandler.defaultRoute, httpMethod, urlParts) :
        checkRouteInWorker(route, httpMethod, urlParts);
}