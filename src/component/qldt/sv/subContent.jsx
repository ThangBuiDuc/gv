import { useAuth } from "@clerk/clerk-react";
import "../../../App.css";
import { useLayoutEffect } from "react";
import ReactLoading from "react-loading";
import { useState } from "react";
import Swal from "sweetalert2";

export default function Index({ data,present}) {
    // console.log(data)
  const { getToken } = useAuth();
  const [sv, setSv] = useState();
  useLayoutEffect(() => {
    let callApi = async () => {
      fetch(`${import.meta.env.VITE_GV_QLDT_SV}${data.class_code}/${data.subject_code}`, {
        method: "GET",
        headers: {
          authorization: `Bearer ${await getToken({
            template: import.meta.env.VITE_TEMPLATE_QLGD_CREATOR,
          })}`,
        },
      })
        .then((res) => res.json())
        .then((res) => {
          if (res.result.length > 0)
            setSv(
              res.result.map((item) => {
                item.status = true;
                return item;
              })
            );
        });
    };

    callApi();
  }, []);

  const handleOnClick = async () => {
        Swal.fire({
            title:`${data.class_code} - ${data.class_name}`,
            text:`Bạn có chắc chắn muốn tổng kết điểm của tất cả sinh viên cho môn học này?`,
            showCancelButton:  true,
            showConfirmButton:true,
            confirmButtonText:'Xác nhận',
            cancelButtonText:'Huỷ',
            allowOutsideClick: () => !Swal.isLoading(),
            showLoaderOnConfirm: true,
            preConfirm: async () => {
                let updates = sv.reduce((total,curr)=>{
                    let data1 = {
                        _set:{
                            status : curr.status,
                            updated_at : new Date()
                        },
                        where:{
                            class_code: {_eq: data.class_code},
                            subject_code: {_eq:data.subject_code },
                            hocky: {_eq: present.hocky },
                            namhoc: {_eq : present.manamhoc},
                            user_code: {_eq : curr.ma_sv}
                        }
                    }

                    return [...total,data1]
                },[])


                let result = await fetch(`${import.meta.env.VITE_QLDT_COURSE_RESPOND}`,{
                    method:'PUT',
                    headers:{
                        authorization: `Bearer ${await getToken({
                            template: import.meta.env.VITE_TEMPLATE_GV_CREATOR,
                          })}`,
                    },
                    body: JSON.stringify({updates})
                }).then(res => res.status)

                let result1 = await fetch(`${import.meta.env.VITE_QLDT_STUDENT_RESULT}`,{
                    method:'POST',
                    headers:{
                        authorization: `Bearer ${await getToken({
                            template: import.meta.env.VITE_TEMPLATE_GV_CREATOR,
                          })}`,
                    },
                    body: JSON.stringify({args:{
                        clss_code : data.class_code,
                        sbj_code: data.subject_code,
                        hk: present.hocky,
                        nam:present.manamhoc
                    }})
                }).then(res => res.status)

                console.log(result1)

                if (result === 200){
                    // setStatus(!status)
                    Swal.fire({ title: "Tổng kết điểm môn học thành công!", icon: "success" });
                  }
                    
                  else
                    Swal.fire({
                      title: "Tổng kết điểm môn học không thành công",
                      icon: "error",
                    });
            }
        })
  }

  //   console.log(sv)
  return sv ? (
    <div className="flex flex-col">
      {sv.map((item, index) => {
        return (
          <div className="flex justify-between p-[10px] hover:bg-bordercl rounded-[5px]" key = {index}>
            <p className="w-[40%]">{item.name}</p>
            <p className="w-[30%] text-left">Tỉ lệ vắng: {item.tinhhinh?item.tinhhinh:0}%</p>
            <div className="flex gap-[5px] w-[20%] items-center">
              <p>Được phép tính kết quả: </p>
              <input
                type="checkbox"
                checked={item.status}
                onChange={() =>
                  setSv(
                    sv.map((item, i) => {
                      if (index === i) item.status = !item.status;
                      return item;
                    })
                  )
                }
              />
            </div>
          </div>
        );
      })}
      <button className="btn w-fit self-center mt-[20px]" onClick={() => {handleOnClick()}}>Hoàn thành</button>
    </div>
  ) : (
    <ReactLoading
      type="spin"
      color="#0083C2"
      width={"25px"}
      height={"25px"}
      className="self-center"
    />
  );
}
