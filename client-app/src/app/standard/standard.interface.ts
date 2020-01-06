export interface IStandardFormField {
  name: string;
  type: string;
  displayName?: string;
  required?: boolean;
  childName?: string;
  ref?: string;
  refName?: string;
  refValue?: string;
  refOptions?: any[];
  default?: any;
  enum?: any;
  fields?: IStandardFormField[];
  add?: any;
  isShow?: any;
  reuqired?: boolean;
  enumList?: any[];
  filterOption?: any;
  refIncludes?: string[];
  queryModel?: any;
  max?: number | boolean | Func;
}

export enum IStandardFormFieldType {
  string,
  number,
  table,
  ref,
  textarea,
  date,
  time,
  boolean,
  enum,
  object,
  array,
  image,
}

export enum IStandardColumnType {
  string,
  date,
  currency,
  link,
  template,
}

export interface IStandardColumn {
  name: string;
  type?: string;
  format?: string;
  displayName?: string;
  link?: string | StringFunc;
  dateFormat?: string;
  template?: StringFunc;
  width?: string;
}

export interface IStandardDisplayField {
  name: string;
  displayName?: string;
  type?: string;
  noLabel?: boolean;
  getValue?: Func;
  link?: Func;
}

export interface StandardHttpResponse {
  data: any;
  message: string;
  status: number;
}

type StringFunc = (item: any) => string;
type Func = (item: any) => any;
