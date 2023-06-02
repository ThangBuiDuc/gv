import "../../../App.css";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@clerk/clerk-react";
import { useUser } from "@clerk/clerk-react";
import ReactLoading from "react-loading";
import Select from "react-select";
import { useEffect, useState } from "react";

import ListClass from "./listClass";

function convertMajor(value) {
  let result;
  switch (value.slice(0, 2)) {
    case "CT": {
      result = "Công nghệ thông tin";
      break;
    }
    case "DC": {
      result = "Điện";
      break;
    }
    case "MT": {
      result = "Môi trường";
      break;
    }
    case "DL": {
      result = "Du lịch";
      break;
    }
    case "NA": {
      result = "Ngoại ngữ";
      break;
    }
    case "PL": {
      result = "Pháp Luật";
      break;
    }
    case "QT": {
      result = "Quản trị kinh doanh";
      break;
    }
    default:
      result = "";
  }

  return result;
}

export default function Index() {
  // console.log(import.meta.env.VITE_RL_ROLE);
  const [majorState, setMajorState] = useState();
  const [select, setSelect] = useState();
  const [select1, setSelect1] = useState();
  const [options, setOptions] = useState();
  const [options1, setOptions1] = useState();
  const { user } = useUser();
  const { getToken } = useAuth();

  useEffect(() => {
    if (majorState) {
      setOptions(
        majorState.reduce((total, item) => {
          if (total.some((el) => el.value === item.ma_khoa_hoc)) {
            return [...total];
          } else {
            return [
              ...total,
              { value: item.ma_khoa_hoc, label: "Khoá " + item.ma_khoa_hoc },
            ];
          }
        }, [])
      );

      setOptions1(
        majorState.reduce((total, item) => {
          if (total.some((el) => el.value === item.class_code.slice(0, 2))) {
            return [...total];
          } else {
            return [
              ...total,
              {
                value: item.class_code.slice(0, 2),
                label: convertMajor(item.class_code),
              },
            ];
          }
        }, [])
      );
    }
  }, [majorState]);
  const batch = useQuery({
    queryKey: ["getBatch_RL"],
    queryFn: async () => {
      return await fetch(`${import.meta.env.VITE_RL_BATCH}`, {
        method: "GET",
      }).then((res) => res.json());
    },
  });

  const role = useQuery({
    queryKey: ["getRole_RL"],
    queryFn: async () => {
      return await fetch(
        `${import.meta.env.VITE_RL_ROLE}${user.publicMetadata.magv}/${
          batch.data?.result[0].id
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
    enabled: batch.data?.result.length > 0,
  });

  const major = useQuery({
    queryKey: ["getMajor_SV_RL"],
    queryFn: async () => {
      return await fetch(
        `${import.meta.env.VITE_RL_MAJOR}${user.publicMetadata.magv}/${
          batch.data?.result[0].id
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

    enabled:
      role.data?.result[0].role_id == import.meta.env.VITE_ROLE_RL_MANAGERMENT,
  });

  useEffect(() => {
    if (major.data) setMajorState(major.data?.result);
  }, [major]);

  //   console.log(role.data?.result[0].role_id);
  //   console.log(major);

  if (major.isLoading || major.isFetching) {
    return (
      <div className="wrap">
        <div className="flex justify-center">
          <h2 className="text-primary">
            Đánh giá điểm rèn luyện cho sinh viên
          </h2>
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
    role.data?.result.length === 0 ||
    role.data?.result[0].role_id != import.meta.env.VITE_ROLE_RL_MANAGERMENT
  ) {
    return (
      <div className="wrap">
        <div className=" flex justify-center">
          <h2 className="text-primary">
            Đánh giá điểm rèn luyện cho sinh viên
          </h2>
        </div>
        <div className=" flex justify-center">
          <h3>Tài khoản hiện tại không có quyền thực hiện chức năng này!</h3>
        </div>
      </div>
    );
  }

  if (
    major.data?.result.length === 0 ||
    batch.data?.result.length === 0 ||
    role.data?.result.length === 0
  ) {
    <div className="wrap">
      <div className=" flex justify-center">
        <h2 className="text-primary">Đánh giá điểm rèn luyện cho sinh viên</h2>
      </div>
      <div className=" flex justify-center">
        <h3>Đã có lỗi xảy ra, vui lòng tải lại trang!</h3>
      </div>
    </div>;
  }

  if (major.data?.result.length === 0) {
    <div className="wrap">
      <div className=" flex justify-center">
        <h2 className="text-primary">Đánh giá điểm rèn luyện cho sinh viên</h2>
      </div>
      <div className=" flex justify-center">
        <h3>Chưa có giữ liệu hoặc có lỗi xảy ra</h3>
      </div>
    </div>;
  }

  return (
    <div className="wrap">
      <div className=" flex justify-center">
        <h2 className="text-primary">Đánh giá điểm rèn luyện cho sinh viên</h2>
      </div>
      <div className="flex gap-[50px]">
        <Select
          className="w-[230px]"
          options={options}
          onChange={setSelect}
          defaultValue={select}
          placeholder="Vui lòng chọn khoá"
        />
        {select ? (
          <Select
            className="w-[230px]"
            options={options1}
            onChange={setSelect1}
            defaultValue={select1}
            placeholder="Vui lòng chọn ngành"
          />
        ) : (
          <></>
        )}
      </div>
      {select && select1 ? (
        <ListClass
          major={majorState
            .filter((item) => item.ma_khoa_hoc === select.value)
            .filter((item) => item.class_code.includes(select1.value))}
        />
      ) : (
        <></>
      )}
    </div>
  );
}
