import { useEffect } from "react";
import "../../App.css";

export default function Index() {
  useEffect(() => {
    let callApi = async () => {
      await fetch(
        `https://api.fastwork.vn:6010/v1/timesheets?tokenkey=${import.meta.env.VITE_FAST_WORK}`,
        {
          method: "POST",
          body: {
            code: "Cb21@hpu", //mã đăng nhập trên FW
            from: "2023-11-08", //Thời gian bắt đầu
            to: "2023-11-08", //Thời gian kết thúc
          },
        }
      ).then((res) => res.json())
      .then(res => console.log(res))
    };

    callApi();
  },[]);


  return <div className="wrap">{/* <h2>Xin chào </h2> */}</div>;
}
