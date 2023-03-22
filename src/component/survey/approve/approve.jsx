import { useAuth } from "@clerk/clerk-react";
import "../../../App.css";
import { useEffect, useState } from "react";
import ReactLoading from "react-loading";
import DropDown from "./dropDown";
import NavBtn from "./navBtn";

export default function Index({ present }) {
  // let date = new Date();
  const [data, setData] = useState(null);
  const [checked, setChecked] = useState(null);
  // const [startDate, setStartDate] = useState(date.toISOString().slice(0, 10));
  // const [endDate, setEndDate] = useState(
  //   new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
  // );
  const { getToken } = useAuth();

  useEffect(() => {
    const callApi = async () => {
      await fetch(
        `${import.meta.env.VITE_APPROVE_SUBJECT_API}${present.hocky}/${
          present.manamhoc
        }`,
        {
          method: "GET",
          headers: {
            authorization: `Bearer ${await getToken({
              template: `${import.meta.env.VITE_TEMPLATE_GV_CREATOR}`,
            })}`,
          },
        }
      )
        .then((res) => res.json())
        .then((res) => {
          // console.log(res);
          if (res.result.length > 0) setData(res.result);
        });
    };

    callApi();
  }, []);

  useEffect(() => {
    if (data)
      setChecked(
        new Array(data.filter((item) => item.status === false).length).fill(
          false
        )
      );
  }, [data]);

  // console.log(data.filter((item) => item.status === false).length)
  // console.log(checked)

  return (
    <>
      <div className="flex flex-col gap-[10px]">
        {data && checked ? (
          <>
            <p className="font-semibold">Danh sách lớp môn học chưa duyệt</p>
            <NavBtn data={data} checked={checked} setChecked={setChecked} />
            {data
              .filter((item) => item.status === false)
              .map((item, index) => {
                // console.log(item)
                return (
                  <DropDown
                    key={index}
                    item={item}
                    index={index}
                    checked={checked}
                    setChecked={setChecked}
                  />
                );
              })}
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
    </>
  );
}
