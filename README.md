# Clerk Bug Reproduction

When using the `signIn()` [test helper](https://clerk.com/docs/testing/playwright/test-helpers), a validation error will be incorrectly thrown when using valid test numbers that match the format as outlined in the docs: https://clerk.com/docs/testing/test-emails-and-phones#phone-numbers

> +1 (XXX) 555-0100 to +1 (XXX) 555-0199

I can successfully sign in with both of these test phone numbers via the UI (as expected):

- +15555550100
- +13035550100

However, the `+1303...` number will cause a validation error when using `clerk.signIn()`:

```
await clerk.signIn({
  page,
  signInParams: {
    identifier: '+13035550100',
    strategy: 'phone_code',
  },
});
```

A quick glance at the source code shows logic that's looking for a far stricter subset of the valid test number range: https://github.com/clerk/javascript/blob/da2c741be1ecea8ded4f8e0ced64511f695784c2/packages/testing/src/common/helpers-utils.ts#L20

The current logic doesn't allow for differing area codes:

```ts
!signInParams.identifier.includes('+155555501')
```

This might be a simple solution:

```ts
!/\+1\d{3}55501\d{2}/.test(signInParams.identifier)
```

**Steps to reproduce:**

1. Pull down reproduction repo: https://github.com/calebjacob/test-sign-in-phone-number-validation-bug-reproduction.

_NOTE: Due to `clerkSetup()` requiring the secret key, I committed both the publishable and secret key values in `.env.local` for a temporary development/test Clerk project. Please let me know if there's a better way to handle this. It's a weird case since the reproduction doesn't function without the secret._

2. Install and run the test suite:

```
pnpm i
pnpm test
```

**Expected behavior:**

Test suite succeeds signing in user with both, valid testing phone numbers:

- +15555550100
- +13035550100

**Actual behavior:**

An error is thrown:

```
Error: page.evaluate: Error: Clerk: Failed to sign in: Phone number should be a test phone number.
Example: +15555550100.
Learn more here: https://clerk.com/docs/testing/test-emails-and-phones#phone-numbers
```
