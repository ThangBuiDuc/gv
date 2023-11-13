import "../../../App.css";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import ReactLoading from "react-loading";
import Select from "react-select";
import Content from "./content";
import { useAuth } from "@clerk/clerk-react";

const Index = () => {
  const { getToken } = useAuth();
  const [selected, setSelected] = useState(null);
  const [action, setAction] = useState(null);
  const listBatch = useQuery({
    queryKey: ["RL_LIST_BATCH"],
    queryFn: async () => {
      return await fetch(import.meta.env.VITE_RL_LIST_BATCH)
        .then((res) => res.json())
        .then((res) => (res?.result.length > 0 ? res?.result : null));
    },
  });

  const role = useQuery({
    queryKey: ["RL_ROLE"],
    queryFn: async () => {
      return await fetch(
        `${import.meta.env.VITE_RL_ROLE}/${
          listBatch.data?.find((el) => el.is_active).id
        }`,
        {
          method: "GET",
          headers: {
            authorization: `Bearer ${await getToken({
              template: import.meta.env.VITE_TEMPLATE_SUPER_MANAGERMENT,
            })}`,
          },
        }
      )
        .then((res) => res.json())
        .then((res) => (res.result[0] ? res.result[0] : null));
    },
    enabled: listBatch.data !== null && listBatch.data !== undefined,
  });

  if (role.isFetching && role.isLoading) {
    return (
      <div className="wrap">
        <div className="flex justify-center">
          <h2 className="text-primary">Tổng hợp rèn luyện theo kỳ</h2>
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

  if (listBatch.isLoading && listBatch.isFetching) {
    return (
      <div className="wrap">
        <div className="flex justify-center">
          <h2 className="text-primary">Tổng hợp rèn luyện theo kỳ</h2>
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

  if (listBatch.data === null) {
    return (
      <div className="wrap">
        <div className="flex justify-center">
          <h2 className="text-primary">Tổng hợp rèn luyện theo kỳ</h2>
        </div>
        <div className="flex justify-center">
          <h3>Đã có lỗi xảy ra, vui lòng thử lại sau!</h3>
        </div>
      </div>
    );
  }

  if (
    role.data === null ||
    (role.data?.role_id != import.meta.env.VITE_ROLE_RL_SUPER_MANAGERMENT &&
      role.data?.role_id != import.meta.env.VITE_ROLE_RL_HCTH)
  ) {
    return (
      <div className="wrap">
        <div className="flex justify-center">
          <h2 className="text-primary">Tổng hợp rèn luyện theo kỳ</h2>
        </div>
        <div className="flex justify-center">
          <h3>Tài khoản không có quyền thực hiện chức năng này!</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="wrap">
      <div className="flex justify-center">
        <h2 className="text-primary">Tổng hợp rèn luyện theo kỳ</h2>
      </div>
      <div className="flex justify-center items-center gap-[30px]">
        <p className="font-semibold">Lựa chọn học kỳ:</p>
        <Select
          options={listBatch?.data.map((item) => ({
            ...item,
            value: item.id,
            label: `Học kỳ ${item.term} - Năm ${item.school_year}`,
          }))}
          value={selected}
          onChange={setSelected}
          className="w-[300px]"
          placeholder="Lựa chọn học kỳ cần lọc"
        />
        <button className="selfBtn w-[fit]" onClick={() => setAction(selected)}>
          Tìm
        </button>
      </div>
      <div className="flex gap-[30px] flex-col">
        {action ? <Content action={action} /> : <></>}
      </div>
    </div>
  );
};

export default Index;
