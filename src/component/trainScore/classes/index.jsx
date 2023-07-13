import { useAuth, useUser } from "@clerk/clerk-react";
import { Fragment, useEffect, useState } from "react";
import ReactLoading from "react-loading";
import "../../../App.css";
import { useQuery } from "@tanstack/react-query";
import Content from "./content";
import { createContext } from "react";

export const setRootChecked = createContext(null);

export default function Index() {
  const { getToken } = useAuth();
  const [data, setData] = useState(null);

  const { user } = useUser();
  const role = useQuery({
    queryKey: ["RL_ROLE"],
    queryFn: async () => {
      return await fetch(import.meta.env.VITE_RL_ROLE, {
        method: "GET",
        headers: {
          authorization: `Bearer ${await getToken({
            template: import.meta.env.VITE_TEMPLATE_MANAGERMENT,
          })}`,
        },
      })
        .then((res) => res.json())
        .then((res) => (res.result[0] ? res.result[0] : null));
    },
  });

  const batch = useQuery({
    queryKey: ["RL_BATCH"],
    queryFn: async () => {
      return await fetch(import.meta.env.VITE_RL_BATCH)
        .then((res) => res.json())
        .then((res) => (res?.result.length > 0 ? res?.result[0] : null));
    },
    enabled:
      role.data !== null &&
      role.data !== undefined &&
      role.data?.role_id == import.meta.env.VITE_ROLE_RL_MANAGERMENT,
  });

  const preData = useQuery({
    queryKey: ["rlclasses"],
    queryFn: async () => {
      return await fetch(
        `${import.meta.env.VITE_RL_CLASSES}${user.publicMetadata.magv}/${
          batch.data?.id
        }`,
        {
          method: "GET",
          headers: {
            authorization: `Bearer ${await getToken({
              template: import.meta.env.VITE_TEMPLATE_MANAGERMENT,
            })}`,
          },
        }
      )
        .then((res) => res.json())
        .then((res) =>
          res.result.map((item) => ({
            ...item,
            checkedAll: false,
            enrollment: item.enrollment.map((el) => ({
              ...el,
              checked: false,
            })),
          }))
        );
    },
    enabled:
      batch.data !== null &&
      batch.data !== undefined &&
      role.data?.role_id == import.meta.env.VITE_ROLE_RL_MANAGERMENT,
  });

  useEffect(() => {
    if (preData.data) setData(preData.data);
  }, [preData.data]);

  if (role.isFetching && role.isLoading) {
    return (
      <div className="wrap">
        <div className="flex justify-center">
          <h2 className="text-primary">Đánh giá sinh viên</h2>
        </div>
        <ReactLoading
          type="spin"
          color="#0083C2"
          width={"50px"}
          height={"50px"}
          className="self-center"
        />
      </div>
    );
  }

  if (
    role.data === null ||
    role.data?.role_id != import.meta.env.VITE_ROLE_RL_MANAGERMENT
  ) {
    return (
      <div className="wrap">
        <div className="flex justify-center">
          <h2 className="text-primary">Đánh giá sinh viên</h2>
        </div>
        <div className="flex justify-center">
          <h3>Tài khoản không có quyền thực hiện chức năng này!</h3>
        </div>
      </div>
    );
  }

  if (batch.isFetching && batch.isLoading) {
    return (
      <div className="wrap">
        <div className="flex justify-center">
          <h2 className="text-primary">Đánh giá sinh viên</h2>
        </div>
        <ReactLoading
          type="spin"
          color="#0083C2"
          width={"50px"}
          height={"50px"}
          className="self-center"
        />
      </div>
    );
  }

  if (preData.isFetching && preData.isLoading) {
    return (
      <div className="wrap">
        <div className="flex justify-center">
          <h2 className="text-primary">Đánh giá sinh viên</h2>
        </div>
        <ReactLoading
          type="spin"
          color="#0083C2"
          width={"50px"}
          height={"50px"}
          className="self-center"
        />
      </div>
    );
  }

  // if (
  //   role.data?.role_id === undefined ||
  //   batch.data?.length <= 0 ||
  //   preData?.length <= 0
  // ) {
  //   return (
  //     <div className="wrap">
  //       <div className="flex justify-center">
  //         <h2 className="text-primary">Đánh giá sinh viên</h2>
  //       </div>
  //       <div className="flex justify-center">
  //         <h3>Đã có lỗi xảy ra, vui lòng tải lại trang!</h3>
  //       </div>
  //     </div>
  //   );
  // }

  // console.log(data);
  // console.log(preData.isRefetching);

  return (
    <setRootChecked.Provider
      value={{ setRoot: setData, isRefetch: preData.isRefetching }}
    >
      <div className="wrap">
        <div className="flex justify-center">
          <h2 className="text-primary">Đánh giá sinh viên</h2>
        </div>
        {data &&
          data
            .sort((a, b) => a.class_code.localeCompare(b.class_code))
            .map((item, index) => {
              return (
                <Fragment key={index}>
                  <Content
                    data={item}
                    rootIndex={index}
                    isRefetch={preData.isRefetching}
                  />
                </Fragment>
              );
            })}
      </div>
    </setRootChecked.Provider>
  );
}
