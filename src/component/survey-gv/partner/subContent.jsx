// import React from 'react'
import { BiArrowBack } from "react-icons/bi";
import { useAuth, useUser } from "@clerk/clerk-react";
import { useState, useEffect } from "react";
import ReactLoading from "react-loading";
import Swal from "sweetalert2";

export default function Index({
  toggle,
  setToggle,
  dataSent,
  afterUpdate,
  setAfterUpdate,
}) {
  const { subject_code, class_code, present, class_name, teacher_name } =
    dataSent;
  const [preData, setPreData] = useState();
  const { getToken } = useAuth();
  const { user } = useUser();
  const [point, setPoint] = useState(null);
  const [comment, setComment] = useState(null);
  //   const [point,setPoint] = useState([0,0,0])
  useEffect(() => {
    const callApi = async () => {
      await fetch(`${import.meta.env.VITE_LIST_QUESTION_API}`, {
        method: "POST",
        headers: {
          authorization: `Bearer ${await getToken({
            template: import.meta.env.VITE_TEMPLATE_GV_GV,
          })}`,
        },
        body: JSON.stringify({
          code: user.publicMetadata.magv,
          sbj_code: subject_code,
          hk: present.hocky,
          namhoc: present.manamhoc,
        }),
      })
        .then((res) => res.json())
        .then((res) => {
          // console.log(res.result)
          setPreData(res.result);
          //   setPoint(new Array(preData.length))
        });
    };

    callApi();
  }, []);

  useEffect(() => {
    if (preData) {
      setPoint(new Array(preData.length).fill(""));
      setComment(new Array(preData.length).fill(""));
    }
  }, [preData]);

  const handleOnClick = () => {
    if (point.every((item) => item !== "")) {
      Swal.fire({
        title: "Bạn có chắc chắn muốn hoàn thành đánh giá không?",
        showCancelButton: true,
        showConfirmButton: true,
        confirmButtonText: "Xác nhận",
        cancelButtonText: "Huỷ",
        allowOutsideClick: () => !Swal.isLoading(),
        showLoaderOnConfirm: true,
        preConfirm: async () => {
          let updates = point.reduce((total, curr, i) => {
            let data = {
              _set: {
                question_point: curr,
                comment : comment[i],
                updated_at: new Date(),
              },
              where: {
                question_id: {
                  _eq: preData[i].id,
                },
                class_code: {
                  _eq: class_code,
                },
                subject_code: {
                  _eq: subject_code,
                },
                hocky: {
                  _eq: present.hocky,
                },
                namhoc: {
                  _eq: present.manamhoc,
                },
                user_code: {
                  _eq: user.publicMetadata.magv,
                },
              },
            };

            return [...total, data];
          }, []);

          let result = await fetch(`${import.meta.env.VITE_GV_UPDATE_SURVEY}`, {
            method: "PUT",
            headers: {
              authorization: `Bearer ${await getToken({
                template: import.meta.env.VITE_TEMPLATE_GV_GV,
              })}`,
            },
            body: JSON.stringify({ updates }),
          }).then((res) => res.status);

          if (result === 200) {
            setAfterUpdate(!afterUpdate);
            setToggle(!toggle);
            Swal.fire({
              title: "Đánh giá dự giờ thành công!",
              icon: "success",
            });
          } else
            Swal.fire({
              title: "Đánh giá dự giờ không thành công",
              icon: "error",
            });
        },
      });
    } else {
      Swal.fire({
        title: "Vui lòng nhập điểm đánh giá",
        icon: "warning",
      });
    }
  };

  return preData ? (
    <div className="flex flex-col pl-[20px] gap-[20px] ">
      <label
        onClick={() => setToggle(!toggle)}
        className="w-fit cursor-pointer"
      >
        <BiArrowBack size={"40"} />
      </label>
      <h3 className="text-center">
        {class_name} - {teacher_name}
      </h3>
      {preData.map((item, index) => {
        return (
          <div key={index} className="flex flex-col">
            <p className="font-semibold">
              {index + 1}. {item.content}
            </p>
            <div className="flex flex-col gap-[10px] p-[10px]">
              {item.description
                .split("//")
                .map((item) => item.split("||").join(": "))
                .map((item, index) => (
                  <p key={index}>{item}</p>
                ))}
            </div>
            <div className=" flex flex-col g-[10px] p-[10px]">
              <p className="font-semibold">Nhận xét</p>
              <textarea
                className="resize-none p-[10px] rounded-[10px] border-[1px] border-solid border-bordercl "
                rows="5"
                value={comment?comment[index]:''}
                onChange={(e) =>
                  setComment(
                    comment.map((item, i) => {
                      if (i === index) return e.target.value;
                      else return item;
                    })
                  )
                }
              />
            </div>
            <div className="flex gap-[10px] p-[10px] items-center">
              <h3>Điểm đánh giá: </h3>
              <input
                type="number"
                step={0.01}
                min={0}
                max={10}
                className="max-w-[10%] border-[1px] border-solid border-bordercl overflow-hidden p-[5px] rounded-[5px]"
                value={point ? point[index] : ""}
                maxLength={5}
                pattern="[0-9]{4}"
                onChange={(e) =>
                  setPoint(
                    point.map((curr, i) => {
                      if (i === index)
                        return e.target.value > 10
                          ? 10
                          : e.target.value < 0
                          ? 0
                          : (curr = e.target.value);
                      else return curr;
                    }, [])
                  )
                }
              ></input>
            </div>
          </div>
        );
      })}
      <button
        className="btn w-fit self-center"
        onClick={() => {
          handleOnClick();
        }}
      >
        Hoàn thành
      </button>
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
