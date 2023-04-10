import "../../../App.css";
import { RoleContext } from "../../../App";
import { useContext, useState, Fragment } from "react";
import { useLayoutEffect,useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";
import ReactLoading from "react-loading";
import Content from "./content";

function compare( a, b ) {
  return a.class_name.localeCompare(b.class_name)
}

export default function Index() {
  const [present, setPresent] = useState();
  const [data, setData] = useState();
  const [staff, setStaff] = useState();
  const { getToken } = useAuth();
  const { role } = useContext(RoleContext);
  const [status,setStatus] = useState();
  const [question,setQuestion] = useState(null)
  // console.log(role);

  useLayoutEffect(() => {
    let callApi = async () => {
      await fetch(`${import.meta.env.VITE_PRESENT_API}`)
        .then((res) => res.json())
        .then((res) => {
          if (res.hientai) setPresent(res.hientai[0]);
        });
    };

    if (role.is_truong_khoa) callApi();
  }, []);

  useLayoutEffect(() => {
    let callApi = async () => {
      await fetch(`${import.meta.env.VITE_GET_ASSIGN_STAFF_API}`, {
        method: "GET",
        headers: {
          authorization: `Bearer ${await getToken({
            template: import.meta.env.VITE_TEMPLATE_GV_TRUONG_KHOA,
          })}`,
        },
      })
        .then((res) => res.json())
        .then((res) => {
          if (res.result.length > 0) setStaff(res.result);
          else setStaff("empty");
        });

      
    };

    if (present && role.is_truong_khoa) callApi();
  }, [present]);

  useEffect(()=>{
    const callApi = async () => {
      fetch(`${import.meta.env.VITE_GV_BATCH_QUESTION_API}${present.hocky}/${present.manamhoc}`,{
        method:'GET',
        headers:{
          authorization : `Bearer ${await getToken({template: import.meta.env.VITE_TEMPLATE_GV_TRUONG_KHOA})}`
        }
      }).then(res => res.json())
      .then(res => {
        if(res.result.length > 0) setQuestion(res.result)
      })
    }

    if(present) callApi()
  },[present]) 

  useLayoutEffect(()=> {
    let callApi = async () => {
      await fetch(
        `${import.meta.env.VITE_GET_ASSIGN_OBJECT_API}${role.khoa_gv}/${
          present.hocky
        }/${present.manamhoc}`,
        {
          method: "GET",
          headers: {
            authorization: `Bearer ${await getToken({
              template: import.meta.env.VITE_TEMPLATE_GV_TRUONG_KHOA,
            })}`,
          },
        }
      )
        .then((res) => res.json())
        .then((res) => {
          // console.log(res)
          if (res.result.length > 0) setData(res.result.sort(compare));
          else setData("empty");
        });
    }
    if (present && role.is_truong_khoa) callApi();
  },[status,present])


  return (
    <div className="wrap">
      <div className="flex justify-center">
        <h2 className="text-primary">Phân công dự giờ</h2>
      </div>
      {role.is_truong_khoa ? (
        data === "empty" ? (
          <div className="flex justify-center">
            <h3>Hiện tại chưa có lớp môn học nào được duyệt khảo sát trong kỳ</h3>
          </div>
        ) : data ? (
          <>
            <div className="flex flex-col gap-[20px]">
              <h3 className="self-center text-primary">
                Những lớp môn học chưa phân công dự giờ
              </h3>
              {data
                .filter((item) => item.teacher_attend_1 === null)
                .map((item, index) => {
                  return (
                    <Fragment key={index}>
                      <Content data={item} staff={staff} present={present} status={status} setStatus={setStatus} question={question}/>
                    </Fragment>
                  );
                })}
            </div>
            <div className="flex flex-col gap-[20px]">
              <h3 className="self-center text-primary">
                Những lớp môn học đã phân công dự giờ
              </h3>
              {data
                .filter((item) => item.teacher_attend_1 !== null)
                .map((item, index) => {
                  return (
                    <Fragment key={index}>
                      <Content data={item} staff={staff} present={present} />
                    </Fragment>
                  );
                })}
            </div>
          </>
        ) : (
          <ReactLoading
            type="spin"
            color="#0083C2"
            width={"50px"}
            height={"50px"}
            className="self-center"
          />
        )
      ) : (
        <div className="flex justify-center">
          <h3>Tài khoản hiện tại không có quyền phân công dự giờ</h3>
        </div>
      )}
    </div>
  );
}
