import { Schema, UISchema } from './types';
declare const _default: import("vue").DefineComponent<{
    readonly id: {
        readonly type: import("vue").PropType<string>;
        readonly required: true;
    };
    readonly path: {
        readonly type: import("vue").PropType<string>;
        readonly required: true;
    };
    readonly value: {
        readonly required: true;
    };
    readonly schema: {
        readonly type: import("vue").PropType<Schema>;
        readonly required: true;
    };
    readonly rootSchema: {
        readonly type: import("vue").PropType<Schema>;
        readonly required: true;
    };
    readonly uiSchema: {
        readonly type: import("vue").PropType<UISchema>;
        readonly required: true;
    };
    readonly onChange: {
        readonly type: import("vue").PropType<(value: any) => void>;
        readonly required: true;
    };
    readonly required: {
        readonly type: import("vue").PropType<boolean>;
        readonly required: true;
    };
    readonly isDependenciesKey: {
        readonly type: import("vue").PropType<boolean>;
        readonly required: true;
    };
    readonly errorSchema: {
        readonly type: import("vue").PropType<any>;
        readonly required: true;
    };
}, () => JSX.Element, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, Record<string, any>, string, import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<{
    required: boolean;
    path: string;
    value: unknown;
    id: string;
    onChange: (value: any) => void;
    schema: Schema;
    rootSchema: Schema;
    uiSchema: UISchema;
    isDependenciesKey: boolean;
    errorSchema: unknown;
} & {}>, {}>;
export default _default;
