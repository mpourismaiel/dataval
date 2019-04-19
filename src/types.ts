export type Dictionary<T> = { [key: string]: T }

export type Config = {
  form?: string
  rules?: Dictionary<string>
  validators?: Dictionary<Validator>
}

export type Validation = {
  valid: boolean
  errors: { key: string; message: string[] }[]
}

export type Validator = (attrs: {
  key?: string
  value?: string | boolean | number
  form?: string
  args?: string[]
}) => boolean | Promise<boolean>

export type Rule = { name: string; args: string[] }

export interface DatavalInstance {
  form: string
  rules: Dictionary<Rule[]>
  validators: Dictionary<Validator>
  add: (name: string, validator: Validator) => DatavalInstance
  validate: (values: { [key: string]: string | boolean | number }) => Promise<Validation>
}
