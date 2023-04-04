// import React from 'react'
import { useState } from "react";
import "../../../App.css";
import { useAuth } from "@clerk/clerk-react";
import Swal from "sweetalert2";

export default function AddQ() {
  const [sv, setSv] = useState("");
  const [gv, setGv] = useState("");
  const [gvDis, setGvDis] = useState([
    {
      point: "0÷2,0 điểm",
      content: "",
    },
    {
      point: "2,0÷4,0 điểm",
      content: "",
    },
    {
      point: "4,0÷6,0 điểm",
      content: "",
    },
    {
      point: "6,0÷8,0 điểm",
      content: "",
    },
    {
      point: "8,0÷10,0 điểm",
      content: "",
    },
  ]);
  const { getToken } = useAuth();

  const handleContentGvChange = (e, index) => {
    setGvDis(
      gvDis.map((item, i) => {
        if (i === index) {
          item.content = e.target.value;
          return item;
        } else return item;
      })
    );
  };

  const handleGvOnClick = () => {
    if (gv === "" || gvDis.find((item) => item.content === "")) {
      Swal.fire({
        title: "Bạn chưa nhập câu hỏi cho giáo viên",
        icon: "info",
      });
    } else {
      Swal.fire({
        title: "Bạn có chắc muốn thêm câu hỏi cho giáo viên không?",
        showCancelButton: true,
        cancelButtonText: "Huỷ",
        showConfirmButton: true,
        confirmButtonText: "Thêm mới",
        showLoaderOnConfirm: true,
        preConfirm: async () => {
          let description = gvDis.map((item) => {
            let dis = [item.point, item.content].join("||");
            return dis;
          }).join('//')

        //   console.log(description);

            let result = await fetch(
              `${import.meta.env.VITE_REST_QUESTION_API}`,
              {
                method: "POST",
                headers: {
                  authorization: `Bearer ${await getToken({
                    template: import.meta.env.VITE_TEMPLATE_GV_CREATOR,
                  })}`,
                },
                body: JSON.stringify({
                  objects: [
                    {
                      level_point_id: 2,
                      content: gv,
                      description,
                    },
                  ],
                }),
              }
            ).then((res) => res.status);

            if (result === 200) {
              setGv("");
              setGvDis(gvDis.map(item => {
                item.content = ''
                return item
              }))
              Swal.fire({
                title: "Thêm mới câu hỏi thành công!",
                icon: "success",
              });
            } else
              Swal.fire({ title: "Thêm mới câu hỏi thất bại", icon: "error" });
        },
        allowOutsideClick: () => !Swal.isLoading(),
      });
    }
  };

  const handleSvOnClick = () => {
    if (sv === "") {
      Swal.fire({
        title: "Bạn chưa nhập câu hỏi cho sinh viên",
        icon: "info",
      });
    } else {
      Swal.fire({
        title: "Bạn có chắc muốn thêm câu hỏi cho sinh viên không?",
        showCancelButton: true,
        cancelButtonText: "Huỷ",
        showConfirmButton: true,
        confirmButtonText: "Thêm mới",
        showLoaderOnConfirm: true,
        preConfirm: async () => {
          let description =
            "Rất không đồng ý//Không đồng ý//Lưỡng lự//Đồng ý//Rất đồng ý";
          let result = await fetch(
            `${import.meta.env.VITE_POST_QUESTION_API}`,
            {
              method: "POST",
              headers: {
                authorization: `Bearer ${await getToken({
                  template: import.meta.env.VITE_TEMPLATE_GV_CREATOR,
                })}`,
              },
              body: JSON.stringify({
                objects: [
                  {
                    level_point_id: 1,
                    content: sv,
                    description,
                  },
                ],
              }),
            }
          ).then((res) => res.status);

          if (result === 200) {
            setSv("");
            Swal.fire({
              title: "Thêm mới câu hỏi thành công!",
              icon: "success",
            });
          } else
            Swal.fire({ title: "Thêm mới câu hỏi thất bại", icon: "error" });
        },
        allowOutsideClick: () => !Swal.isLoading(),
      });
    }
  };
  //   const [select, setSelect] = useState([
  //     { id: 1, content: "Câu hỏi sinh viên", status: true },
  //     { id: 2, content: "Câu hỏi giáo viên", status: false },
  //   ]);

  //   const handleOnchange = (index) => {
  //     setSelect(
  //       select.map((item, i) => {
  //         if (index === i) {
  //           item.status = true;
  //         } else item.status = false;

  //         return item;
  //       })
  //     );
  //   };
  return (
    <div className="flex flex-col gap-[40px]">
      <div className="flex items-center gap-[5%]">
        <p className="font-semibold w-[15%]">Câu hỏi sinh viên: </p>
        <input
          type="text"
          className=" w-[70%] p-[10px] rounded-[10px] border-solid border-[1px] border-bordercl"
          value={sv}
          onChange={(e) => setSv(e.target.value)}
        />
        <button
          className="btn w-[10%]"
          onClick={() => {
            handleSvOnClick();
          }}
        >
          Thêm mới
        </button>
      </div>

      <div className="flex flex-col">
        <p className="font-semibold">Câu hỏi giáo viên: </p>
        <div className="flex flex-col pl-[20px] pt-[20px] gap-[30px]">
          <div className="flex items-center gap-[5%]">
            <p className="w-[15%]">Tiêu đề câu hỏi: </p>
            <input
              type="Text"
              className=" w-[80%] p-[5px] rounded-[10px] border-solid border-[1px] border-bordercl "
              value={gv}
              onChange={(e) => setGv(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-[20px]">
            <p className="w-[15%]">Nội dung câu hỏi:</p>
            {gvDis.map((item, index) => {
              return (
                <div
                  className="flex pl-[10px] pt-[10px] items-center"
                  key={index}
                >
                  <p className="w-[15%]">{item.point}:</p>
                  <input
                    type="Text"
                    className=" w-[85%] p-[5px] rounded-[10px] border-solid border-[1px] border-bordercl "
                    value={item.content}
                    onChange={(e) => handleContentGvChange(e, index)}
                  />
                </div>
              );
            })}
          </div>
          <button
            className="btn w-fit self-center"
            onClick={() => {
              handleGvOnClick();
            }}
          >
            Thêm mới
          </button>
        </div>
      </div>
    </div>
  );
}
