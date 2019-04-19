import Dataval from '../src/dataval'

describe('Dataval', () => {
  const key = 'nationalCode'
  const value = '1234567890'
  const form = 'auth'

  const db = { [key]: [value] }

  it('works with built-in rules', async () => {
    const dataval = Dataval({
      form,
      rules: {
        [key]: 'required'
      }
    })

    expect(
      await dataval.validate({
        [key]: value
      })
    ).toEqual({ valid: true, errors: [] })
  })

  it('works with custom rules', async () => {
    const dataval = Dataval({
      form,
      rules: {
        [key]: 'unique'
      }
    }).add('unique', ({ key: k, value: v }) => db[k].indexOf(v) === -1)

    expect(
      await dataval.validate({
        [key]: value + Math.random()
      })
    ).toEqual({ valid: true, errors: [] })
  })

  it('works with combination of custom and built-in rules', async () => {
    const dataval = Dataval({
      form,
      rules: {
        [key]: 'unique|required'
      }
    }).add('unique', ({ key: k, value: v }) => db[k].indexOf(v) === -1)

    expect(
      await dataval.validate({
        [key]: value + Math.random()
      })
    ).toEqual({ valid: true, errors: [] })
  })

  it('works with async validators', async () => {
    const dataval = Dataval({
      form,
      rules: {
        [key]: 'unique'
      }
    }).add(
      'unique',
      ({ key: k, value: v }) =>
        new Promise(resolve => setTimeout(() => resolve(db[k].indexOf(v) === -1), 100))
    )

    expect(
      await dataval.validate({
        [key]: value + Math.random()
      })
    ).toEqual({ valid: true, errors: [] })
  })

  it('fails if async validator fails', async () => {
    const dataval = Dataval({
      form,
      rules: {
        [key]: 'unique'
      }
    }).add(
      'unique',
      ({ key: k, value: v }) =>
        new Promise(resolve => setTimeout(() => resolve(db[k].indexOf(v) === -1), 100))
    )

    expect(
      await dataval.validate({
        [key]: value
      })
    ).toEqual({ valid: false, errors: [{ key, message: ['unique'] }] })
  })

  it('returns all errors for invalid values', async () => {
    const dataval = Dataval({
      form,
      rules: {
        [key]: 'isNumber|required'
      }
    }).add('isNumber', ({ value: v }) => typeof v === 'number')

    expect(
      await dataval.validate({
        [key]: ''
      })
    ).toEqual({ valid: false, errors: [{ key, message: ['isNumber', 'required'] }] })
  })

  it('accepts args', async () => {
    const dataval = Dataval({
      form,
      rules: {
        [key]: `length:${value.length}:${value.length}`
      }
    })

    expect(
      await dataval.validate({
        [key]: value
      })
    ).toEqual({ valid: true, errors: [] })
  })
})
