// import React from 'react'
import { useAuth } from "@clerk/clerk-react";
import { useState, useLayoutEffect, Fragment } from "react";
import ReactLoading from "react-loading";
import Swal from "sweetalert2";

function DeleteQuestion({ item, afterUpdate, setAfterUpdate }) {
  const { getToken } = useAuth();

  const handleOnClick = (id) => {
    Swal.fire({
      title: "Bạn có chắc chắn muốn xoá câu hỏi không?",
      showCancelButton: true,
      showConfirmButton: true,
      cancelButtonText: "Huỷ",
      confirmButtonText: "Xoá",
      showLoaderOnConfirm: true,
      preConfirm: async () => {
        let result = await fetch(`${import.meta.env.VITE_REST_QUESTION_API}`, {
          method: "DELETE",
          headers: {
            authorization: `Bearer ${await getToken({
              template: import.meta.env.VITE_TEMPLATE_GV_CREATOR,
            })}`,
          },
          body: JSON.stringify({
            id,
          }),
        }).then((res) => res.status);

        if (result === 200) {
          setAfterUpdate(!afterUpdate);
          Swal.fire({
            title: "Xoá câu hỏi thành công!",
            icon: "success",
          });
        } else {
          Swal.fire({ title: "Xoá câu hỏi thất bại", icon: "error" });
        }
      },
      allowOutsideClick: () => !Swal.isLoading(),
    });
  };

  return (
    <div className="flex flex-col gap-[20px]">
      <div className="flex border border-bordercl items-center justify-between p-[10px] rounded-[10px]">
        <h3>{item.content_question}</h3>
        <button
          className="selfBtn"
          onClick={() => handleOnClick(item.question_id)}
        >
          Xoá
        </button>
      </div>
    </div>
  );
}

export default function Index() {
  const [afterUpdate, setAfterUpdate] = useState(false);
  const [question, setQuestion] = useState(null);
  const { getToken } = useAuth();

  useLayoutEffect(() => {
    const callApi = async () => {
      await fetch(`${import.meta.env.VITE_PRE_QUESTION_API}`, {
        method: "GET",
        headers: {
          authorization: `Bearer ${await getToken({
            template: import.meta.env.VITE_TEMPLATE_GV_CREATOR,
          })}`,
        },
      })
        .then((res) => res.json())
        .then((res) => {
          // console.log(res)
          if (res.question.length > 0) setQuestion(res.question);
        });
    };

    callApi();
  }, [afterUpdate]);

  //   console.log(question);
  return question ? (
    <div className="flex flex-col gap-[40px]">
      <div className="flex flex-col gap-[20px]">
        <h2>Câu hỏi sinh viên: </h2>
        <div className="flex-col flex p-[10px] gap-[20px]">
          {question
            .filter((item) => item.point_id === 1)
            .map((item, index) => {
              return (
                <Fragment key={index}>
                  <DeleteQuestion
                    item={item}
                    afterUpdate={afterUpdate}
                    setAfterUpdate={setAfterUpdate}
                  />
                </Fragment>
              );
            })}
        </div>
      </div>
      <div className="flex flex-col gap-[20px]">
        <h2>Câu hỏi giáo viên: </h2>
        <div className="flex-col flex p-[10px] gap-[20px]">
          {question
            .filter((item) => item.point_id === 2)
            .map((item, index) => {
              return (
                <Fragment key={index}>
                  <DeleteQuestion
                    item={item}
                    afterUpdate={afterUpdate}
                    setAfterUpdate={setAfterUpdate}
                  />
                </Fragment>
              );
            })}
        </div>
      </div>
    </div>
  ) : (
    <ReactLoading
      type="spin"
      color="#0083C2"
      width={"50px"}
      height={"50px"}
      className="self-center"
    />
  );
}
