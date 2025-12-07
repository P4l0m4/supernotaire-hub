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
  | "range"
  | "location";

export interface BaseField {
  path: string;
  id: string;
  suggestionRef?: string;
  label: string;
  name: string;
  // types "simples" autorisés uniquement
  type: Exclude<
    FieldType,
    | "array"
    | "number"
    | "range"
    | "checkbox-group"
    | "select"
    | "segmented-control"
    | "file"
    | "date"
  >;
  required?: boolean;
  requiredIf?: ShowIf;
  placeholder?: string;
  icon?: string;
  TS_TYPE?: string; // clé extraction AI
  tooltip?: string;
  tooltipLink?: string; // si tooltip renvoie vers une doc
  pattern?: string; // validation par regex
  showIf?: ShowIf; // champ affiché si la condition est vraie
}

// Règles affichage conditionnel
export type ShowIf =
  | {
      path: string; // chemin absolu depuis la racine du modèle
      equals?: any; // valeur attendue (égalité stricte)
      in?: any[]; // une des valeurs
      truthy?: boolean; // valeur considérée comme vraie (par défaut true)
    }
  | { not: ShowIf }
  | { all: ShowIf[] }
  | { any: ShowIf[] }
  | { or: ShowIf[] };

// Options textuelles pour des groupes de choix
export interface ChoiceOption {
  label: string;
  value: string;
  belongsTo?: string[]; // afficher les options selon une autre valeur
}

export interface CheckBoxField extends Omit<BaseField, "type"> {
  type: "checkbox";
}

export interface ArrayField extends Omit<BaseField, "type"> {
  type: "array";
  itemLabel?: string;
  itemSchema: { fields: BaseField[] };
  minItems?: number;
  maxItems?: number;
}

export interface NumberField extends Omit<BaseField, "type"> {
  type: "number";
  step?: number;
  min?: number;
  max?: number;
}

export interface FileField extends Omit<BaseField, "type"> {
  type: "file";
  accept?: string[]; // types de fichiers acceptés, ex: ['image/png', 'application/pdf']
  multiple?: boolean; // permet la sélection de plusieurs fichiers
}

export interface RangeField extends Omit<BaseField, "type"> {
  type: "range";
  options: RangeOption[];
}

export interface CheckBoxGroupField extends Omit<BaseField, "type"> {
  type: "checkbox-group";
  options: ChoiceOption[];
}

export interface SelectField extends Omit<BaseField, "type"> {
  type: "select";
  options: string[];
}

export interface SegmentedControlField extends Omit<BaseField, "type"> {
  type: "segmented-control";
  options: string[];
}

export interface DateField extends Omit<BaseField, "type"> {
  type: "date";
  mode: "year-picker" | "month-picker" | "date-picker";
}

export type FormField =
  | BaseField // text, radio, textarea, email, location
  | CheckBoxField
  | ArrayField
  | NumberField
  | RangeField
  | CheckBoxGroupField
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
