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
- **禁止使用 `cy.get('[data-testid="..."]')`** — SIT DOM 尚未加入 data-testid，詳見 qa-knowledge/selector-policy.md
- Selector 優先順序：`#id` > `.stable-class` > `input[placeholder]` > `cy.contains('button/a', '文字')` > `a[href]`
- 無法確認 selector 的 TC 一律寫 `it.skip()`，並在檔案頂部加 `[ENG TASK]` 說明需確認的 URL 或 selector
- Do not use real credentials or production data.
- Generated code is draft and needs QA/Engineer review.

