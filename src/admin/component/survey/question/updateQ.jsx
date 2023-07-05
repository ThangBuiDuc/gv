// import React from 'react'
import { useAuth } from "@clerk/clerk-react";
import { useLayoutEffect, useState, Fragment, useEffect } from "react";
import ReactLoading from "react-loading";
import { AiOutlineRight } from "react-icons/ai";
import Swal from "sweetalert2";
import { useSpring, animated } from "react-spring";
import useMeasure from "react-use-measure";

function EditSvQuestion({ item, afterUpdate, setAfterUpdate }) {
  const [ref, bounds] = useMeasure();
  // const ref = useRef();
  const [toggle, setToggle] = useState(false);
  const [question, setQuestion] = useState(item);
  const { getToken } = useAuth();
  const spring = useSpring({
    height: toggle ? bounds.height : 0,
    opacity: toggle ? 1 : 0,
    config: {
      duration: 200,
    },
  });
  //   console.log(bounds)

  useEffect(() => {
    setQuestion(item);
  }, [toggle]);

  //   console.log(question)

  const handleOnClick = () => {
    if (question.content_question === item.content_question) {
      Swal.fire({
        title: "Không có dữ liệu thay đổi để cập nhật",
        icon: "info",
      });
    } else {
      Swal.fire({
        title: "Bạn có chắc muốn cập nhật câu hỏi cho sinh viên không?",
        showCancelButton: true,
        cancelButtonText: "Huỷ",
        showConfirmButton: true,
        confirmButtonText: "Cập nhật",
        showLoaderOnConfirm: true,
        preConfirm: async () => {
          let result = await fetch(
            `${import.meta.env.VITE_REST_QUESTION_API}`,
            {
              method: "PUT",
              headers: {
                authorization: `Bearer ${await getToken({
                  template: import.meta.env.VITE_TEMPLATE_GV_CREATOR,
                })}`,
              },
              body: JSON.stringify({
                where: {
                  id: {
                    _eq: question.question_id,
                  },
                },
                _set: {
                  content: question.content_question,
                  description: question.description,
                  updated_at: new Date(),
                },
              }),
            }
          ).then((res) => res.status);

          if (result === 200) {
            setAfterUpdate(!afterUpdate);
            setToggle(!toggle);
            Swal.fire({
              title: "Cập nhật câu hỏi thành công!",
              icon: "success",
            });
          } else
            Swal.fire({ title: "Cập nhật câu hỏi thất bại", icon: "error" });
        },
        allowOutsideClick: () => !Swal.isLoading(),
      });
    }
  };

  return (
    <div className="flex flex-col gap-[10px]">
      <div
        className="flex border-t border-bordercl items-center justify-between cursor-pointer"
        onClick={() => {
          setToggle(!toggle);
        }}
      >
        <h3>{item.content_question}</h3>
        <label
          className={`${
            toggle ? "rotate-90" : ""
          } transition-transform duration-200`}
        >
          <AiOutlineRight size={"22px"} />
        </label>
      </div>
      <animated.div style={spring} className={"overflow-hidden"}>
        <div ref={ref} className={`flex items-center gap-[5%]`}>
          <input
            type="text"
            className=" w-[85%] p-[5px] rounded-[10px] border-solid border-[1px] border-bordercl"
            value={question.content_question}
            onChange={(e) =>
              setQuestion({ ...question, content_question: e.target.value })
            }
          />
          <button className="selfBtn w-[10%]" onClick={() => handleOnClick()}>
            Cập nhật
          </button>
        </div>
      </animated.div>
    </div>
  );
}

function EditGvQuestion({ item, afterUpdate, setAfterUpdate }) {
  const [ref, bounds] = useMeasure();
  let data = Object.assign({}, item);
  data.description = data.description
    .split("//")
    .map((item) => item.split("||"));
  const [toggle, setToggle] = useState(false);
  const [question, setQuestion] = useState(data);
  const { getToken } = useAuth();
  const spring = useSpring({
    height: toggle ? bounds.height : 0,
    opacity: toggle ? 1 : 0,
    config: {
      duration: 500,
    },
  });
  //   console.log(data.description==question.description)
  useEffect(() => {
    setQuestion(data);
  }, [toggle]);

  const handleOnClick = () => {
    if (
      question.content_question === data.content_question &&
      question.description.map((item) => item.join("||")).join("//") ===
        data.description.map((item) => item.join("||")).join("//")
    ) {
      Swal.fire({
        title: "Không có dữ liệu thay đổi để cập nhật",
        icon: "info",
      });
    } else {
      Swal.fire({
        title: "Bạn có chắc muốn cập nhật câu hỏi cho sinh viên không?",
        showCancelButton: true,
        cancelButtonText: "Huỷ",
        showConfirmButton: true,
        confirmButtonText: "Cập nhật",
        showLoaderOnConfirm: true,
        preConfirm: async () => {
          let result = await fetch(
            `${import.meta.env.VITE_REST_QUESTION_API}`,
            {
              method: "PUT",
              headers: {
                authorization: `Bearer ${await getToken({
                  template: import.meta.env.VITE_TEMPLATE_GV_CREATOR,
                })}`,
              },
              body: JSON.stringify({
                where: {
                  id: {
                    _eq: question.question_id,
                  },
                },
                _set: {
                  content: question.content_question,
                  description: question.description
                    .map((item) => item.join("||"))
                    .join("//"),
                  updated_at: new Date(),
                },
              }),
            }
          ).then((res) => res.status);

          if (result === 200) {
            setAfterUpdate(!afterUpdate);
            setToggle(!toggle);
            Swal.fire({
              title: "Cập nhật câu hỏi thành công!",
              icon: "success",
            });
          } else
            Swal.fire({ title: "Cập nhật câu hỏi thất bại", icon: "error" });
        },
        allowOutsideClick: () => !Swal.isLoading(),
      });
    }
  };

  return (
    <div className="flex flex-col gap-[20px]">
      <div
        className="flex border-t border-bordercl items-center justify-between cursor-pointer"
        onClick={() => {
          setToggle(!toggle);
        }}
      >
        <h3>{item.content_question}</h3>
        <label
          className={`${
            toggle ? "rotate-90" : ""
          } transition-transform duration-500`}
        >
          <AiOutlineRight size={"22px"} />
        </label>
      </div>
      <animated.div style={spring} className={"overflow-hidden"}>
        <div ref={ref} className="flex flex-col pl-[20px] pt-[20px] gap-[30px]">
          <div className="flex items-center gap-[5%]">
            <p className="w-[15%]">Tiêu đề câu hỏi: </p>
            <input
              type="Text"
              className=" w-[80%] p-[5px] rounded-[10px] border-solid border-[1px] border-bordercl "
              value={question.content_question}
              onChange={(e) =>
                setQuestion({ ...question, content_question: e.target.value })
              }
            />
          </div>
          <div className="flex flex-col gap-[20px]">
            <p className="w-[15%]">Nội dung câu hỏi:</p>
            {question.description.map((item, index) => {
              return (
                <div
                  className="flex pl-[10px] pt-[10px] items-center"
                  key={index}
                >
                  <p className="w-[15%]">{item[0]}:</p>
                  <input
                    type="Text"
                    className=" w-[85%] p-[5px] rounded-[10px] border-solid border-[1px] border-bordercl "
                    value={item[1]}
                    onChange={(e) => {
                      setQuestion({
                        ...question,
                        description: question.description.map((item, i) => {
                          if (i === index) {
                            item[1] = e.target.value;
                            return item;
                          } else return item;
                        }),
                      });
                    }}
                  />
                </div>
              );
            })}
          </div>
          <button
            className="selfBtn w-fit self-center"
            onClick={() => handleOnClick()}
          >
            Cập nhật
          </button>
        </div>
      </animated.div>
    </div>
  );
}

export default function Index() {
  const [question, setQuestion] = useState(null);
  const [afterUpdate, setAfterUpdate] = useState(false);
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
                  <EditSvQuestion
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
                  <EditGvQuestion
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
