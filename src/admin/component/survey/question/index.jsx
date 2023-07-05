import "../../../../App.css";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import AddQ from "./addQ";
import UpdateQ from "./updateQ";
import DeleteQ from "./deleteQ";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@clerk/clerk-react";
import ReactLoading from "react-loading";

export default function Index() {
  const { getToken } = useAuth();

  const role = useQuery({
    queryKey: ["getRole_CTGD"],
    queryFn: async () => {
      return await fetch(`${import.meta.env.VITE_ROLE_API}`, {
        method: "GET",
        headers: {
          authorization: `Bearer ${await getToken({
            template: import.meta.env.VITE_TEMPLATE_ROLE,
          })}`,
        },
      })
        .then((res) => res.json())
        .then((res) => res.result[0]);
    },
  });

  if (role.isLoading || role.isFetching) {
    return (
      <div className="wrapAdmin">
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

  if (role.data.role_id != import.meta.env.VITE_ROLE_ADMIN) {
    return (
      <div className="wrapAdmin">
        <div className="flex justify-center">
          <h3>Tài khoản hiện tại không có quyền thực hiện chức năng này!</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="wrapAdmin">
      <Tabs>
        <TabList>
          <Tab>Thêm câu hỏi</Tab>
          <Tab>Sửa câu hỏi</Tab>
          <Tab>Xoá câu hỏi</Tab>
        </TabList>

        <TabPanel>
          <AddQ />
        </TabPanel>
        <TabPanel>
          <UpdateQ />
        </TabPanel>
        <TabPanel>
          <DeleteQ />
        </TabPanel>
      </Tabs>
    </div>
  );
}
