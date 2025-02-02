import { Shield } from "../abstracts";
import { RouteHandler } from "../handlers";
import { GenericShield } from "../generics";
 
// tslint:disable-next-line
export const shields = (...shields: Array<typeof Shield>): ClassDecorator => {
    return (target: any) => {
        const className = target.name;
        RouteHandler.addShields(shields as Array<typeof GenericShield>, className);
    };
};