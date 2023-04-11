import { useState, useLayoutEffect } from "react";
import { useAuth } from "@clerk/clerk-react";
import TKB from "./tkb";
import TKBMobile from "./tkb_mobile";
import moment from "moment-timezone";
import time from "./time.json";
import ReactLoading from "react-loading";

function Index() {
  const [data, setData] = useState(null);
  const [screenSize, setScreenSize] = useState(window.innerWidth);
  // console.log(time);
  // useLayoutEffect(()=>{
  //     setData(datatest);
  // },[data])
  // console.log(screenSize)
  const { getToken } = useAuth();

  // useEffect(()=>{
  //   setScreenSize(window.innerWidth)
  // },[window.innerWidth])

  useLayoutEffect(() => {
    const handleResize = (e) => {
      setScreenSize(e.target.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    const fetchdata = async () => {
      fetch(`${import.meta.env.VITE_CALENDAR_GV}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${await getToken({
            template: import.meta.env.VITE_TEMPLATE_QLGD_GV,
          })}`,
        },
      })
        .then((res) => res.json())
        .then((res) => {
          // console.log(res)
          setData(
            res?.tkb_gv.map((item, index) => {
              item.id = index;
              item.allDay = false;
              item.title = item.ten_mon_hoc;
              item.start = moment(item.thoi_gian + "Z")
                .tz("Asia/Ho_Chi_Minh")
                .format();
              item.end =
                item.thoi_gian.split("T")[0] +
                "T" +
                time[`tiet_${item.tiet_bat_dau + item.so_tiet - 1}`];
              return item;
            })
          );
        });
    };

    fetchdata();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="wrap">
      {/* <h2 className={style.title}>
          Tính năng đang trong quá trình phát triển ...
        </h2> */}
      <div className="flex justify-center">
        <h2 className="text-primary">Lịch giảng dạy</h2>
      </div>
      {data ? (
        data.length > 0 ? (
          screenSize <= 768 ? (
            <TKBMobile data={data} />
          ) : (
            <TKB data={data} />
          )
        ) : (
          <div className="flex justify-center">
            <h3>
              Chưa có lịch giảng dạy của thầy/cô trong kỳ hoặc chưa cập nhật dữ
              liệu!
            </h3>
          </div>
        )
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

export default Index;
