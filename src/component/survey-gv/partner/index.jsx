import { useEffect, useLayoutEffect, useState } from "react";
import "../../../App.css";
import { useAuth, useUser } from "@clerk/clerk-react";
import ReactLoading from "react-loading";
import Content from "./content";
function compare( a, b ) {
  return a.class_name.localeCompare(b.class_name)
}

export default function Index() {
  const { getToken } = useAuth();
  const { user } = useUser();
  const [present, setPresent] = useState(null);
  const [data, setData] = useState(null);
  const [afterUpdate,setAfterUpdate] = useState(false)
  useLayoutEffect(() => {
    let callApi = async () => {
      await fetch(`${import.meta.env.VITE_PRESENT_API}`)
        .then((res) => res.json())
        .then((res) => {
          if (res.hientai) setPresent(res.hientai[0]);
        });
    };

    callApi();
  }, []);
  // useEffect(() => {
  //   let callApi = async () => {
  //     fetch(`${import.meta.env.VITE_IS_ASSIGNED_API}`, {
  //       method: "POST",
  //       headers: {
  //         authorization: `Bearer ${await getToken({
  //           template: import.meta.env.VITE_TEMPLATE_GV_GV,
  //         })}`,
  //       },
  //       body: JSON.stringify({
  //         code: `%${user.publicMetadata.magv}%`,
  //         hocky: present.hocky,
  //         namhoc: present.manamhoc,
  //       }),
  //     })
  //       .then((res) => res.json())
  //       .then((res) => {
  //         if (res.result.length > 0) setData(res.result);
  //         else setData("empty");
  //       });
  //   };
  //   if (present) callApi();
  // }, [present]);

  useEffect(() => {
    const callApi = async () => {
      await fetch(
        `${import.meta.env.VITE_GV_STATUS_SURVEY_API}${
          user.publicMetadata.magv
        }/${present.hocky}/${present.manamhoc}`,
        {
          method: "GET",
          headers: {
            authorization: `Bearer ${await getToken({
              template: import.meta.env.VITE_TEMPLATE_GV_GV,
            })}`,
          },
        }
      )
        .then((res) => res.json())
        .then((res) => {
          if (res.result.length > 0) setData(res.result.sort(compare));
          else setData("empty");
        });
    };

    if (present) callApi();
  }, [present,afterUpdate]);

  return (
    <div className="wrap">
      <div className="flex justify-center">
        <h2 className="text-primary">Đồng nghiệp phản hồi</h2>
      </div>
      {data === "empty" ? (
        <div className="flex justify-center">
          <h3>
            Hiện tại giảng viên chưa có môn học được phân công dự giờ kỳ hiện
            tại
          </h3>
        </div>
      ) : data ? (
        <Content present={present} data={data} afterUpdate={afterUpdate} setAfterUpdate={setAfterUpdate}/>
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
