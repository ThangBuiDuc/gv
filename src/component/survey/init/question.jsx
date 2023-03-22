import "../../../App.css";
import { useState, useLayoutEffect, useEffect } from "react";
import ReactLoading from "react-loading";
import Swal from "sweetalert2";
import { useAuth } from "@clerk/clerk-react";

export default function Index({ hocky, namhoc, setInited }) {
  const [data, setData] = useState(null);
  const [checked, setChecked] = useState(null);
  const { getToken } = useAuth();
  // const [test, setTest] = useState('');

  useLayoutEffect(() => {
    const callApi = async () => {
      await fetch(`${import.meta.env.VITE_PRE_QUESTION_API}`)
        .then((res) => res.json())
        .then((res) => {
          if (res.question.length > 0) setData(res.question);
        });
    };

    callApi();
  }, []);

  // console.log(checked)

  useEffect(() => {
    if (data) {
      let array = new Array(data.length).fill(false);
      setChecked(array);
    }
  }, [data]);

  // if (data) SetChecked(new Array(data.length).fill(false));

  // console.log(data)
  // console.log(checked)

  const handleOnChange = (position) => {
    let updateState = checked.map((item, index) =>
      index === position ? !item : item
    );
    setChecked(updateState);
  };

  const handleInit = () => {
    Swal.fire({
      title: "Bạn có chắc chắn tạo đợt đánh giá",
      inputAttributes: {
        autocapitalize: "off",
      },
      showCancelButton: true,
      cancelButtonText: "Huỷ",
      confirmButtonText: "Tạo mới",
      showLoaderOnConfirm: true,
      preConfirm: async () => {
        const question = data.reduce((total, current, index) => {
          let item = Object.assign({}, current);
          item.hocky = hocky;
          item.namhoc = namhoc;
          delete item.point_id;
          delete item.level_point;
          delete item.content_question;
          if (checked[index]) return [...total, item];
          else return total;
        }, []);

        const preCourse = await fetch(
          `${import.meta.env.VITE_PRE_COURSE_API}`,
          {
            method: "GET",
            headers: {
              authorization: `Bearer ${await getToken({
                template: import.meta.env.VITE_TEMPLATE_QLGD_CREATOR,
              })}`,
            },
          }
        )
          .then((res) => res.json())
          .then((res) =>
            res.v_course.map((item) => {
              item.end_date = item.end_date.split("T")[0];
              item.hocky = hocky;
              item.namhoc = namhoc;
              return item;
            })
          );

        // console.log(preCourse)

        const result = await fetch(`${import.meta.env.VITE_INIT_SURVEY_API}`, {
          method: "POST",
          headers: {
            authorization: `Bearer ${await getToken({
              template: import.meta.env.VITE_TEMPLATE_GV_CREATOR,
            })}`,
          },
          body: JSON.stringify({ objects: question, objects1: preCourse }),
        }).then((res) => res.json());

        if (result.result && result.result1) {
          setInited(true);
          Swal.fire({
            icon: "success",
            title: `Tạo mới đợt thành công`,
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Đã có lỗi xảy ra",
          });
        }
        // return (new Promise(function(resolve){
        //   resolve(false)
        // }))
      },
      allowOutsideClick: () => !Swal.isLoading(),
    });
    //   .then((result) => {
    //     console.log(result)
    //     if (result) {
    //       Swal.fire({
    //         title: `Tạo mới đợt thành công`,
    //       });
    //       setInited(true)
    //     }
    //   });
  };

  return (
    <div className="flex flex-col [&>h3]:mb-[10px]">
      <h3 className="text-primary">Câu hỏi đánh giá:</h3>
      {data && checked ? (
        <>
          <div className="flex flex-col gap-[10px]">
            <p className="text-center font-semibold">Câu hỏi cho sinh viên</p>
            {data.map((item, index) => {
              return item.point_id === 1 ? (
                <div key={index} className="flex gap-[5px] pr-[10px] pl-[10px]">
                  <input
                    className="leading-[24px]"
                    id={"question" + index}
                    type="checkbox"
                    value={item.content_question}
                    checked={checked[index]}
                    onChange={() => handleOnChange(index)}
                  />

                  <label htmlFor={"question" + index}>
                    {item.content_question}
                  </label>
                </div>
              ) : (
                ""
              );
            })}
            <div className="flex justify-evenly">
              <button
                className="btn"
                onClick={() => {
                  setChecked(
                    checked.map((item, index) => {
                      if (data[index].point_id === 1) return true;
                      else return item;
                    })
                  );
                }}
              >
                Chọn tất cả
              </button>
              <button
                className="btn"
                onClick={() => {
                  setChecked(
                    checked.map((item, index) => {
                      if (data[index].point_id === 1) return false;
                      else return item;
                    })
                  );
                }}
              >
                Bỏ chọn tất cả
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-[10px] mt-[15px]">
            <p className="text-center font-semibold">Câu hỏi cho giáo viên</p>
            {data.map((item, index) => {
              return item.point_id === 2 ? (
                <div key={index} className="flex gap-[5px] pr-[10px] pl-[10px]">
                  <input
                    className="leading-[24px]"
                    id={"question" + index}
                    type="checkbox"
                    value={item.content_question}
                    checked={checked[index]}
                    onChange={() => handleOnChange(index)}
                  />

                  <label htmlFor={"question" + index}>
                    {item.content_question}
                  </label>
                </div>
              ) : (
                ""
              );
            })}
            <div className="flex justify-evenly">
              <button
                className="btn"
                onClick={() => {
                  setChecked(
                    checked.map((item, index) => {
                      if (data[index].point_id === 2) return true;
                      else return item;
                    })
                  );
                }}
              >
                Chọn tất cả
              </button>
              <button
                className="btn"
                onClick={() => {
                  setChecked(
                    checked.map((item, index) => {
                      if (data[index].point_id === 2) return false;
                      else return item;
                    })
                  );
                }}
              >
                Bỏ chọn tất cả
              </button>
            </div>
          </div>

          <button
            className="btn w-fit mt-[40px] self-center"
            onClick={() => {
              handleInit();
            }}
          >
            Tạo mới đợt đánh giá
          </button>
        </>
      ) : (
        <ReactLoading
          type="spin"
          color="#0083C2"
          width={"50px"}
          height={"50px"}
          className="self-center"
        />
      )}
    </div>
  );
}
