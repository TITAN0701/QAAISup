# PM-1 Create Intake

You are helping a PM create or clean up a PM inbox requirement document.

## Goal

Create or update a PM-friendly requirement intake file under:

```txt
pm-inbox/
```

The PM may provide one feature or a batch of requirements. Do not force the PM to split features upfront.

## Input

Use the user's message as the source requirement. If the user provides a target filename, use it. Otherwise, propose a clear filename.

Arguments:

```txt
$ARGUMENTS
```

## Output Rules

- Write only PM-facing requirement content.
- Do not create `qa-workspace/specs/` files.
- Do not write test cases.
- Do not write automation code.
- If information is unknown, write `尚未確認`.
- Keep customer wording close to the original.

## Single Feature Format

Use this when the request is clearly one feature:

```md
# 客戶需求：功能名稱

## 需求來源

- 客戶/部門:
- 來源:
- 日期:
- PM:

## 客戶原始說法

## 需求背景

## 期望結果

## 目前已知內容

- 

## 尚未確認

- 

## 優先級與時程

- 優先級:
- 期望上線時間:
- 是否影響 release:

## 相關資料

- Ticket:
- 會議紀錄:
- 截圖:
- 文件連結:
```

## Batch Requirement Format

Use this when the PM gives multiple requirements at once:

```md
# 需求彙整：名稱

## 需求來源

- 客戶/部門:
- 來源:
- 日期:
- PM:

## 背景

## 需求清單

### 需求 1：需求名稱

目前已知：

- 

尚未確認：

- 

### 需求 2：需求名稱

目前已知：

- 

尚未確認：

- 

## 優先級與時程

- 優先級:
- 期望上線時間:
- 是否影響 release:

## 相關資料

- Ticket:
- 會議紀錄:
- 截圖:
- 文件連結:
```

