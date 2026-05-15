# QA/AI Questions for PM

> 此文件由 QA 或 AI 撰寫，用來把 `spec.md` 中不清楚、會影響驗收或測試的問題整理給 PM。
>
> PM 不需要主動撰寫問題，只需要在每題的 `PM Answer` 欄位回答；如果還不知道答案，可以填「待客戶確認」。

## Need Clarification

1. 重設密碼連結有效時間是多久？
   - Impact: 會影響「有效連結可重設」與「過期連結不可重設」測試情境。
   - PM Answer:

2. 使用者輸入未註冊 Email 時，畫面要顯示成功提示還是錯誤訊息？
   - Impact: 會影響錯誤訊息測試，也會影響是否需要避免帳號枚舉風險。
   - PM Answer:

3. 新密碼需要符合哪些規則？
   - Impact: 會影響密碼格式驗證、錯誤訊息與邊界測試。
   - PM Answer:

4. 重設密碼連結是否只能使用一次？
   - Impact: 會影響「連結重複使用」的負向測試案例。
   - PM Answer:

5. 密碼重設成功後，使用者是否要自動登入？
   - Impact: 會影響成功流程的 expected result，也會影響登入狀態驗證。
   - PM Answer:

6. 密碼重設成功後，是否需要寄送通知信？
   - Impact: 會影響 Email 驗證測試與通知流程測試。
   - PM Answer:

## Confirmed Decisions

- 客戶希望使用者可以透過 Email 自行重設密碼。
- 客服手動重設密碼不在目前初步需求中。

## PM Response Rule

- PM 只需要填寫 `PM Answer`。
- 如果答案已確定，請直接填寫決策。
- 如果答案還不確定，請填寫「待客戶確認」。
- 若 PM 回答後改變需求，請同步更新 `spec.md`。

## Writing Notes

- QA/AI 問題應該聚焦在「會影響驗收或測試」的地方。
- PM 回答後，重要決策要同步更新回 `spec.md`。
- 如果 PM 暫時不知道答案，可以填「待客戶確認」。
