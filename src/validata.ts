export type Dictionary<T> = { [key: string]: T }
export type Config = {
  form?: string
  rules?: { [key: string]: string }
  validators?: Dictionary<Validator>
}

export type Validation = {
  valid: boolean
  errors: { key: string; message: string[] }[]
}

export type Validator = (attrs: {
  key: string
  value: string | boolean | number
  form: string
  args: string[]
}) => boolean

export type Rule = { name: string; args: string[] }[]

export interface ValidataInstance {
  form: string
  rules: Dictionary<Rule>
  validators: Dictionary<Validator>
  add: (name: string, validator: Validator) => ValidataInstance
  validate: (values: { [key: string]: string | boolean | number }) => Validation
}

const validators: Dictionary<Validator> = {
  required: ({ value }) =>
    typeof value !== 'undefined' &&
    ((typeof value === 'string' || typeof value === 'number') && (value + '').length > 0),
  length: ({ value, args: [from, to] }) =>
    (value + '').length >= parseInt(from) &&
    (value + '').length <= (parseInt(to) || (value + '').length)
}

const Validata = (config?: Config): ValidataInstance => {
  const validata: ValidataInstance = {
    form: config.form,
    rules: Object.keys(config.rules).reduce((tmp, key) => {
      tmp[key] = config.rules[key]
        .split('|')
        .map(rule => ({ name: rule.split(':')[0], args: rule.split(':').slice(1) }))
      return tmp
    }, {}),
    validators: config.validators,
    add: (name, fn) =>
      Validata({
        form: config.form,
        rules: Object.keys(validata.rules).reduce((tmp, k) => {
          tmp[k] = validata.rules[k].map(rules => `${rules.name}:${rules.args.join(':')}`).join('|')
          return tmp
        }, {}),
        validators: { ...validata.validators, [name]: fn }
      }),
    validate: values => {
      return Object.keys(values).reduce(
        (result: Validation, key: string) => {
          const fieldResults = (validata.rules[key] || []).filter(validation => {
            const isValid = (validators[validation.name] || validata.validators[validation.name])({
              key,
              value: values[key],
              form: validata.form,
              args: validation.args
            })

            return !isValid
          })
          if (fieldResults.length > 0) {
            result.valid = false
            result.errors.push({ key, message: fieldResults.map(v => v.name) })
          }
          return result
        },
        {
          valid: true,
          errors: []
        }
      )
    }
  }

  return validata
}

export default Validata
