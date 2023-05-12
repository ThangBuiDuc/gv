import { useState } from "react";
import "../../../../App.css";
import { useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";
import ReactLoading from "react-loading";

import Content from "./content";

export default function Index() {
  const [data, setData] = useState(null);
  const { getToken } = useAuth();
  useEffect(() => {
    const callApi = async () => {
      fetch(import.meta.env.VITE_LIST_CB_GV, {
        method: "GET",
        headers: {
          authorization: `Bearer ${await getToken({
            template: import.meta.env.VITE_TEMPLATE_GV_CREATOR,
          })}`,
        },
      })
        .then((res) => res.json())
        .then((res) => {
          res.result.length > 0 ? setData(res.result) : setData("empty");
        });
    };
    callApi();
  }, []);

  return (
    <div className="wrapAdmin">
      <div className="flex justify-center">
        <h2 className="text-primary">Phân quyền đánh giá CTGD</h2>
      </div>
      {data === "empty" ? (
        <div className="flex justify-center">
          <h3>Đã có lỗi xảy ra. Vui lòng tải lại trang</h3>
        </div>
      ) : data ? (
        <Content data={data} setData={setData} />
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
