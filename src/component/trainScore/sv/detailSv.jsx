import "../../../App.css";
import { BiArrowBack } from "react-icons/bi";
import { useQuery } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth, useUser } from "@clerk/clerk-react";
import { useState } from "react";
import { useEffect } from "react";
import ReactLoading from "react-loading";
import Swal from "sweetalert2";

export default function Index({ dataSent }) {
  const { setToggle, student_code, user } = dataSent;
  const queryClient = useQueryClient();
  const userClerk = useUser();
  const { getToken } = useAuth();
  const [detailState, setDetailState] = useState();

  const handleOnChange = (e, item) => {
    setDetailState((pre) =>
      pre.map((el) => {
        if (
          el.student_code === item.student_code &&
          el.question_id === item.question_id
        ) {
          return {
            ...el,
            manager_point: e.target.value,
          };
        } else return el;
      })
    );
  };

  const handleOnClick = () => {
    Swal.fire({
      title: "Xác nhận",
      showCancelButton: true,
      showConfirmButton: true,
      showLoaderOnConfirm: () => !Swal.isLoading(),
      preConfirm: async () => {
        let updates = detailState.map((item) => {
          return {
            _set: {
              point: item.manager_point,
            },
            where: {
              question_id: {
                _eq: item.question_id,
              },
              student_code: {
                _eq: item.student_code,
              },
              code: {
                _eq: userClerk.user.publicMetadata.magv,
              },
              batch_id: {
                _eq: 1,
              },
            },
          };
        });

        console.log(JSON.stringify(updates));

        let result = await fetch(import.meta.env.VITE_RL_UPDATE_POINT, {
          method: "PUT",
          headers: {
            authorization: `Bearer ${await getToken({
              template: import.meta.env.VITE_TEMPLATE_MANAGERMENT,
            })}`,
          },
          body: JSON.stringify({ updates }),
        }).then((res) => res.json());

        console.log(result);
        Swal.fire({ title: "Thành công" });
      },
    });
  };
  const detail = useQuery({
    queryKey: ["detail_SV_RL"],
    queryFn: async () => {
      return await fetch(
        `${import.meta.env.VITE_RL_DETAIL_SV}${student_code}/${
          queryClient.getQueryData(["getBatch_RL"])?.result[0].id
        }`,
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
    if (detail.data?.result.length > 0) setDetailState(detail.data?.result);
  }, [detail.status]);

  if (detail.isLoading || detail.isFetching)
    return (
      <ReactLoading
        type="spin"
        color="#0083C2"
        width={"25px"}
        height={"25px"}
        className="self-center"
      />
    );

  if (detail.data?.result.length === 0)
    return (
      <p className="font-semibold">
        Đã có lỗi xảy ra, vui lòng đóng mục hiện thời và mở lại!
      </p>
    );

  console.log(detailState);

  return (
    <div className="flex p-[10px] flex-col gap-[10px]">
      <BiArrowBack size={"22px"} onClick={() => setToggle((pre) => !pre)} />
      <h5 className="text-center">
        Đánh giá cho sinh viên {user.first_name + " " + user.last_name}
      </h5>
      <table>
        <thead>
          <tr className="[&>th]:w-[10%] [&>th]:border-[1px] [&>th]:border-solid [&>th]:border-bordercl [&>th]:p-[5px]">
            <th className="!w-[60%]">Nội dung đánh giá</th>
            <th>Mức điểm tối đa</th>
            <th>SV tự chấm</th>
            <th>Cán bộ chấm</th>
            <th>QLSV chấm</th>
          </tr>
        </thead>
        <tbody>
          {detailState ? (
            detailState.map((item, index) => {
              return (
                <tr
                  key={index}
                  className="[&>td]:w-[10%] [&>td]:border-[1px] [&>td]:border-solid [&>td]:border-bordercl [&>td]:p-[5px]"
                >
                  <td className="!w-[60%]">{item.question_name}</td>
                  <td>{item.point_max}</td>
                  <td>
                    <input
                      type="number"
                      max={item.point_max}
                      value={item.self_point}
                      disabled
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      max={item.point_max}
                      value={item.monitor_point}
                      disabled
                    />
                  </td>

                  <td>
                    <input
                      type="number"
                      max={item.point_max}
                      value={item.manager_point}
                      onChange={(e) => handleOnChange(e, item)}
                    />
                  </td>
                </tr>
              );
            })
          ) : (
            <></>
          )}
        </tbody>
      </table>

      <button className="btn w-fit self-center" onClick={() => handleOnClick()}>
        Hoàn thành
      </button>
    </div>
  );
}
