import type { RangeOption } from "@/components/FormElements/RangeInput.vue";

type FieldType =
  | "text"
  | "number"
  | "date"
  | "select"
  | "checkbox"
  | "radio"
  | "textarea"
  | "checkbox-group"
  | "array"
  | "email"
  | "file"
  | "segmented-control"
  | "range";

export interface BaseField {
  path: string;
  id: string;
  suggestionRef?: string;
  label: string;
  name: string;
  type: Exclude<FieldType, "array">;
  required?: boolean;
  placeholder?: string;
  icon?: string;
  TS_TYPE?: string; // pour extraction AI
  tooltip?: string; // pour info bulle
  pattern?: string; // pour validation par regex
}

export interface CheckBoxOption {
  label: string;
  value: boolean;
  belongsTo?: string[]; // pour afficher les checkbox en fonction d'une autre valeur
}

export interface CheckBoxField extends BaseField {
  options: CheckBoxOption[];
}

export interface ArrayField extends Omit<BaseField, "type"> {
  type: "array";
  itemLabel?: string;
  itemSchema: { fields: BaseField[] };
  minItems?: number;
  maxItems?: number;
}

export interface NumberField extends BaseField {
  type: "number";
  step?: number;
  min?: number;
  max?: number;
}

export interface FileField extends BaseField {
  type: "file";
  accept?: string[]; // types de fichiers acceptés, ex: ['image/png', 'application/pdf']
  multiple?: boolean; // permet la sélection de plusieurs fichiers
}

export interface RangeField extends BaseField {
  type: "range";
  options: RangeOption[];
}

export interface CheckBoxGroupField extends BaseField {
  type: "checkbox-group";
  options: CheckBoxOption[];
}

export interface SelectField extends BaseField {
  type: "select";
  options: string[];
}

export interface SegmentedControlField extends BaseField {
  type: "segmented-control";
  options: string[];
}

export interface DateField extends BaseField {
  type: "date";
  mode: "year-picker" | "month-picker" | "date-picker";
}

export type FormField =
  | BaseField
  | ArrayField
  | NumberField
  | RangeField
  | CheckBoxGroupField
  | CheckBoxField
  | SelectField
  | SegmentedControlField
  | FileField
  | DateField;

export interface FormDefinition {
  title: string;
  sections: Array<{
    id: string;
    label: string;
    fields: FormField[];
  }>;
}
