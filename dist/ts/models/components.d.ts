import { ControllerTestData } from "../types";
declare class ControllerListRef {
    static getInstance(name: string, data?: ControllerTestData): import("../generics").GenericController;
    static getMethod(className: string, methodName: string): any;
    static executeMethod(className: string, methodName: string): any;
}
export declare class Components {
    static controllers: typeof ControllerListRef;
}
export {};
