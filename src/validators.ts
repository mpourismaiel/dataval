import { Dictionary, Validator } from './types'

export const validators: Dictionary<Validator> = {
  required: ({ value }) =>
    typeof value !== 'undefined' &&
    ((typeof value === 'string' || typeof value === 'number') && (value + '').length > 0),
  length: ({ value, args: [from, to] }) =>
    (value + '').length >= parseInt(from) &&
    (value + '').length <= (parseInt(to) || (value + '').length),
  isString: ({ value }) => typeof value === 'string',
  isBoolean: ({ value }) => typeof value === 'boolean',
  isNumber: ({ value }) => typeof value === 'number',
  isDate: ({ value }) => Date.parse(value as string) !== NaN,
  isTrue: ({ value }) => validators.isBoolean({ value }) && (value as boolean),
  isFalse: ({ value }) => validators.isBoolean({ value }) && !value,
  isEmpty: ({ value }) => validators.length({ value, args: ['0', '0'] }),
  max: ({ value, args: [max] }) => validators.isNumber({ value }) && value <= max,
  min: ({ value, args: [min] }) => validators.isNumber({ value }) && value >= min,
  between: ({ value, args: [min, max] }) =>
    validators.isNumber({ value }) && value >= min && value <= max,
  isAfter: ({ value, args: [date] }) =>
    validators.isDate({ value }) && Date.parse(value as string) > parseInt(date),
  isBefore: ({ value, args: [date] }) =>
    validators.isDate({ value }) && Date.parse(value as string) < parseInt(date)
}
