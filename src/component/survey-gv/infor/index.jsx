import { useState } from "react";
import "../../../App.css";
import { useLayoutEffect } from "react";
import { useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";
import ReactLoading from "react-loading";
import Content from "./content";

function compare(a, b) {
  return a.class_name.localeCompare(b.class_name);
}

export default function Index() {
  const [present, setPresent] = useState(null);
  const [data, setData] = useState(null);
  const { getToken } = useAuth();

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

  useEffect(() => {
    let callApi = async () => {
      fetch(
        `${import.meta.env.VITE_STATUS_SURVEY_GV_API}/${present.hocky}/${
          present.manamhoc
        }`,
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
  }, [present]);

  // console.log(present);
  // console.log(data);
  return (
    <div className="wrap">
      <div className="flex justify-center">
        <h2 className="text-primary">Phản hồi công tác giảng dạy</h2>
      </div>
      {data === "empty" ? (
        <div className="flex justify-center">
          <h3>
            Hiện tại chưa có môn học nào trong quá trình phản hồi công tác giảng
            dạy kỳ hiện tại
          </h3>
        </div>
      ) : data ? (
        data.map((item, index) => (
          <div className="flex flex-col" key={index}>
            <Content data={item} />
          </div>
        ))
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
