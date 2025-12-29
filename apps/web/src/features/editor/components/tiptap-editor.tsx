import Placeholder from '@tiptap/extension-placeholder';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useEffect, useRef } from 'react';

interface TiptapEditorProps {
    content: string;
    onChange?: (content: string) => void;
    editable?: boolean;
}

export function TiptapEditor({ content, onChange, editable = true }: TiptapEditorProps) {
    const contentRef = useRef(content);

    const editor = useEditor({
        extensions: [
            StarterKit,
            Placeholder.configure({
                placeholder: 'Start writing...',
            })
        ],
        content: content,
        editable: editable,
        editorProps: {
            attributes: {
                class: 'prose prose-lg dark:prose-invert focus:outline-none max-w-none min-h-[calc(100vh-250px)] leading-relaxed text-slate-700 dark:text-slate-200 selection:bg-blue-100 dark:selection:bg-blue-900/30',
            }
        },
        onUpdate: ({ editor }) => {
            const html = editor.getHTML();
            if (onChange) onChange(html);
        },
        immediatelyRender: false,
    });

    // Sync content if it changes externally
    useEffect(() => {
        if (editor && content !== contentRef.current) {
            editor.commands.setContent(content);
            contentRef.current = content;
        }
    }, [content, editor]);

    return (
        <div className="w-full">
            <EditorContent editor={editor} />
        </div>
    )
}
