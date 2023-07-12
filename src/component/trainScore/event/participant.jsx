import { Transfer } from 'antd';
import { useState,
  //  useEffect
   } from 'react';

import { CiSearch } from "react-icons/ci";
import { IconContext } from "react-icons";





function TransferList() {
  const data =[
    {
      key: "2012111001",
      name: "Trịnh Hoàng Anh",
      class: "CT2401",
    },
    {
      key: "2012111002",
      name: "Nguyễn Viết Hồng",
      class: "CT2401",
    },
    {
      key: "2012111003",
      name: "Nguyễn Quang Huy",
      class: "CT2401",
    },
    {
      key: "2012111004",
      name: "Đinh Văn phóng",
      class: "CT2401",
    },
    {
      key: "2012111005",
      name: "Nguyễn Quốc Thụ",
      class: "CT2401",
    },
    {
      key: "2012111006",
      name: "Phạm Thị Thanh Huyền",
      class: "CT2401",
    },
  ];

  const [target,setTarget] = useState([]);
  // const [mockData, setMockData] = useState([]);
  // const [targetKeys, setTargetKeys] = useState([]);

  // const getMock = () => {
  //   const tempTargetKeys = [];
  //   const tempMockData = [];
  //   for (let i = 0; i < 20; i++) {
  //     const data = {
  //       key: i.toString(),
  //       title: `content${i + 1}`,
  //       description: `description of content${i + 1}`,
  //       chosen: i % 2 === 0,
  //     };
  //     if (data.chosen) {
  //       tempTargetKeys.push(data.key);
  //     }
  //     tempMockData.push(data);
  //   }
  //   // {data.map((item, i) => {
  //   //   return {
  //   //     ...item,
  //   //     chosen: i % 2 === 0,
  //   //   }
  //   // })}


  //   setMockData(tempMockData);
  //   setTargetKeys(tempTargetKeys);
  // };

  // useEffect(() => {
  //   getMock();
  // }, []);

  const handleChange = (newTargetKeys, direction, moveKeys) => {
    console.log(newTargetKeys, direction, moveKeys);
    setTarget(newTargetKeys);
  };

  const renderItem = (item) => {
    const customLabel = (
      <div className="flex flex-col">
        <span className="custom-item">
          {item.class} - {item.name}
        </span>
        {/* <span>{item.key}</span> */}
      </div>
    );

    return {
      label: customLabel,
      value: item.name,
    };
  };

  return (
    <Transfer
      dataSource={data}
      listStyle={{
        width: 300,
        height: 330,  
      }}
      targetKeys={target}
      onChange={handleChange}
      render={renderItem}
      
    />
  );
}


function Participant() {
  return (
    <div>
      {/* Search */}
      <p className="p-[5px] text-[20px] text-[#202124]">
        Tìm kiếm người tham gia :
      </p>
      <div className="searchGroup w-full">
        <IconContext.Provider value={{ color: "#9e9ea7", size: "30px" }}>
          <CiSearch className="searchIcon" />
        </IconContext.Provider>
        <input className="searchInput" type="search" placeholder="Search" />
      </div>
      <div className="w-full flex mt-[20px]">
        <TransferList/>
      </div>
    </div>
  );
}

export default Participant;



