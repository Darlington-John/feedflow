import { Editor } from "@tiptap/react";
import "./editor-styles.css";
// import EmojiPicker from "emoji-picker-react";
import {
  BlocksIcon,
  Bold,
  Code,
  CodeSquare,
  Heading1,
  Heading2,
  Highlighter,
  ImageIcon,
  Italic,
  List,
  Strikethrough,
} from "lucide-react";
import { useRef } from "react";
interface editorProps {
  editor: Editor | null;
}
export const MenuBar = ({ editor }: editorProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  if (!editor) {
    return null;
  }

  const insertImage = (file: File) => {
    const reader = new FileReader();

    reader.onload = () => {
      const imageUrl = reader.result as string;
      editor.chain().focus().setImage({ src: imageUrl }).run();
    };

    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      insertImage(file);
      e.target.value = "";
    }
  };

  const options = [
    {
      onClick: () => editor.chain().focus().toggleBold().run(),
      disabled: !editor.can().chain().focus().toggleBold().run(),
      pressed: editor.isActive("bold"),
      icon: <Bold size={15} />,
    },
    {
      onClick: () => editor.chain().focus().toggleItalic().run(),
      disabled: !editor.can().chain().focus().toggleItalic().run(),
      pressed: editor.isActive("italic"),
      icon: <Italic size={15} />,
    },
    {
      onClick: () => editor.chain().focus().toggleStrike().run(),
      disabled: !editor.can().chain().focus().toggleStrike().run(),
      pressed: editor.isActive("strike"),
      icon: <Strikethrough size={15} />,
    },
    {
      onClick: () => editor.chain().focus().toggleCode().run(),
      disabled: !editor.can().chain().focus().toggleCode().run(),
      pressed: editor.isActive("code"),
      icon: <Code size={15} />,
    },
    {
      onClick: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
      disabled: undefined,
      pressed: editor.isActive("heading", { level: 1 }),
      icon: <Heading1 size={15} />,
    },
    {
      onClick: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      disabled: undefined,
      pressed: editor.isActive("heading", { level: 2 }),
      icon: <Heading2 size={15} />,
    },
    {
      onClick: () => editor.chain().focus().toggleBulletList().run(),
      disabled: undefined,
      pressed: editor.isActive("bulletList"),
      icon: <List size={15} />,
    },
    {
      onClick: () => editor.chain().focus().toggleCodeBlock().run(),
      disabled: undefined,
      pressed: editor.isActive("codeBlock"),
      icon: <CodeSquare size={15} />,
    },
    {
      onClick: () => editor.chain().focus().toggleBlockquote().run(),
      disabled: undefined,
      pressed: editor.isActive("blockquote"),
      icon: <BlocksIcon size={15} />,
    },
    {
      onClick: () => editor.chain().focus().setColor("#0AA0EA").run(),
      disabled: undefined,
      pressed: editor.isActive("textStyle", { color: "#0AA0EA" }),
      icon: <Highlighter size={15} />,
    },
    {
      onClick: () => fileInputRef.current?.click(),
      pressed: false,
      icon: <ImageIcon size={15} />,
    },
  ];
  return (
    <div className="text-white flex items-center gap-1 w-full  absolute top-1  left-2 z-1   ">
      {options.map((opt, index) => (
        <button
          onClick={opt.onClick}
          disabled={opt.disabled}
          className={` p-1.5   rounded-full ${
            opt.pressed ? "bg-grey" : " hover:bg-fade-grey"
          }`}
          key={index}
        >
          {opt.icon}
        </button>
      ))}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
};
