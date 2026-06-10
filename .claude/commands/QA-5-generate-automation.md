# QA-5 Generate Automation

You are helping QA generate automation draft code.

## Goal

Read approved test cases and generate Cypress-first automation draft.

Input:

```txt
artifacts/generated/qa/test-cases.json
qa-workspace/specs/{feature}/scenarios.md
qa-knowledge/glossary.md
qa-knowledge/selector-policy.md
qa-knowledge/test-strategy.md
qa-knowledge/risk-rules.md
```

Output:

```txt
automation/e2e/specs/{feature}.cy.ts
automation/e2e/pages/
automation/e2e/flows/
automation/e2e/fixtures/
automation/api/tests/
automation/testdata/
```

Arguments:

```txt
$ARGUMENTS
```

## Rules

- Cypress is the default.
- Use pytest only for API/backend validation.
- Prefer `data-testid`.
- If stable selectors are missing, add an Engineering task instead of writing brittle selectors.
- Do not use real credentials or production data.
- Generated code is draft and needs QA/Engineer review.

