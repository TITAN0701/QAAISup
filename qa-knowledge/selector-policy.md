# Selector Policy

此文件定義 E2E 測試使用 selector 的優先順序。

## Preferred Selector

E2E 測試優先使用：

```txt
data-testid
role
label
text
```

建議優先順序：

1. `data-testid`
2. semantic role，例如 button、textbox
3. label
4. 穩定且唯一的文字

## Avoid

避免使用：

```txt
CSS nth-child
不穩定 class name
完整 XPath
依賴畫面位置的 selector
```

## Naming Convention

建議格式：

```txt
data-testid="login-email-input"
data-testid="login-password-input"
data-testid="login-submit-button"
data-testid="login-error-message"
```

## Review Rule

AI 產生測試碼時，如果缺少穩定 selector，應在測試碼或 notes 中標示需要工程師補 `data-testid`，不要硬寫脆弱 selector。
