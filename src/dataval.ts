import { Config, Rule, DatavalInstance } from './types'
import { validators } from './validators'
import { rulesToStringDictionary, stringDictionaryToRules } from './utils'

const Dataval = (config: Config = {}): DatavalInstance => {
  const dataval: DatavalInstance = {
    form: config.form,
    rules: stringDictionaryToRules(config.rules || {}),
    validators: config.validators,
    add: (name, fn) =>
      Dataval({
        form: config.form,
        rules: rulesToStringDictionary(dataval.rules || {}),
        validators: { ...dataval.validators, [name]: fn }
      }),
    validate: async values => {
      const results = await Promise.all(
        Object.keys(values).map(async key => {
          const validations: Rule[] = dataval.rules[key] || []
          if (validations.length === 0) {
            return { key, message: [] }
          }

          const fieldResults = await Promise.all(
            validations.map(async validation => {
              const validator = validators[validation.name] || dataval.validators[validation.name]
              if (!validator) {
                throw new Error(
                  `Validator ${validation.name} is not registered but a rule requires it.`
                )
              }

              const valid = await validator({
                key,
                value: values[key],
                values,
                form: dataval.form,
                args: validation.args
              })

              return { name: validation.name, valid }
            })
          )

          return {
            key,
            message: fieldResults.filter(v => !v.valid).map(v => v.name)
          }
        })
      )

      return {
        valid: !results.some(result => result.message.length > 0),
        errors: results.filter(result => result.message.length > 0)
      }
    }
  }

  return dataval
}

export default Dataval
