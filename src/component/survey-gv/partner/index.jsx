import "../../../App.css";
import { useAuth, useUser } from "@clerk/clerk-react";
import ReactLoading from "react-loading";
import Content from "./content";
import { useQuery } from "@tanstack/react-query";
function compare(a, b) {
  return a.class_name.localeCompare(b.class_name);
}

export default function Index() {
  const { getToken } = useAuth();
  const { user } = useUser();

  const present = useQuery({
    queryKey: ["getPresent_CTGD"],
    queryFn: async () => {
      return await fetch(`${import.meta.env.VITE_PRESENT_API}`)
        .then((res) => res.json())
        .then((res) => (res?.hientai.length > 0 ? res?.hientai[0] : null));
    },
  });

  // useEffect(() => {
  //   let callApi = async () => {
  //     fetch(`${import.meta.env.VITE_IS_ASSIGNED_API}`, {
  //       method: "POST",
  //       headers: {
  //         authorization: `Bearer ${await getToken({
  //           template: import.meta.env.VITE_TEMPLATE_GV_GV,
  //         })}`,
  //       },
  //       body: JSON.stringify({
  //         code: `%${user.publicMetadata.magv}%`,
  //         hocky: present.hocky,
  //         namhoc: present.manamhoc,
  //       }),
  //     })
  //       .then((res) => res.json())
  //       .then((res) => {
  //         if (res.result.length > 0) setData(res.result);
  //         else setData("empty");
  //       });
  //   };
  //   if (present) callApi();
  // }, [present]);
  const data = useQuery({
    queryKey: ["getData_partner_CTGD"],
    queryFn: async () => {
      return await fetch(
        `${import.meta.env.VITE_GV_STATUS_SURVEY_API}${
          user.publicMetadata.magv
        }/${present.data?.hocky}/${present.data?.manamhoc}`,
        {
          method: "GET",
          headers: {
            authorization: `Bearer ${await getToken({
              template: import.meta.env.VITE_TEMPLATE_GV_GV,
            })}`,
          },
        }
      )
        .then((res) => res.json())
        .then((res) =>
          res.result.length > 0 ? res.result.sort(compare) : null
        );
    },
    enabled: present.data !== null && present.data !== undefined,
  });

  if (
    (present.isLoading && present.isFetching) ||
    (data.isLoading && data.isFetching)
  ) {
    return (
      <div className="wrap">
        <div className="flex justify-center">
          <h2 className="text-primary">Phản hồi công tác giảng dạy</h2>
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

  if (data.data === null) {
    return (
      <div className="wrap">
        <div className="flex justify-center">
          <h2 className="text-primary">Phản hồi công tác giảng dạy</h2>
        </div>
        <h3 className="text-center">
          Hiện tại giảng viên chưa có lớp môn học được phân công dự giờ kỳ hiện
          tại
        </h3>
      </div>
    );
  }

  return (
    <div className="wrap">
      <div className="flex justify-center">
        <h2 className="text-primary">Góp ý với đồng nghiệp</h2>
      </div>
      <Content
        present={present.data}
        data={data.data}
        isRefetch={data.isRefetching}
      />
    </div>
  );
}
