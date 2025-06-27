import { EditorContent, JSONContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import "./editor-styles.css";
import { Color } from "@tiptap/extension-color";
import ListItem from "@tiptap/extension-list-item";
import TextStyle from "@tiptap/extension-text-style";
import Image from "@tiptap/extension-image";
interface EditorViewerProps {
  content?: JSONContent | null;
  className?: string;
}
export default function EditorViewer({
  content,
  className,
}: EditorViewerProps) {
  const extensions = [
    Color.configure({ types: [TextStyle.name, ListItem.name] }),
    //   @ts-expect-error: types unknown
    TextStyle.configure({ types: [ListItem.name] }),
    StarterKit.configure({
      bulletList: {
        keepMarks: true,
        keepAttributes: false,
      },
    }),

    Image,
  ];

  const editor = useEditor({
    editable: false, // 🔒 Read-only
    content: content,
    extensions: extensions,
    editorProps: {
      attributes: {
        class: className as string,
      },
    },
    immediatelyRender: false,
  });

  if (!editor) return null;

  return <EditorContent editor={editor} />;
}
