import { Color } from "@tiptap/extension-color";
import ListItem from "@tiptap/extension-list-item";
import TextStyle from "@tiptap/extension-text-style";
import { EditorContent, JSONContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import "./editor-styles.css";
import Image from "@tiptap/extension-image";
import { MenuBar } from "./editor-menu";
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
interface props {
  onContentChange?: (content: JSONContent) => void;
  classname_overide?: string;
  default_content?: JSONContent | null;
}
const TextEditor = ({
  onContentChange,
  classname_overide,
  default_content,
}: props) => {
  const editor = useEditor({
    extensions,
    editorProps: {
      attributes: {
        class: `${classname_overide} text-white pt-10  pb-2 px-3  min-h-[120px] outline-none  editor   focus:ring-2  focus:ring-grey ring-[1px] ring-grey rounded-xl`,
      },
    },
    immediatelyRender: false,
    content: default_content,
    onUpdate({ editor }) {
      const json = editor.getJSON();
      onContentChange?.(json);
    },
  });

  return (
    <div className="flex  flex-col gap-4         rounded-xl      duration-150 relative  w-full  editor">
      {editor && <MenuBar editor={editor} />}
      <EditorContent editor={editor} />
    </div>
  );
};

export default TextEditor;
