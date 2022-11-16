# Dataval

Crieate rules, validate all the forms.

Dataval is a form validator following ideas from Laravel. The idea is that you
can create a validator and validate every form data by just calling it. This
allows you to add the validator as a Redux Form validator (it would just need a
`reduce` call to create your error messages) or as an Express middleware.

### Usage

First, you need to create an instance of the validator by calling the `Dataval`
factory function.

```typescript
const dataval = Dataval()
```

After you have your `dataval` instance, you can start validating your forms.

```typescript
const form = {
  name: 'John',
  age: 25
}

await dataval.validate(form)
```

The validate function returns a promise and the result of that promise is an
object:

```
{
  valid: boolean
  errors: { key: string; message: string[] }[]
}
```

The errors array will be empty if the form has no errors and will contain the
invalid fields along the name of each rule that was broken.

The example above returns a valid result. That's because there are no rules. In
order to validate your forms, you need to add the rules of validation.

```typescript
const dataval = Dataval({
  rules: {
    name: 'required|isString|length:2:50',
    age: 'isNumber|min:18'
  }
})
```

Rules are the name of the validators that you want to run on each field. The `|`
symbol delimits each validator. Each string coming after each `:` represent an
argument. So the `name` field is required, should be string and should have a
length of 2 to 50 characters and the `age` field should be a number more than 18.

### Todo

- [ ] Add support for nested data structures
- [ ] Add support for arrays
