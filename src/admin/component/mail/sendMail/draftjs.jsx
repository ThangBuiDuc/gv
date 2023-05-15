import "../../../../App.css";
import { Editor } from "react-draft-wysiwyg";
import "../../../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

const trans = {
  // Generic
  "generic.add": "Thêm",
  "generic.cancel": "Huỷ",

  // BlockType
  "components.controls.blocktype.h1": "H1",
  "components.controls.blocktype.h2": "H2",
  "components.controls.blocktype.h3": "H3",
  "components.controls.blocktype.h4": "H4",
  "components.controls.blocktype.h5": "H5",
  "components.controls.blocktype.h6": "H6",
  "components.controls.blocktype.blockquote": "Blockquote",
  "components.controls.blocktype.code": "Code",
  "components.controls.blocktype.blocktype": "Block Type",
  "components.controls.blocktype.normal": "Bình thường",

  // Color Picker
  "components.controls.colorpicker.colorpicker": "Chọn màu",
  "components.controls.colorpicker.text": "Màu chữ",
  "components.controls.colorpicker.background": "Nền",

  // Embedded
  "components.controls.embedded.embedded": "Embedded",
  "components.controls.embedded.embeddedlink": "Embedded Link",
  "components.controls.embedded.enterlink": "Enter link",

  // Emoji
  "components.controls.emoji.emoji": "Biểu tượng cảm xúc",

  // FontFamily
  "components.controls.fontfamily.fontfamily": "Kiểu chữ",

  // FontSize
  "components.controls.fontsize.fontsize": "Cỡ chữ",

  // History
  "components.controls.history.history": "Lịch sử",
  "components.controls.history.undo": "Quay lại",
  "components.controls.history.redo": "Tiếp theo",

  // Image
  "components.controls.image.image": "Ảnh",
  "components.controls.image.fileUpload": "Tải lên",
  "components.controls.image.byURL": "Đường dẫn",
  "components.controls.image.dropFileText": "Kéo thả hoặc chọn từ Clipboard",

  // Inline
  "components.controls.inline.bold": "Đậm",
  "components.controls.inline.italic": "Nghiêng",
  "components.controls.inline.underline": "Gạch chân",
  "components.controls.inline.strikethrough": "Strikethrough",
  "components.controls.inline.monospace": "Monospace",
  "components.controls.inline.superscript": "Superscript",
  "components.controls.inline.subscript": "Subscript",

  // Link
  "components.controls.link.linkTitle": "Link Title",
  "components.controls.link.linkTarget": "Link Target",
  "components.controls.link.linkTargetOption": "Open link in new window",
  "components.controls.link.link": "Link",
  "components.controls.link.unlink": "Unlink",

  // List
  "components.controls.list.list": "Danh sách",
  "components.controls.list.unordered": "Unordered",
  "components.controls.list.ordered": "Ordered",
  "components.controls.list.indent": "Indent",
  "components.controls.list.outdent": "Outdent",

  // Remove
  "components.controls.remove.remove": "Xoá",

  // TextAlign
  "components.controls.textalign.textalign": "Căn chữ",
  "components.controls.textalign.left": "Căn trái",
  "components.controls.textalign.center": "Căn giữa",
  "components.controls.textalign.right": "Căn phải",
  "components.controls.textalign.justify": "Căn đều",
};

export default function Index({ editorState, setEditorState }) {
  return (
    <>
      <Editor
        editorState={editorState}
        onEditorStateChange={(e) => setEditorState(e)}
        editorClassName="h-[350px_!important] p-[10px] border-solid border-[1px] border-bordercl"
        localization={{
          translations: trans,
        }}
        toolbar={{
          inline: {
            bold: { className: "aria-selected:bg-[#bfbfbf]" },
            italic: { className: "aria-selected:bg-[#bfbfbf]" },
            underline: { className: "aria-selected:bg-[#bfbfbf]" },
            strikethrough: { className: "aria-selected:bg-[#bfbfbf]" },
            monospace: { className: "aria-selected:bg-[#bfbfbf]" },
            superscript: { className: "aria-selected:bg-[#bfbfbf]" },
            subscript: { className: "aria-selected:bg-[#bfbfbf]" },
          },
          list: {
            unordered: { className: "aria-selected:bg-[#bfbfbf]" },
            ordered: { className: "aria-selected:bg-[#bfbfbf]" },
            indent: { className: "aria-selected:bg-[#bfbfbf]" },
            outdent: { className: "aria-selected:bg-[#bfbfbf]" },
          },
          textAlign: {
            left: { className: "aria-selected:bg-[#bfbfbf]" },
            center: { className: "aria-selected:bg-[#bfbfbf]" },
            right: { className: "aria-selected:bg-[#bfbfbf]" },
            justify: { className: "aria-selected:bg-[#bfbfbf]" },
          },
          blockType: {
            className: "w-[150px_!important]",
          },
          fontFamily: {
            dropdownClassName: "w-[200px_!important]",
          },
        }}
      />
    </>
  );
}
