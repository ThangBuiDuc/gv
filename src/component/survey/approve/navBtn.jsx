import { useAuth } from "@clerk/clerk-react";
import "../../../App.css";
import { useEffect, useRef } from "react";

import Swal from "sweetalert2";

export default function Index({
  data,
  checked,
  setChecked,
  present,
  status,
  setStatus,
}) {
  // const [position, setPositon] = useState();
  const ref = useRef();
  const { getToken } = useAuth();
  // const { user } = useUser;
  // useEffect(() => {
  //   setPositon(ref.current.offsetTop);
  // }, []);
  // console.log('re-render')
  useEffect(() => {
    const nav = ref.current.offsetTop;
    // console.log(ref.current.childNodes[0])
    const handleScroll = () => {
      if (window.scrollY > nav) {
        ref.current.style =
          "position:fixed; width:80%; z-index:99; top:0;left:0;padding:0px 30px 30px 35px";
        ref.current.childNodes[0].style =
          "background-color:#0083c28a;backdrop-filter:blur(5px); border-radius: 10px ; padding: 5px";
      } else {
        ref.current.style = "positon:none";
        ref.current.childNodes[0].style =
          "background-color:none; border-radius: none ; padding: none;backdrop-filter:none";
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleApprove = async () => {
    if (checked.find((item) => item === true)) {
      Swal.fire({
        title: "Bạn có chắc chắn muốn duyệt những lớp môn học đã chọn?",
        inputAttributes: {
          autocapitalize: "off",
        },
        showCancelButton: true,
        cancelButtonText: "Huỷ",
        confirmButtonText: "Đồng ý",
        showLoaderOnConfirm: true,
        preConfirm: async () => {
          let _in = checked.reduce((total, current, index) => {
            if (current) {
              let item = Object.assign({}, data[index]);
              return (total = [...total, item.subject_code]);
            } else return total;
          }, []);

          let _in1 = checked.reduce((total, current, index) => {
            if (current) {
              let item = Object.assign({}, data[index]);
              return (total = [...total, item.class_code]);
            } else return total;
          }, []);

          const question = await fetch(
            `${import.meta.env.VITE_SV_BATCH_QUESTION_API}${present.hocky}/${
              present.manamhoc
            }`,
            {
              method: "GET",
              headers: {
                authorization: `Bearer ${await getToken({
                  template: import.meta.env.VITE_TEMPLATE_GV_CREATOR,
                })}`,
              },
            }
          )
            .then((res) => res.json())
            .then((res) => res.result);

          // console.log(question);

          const coures_respond = await fetch(
            `${import.meta.env.VITE_COURSE_RESPOND_API}`,
            {
              method: "POST",
              headers: {
                authorization: `Bearer ${await getToken({
                  template: import.meta.env.VITE_TEMPLATE_QLGD_CREATOR,
                })}`,
              },
              body: JSON.stringify({ _in, _in1 }),
            }
          )
            .then((res) => res.json())
            .then((res) => res.course_respond);

          const objects = coures_respond.map((item) => {
            let data = Object.assign({}, item);
            delete data.class_name;
            data.end_date = data.end_date.split('T')[0]
            data.hocky = present.hocky;
            data.namhoc = present.manamhoc;
            return data;
          });

          const objects1 = question.reduce((total, current) => {
            return [
              ...total,
              objects.map((i) => {
                let data = Object.assign({}, i);
                data.end_date
                data.question_id = current.question_id;
                return data;
              }),
            ];
          }, []);

          // console.log(objects1)
          const updates = checked
            .reduce((total, current, index) => {
              if (current) return [...total, data[index]];
              else return total;
            }, [])
            .map((item) => {
              let data = Object.assign({}, item);
              return {
                _set: {
                  status: true,
                  batch_created: new Date(),
                  updated_at: new Date(),
                },
                where: {
                  class_code: {
                    _eq: data.class_code,
                  },
                  subject_code: {
                    _eq: data.subject_code,
                  },
                  hocky: {
                    _eq: present.hocky,
                  },
                  namhoc: {
                    _eq: present.manamhoc,
                  },
                },
              };
            });

          // const coures_respond_detail =

          // console.log(coures_respond);
          // console.log(objects)
          // console.log(objects1)
          // console.log(JSON.stringify(updates))
          const final = await Promise.all(
            objects1.map(async (item) => {
              return await fetch(`${import.meta.env.VITE_RESPOND_DETAIL_API}`, {
                method: "POST",
                headers: {
                  authorization: `Bearer ${await getToken({
                    template: import.meta.env.VITE_TEMPLATE_GV_CREATOR,
                  })}`,
                },
                body: JSON.stringify({ objects: item }),
              }).then((res) => res.status);
            })
          );

          const final1 = await fetch(
            `${import.meta.env.VITE_SV_APPROVED_API}`,
            {
              method: "POST",
              headers: {
                authorization: `Bearer ${await getToken({
                  template: import.meta.env.VITE_TEMPLATE_GV_CREATOR,
                })}`,
              },
              body: JSON.stringify({ objects, updates }),
            }
          ).then((res) => res.status);

          if (final.every((item) => item === 200) && final1 === 200) {
            setStatus(!status);
            Swal.fire({
              icon: "success",
              title: `Duyệt môn học thành công`,
            });
          } else {
            Swal.fire({
              icon: "error",
              title: "Đã có lỗi xảy ra",
            });
          }
        },
        allowOutsideClick: () => !Swal.isLoading(),
      });
    } else {
      Swal.fire({
        icon: "info",
        title: `Bạn chưa chọn môn học cần duyệt`,
      });
    }
  };

  //   useEffect(() => {
  //     let nav = ref.current;
  //     //   console.log(nav.offsetTop)
  //     if (position > nav.offsetTop)
  //       nav.style = "position:fixed; width:100%; z-index:99; top:0;left:0;";
  //     else nav.style = "positon:none";
  //   }, [position]);
  return (
    <div ref={ref}>
      <div className={`flex justify-evenly`}>
        <button
          className="btn"
          onClick={() =>
            setChecked(
              checked.map((item) => {
                item = true;
                return item;
              })
            )
          }
        >
          Chọn tất cả
        </button>
        <button
          className="btn"
          onClick={() =>
            setChecked(
              checked.map((item) => {
                item = false;
                return item;
              })
            )
          }
        >
          Bỏ chọn tất cả
        </button>
        <button className="btn" onClick={() => handleApprove()}>
          Duyệt
        </button>
      </div>
    </div>
  );
}
