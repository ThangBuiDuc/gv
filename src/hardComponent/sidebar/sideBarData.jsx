import { RiSurveyFill } from "react-icons/ri";
import {
  // MdCreateNewFolder,
  MdOutlineAssignment,
  MdOutlineManageAccounts,
  MdAppRegistration,
} from "react-icons/md";
//import { TiTickOutline } from "react-icons/ti";
import {
  //AiOutlineQuestionCircle,
  AiOutlineUsergroupDelete,
  // AiOutlineCalculator,
} from "react-icons/ai";
//import { IoCreateOutline } from "react-icons/io5";
import { HiOutlineInformationCircle } from "react-icons/hi";
import { SlCalender } from "react-icons/sl";
import {
  BsCalendarCheck,
  // BsCalendarEvent
} from "react-icons/bs";
import { TbSettingsCog } from "react-icons/tb";

export const sideBarData = [
  {
    title: "Phản hồi CTGD",
    path: "/survey-gv",
    icon: <RiSurveyFill size={"30px"} />,
    subNav: [
      {
        title: "Kết quả của tôi",
        path: "/survey-gv/infor",
        icon: <HiOutlineInformationCircle size={"22px"} />,
      },
      {
        title: "Góp ý với đồng nghiệp",
        path: "/survey-gv/partner",
        icon: <AiOutlineUsergroupDelete size={"22px"} />,
      },
      {
        title: "Phân công dự giờ",
        path: "/survey-gv/assign",
        icon: <MdOutlineAssignment size={"22px"} />,
      },
    ],
  },
  {
    title: "Lịch",
    icon: <SlCalender size={"30px"} />,
    path: "/calendar",
    subNav: [
      {
        title: "Lịch giảng dạy",
        path: "/calendar/work",
        icon: <BsCalendarCheck size={"22px"} />,
      },
    ],
  },
  {
    title: "Quản lý đào tạo",
    path: "/qldt",
    icon: <MdOutlineManageAccounts size={"30px"} />,
    subNav: [
      {
        title: "Duyệt tư cách sinh viên",
        path: "/qldt/sv",
        icon: <MdAppRegistration size={"22px"} />,
      },
      {
        title: "Đánh giá CTGD",
        path: "/qldt/gv",
        icon: <MdAppRegistration size={"22px"} />,
      },
    ],
  },
  {
    title: "Sinh viên rèn luyện",
    icon: <MdOutlineManageAccounts size={"30px"} />,
    subNav: [
      {
        title: "Đánh giá sinh viên",
        path: "/trainscore/classes",
        icon: <MdAppRegistration size={"22px"} />,
      },
      // {
      //   title: "Sự kiện",
      //   path: "/trainscore/event",
      //   icon: <BsCalendarEvent size={"22px"} />,
      // },
      {
        title: "Phân công lớp trưởng",
        path: "/trainscore/setMonitor",
        icon: <TbSettingsCog size={"22px"} />,
      },
    ],
  },
  // {
  //   title: "Quản lý thăm dò CTGD",
  //   icon: <IoCreateOutline size={"30px"} />,
  //   path: "/survey",
  //   role: import.meta.env.VITE_ROLE_ADMIN.split("||"),
  //   subNav: [
  //     {
  //       title: "Câu hỏi",
  //       path: "/survey/question",
  //       icon: <AiOutlineQuestionCircle size={"22px"} />,
  //     },
  //     {
  //       title: "Khởi tạo",
  //       path: "/survey/init",
  //       icon: <MdCreateNewFolder size={"22px"} />,
  //     },
  //     {
  //       title: "Duyệt lớp môn học",
  //       path: "/survey/approve",
  //       icon: <TiTickOutline size={"22px"} />,
  //     },
  //     {
  //       title: "Tổng kết",
  //       path: "/survey/total",
  //       icon: <AiOutlineCalculator size={"22px"} />,
  //     },
  //   ],
  // },
];
