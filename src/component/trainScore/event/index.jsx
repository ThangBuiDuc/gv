import "../../../App.css";
import ReactLoading from "react-loading";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@clerk/clerk-react";
import Content from "./content";

export default function Index() {
  const { getToken } = useAuth();
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
        .then((res) => res.result[0]);
    },
  });

  const batch = useQuery({
    queryKey: ["RL_BATCH"],
    queryFn: async () => {
      return await fetch(import.meta.env.VITE_RL_BATCH)
        .then((res) => res.json())
        .then((res) => res.result);
    },
    enabled:
      role.data?.role_id.toString() ===
      import.meta.env.VITE_ROLE_RL_MANAGERMENT,
  });

  const listSV = useQuery({
    queryKey: ["RL_LIST_SV"],
    queryFn: async () => {
      return await fetch(import.meta.env.VITE_RL_LIST_SV, {
        method: "GET",
        headers: {
          authorization: `Bearer ${await getToken({
            template: import.meta.env.VITE_TEMPLATE_MANAGERMENT,
          })}`,
        },
      })
        .then((res) => res.json())
        .then((res) => res.result);
    },
    enabled:
      role.data?.role_id.toString() ===
      import.meta.env.VITE_ROLE_RL_MANAGERMENT,
  });

  const listEvent = useQuery({
    queryKey: ["RL_LIST_EV"],
    queryFn: async () => {
      return await fetch(import.meta.env.VITE_RL_LIST_EVENT, {
        method: "GET",
        headers: {
          authorization: `Bearer ${await getToken({
            template: import.meta.env.VITE_TEMPLATE_MANAGERMENT,
          })}`,
        },
      })
        .then((res) => res.json())
        .then((res) => res.result);
    },
    enabled:
      role.data?.role_id.toString() ===
      import.meta.env.VITE_ROLE_RL_MANAGERMENT,
  });

  console.log(batch.data);
  console.log(listSV.data);
  console.log(listEvent.data);

  if (role.isFetching || role.isLoading) {
    return (
      <div className="wrap">
        <div className="flex justify-center">
          <h2 className="text-primary">Sự kiện rèn luyện</h2>
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
    role.data?.role_id.toString() !== import.meta.env.VITE_ROLE_RL_MANAGERMENT
  ) {
    return (
      <div className="wrap">
        <div className="flex justify-center">
          <h2 className="text-primary">Sự kiện rèn luyện</h2>
        </div>
        <div className="flex justify-center">
          <h3>Tài khoản không có quyền thực hiện chức năng này!</h3>
        </div>
      </div>
    );
  }

  if (
    batch.isFetching ||
    batch.isLoading ||
    listEvent.isFetching ||
    listEvent.isLoading ||
    listSV.isFetching ||
    listSV.isLoading
  ) {
    return (
      <div className="wrap">
        <div className="flex justify-center">
          <h2 className="text-primary">Sự kiện rèn luyện</h2>
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

  return (
    <div className="wrap">
      <div className="flex justify-center">
        <h2 className="text-primary">Sự kiện rèn luyện</h2>
      </div>
      <Content />
    </div>
  );
}
