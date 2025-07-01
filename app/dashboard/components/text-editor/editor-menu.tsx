import { Editor } from "@tiptap/react";
import "./editor-styles.css";
// import EmojiPicker from "emoji-picker-react";

import { useRef } from "react";
import { FiBold, FiItalic } from "react-icons/fi";
import { HiMiniStrikethrough } from "react-icons/hi2";
import { FaCode } from "react-icons/fa6";
import {
  LuBlocks,
  LuHeading1,
  LuHighlighter,
  LuImage,
  LuSquareCode,
} from "react-icons/lu";
import { IoIosList } from "react-icons/io";
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
      icon: <FiBold className="text-base  max-3xs:text-sm text-silver-blue" />,
    },
    {
      onClick: () => editor.chain().focus().toggleItalic().run(),
      disabled: !editor.can().chain().focus().toggleItalic().run(),
      pressed: editor.isActive("italic"),
      icon: (
        <FiItalic className="text-base  max-3xs:text-sm text-silver-blue" />
      ),
    },
    {
      onClick: () => editor.chain().focus().toggleStrike().run(),
      disabled: !editor.can().chain().focus().toggleStrike().run(),
      pressed: editor.isActive("strike"),
      icon: (
        <HiMiniStrikethrough className="text-base  max-3xs:text-sm text-silver-blue" />
      ),
    },
    {
      onClick: () => editor.chain().focus().toggleCode().run(),
      disabled: !editor.can().chain().focus().toggleCode().run(),
      pressed: editor.isActive("code"),
      icon: <FaCode className="text-base  max-3xs:text-sm text-silver-blue" />,
    },
    {
      onClick: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
      disabled: undefined,
      pressed: editor.isActive("heading", { level: 1 }),
      icon: (
        <LuHeading1 className="text-base  max-3xs:text-sm text-silver-blue" />
      ),
    },

    {
      onClick: () => editor.chain().focus().toggleBulletList().run(),
      disabled: undefined,
      pressed: editor.isActive("bulletList"),
      icon: (
        <IoIosList className="text-base  max-3xs:text-sm text-silver-blue" />
      ),
    },
    {
      onClick: () => editor.chain().focus().toggleCodeBlock().run(),
      disabled: undefined,
      pressed: editor.isActive("codeBlock"),
      icon: (
        <LuSquareCode className="text-base  max-3xs:text-sm text-silver-blue" />
      ),
    },
    {
      onClick: () => editor.chain().focus().toggleBlockquote().run(),
      disabled: undefined,
      pressed: editor.isActive("blockquote"),
      icon: (
        <LuBlocks className="text-base  max-3xs:text-sm text-silver-blue" />
      ),
    },
    {
      onClick: () => editor.chain().focus().setColor("#0AA0EA").run(),
      disabled: undefined,
      pressed: editor.isActive("textStyle", { color: "#0AA0EA" }),
      icon: (
        <LuHighlighter className="text-base  max-3xs:text-sm text-silver-blue" />
      ),
    },
    {
      onClick: () => fileInputRef.current?.click(),
      pressed: false,
      icon: <LuImage className="text-base  max-3xs:text-sm text-silver-blue" />,
    },
  ];
  return (
    <div className="text-white flex items-center gap-1 w-full  absolute top-1  left-2 z-1  max-2xs:gap-0  ">
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
