import "../../../App.css";
import ReactLoading from "react-loading";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@clerk/clerk-react";
import { Fragment, useState, useEffect } from "react";
import Select from "react-select";
import Swal from "sweetalert2";
import { useQueryClient, useMutation } from "@tanstack/react-query";
// import Select from 'react-select';

function Content({ data, batch, isRefetch, staff }) {
  const [selectedOption, setSelectedOption] = useState(null);
  const queryClient = useQueryClient();
  const { getToken } = useAuth();
  const mutation = useMutation({
    mutationFn: async () => {
      return await fetch(import.meta.env.VITE_RL_UPDATE_STAFF, {
        method: "PUT",
        headers: {
          authorization: `Bearer ${await getToken({
            template: import.meta.env.VITE_TEMPLATE_SUPER_MANAGERMENT,
          })}`,
        },
        body: JSON.stringify({
          staff: selectedOption.value,
          batch: batch.id,
          khoa: data.khoa.makhoa,
        }),
      })
        .then((res) => res.json())
        .then((res) => res.result);
    },
    onSuccess: (data) => {
      if (data.affected_rows === 0) {
        Swal.fire({
          title: "Đã có lỗi xảy ra!",
          text: "Vui lòng liên hệ quản trị mạng để khắc phục sự cố",
          icon: "error",
        });
      } else {
        setSelectedOption(null);
        queryClient.invalidateQueries({ queryKey: ["RL_GET_UPDATE_STAFF"] });
        Swal.fire({
          title: `Cập nhật quản lý sinh viên cho ngành ${selectedOption.khoa} thành công!`,
          icon: "success",
        });
      }
    },
  });
  const handleOnclick = () => {
    Swal.fire({
      title: "Hoàn thành cập nhật quản lý sinh viên",
      html: `<p>
            Bạn có chắc chắn muốn hoàn thành cập nhật quản lý sinh viên <span style="font-weight:600;">${selectedOption.fullname}</span> cho ngành <span style="font-weight:600;">${selectedOption.khoa}</span> không?
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

  console.log(selectedOption);

  return (
    <div className="flex w-full gap-[10px] justify-center align-middle [&>div]:flex [&>div]:align-middle">
      <div className="flex w-[20%]">
        <h3 className="self-center">{data.khoa.tenkhoa}</h3>
      </div>
      <div className="flex w-[40%]">
        <h3 className="self-center">Quản lý sinh viên:&nbsp;</h3>
        <h3 className={`${data.staff ? "" : "text-red-600"}  self-center`}>
          {data.staff ? data.staff.fullname : "Vui lòng phân công!"}
        </h3>
      </div>
      <div className="w-[35%]">
        <Select
          className="w-full"
          placeholder="Chọn quản lý sinh viên"
          value={selectedOption}
          onChange={setSelectedOption}
          options={
            data.staff
              ? staff
                  .filter((item) => item.magiaovien !== data.staff.magiaovien)
                  .sort((a, b) => a.ten.localeCompare(b.ten))
                  .map((item) => ({
                    value: item.magiaovien,
                    fullname: item.fullname,
                    khoa: data.khoa.tenkhoa,
                    label: `${item.magiaovien} - ${item.fullname}`,
                  }))
              : staff
                  .sort((a, b) => a.ten.localeCompare(b.ten))
                  .map((item) => ({
                    value: item.magiaovien,
                    fullname: item.fullname,
                    khoa: data.khoa.tenkhoa,
                    label: `${item.magiaovien} - ${item.fullname}`,
                  }))
          }
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
  const [data, setData] = useState(null);

  const batch = useQuery({
    queryKey: ["RL_BATCH"],
    queryFn: async () => {
      return await fetch(import.meta.env.VITE_RL_BATCH)
        .then((res) => res.json())
        .then((res) => (res?.result.length > 0 ? res?.result[0] : null));
    },
  });

  // console.log(user.publicMetadata.magv);
  const { getToken } = useAuth();
  const role = useQuery({
    queryKey: ["RL_ROLE"],
    queryFn: async () => {
      return await fetch(`${import.meta.env.VITE_RL_ROLE}/${batch.data?.id}`, {
        method: "GET",
        headers: {
          authorization: `Bearer ${await getToken({
            template: import.meta.env.VITE_TEMPLATE_SUPER_MANAGERMENT,
          })}`,
        },
      })
        .then((res) => res.json())
        .then((res) => (res?.result.length > 0 ? res?.result[0] : null));
    },
    enabled: batch.data !== null && batch.data !== undefined,
  });

  const updateStaffData = useQuery({
    queryKey: ["RL_GET_UPDATE_STAFF"],
    queryFn: async () => {
      return await fetch(
        `${import.meta.env.VITE_RL_GET_UPDATE_STAFF}${batch.data?.id}`,
        {
          method: "GET",
          headers: {
            authorization: `Bearer ${await getToken({
              template: import.meta.env.VITE_TEMPLATE_SUPER_MANAGERMENT,
            })}`,
          },
        }
      ).then((res) => res.json());
    },
    enabled: batch.data !== null && batch.data !== undefined,
  });

  useEffect(() => {
    if (updateStaffData.data) setData(updateStaffData.data);
  }, [updateStaffData.data]);

  if (
    (batch.isFetching && batch.isLoading) ||
    (updateStaffData.isFetching && updateStaffData.isLoading)
  ) {
    return (
      <div className="wrap">
        <div className="flex justify-center">
          <h2 className="text-primary">Phân công quản lý sinh viên</h2>
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

  if (role.isFetching && role.isLoading) {
    return (
      <div className="wrap">
        <div className="flex justify-center">
          <h2 className="text-primary">Phân công quản lý sinh viên</h2>
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

  if (role.data?.role_id != import.meta.env.VITE_ROLE_RL_SUPER_MANAGERMENT) {
    return (
      <div className="wrap">
        <div className="flex justify-center">
          <h2 className="text-primary">Phân công quản lý sinh viên</h2>
        </div>
        <div className="flex justify-center">
          <h3>Tài khoản không có quyền thực hiện chức năng này!</h3>
        </div>
      </div>
    );
  }

  if (data && data.classes.length === 0) {
    return (
      <div className="wrap">
        <div className="flex justify-center">
          <h2 className="text-primary">Phân công quản lý sinh viên</h2>
        </div>
        <div className="flex justify-center gap-[30px]">
          <p className="font-semibold">Học kỳ: {batch?.data.term}</p>
          <p className="font-semibold">Năm học: {batch?.data.school_year}</p>
        </div>
        <div className="flex justify-center">
          <h3>Hiện tại chưa có lớp môn học để phân công quản lý sinh viên!</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="wrap">
      <div className="flex justify-center">
        <h2 className="text-primary">Phân công quản lý sinh viên</h2>
      </div>
      <div className="flex justify-center gap-[30px]">
        <p className="font-semibold">Học kỳ: {batch?.data.term}</p>
        <p className="font-semibold">Năm học: {batch?.data.school_year}</p>
      </div>
      {data &&
        data.classes.map((item, index) => {
          return (
            <Fragment key={index}>
              <Content
                staff={data.listStaff}
                data={item}
                batch={batch.data}
                isRefetch={updateStaffData.isRefetching}
              />
            </Fragment>
          );
        })}
    </div>
  );
}
