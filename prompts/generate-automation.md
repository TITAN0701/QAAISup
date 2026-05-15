# Prompt: Generate Automation Draft

用途：根據已審核的 `test-cases.yaml` 產生自動化測試草稿。

## Input

```txt
artifacts/generated/qa/test-cases.yaml
qa-workspace/specs/{feature}/scenarios.md
qa-knowledge/selector-policy.md
automation/testdata/
```

## Output

依照測試類型輸出到：

```txt
automation/e2e/specs/
automation/e2e/pages/
automation/e2e/flows/
automation/e2e/fixtures/
automation/api/tests/
automation/api/clients/
automation/testdata/
```

## Rules

- E2E 測試放在 `automation/e2e/specs/`。
- Page Object 放在 `automation/e2e/pages/`。
- 共用流程放在 `automation/e2e/flows/`。
- API 測試放在 `automation/api/tests/`。
- 測試資料放在 `automation/testdata/`。
- selector 優先遵守 `qa-knowledge/selector-policy.md`。
- 產出的測試碼仍需 QA 或工程師 review。
- 不要使用正式帳密或敏感資料。
