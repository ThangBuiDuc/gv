import "../../../App.css";
import ReactLoading from "react-loading";
import { useQuery } from "@tanstack/react-query";
import { useAuth, useClerk } from "@clerk/clerk-react";
import { Fragment, useState, useEffect } from "react";
import Select from "react-select";
import Swal from "sweetalert2";
import { useQueryClient, useMutation } from "@tanstack/react-query";
// import Select from 'react-select';

function Content({ data, batch, isRefetch }) {
  const [selectedOption, setSelectedOption] = useState(null);
  const queryClient = useQueryClient();
  const { getToken } = useAuth();
  const mutation = useMutation({
    mutationFn: async () => {
      return await fetch(import.meta.env.VITE_RL_UPDATE_MONITOR, {
        method: "PUT",
        headers: {
          authorization: `Bearer ${await getToken({
            template: import.meta.env.VITE_TEMPLATE_MANAGERMENT,
          })}`,
        },
        body: JSON.stringify({
          class_code: data.class_code,
          monitor: selectedOption.value,
          batch: batch.id,
        }),
      })
        .then((res) => res.json())
        .then((res) => res.result);
    },
    onSuccess: (data) => {
      if (data.affected_rows !== 1) {
        Swal.fire({
          title: "Đã có lỗi xảy ra!",
          text: "Vui lòng liên hệ quản trị mạng để khắc phục sự cố",
          icon: "error",
        });
      } else {
        setSelectedOption(null);
        queryClient.invalidateQueries({ queryKey: ["RL_CLASS_LIST"] });
        Swal.fire({
          title: `Cập nhật lớp trưởng cho lớp ${selectedOption.class_code} thành công!`,
          icon: "success",
        });
      }
    },
  });
  const handleOnclick = () => {
    Swal.fire({
      title: "Hoàn thành cập nhật lớp trưởng",
      html: `<p>
            Bạn có chắc chắn muốn hoàn thành cập nhật lớp trưởng <span style="font-weight:600;">${selectedOption.fullname}</span> cho lớp <span style="font-weight:600;">${data.class_code}</span> không?
          </p>`,
      icon: "question",
      showCancelButton: true,
      showCloseButton: true,
      confirmButtonText: "Xác nhận",
      cancelButtonText: "Huỷ bỏ",
      showLoaderOnConfirm: () => !Swal.isLoading(),
      preConfirm: async () => {
        await mutation.mutateAsync();
      },
    });
  };

  return (
    <div className="flex w-full gap-[10px] justify-center align-middle [&>div]:flex [&>div]:align-middle">
      <div className="flex w-[20%]">
        <h3>{data.class_code}</h3>
      </div>
      <div className="flex w-[40%]">
        <h3>Lớp trưởng:&nbsp;</h3>
        <h3 className={`${data.loptruong ? "" : "text-red-600"}`}>
          {data.loptruong ? data.loptruong.fullname : "Vui lòng phân công!"}
        </h3>
      </div>
      <div className="w-[35%]">
        <Select
          className="w-full"
          placeholder="Chọn lớp trưởng"
          value={selectedOption}
          onChange={setSelectedOption}
          options={data.listSV
            .filter((item) => item.masv !== data.loptruong.masv)
            .sort((a, b) => a.ten.localeCompare(b.ten))
            .map((item) => ({
              value: item.masv,
              fullname: item.fullname,
              class_code: data.class_code,
              label: `${item.masv} - ${item.fullname}`,
            }))}
        />
      </div>
      <div className="w-[5%] justify-center align-middle flex">
        {selectedOption ? (
          isRefetch ? (
            <ReactLoading
              type="spin"
              color="#0083C2"
              width={"20px"}
              height={"20px"}
              className="self-center"
            />
          ) : (
            <button className="selfBtn w-fit" onClick={handleOnclick}>
              Lưu
            </button>
          )
        ) : isRefetch ? (
          <ReactLoading
            type="spin"
            color="#0083C2"
            width={"20px"}
            height={"20px"}
            className="self-center"
          />
        ) : (
          <button className="disableBtn w-fit cursor-not-allowed" disabled>
            Lưu
          </button>
        )}
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
        .then((res) => (res?.result.length > 0 ? res?.result[0] : null));
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
      role.data?.role_id == import.meta.env.VITE_ROLE_RL_MANAGERMENT ||
      role.data?.role_id == import.meta.env.VITE_ROLE_RL_SUPER_MANAGERMENT,
  });

  const classList = useQuery({
    queryKey: ["RL_CLASS_LIST"],
    queryFn: async () => {
      return await fetch(
        `${import.meta.env.VITE_RL_GET_CLASS_SV}${user.publicMetadata.magv}/${
          batch.data.id
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
        .then((res) => res.result);
    },
    enabled: batch.data !== null && batch.data !== undefined,
  });

  useEffect(() => {
    if (classList.data) setData(classList.data);
  }, [classList.data]);

  if (role.isFetching && role.isLoading) {
    return (
      <div className="wrap">
        <div className="flex justify-center">
          <h2 className="text-primary">Phân công lớp trưởng</h2>
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
    role.data?.role_id != import.meta.env.VITE_ROLE_RL_MANAGERMENT &&
    role.data?.role_id != import.meta.env.VITE_ROLE_RL_SUPER_MANAGERMENT
  ) {
    return (
      <div className="wrap">
        <div className="flex justify-center">
          <h2 className="text-primary">Phân công lớp trưởng</h2>
        </div>
        <div className="flex justify-center">
          <h3>Tài khoản không có quyền thực hiện chức năng này!</h3>
        </div>
      </div>
    );
  }

  if (
    (batch.isFetching && batch.isLoading) ||
    (classList.isFetching && classList.isLoading)
  ) {
    return (
      <div className="wrap">
        <div className="flex justify-center">
          <h2 className="text-primary">Phân công lớp trưởng</h2>
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
        <h2 className="text-primary">Phân công lớp trưởng</h2>
      </div>
      {data &&
        data
          .sort((a, b) => a.class_code.localeCompare(b.class_code))
          .map((item, index) => {
            return (
              <Fragment key={index}>
                <Content
                  data={item}
                  batch={batch.data}
                  isRefetch={classList.isRefetching}
                />
              </Fragment>
            );
          })}
    </div>
  );
}
