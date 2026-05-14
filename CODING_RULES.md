# ByeBug(v2) Coding Rules

To maintain the stability and clarity of the codebase, the following rules must be strictly followed:

## 1. Minimal Modification of Existing Files
- **Do not arbitrarily modify** existing code or files.
- Any changes to existing logic must have a clear justification.
- Preserve existing comments, formatting, and structure unless a refactor is explicitly requested.

## 2. Selective Additions
- **Only add new code** to existing files when absolutely necessary (e.g., adding a new route, a new constant, or a minor utility).
- If a change is large, prefer creating new files or components to keep existing files clean.

## 3. Code Clarity
- Write **clear, readable, and well-structured code**.
- Use descriptive names for variables, functions, and classes.
- Follow the established naming conventions in the project (e.g., camelCase for JS/TS, PascalCase for React components, etc.).

## 4. Reusability
- **Reuse existing functions** whenever possible to avoid duplication.
- Before creating a new utility or helper, check if a similar one already exists in the project.
- If no suitable function exists, create a new one following the project's architecture.

## 5. Naming and Consistency
- **Check for existence:** Before creating a new function or variable, verify if a name or similar functionality already exists to avoid duplication.
- **Consistency:** Follow the naming format and conventions (e.g., camelCase, PascalCase, snake_case) used by existing functions and variables in the same context/file.
