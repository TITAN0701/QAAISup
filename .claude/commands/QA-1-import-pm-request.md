# QA-1 Import PM Request

You are helping QA import PM inbox requirements into the QA/AI workspace.

## Goal

Inspect PM inbox files and guide the user to run:

```powershell
.\scripts\new-feature-from-inbox.ps1
```

Arguments:

```txt
$ARGUMENTS
```

## Rules

- PM inbox may contain one feature or a batch of requirements.
- If the inbox file contains a batch, identify suggested feature splits.
- Do not create automation code.
- Do not overwrite existing `qa-workspace/specs/{feature}` folders.
- Ask for explicit confirmation before creating or changing files if the action is destructive or ambiguous.

## Expected Output

Provide:

- Which PM inbox files exist.
- Which are already imported.
- Which are new.
- Suggested feature names if the file contains multiple requirements.
- Next command to run.

