import { Dictionary, Rule } from './types'

export const stringDictionaryToRules = (rules: Dictionary<string>): Dictionary<Rule[]> =>
  Object.keys(rules).reduce((tmp, key) => {
    tmp[key] = rules[key]
      .split('|')
      .map(rule => ({ name: rule.split(':')[0], args: rule.split(':').slice(1) }))
    return tmp
  }, {})

export const rulesToStringDictionary = (rules: Dictionary<Rule[]>): Dictionary<string> =>
  Object.keys(rules).reduce((tmp, k) => {
    tmp[k] = rules[k].map(rules => `${rules.name}:${rules.args.join(':')}`).join('|')
    return tmp
  }, {})
