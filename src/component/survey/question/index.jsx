import "../../../App.css";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import AddQ from "./addQ";
import UpdateQ from "./updateQ";
import DeleteQ from "./deleteQ";

export default function Index() {

  return (
    <div className="wrap">
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
