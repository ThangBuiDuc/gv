import { useState } from "react";
import "../../../../App.css";
import Draftjs from "./draftjs";
import { EditorState } from "draft-js";
import { convertToRaw } from "draft-js";
import draftToHtml from "draftjs-to-html";
import Swal from "sweetalert2";
import { useAuth } from "@clerk/clerk-react";

export default function Index() {
  const [title, setTitle] = useState("");
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const { getToken } = useAuth();

  const handleOnClick = () => {
    // console.log(draftToHtml(convertToRaw(editorState.getCurrentContent())));
    if (title === "" || editorState.getCurrentContent().hasText() === false) {
      Swal.fire({
        title: "Tiêu đề và Nội dung không được để trống!",
        icon: "warning",
      });
    } else {
      Swal.fire({
        title: "Bạn có chắc chắn muốn gửi Email không?",
        icon: "question",
        showCancelButton: true,
        showConfirmButton: true,
        confirmButtonText: "Xác nhận",
        cancelButtonText: "Huỷ",
        showLoaderOnConfirm: true,
        allowOutsideClick: () => !Swal.isLoading(),
        preConfirm: async () => {
          await fetch("/api/mailer", {
            method: "POST",
            body: JSON.stringify({
              token: await getToken({
                template: import.meta.env.VITE_TEMPLATE_GV_CREATOR,
              }),
              title: title,
              content: draftToHtml(
                convertToRaw(editorState.getCurrentContent())
              ),
            }),
          })
            .then((res) =>
              res.status === 200
                ? Swal.fire({
                    title: "Gửi Email thành công!",
                    icon: "success",
                  })
                : Swal.fire({
                    title: "Gửi Email không thành công!",
                    icon: "error",
                  })
            )
            .catch(() => {
              Swal.fire({
                title: "Gửi Email không thành công!",
                icon: "error",
              });
            });
        },
      });
    }
  };
  return (
    <div className="wrapAdmin">
      <div className="flex justify-center">
        <h2 className="text-primary">Gửi Email</h2>
      </div>
      <div className="flex flex-col gap-[20px]">
        <div className="flex gap-[10px] items-center">
          <h3 className="text-center">Tiêu đề:</h3>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border-[1px] border-solid border-bordercl text-[18px] min-w-[400px] rounded-[10px] pl-[10px] pr-[10px] p-[5px] font-semibold"
          />
        </div>
        <div className="flex flex-col gap-[10px]">
          <h3 className="w-fit">Nội dung:</h3>
          <Draftjs editorState={editorState} setEditorState={setEditorState} />
          <button className="btn w- self-center" onClick={handleOnClick}>
            Click Me!
          </button>
        </div>
      </div>
    </div>
  );
}
