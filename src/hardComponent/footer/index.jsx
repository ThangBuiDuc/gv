import "../../App.css";
import fbicon from "../../assets/fbIcon.svg";
import youtube from "../../assets/youtubeIcon.svg";
import zalo from "../../assets/zaloIcon.svg";

export default function Index() {
  return (
    <div className="h-[240px] w-full bg-primary mt-[50px] flex justify-evenly relative [&>div]:self-center [&>div]:w-[30%] [&>p]:absolute [&>p]:left-[5px] [&>p]:bottom-[5px] [&>p]:text-[16px] [&>p]:text-white">
      <div className="flex flex-col">
        <p className="font-bold text-[16px] text-white">Thông tin về HPU</p>
        <p className="text-[16px] text-white mt-[15px]">
          <span className="font-bold">Địa chỉ:</span>
          &nbsp;Số 36, đường Dân lập, phường Dư Hàng Kênh, quận Lê Chân, thành
          phố Hải Phòng
        </p>
      </div>

      <div className="flex flex-col">
        <p className="text-[16px] text-white">
          <span className="font-bold">Số điện thoại:</span>
          &nbsp;0936 821 821
        </p>

        <p className="text-[16px] text-white mt-[15px]">
          <span className="font-bold">Email:</span>
          &nbsp;hpu@hpu.edu.vn
        </p>

        <p className="text-[16px] text-white mt-[15px]">
          <span className="font-bold">Thời gian làm việc:</span>
          &nbsp;Thứ 2 - Sáng Thứ 7
        </p>
      </div>

      <div className="flex flex-col">
        <p className="font-bold text-[16px] text-white uppercase">
          Social networks:
        </p>
        <div className="flex mt-[15px]">
          <a
            href="https://www.facebook.com/HaiPhongPrivateUniversity"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={fbicon} alt="this is fb icon" />
          </a>
          <a
            href="https://www.youtube.com/channel/UCBzgxqAk0f2jtqXHnmZoq8w"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-[20px]"
          >
            <img src={youtube} alt="this is youtube icon" />
          </a>
          <a
            href="https://zalo.me/0901598698"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-[20px]"
          >
            <img src={zalo} alt="this is zalo icon" />
          </a>
        </div>
      </div>
      <p><span className="font-bold">Dev by HPU-TTS:</span> Bùi Đức Thắng, Lưu Thanh Hoàng, Vũ Hoài Nam, Nguyễn Quốc Thụ, Đào Anh Ngọc</p>
    </div>
  );
}
