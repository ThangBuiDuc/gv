import { RiSurveyFill } from "react-icons/ri";
import {
  MdCreateNewFolder,
  MdOutlineAssignment,
  MdOutlineManageAccounts,
  MdAppRegistration,
} from "react-icons/md";
import { TiTickOutline } from "react-icons/ti";
import {
  AiOutlineQuestionCircle,
  AiOutlineUsergroupDelete,
} from "react-icons/ai";
import { IoCreateOutline } from "react-icons/io5";
import { HiOutlineInformationCircle } from "react-icons/hi";
export const sideBarData = [
  {
    title: "Phản hồi CTGD",
    path: "/survey-gv",
    icon: <RiSurveyFill size={"30px"} />,
    subNav: [
      {
        title: "Phản hồi",
        path: "/survey-gv/infor",
        icon: <HiOutlineInformationCircle size={"22px"} />,
      },
      {
        title: "Đồng nghiệp phản hồi",
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
    title: "Quản lý đào tạo",
    path: "/qldt",
    icon: <MdOutlineManageAccounts size={"30px"} />,
    role: import.meta.env.VITE_ROLE_ADMIN.split("||"),
    subNav: [
      {
        title: "Duyệt kết quả sinh viên",
        path: "/qldt/sv",
        icon: <MdAppRegistration size={"22px"} />,
      },
      {
        title: "Đánh giá giảng viên",
        path: "/qldt/gv",
        icon: <MdAppRegistration size={"22px"} />,
      },
    ],
  },
  {
    title: "Tạo đợi thăm dò",
    icon: <IoCreateOutline size={"30px"} />,
    path: "/survey",
    role: import.meta.env.VITE_ROLE_ADMIN.split("||"),
    subNav: [
      {
        title: "Câu hỏi",
        path: "/survey/question",
        icon: <AiOutlineQuestionCircle size={"22px"} />,
      },
      {
        title: "Khởi tạo",
        path: "/survey/init",
        icon: <MdCreateNewFolder size={"22px"} />,
      },
      {
        title: "Duyệt môn học",
        path: "/survey/approve",
        icon: <TiTickOutline size={"22px"} />,
      },
    ],
  },
];
