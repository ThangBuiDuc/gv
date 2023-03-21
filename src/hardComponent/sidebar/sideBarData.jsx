import { RiSurveyFill } from "react-icons/ri";
import { MdCreateNewFolder } from "react-icons/md";
import {TiTickOutline} from 'react-icons/ti'

export const sideBarData = [
  {
    title: "Đánh giá",
    icon: <RiSurveyFill size={'30px'}/>,
    path: "/survey",
    subNav: [
      {
        title: "Khởi tạo",
        path: "/survey/init",
        icon: <MdCreateNewFolder size={'22px'}/>,
      },
      {
        title : 'Duyệt môn học',
        path : '/survey/approve',
        icon: <TiTickOutline size={'22px'}/>
      }
    ],
  },
];
