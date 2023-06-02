import { useAuth } from "@clerk/clerk-react";
import "../../../App.css";
import { useQuery } from "@tanstack/react-query";
import ReactLoading from "react-loading";
import { useState } from "react";
import { useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import DetailSv from "./detailSv";

export default function Index({ batch, monitor_code, unique }) {
  const { getToken } = useAuth();
  const [listSVState, setListSVState] = useState();
  const { user } = useUser();
  const [dataSent, setDataSent] = useState();
  const [toggle, setToggle] = useState(false);

  const handleOnclick = (item) => {
    setDataSent({
      user: item.user,
      student_code: item.student_code,
      manager_code: user.publicMetadata.magv,
      setToggle,
    });
    setToggle((pre) => !pre);
  };

  //   const handleOnClickTd = (item, type) => {
  //     switch (type) {
  //       case 1: {
  //         setListSVState((pre) =>
  //           pre.map((el) => {
  //             if (el.student_code === item.student_code)
  //               return {
  //                 ...el,
  //                 manager_total_point: 50,
  //               };
  //             else return el;
  //           })
  //         );
  //         break;
  //       }
  //       case 2: {
  //         setListSVState((pre) =>
  //           pre.map((el) => {
  //             if (el.student_code === item.student_code)
  //               return {
  //                 ...el,
  //                 manager_total_point: 50,
  //               };
  //             else return el;
  //           })
  //         );
  //         break;
  //       }
  //       default:
  //         console.log("err");
  //     }
  //   };

  //   console.log(listSVState);
  const listSV = useQuery({
    queryKey: ["getListSV_SV_RL", unique],
    queryFn: async () => {
      return await fetch(
        `${import.meta.env.VITE_RL_LIST_SV}${monitor_code}/${batch}`,
        {
          method: "GET",
          headers: {
            authorization: `Bearer ${await getToken({
              template: import.meta.env.VITE_TEMPLATE_MANAGERMENT,
            })}`,
          },
        }
      ).then((res) => res.json());
    },
  });

  useEffect(() => {
    if (listSV.data?.result.length > 0)
      setListSVState(listSV.data?.result[1].detail);
  }, [listSV.status]);

  if (listSV.isLoading || listSV.isFetching)
    return (
      <ReactLoading
        type="spin"
        color="#0083C2"
        width={"25px"}
        height={"25px"}
        className="self-center"
      />
    );

  if (listSV.data?.result.length === 0)
    return (
      <p className="font-semibold">
        Đã có lỗi xảy ra, vui lòng đóng mục hiện thời và mở lại!
      </p>
    );

  return toggle ? (
    <DetailSv dataSent={dataSent} />
  ) : (
    <table>
      <thead>
        <tr className="[&>th]:w-[15%] [&>th]:border-[1px] [&>th]:border-solid [&>th]:border-bordercl [&>th]:p-[5px]">
          <th>Mã sinh viên</th>
          <th className="!w-[20%]">Họ tên</th>
          <th>Điểm tự đánh giá</th>
          <th>Điểm lớp trưởng</th>
          <th>Điểm QLSV</th>
          <th className="!w-[10%]">Điểm chốt</th>
          <th className="!w-[10%]"></th>
        </tr>
      </thead>
      <tbody>
        {listSVState ? (
          listSVState.map((item, index) => {
            return (
              <tr
                key={index}
                className="[&>td]:w-[15%] [&>td]:border-[1px] [&>td]:border-solid [&>td]:border-bordercl [&>td]:p-[5px]"
              >
                <td className="text-center">{item.student_code}</td>
                <td className="!w-[20%]">{`${item.user.first_name} ${item.user.last_name}`}</td>
                <td
                  className="text-center"
                  // onClick={() => handleOnClickTd(item, 1)}
                >
                  {item.student_total_point}
                </td>
                <td
                  className="text-center"
                  // onClick={() => handleOnClickTd(item, 2)}
                >
                  {item.monitor_total_point}
                </td>
                {listSV.data?.result[0].detail.some(
                  (el) =>
                    el.student_code === item.student_code &&
                    el.manager_total_point
                ) ? (
                  <td
                    className="text-center"
                    //   onClick={() => handleOnClickTd(item, 3)}
                  >
                    {item.manager_total_point}
                  </td>
                ) : (
                  <td className="text-center">{item.manager_total_point}</td>
                )}
                <td className="!w-[10%] text-center">
                  {item.final_total_point}
                </td>
                <td className="!w-[10%] text-center">
                  <button className="btn" onClick={() => handleOnclick(item)}>
                    Chi tiết
                  </button>
                </td>
              </tr>
            );
          })
        ) : (
          <></>
        )}
      </tbody>
    </table>
  );
}
