# QA/AI Questions for PM

> 填寫說明：此文件由 QA 或 AI 撰寫，用來把 `spec.md` 中不清楚、不可測或會影響測試設計的地方回拋給 PM。
>
> PM 不需要主動撰寫問題，只需要在每題的 `PM Answer` 欄位回答；如果還不知道答案，可以填「待客戶確認」。

## How to Write

每個問題建議包含三個部分：

```txt
問題本身
Impact: 這個問題會影響什麼測試或驗收？
PM Answer: PM 回答後填寫
```

## Need Clarification

1. 
   - Impact:
   - PM Answer:

2. 
   - Impact:
   - PM Answer:

## Confirmed Decisions

> PM 回答後，如果已經確定的規則可以整理到這裡，並同步更新 `spec.md`。

- 

## PM Response Rule

- PM 只需要填寫 `PM Answer`。
- 如果答案已確定，請直接填寫決策。
- 如果答案還不確定，請填寫「待客戶確認」。
- 若 PM 回答後改變需求，請同步更新 `spec.md`。

## Writing Rules

- 問題要具體，不要問太大範圍。
- 每個問題都要寫 Impact，說明為什麼會影響 QA 或自動化。
- 不要問 AI/QA 自己可以決定的事情，只問需要 PM 或客戶決策的事情。
- PM 回答後，如果答案會改變需求，請同步更新 `spec.md`。

## Good Example

```md
1. 重設密碼連結有效時間是多久？
   - Impact: 會影響連結過期情境與 API/token 測試。
   - PM Answer:
```

## Bad Example

```md
1. 忘記密碼要怎麼做？
```

原因：問題太大，PM 不知道要回答流程、畫面、Email、密碼規則，還是錯誤處理。
