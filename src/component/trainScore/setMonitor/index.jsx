import "../../../App.css";
import ReactLoading from "react-loading";
import { useQuery } from "@tanstack/react-query";
import { useAuth, useClerk } from "@clerk/clerk-react";
import { Fragment, useState, useEffect } from "react";

// import Select from 'react-select';



function Content({data}) {
  // const [selectedOption, setSelectedOption] = useState(null);

  return(
    <div className="flex w-full">
      <div className="flex w-[20%]">
        <p>Lớp :</p>
        <p>{data.class_code}</p>
      </div>
      <div className="flex w-[40%]">
        <p>Lớp trưởng hiện tại :</p>
        <p>{data.loptruong.fullname}</p>
      </div>
      <div className="w-[35%]">
        <select className="select select-bordered select-sm w-full max-w-xs"
                // defaultValue={"Chọn lớp trưởng"}
        >
          <option disabled selected>Chọn lớp trưởng</option>
          {data.listSV.map((item,i ) => {
            return (
              <option key={i}>{item.fullname}</option>
            )
          })}
        </select>
      </div>
      <div className="w-[5%]">
        <button className="btn btn-sm">
          <span>Lưu</span>
        </button>
      </div>
    </div>
  );
}







export default function Index() {
  const { user } = useClerk();


  const [data, setData] = useState(null);

  // console.log(user.publicMetadata.magv);
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

  const classList = useQuery({
    queryKey: ["RL_CLASS_LIST"],
    queryFn: async () => {
        return await fetch(`${import.meta.env.VITE_RL_GET_CLASS_SV}${user.publicMetadata.magv}`, {
            method: "GET",
            headers: {
              authorization: `Bearer ${await getToken({
                template: import.meta.env.VITE_TEMPLATE_MANAGERMENT,
              })}`,
            },
          }).then(res => res.json())
          .then(res => res.result)
    }
  })

  useEffect(() => {
    if (classList.data) setData(classList.data);
  }, [classList.data]);


  console.log(data);



  if (role.isFetching || role.isLoading) {
    return (
      <div className="wrap">
        <div className="flex justify-center">
          <h2 className="text-black">Phân công lớp trưởng</h2>
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
          <h2 className="text-black">Phân công lớp trưởng</h2>
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
    classList.isFetching ||
    classList.isLoading
  ) {
    return (
      <div className="wrap">
        <div className="flex justify-center">
          <h2 className="text-black">Phân công lớp trưởng</h2>
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
          <h2 className="text-black">Phân công lớp trưởng</h2>
      </div>
      {data &&
          data.map((item, index) => {
            return (
              <Fragment key={index}>
                <Content
                  data={item}
                  rootIndex={index}
                  isRefetch={classList.isRefetching}
                />
              </Fragment>
            );
          })}
    </div>
  );
}
