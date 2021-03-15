// To parse this data:
//
//   import { Convert, CurrentUsage, PredictedUsage } from "./file";
//
//   const currentUsage = Convert.toCurrentUsage(json);
//   const predictedUsage = Convert.toPredictedUsage(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

export interface CurrentUsageObject {
    current_usage?: Usage;
}

export interface Usage {
    usage?: CurrentUsageUsage;
}

export interface CurrentUsageUsage {
    /**
     * The unit in which the usage is expressed
     */
    unit?: Unit;
    /**
     * The current usage
     */
    value?: number;
}

/**
 * The unit in which the usage is expressed
 */
export enum Unit {
    Joules = "Joules",
    KWh = "kWh",
}

/**
 * The predicted usage of the shower
 */
export interface PredictedUsage {
    usages: Usage[];
}

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class Convert {
    public static toCurrentUsage(json: string): any[] | boolean | number | number | null | CurrentUsageObject | string {
        return cast(JSON.parse(json), u(a("any"), true, 3.14, 0, null, r("CurrentUsageObject"), ""));
    }

    public static currentUsageToJson(value: any[] | boolean | number | number | null | CurrentUsageObject | string): string {
        return JSON.stringify(uncast(value, u(a("any"), true, 3.14, 0, null, r("CurrentUsageObject"), "")), null, 2);
    }

    public static toPredictedUsage(json: string): PredictedUsage {
        return cast(JSON.parse(json), r("PredictedUsage"));
    }

    public static predictedUsageToJson(value: PredictedUsage): string {
        return JSON.stringify(uncast(value, r("PredictedUsage")), null, 2);
    }
}

function invalidValue(typ: any, val: any, key: any = ''): never {
    if (key) {
        throw Error(`Invalid value for key "${key}". Expected type ${JSON.stringify(typ)} but got ${JSON.stringify(val)}`);
    }
    throw Error(`Invalid value ${JSON.stringify(val)} for type ${JSON.stringify(typ)}`, );
}

function jsonToJSProps(typ: any): any {
    if (typ.jsonToJS === undefined) {
        const map: any = {};
        typ.props.forEach((p: any) => map[p.json] = { key: p.js, typ: p.typ });
        typ.jsonToJS = map;
    }
    return typ.jsonToJS;
}

function jsToJSONProps(typ: any): any {
    if (typ.jsToJSON === undefined) {
        const map: any = {};
        typ.props.forEach((p: any) => map[p.js] = { key: p.json, typ: p.typ });
        typ.jsToJSON = map;
    }
    return typ.jsToJSON;
}

function transform(val: any, typ: any, getProps: any, key: any = ''): any {
    function transformPrimitive(typ: string, val: any): any {
        if (typeof typ === typeof val) return val;
        return invalidValue(typ, val, key);
    }

    function transformUnion(typs: any[], val: any): any {
        // val must validate against one typ in typs
        const l = typs.length;
        for (let i = 0; i < l; i++) {
            const typ = typs[i];
            try {
                return transform(val, typ, getProps);
            } catch (_) {}
        }
        return invalidValue(typs, val);
    }

    function transformEnum(cases: string[], val: any): any {
        if (cases.indexOf(val) !== -1) return val;
        return invalidValue(cases, val);
    }

    function transformArray(typ: any, val: any): any {
        // val must be an array with no invalid elements
        if (!Array.isArray(val)) return invalidValue("array", val);
        return val.map(el => transform(el, typ, getProps));
    }

    function transformDate(val: any): any {
        if (val === null) {
            return null;
        }
        const d = new Date(val);
        if (isNaN(d.valueOf())) {
            return invalidValue("Date", val);
        }
        return d;
    }

    function transformObject(props: { [k: string]: any }, additional: any, val: any): any {
        if (val === null || typeof val !== "object" || Array.isArray(val)) {
            return invalidValue("object", val);
        }
        const result: any = {};
        Object.getOwnPropertyNames(props).forEach(key => {
            const prop = props[key];
            const v = Object.prototype.hasOwnProperty.call(val, key) ? val[key] : undefined;
            result[prop.key] = transform(v, prop.typ, getProps, prop.key);
        });
        Object.getOwnPropertyNames(val).forEach(key => {
            if (!Object.prototype.hasOwnProperty.call(props, key)) {
                result[key] = transform(val[key], additional, getProps, key);
            }
        });
        return result;
    }

    if (typ === "any") return val;
    if (typ === null) {
        if (val === null) return val;
        return invalidValue(typ, val);
    }
    if (typ === false) return invalidValue(typ, val);
    while (typeof typ === "object" && typ.ref !== undefined) {
        typ = typeMap[typ.ref];
    }
    if (Array.isArray(typ)) return transformEnum(typ, val);
    if (typeof typ === "object") {
        return typ.hasOwnProperty("unionMembers") ? transformUnion(typ.unionMembers, val)
            : typ.hasOwnProperty("arrayItems")    ? transformArray(typ.arrayItems, val)
            : typ.hasOwnProperty("props")         ? transformObject(getProps(typ), typ.additional, val)
            : invalidValue(typ, val);
    }
    // Numbers can be parsed by Date but shouldn't be.
    if (typ === Date && typeof val !== "number") return transformDate(val);
    return transformPrimitive(typ, val);
}

function cast<T>(val: any, typ: any): T {
    return transform(val, typ, jsonToJSProps);
}

function uncast<T>(val: T, typ: any): any {
    return transform(val, typ, jsToJSONProps);
}

function a(typ: any) {
    return { arrayItems: typ };
}

function u(...typs: any[]) {
    return { unionMembers: typs };
}

function o(props: any[], additional: any) {
    return { props, additional };
}

function m(additional: any) {
    return { props: [], additional };
}

function r(name: string) {
    return { ref: name };
}

const typeMap: any = {
    "CurrentUsageObject": o([
        { json: "current_usage", js: "current_usage", typ: u(undefined, r("Usage")) },
    ], "any"),
    "Usage": o([
        { json: "usage", js: "usage", typ: u(undefined, r("CurrentUsageUsage")) },
    ], "any"),
    "CurrentUsageUsage": o([
        { json: "unit", js: "unit", typ: u(undefined, r("Unit")) },
        { json: "value", js: "value", typ: u(undefined, 3.14) },
    ], "any"),
    "PredictedUsage": o([
        { json: "usages", js: "usages", typ: a(r("Usage")) },
    ], "any"),
    "Unit": [
        "Joules",
        "kWh",
    ],
};
