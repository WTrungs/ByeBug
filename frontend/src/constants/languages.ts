export type Language = "cpp" | "python";

export const LANG_TEMPLATES: Record<Language, string> = {
  cpp: "#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    \n    // Your code here\n    \n    return 0;\n}",
  python:
    "# Read input\nimport sys\ninput = sys.stdin.readline\n\n# Your code here\n",
};

export const LANG_FILENAMES: Record<Language, string> = {
  cpp: "solution.cpp",
  python: "solution.py",
};

export const LANG_LABELS: Record<Language, string> = {
  cpp: "C++ 17",
  python: "Python 3",
};
