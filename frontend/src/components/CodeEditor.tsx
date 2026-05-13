import Editor from '@monaco-editor/react';

interface CodeEditorProps {
    code: string;
    onChange: (value: string | undefined) => void;
    language?: string;
    theme?: 'vs-dark' | 'light';
}

const CodeEditor = ({ code, onChange, language = 'cpp', theme = 'vs-dark' }: CodeEditorProps) => {
    return (
        <Editor
            height="100%"
            defaultLanguage={language}
            theme={theme}
            value={code}
            onChange={onChange}
            options={{
                fontSize: 14,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                automaticLayout: true,
                padding: { top: 16 },
                fontFamily: "var(--font-mono)",
                cursorSmoothCaretAnimation: "on",
            }}
        />
    );
};

export default CodeEditor;
