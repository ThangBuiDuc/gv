import "../../../../App.css";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import ReactLoading from "react-loading";
import { useAuth } from "@clerk/clerk-react";

export default function Index() {
  const queryClient = useQueryClient();
  const batch = queryClient.getQueryData(["RL_BATCH"]);
  const { getToken } = useAuth();
  const classInit = useQuery({
    queryKey: ["RL_CLASS_INIT"],
    queryFn: async () => {
      return await fetch(`${import.meta.env.VITE_RL_CLASS_INIT}${batch?.id}`, {
        method: "GET",
        headers: {
          authorization: `Bearer ${await getToken({
            template: import.meta.env.VITE_TEMPLATE_SUPER_ADMIN,
          })}`,
        },
      })
        .then((res) => res.json())
        .then((res) => (res?.result.length > 0 ? res?.result : null));
    },
  });

  if (classInit.isLoading && classInit.isFetching) {
    return (
      <ReactLoading
        type="spin"
        color="#0083C2"
        width={"30px"}
        height={"30px"}
        className="self-center"
      />
    );
  }

  return (
    <div className="flex flex-col">
      <p className="font-semibold">
        Tổng số lớp hành chính đã lấy được từ EDU: {classInit.data.length}
      </p>
      <p className="font-semibold">
        Tổng số lớp hành chính đang tiến hành đánh giá:{" "}
        {classInit.data.reduce((total, item) => {
          if (item.canbo !== null && item.staff !== null) {
            return total + 1;
          }
          return total;
        }, 0)}
      </p>
      <p className="font-semibold">
        Tổng số lớp hành chính chưa đủ điều kiện đánh giá:{" "}
        {classInit.data.reduce((total, item) => {
          if (item.canbo === null || item.staff === null) {
            return total + 1;
          }
          return total;
        }, 0)}
      </p>
      <div className="overflow-x-auto mt-[30px] h-[500px]">
        <table className="table table-pin-rows">
          {/* head */}
          <thead>
            <tr>
              <th></th>
              <th>Tên lớp</th>
              <th>Cán bộ lớp</th>
              <th>Quản lý sinh viên</th>
              <th>Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {classInit.data.map((item, index) => {
              return (
                <tr key={index} className="hover">
                  <th>{index + 1}</th>
                  <td>{item.class_code}</td>
                  <td>
                    {item.canbo ? item.canbo.fullname : ". . ."}
                    {item.canbo ? (
                      <>
                        <br />
                        <span className="badge badge-ghost badge-sm">
                          {item.canbo.masv}
                        </span>
                      </>
                    ) : (
                      ". . ."
                    )}
                  </td>
                  <td>
                    {item.staff ? item.staff.fullname : ". . ."}
                    {item.staff ? (
                      <>
                        <br />
                        <span className="badge badge-ghost badge-sm">
                          {item.staff.magiaovien}
                        </span>
                      </>
                    ) : (
                      ". . ."
                    )}
                  </td>
                  {item.canbo === null && item.staff === null ? (
                    <td className="text-red-600">
                      Thiếu thông tin cán bộ lớp và QLSV
                    </td>
                  ) : item.canbo === null && item.staff !== null ? (
                    <td className="text-red-600">Thiếu thông tin cán bộ lớp</td>
                  ) : item.canbo !== null && item.staff === null ? (
                    <td className="text-red-600">Thiếu thông tin QLSV</td>
                  ) : (
                    <td className="text-green-600">Đang đánh giá</td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
