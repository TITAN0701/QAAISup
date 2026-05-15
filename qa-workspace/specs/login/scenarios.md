# Login Scenarios

## Scenario: 正確帳密登入成功

```gherkin
Given 使用者位於登入頁
When 使用者輸入正確帳號與密碼
And 使用者點擊登入
Then 使用者應成功登入
And 使用者應進入首頁
```

## Scenario: 錯誤密碼登入失敗

```gherkin
Given 使用者位於登入頁
When 使用者輸入正確帳號與錯誤密碼
And 使用者點擊登入
Then 系統應顯示「帳號或密碼錯誤」
And 使用者應停留在登入頁
```

## Scenario: 停用帳號不可登入

```gherkin
Given 使用者位於登入頁
And 使用者帳號狀態為停用
When 使用者輸入該帳號與正確密碼
And 使用者點擊登入
Then 系統應顯示「帳號已停用，請聯絡管理員」
And 使用者應停留在登入頁
```

## Scenario: 鎖定帳號不可登入

```gherkin
Given 使用者位於登入頁
And 使用者帳號狀態為鎖定
When 使用者輸入該帳號與正確密碼
And 使用者點擊登入
Then 系統應顯示「帳號已被鎖定，請稍後再試」
And 使用者應停留在登入頁
```
