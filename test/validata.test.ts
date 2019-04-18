import Validata from '../src/validata'

describe('Validata', () => {
  const key = 'nationalCode'
  const value = '1234567890'
  const form = 'auth'

  const db = { [key]: [value] }

  it('works with built-in rules', () => {
    const validata = Validata({
      form,
      rules: {
        [key]: 'required'
      }
    })

    expect(
      validata.validate({
        [key]: value
      })
    ).toEqual({ valid: true, errors: [] })
  })

  it('works with custom rules', () => {
    const validata = Validata({
      form,
      rules: {
        [key]: 'unique'
      }
    }).add('unique', ({ key: k, value: v }) => db[k].indexOf(v) === -1)

    expect(
      validata.validate({
        [key]: value + Math.random()
      })
    ).toEqual({ valid: true, errors: [] })
  })

  it('works with combination of custom and built-in rules', () => {
    const validata = Validata({
      form,
      rules: {
        [key]: 'unique|required'
      }
    }).add('unique', ({ key: k, value: v }) => db[k].indexOf(v) === -1)

    expect(
      validata.validate({
        [key]: value + Math.random()
      })
    ).toEqual({ valid: true, errors: [] })
  })

  it('returns all errors for invalid values', () => {
    const validata = Validata({
      form,
      rules: {
        [key]: 'isNumber|required'
      }
    }).add('isNumber', ({ value: v }) => typeof v === 'number')

    expect(
      validata.validate({
        [key]: ''
      })
    ).toEqual({ valid: false, errors: [{ key, message: ['isNumber', 'required'] }] })
  })

  it('accepts args', () => {
    const validata = Validata({
      form,
      rules: {
        [key]: `length:${value.length}:${value.length}`
      }
    })

    expect(
      validata.validate({
        [key]: value
      })
    ).toEqual({ valid: true, errors: [] })
  })
})
