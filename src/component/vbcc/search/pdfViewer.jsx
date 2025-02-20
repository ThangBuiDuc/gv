import "../../../App.css";
import {
  Page,
  Text,
  View,
  Document,
  Image,
  //   usePDF,
  StyleSheet,
  Font,
  usePDF,
} from "@react-pdf/renderer";
import { Fragment, useEffect, useState, useRef, useMemo } from "react";
import {
  Document as DocumentViewer,
  Page as PageViewer,
  pdfjs,
} from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import logo from "../../../assets/logoPDF.png";
import FontRegular from "../../../assets/Montserrat/Montserrat-Regular.ttf";
import FontItalic from "../../../assets/Montserrat/Montserrat-Italic.ttf";
import FontSemiBold from "../../../assets/Montserrat/Montserrat-SemiBold.ttf";
import SemiBoldItalic from "../../../assets/Montserrat/Montserrat-SemiBoldItalic.ttf";
import FontBold from "../../../assets/Montserrat/Montserrat-Bold.ttf";
import BoldItalic from "../../../assets/Montserrat/Montserrat-BoldItalic.ttf";
import moment from "moment/moment";
import { useQuery } from "@tanstack/react-query";
// import { BiArrowBack } from "react-icons/bi";
import ReactLoading from "react-loading";
import { useAuth } from "@clerk/clerk-react";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.js",
  import.meta.url
).toString();

Font.register({
  family: "montserrat",
  fonts: [
    {
      src: FontRegular,
    },
    {
      fontStyle: "italic",
      src: FontItalic,
    },
    {
      fontWeight: "semibold",
      src: FontSemiBold,
    },
    {
      fontWeight: "semibold",
      fontStyle: "italic",
      src: SemiBoldItalic,
    },
    {
      fontWeight: "bold",
      src: FontBold,
    },
    {
      fontWeight: "bold",
      fontStyle: "italic",
      src: BoldItalic,
    },
  ],
});

Font.registerHyphenationCallback((word) => {
  return [word];
});

const styles = StyleSheet.create({
  page: {
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#fff",
    padding: "18.897637795px",
    paddingBottom: "37.795275591px",
    fontFamily: "montserrat",
    gap: "15px",
  },
  pageNumber: {
    position: "absolute",
    fontSize: 10,
    bottom: 10,
    left: 0,
    right: 0,
    textAlign: "center",
    color: "grey",
  },
  table: {
    display: "flex",
    // display: "table",
    width: "auto",
    columnGap: 0,
    rowGap: 0,
  },
  tableRow: {
    flexDirection: "row",
  },
  tableCol: {
    justifyContent: "center",
    padding: "5px",
  },
  tableCell: {
    fontSize: 8,
    alignSelf: "center",
    textAlign: "center",
  },
});
// { raw1, raw2, countTable2, chungChi }

function capitalizeFirstLetter(string) {
  if (!string) return string; // Handle empty or undefined strings
  return string.charAt(0).toUpperCase() + string.slice(1);
}

//-----------------------------------------------------------------------------------------------------------------------------------------
const Doc1 = ({ data }) => {
  const raw = [
    ...data.diem_toan_khoa,
    ...data.chung_chi.map((item) => ({ ...item, isChungChi: true })),
  ];
  if (raw.length % 2) {
    raw.push(null);
  }

  let raw1 = raw.slice(0, raw.length / 2);

  let raw2 = raw.slice(raw.length / 2);

  // console.log(raw2.length);

  let countTable2 = raw.length / 2;
  moment().locale("vi");
  // const [date, setDate] = useState(moment());
  // // console.log(moment().year());
  // useEffect(() => {
  //   let time = () => {
  //     setDate(moment());
  //   };

  //   setInterval(time, 1000);

  //   return () => {
  //     clearInterval(time);
  //   };
  // }, []);

  // console.log(date);
  return (
    <Document>
      <Page size="A4" orientation="portrait" style={styles.page}>
        {/* {role_id != 2 ? (
          <Text
            style={{
              position: "absolute",
              color: "rgba(219, 220, 219, 0.52)",
              transform: "rotate(-45deg)",
              top: "300",
              left: "80",
              fontSize: "70",
              zIndex: 0,
            }}
            fixed
          >
            HPU.EDU.VN
          </Text>
        ) : (
          <></>
        )} */}
        <View style={{ display: "flex", flexDirection: "row" }}>
          <View>
            <Image
              src={logo}
              style={{
                objectFit: "cover",
                width: "70px",
                height: "70px",
              }}
            />
          </View>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              width: "100%",
              justifyContent: "space-between",
            }}
          >
            <View
              style={{
                marginTop: "25px",
                gap: "5px",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Text
                style={{
                  fontWeight: "bold",
                  fontSize: "8px",
                  alignSelf: "center",
                }}
              >
                BỘ GIÁO DỤC VÀ ĐÀO TẠO
              </Text>
              <Text
                style={{
                  fontWeight: "bold",
                  fontSize: "8px",
                  alignSelf: "center",
                  borderBottom: "1px solid black",
                }}
              >
                TRƯỜNG ĐẠI HỌC QUẢN LÝ VÀ CÔNG NGHỆ HẢI PHÒNG
              </Text>
            </View>
            <View style={{ gap: "5px", display: "flex", marginTop: "25px" }}>
              <Text
                style={{
                  fontWeight: "bold",
                  fontSize: "8px",
                }}
              >
                CỘNG HOÀ XÃ HỘI CHỦ NGHĨA VIỆT NAM
              </Text>
              <Text
                style={{
                  fontWeight: "bold",
                  fontSize: "6px",
                  display: "flex",
                  alignSelf: "center",
                  borderBottom: "1px solid black",
                }}
              >
                Độc lập - Tự do - Hạnh Phúc
              </Text>
            </View>
          </View>
        </View>
        <Text
          style={{
            fontWeight: "bold",
            fontSize: "20px",
            display: "flex",
            alignSelf: "center",
            marginBottom: "10px",
          }}
        >
          PHỤ LỤC VĂN BẰNG
        </Text>
        <View style={{ width: "100%", display: "flex", flexDirection: "row" }}>
          <View
            style={{
              display: "flex",
              flexDirection: "column",
              paddingLeft: "30px",
              gap: "5px",
              width: "50%",
            }}
          >
            <Text style={{ fontSize: "12px" }}>
              Họ và tên:{" "}
              <Text style={{ fontWeight: "semibold" }}>{data.tt[0].hoten}</Text>
            </Text>
            <Text style={{ fontSize: "12px" }}>
              Giới tính:{" "}
              <Text style={{ fontWeight: "semibold" }}>
                {capitalizeFirstLetter(data.tt[0].gioitinh)}
              </Text>
            </Text>
            <Text style={{ fontSize: "12px" }}>
              Mã sinh viên:{" "}
              <Text style={{ fontWeight: "semibold" }}>
                {data.tt[0].masinhvien}
              </Text>
            </Text>
            <Text style={{ fontSize: "12px" }}>
              Hình thức đào tạo:{" "}
              <Text style={{ fontWeight: "semibold" }}>
                {capitalizeFirstLetter(data.tt[0].daotao)}
              </Text>
            </Text>
            <Text style={{ fontSize: "12px" }}>
              Trình độ đào tạo:{" "}
              <Text style={{ fontWeight: "semibold" }}>
                {data.tt[0].tenhedaotao}
              </Text>
            </Text>
            <Text style={{ fontSize: "12px" }}>
              Ngôn ngữ đào tạo:{" "}
              <Text style={{ fontWeight: "semibold" }}>Tiếng việt</Text>
            </Text>
          </View>
          <View
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "5px",
              width: "50%",
            }}
          >
            <Text style={{ fontSize: "12px" }}>
              Ngày sinh:{" "}
              <Text style={{ fontWeight: "semibold" }}>
                {data.tt[0].ngaysinh
                  .split("T")[0]
                  .split("-")
                  .reverse()
                  .join("-")}
              </Text>
            </Text>
            <Text style={{ fontSize: "12px" }}>
              Khoá:{" "}
              <Text style={{ fontWeight: "semibold" }}>
                {data.tt[0].makhoahoc}
              </Text>
            </Text>
            <Text style={{ fontSize: "12px" }}>
              Chuyên ngành:{" "}
              <Text style={{ fontWeight: "semibold" }}>
                {data.tt[0].tennganh}
              </Text>
            </Text>
            <Text style={{ fontSize: "12px" }}>
              Ngày nhập học:{" "}
              <Text style={{ fontWeight: "semibold" }}>
                {data.tt[0].ngaynhaphoc
                  .split(" ")[0]
                  .split("-")
                  .reverse()
                  .join("-")}
              </Text>
            </Text>
            <Text style={{ fontSize: "12px" }}>
              Thời gian đào tạo:{" "}
              <Text style={{ fontWeight: "semibold" }}>
                {data.addition[0].sonamhoc} năm
              </Text>
            </Text>
          </View>
        </View>
        <Text
          style={{
            fontWeight: "bold",
            fontSize: "14px",
            display: "flex",
            alignSelf: "center",
            marginBottom: "10px",
          }}
        >
          KẾT QUẢ HỌC TẬP
        </Text>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            width: "100%",
            paddingLeft: "10px",
            gap: "10px",
          }}
        >
          <View style={{ ...styles.table, width: "50%" }}>
            <View
              style={{
                ...styles.tableRow,
                width: "100%",
                border: "0.5px solid black",
              }}
              fixed
            >
              <View style={{ ...styles.tableCol, width: "10%" }}>
                <Text style={{ ...styles.tableCell, fontWeight: "semibold" }}>
                  Số TT
                </Text>
              </View>
              <View
                style={{
                  ...styles.tableCol,
                  width: "45%",
                  border: "0.5px solid black",
                  borderTop: 0,
                  borderBottom: 0,
                  borderRight: 0,
                }}
              >
                <Text style={{ ...styles.tableCell, fontWeight: "semibold" }}>
                  Tên học phần
                </Text>
              </View>
              <View
                style={{
                  ...styles.tableCol,
                  width: "10%",
                  border: "0.5px solid black",
                  borderTop: 0,
                  borderBottom: 0,
                }}
              >
                <Text style={{ ...styles.tableCell, fontWeight: "semibold" }}>
                  Số tín chỉ
                </Text>
              </View>
              <View
                style={{
                  flexDirection: "column",
                  width: "20%",
                }}
              >
                <View
                  style={{
                    ...styles.tableCol,
                    height: "31px",
                    border: "0.5px solid black",
                    borderTop: 0,
                    borderRight: 0,
                    borderLeft: 0,
                  }}
                >
                  <Text style={{ ...styles.tableCell, fontWeight: "semibold" }}>
                    Điểm số
                  </Text>
                </View>
                <View style={{ flexDirection: "row", width: "100%" }}>
                  <View
                    style={{
                      ...styles.tableCol,
                      width: "50%",
                      height: "42px",
                    }}
                  >
                    <Text
                      style={{ ...styles.tableCell, fontWeight: "semibold" }}
                    >
                      Hệ 4
                    </Text>
                  </View>
                  <View
                    style={{
                      ...styles.tableCol,
                      width: "50%",
                      height: "42px",
                      border: "0.5px solid black",
                      borderTop: 0,
                      borderBottom: 0,
                      borderRight: 0,
                    }}
                  >
                    <Text
                      style={{ ...styles.tableCell, fontWeight: "semibold" }}
                    >
                      Hệ 10
                    </Text>
                  </View>
                </View>
              </View>
              <View
                style={{
                  ...styles.tableCol,
                  width: "15%",
                  border: "0.5px solid black",
                  borderTop: 0,
                  borderBottom: 0,
                  borderRight: 0,
                }}
              >
                <Text style={{ ...styles.tableCell, fontWeight: "semibold" }}>
                  Điểm chữ
                </Text>
              </View>
            </View>
            {raw1.map((item, index) => {
              return (
                <View
                  style={{
                    ...styles.tableRow,
                    width: "100%",
                    height: "35px",
                    border: "0.5px solid black",
                    borderTop: 0,
                  }}
                  wrap={false}
                  key={index}
                >
                  <View style={{ ...styles.tableCol, width: "10%" }}>
                    <Text style={styles.tableCell}>{index + 1}</Text>
                  </View>
                  <View
                    style={{
                      ...styles.tableCol,
                      width: "45%",
                      border: "0.5px solid black",
                      borderTop: 0,
                      borderBottom: 0,
                      borderRight: 0,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: "8",
                        textAlign: "left",
                      }}
                    >
                      {item.tenmonhoc}
                    </Text>
                  </View>
                  <View
                    style={{
                      ...styles.tableCol,
                      width: "10%",
                      border: "0.5px solid black",
                      borderTop: 0,
                      borderBottom: 0,
                    }}
                  >
                    <Text style={styles.tableCell}>{item.khoiluong}</Text>
                  </View>
                  <View
                    style={{
                      ...styles.tableCol,
                      width: "10%",
                    }}
                  >
                    <Text style={styles.tableCell}>{item.diemthang4}</Text>
                  </View>
                  <View
                    style={{
                      ...styles.tableCol,
                      width: "10%",
                      border: "0.5px solid black",
                      borderTop: 0,
                      borderBottom: 0,
                      borderRight: 0,
                    }}
                  >
                    <Text style={styles.tableCell}>{item.diemthang10}</Text>
                  </View>
                  <View
                    style={{
                      ...styles.tableCol,
                      width: "15%",
                      border: "0.5px solid black",
                      borderTop: 0,
                      borderBottom: 0,
                      borderRight: 0,
                    }}
                  >
                    <Text style={styles.tableCell}>{item.diemchu}</Text>
                  </View>
                </View>
              );
            })}
          </View>
          <View style={{ ...styles.table, width: "50%" }}>
            <View
              style={{
                ...styles.tableRow,
                width: "100%",
                border: "0.5px solid black",
              }}
              fixed
            >
              <View style={{ ...styles.tableCol, width: "10%" }}>
                <Text style={{ ...styles.tableCell, fontWeight: "semibold" }}>
                  Số TT
                </Text>
              </View>
              <View
                style={{
                  ...styles.tableCol,
                  width: "45%",
                  border: "0.5px solid black",
                  borderTop: 0,
                  borderBottom: 0,
                  borderRight: 0,
                }}
              >
                <Text style={{ ...styles.tableCell, fontWeight: "semibold" }}>
                  Tên học phần
                </Text>
              </View>
              <View
                style={{
                  ...styles.tableCol,
                  width: "10%",
                  border: "0.5px solid black",
                  borderTop: 0,
                  borderBottom: 0,
                }}
              >
                <Text style={{ ...styles.tableCell, fontWeight: "semibold" }}>
                  Số tín chỉ
                </Text>
              </View>
              <View
                style={{
                  flexDirection: "column",
                  width: "20%",
                }}
              >
                <View
                  style={{
                    ...styles.tableCol,
                    height: "31px",
                    border: "0.5px solid black",
                    borderTop: 0,
                    borderRight: 0,
                    borderLeft: 0,
                  }}
                >
                  <Text style={{ ...styles.tableCell, fontWeight: "semibold" }}>
                    Điểm số
                  </Text>
                </View>
                <View style={{ flexDirection: "row", width: "100%" }}>
                  <View
                    style={{
                      ...styles.tableCol,
                      width: "50%",
                      height: "42px",
                    }}
                  >
                    <Text
                      style={{ ...styles.tableCell, fontWeight: "semibold" }}
                    >
                      Hệ 4
                    </Text>
                  </View>
                  <View
                    style={{
                      ...styles.tableCol,
                      width: "50%",
                      height: "42px",
                      border: "0.5px solid black",
                      borderTop: 0,
                      borderBottom: 0,
                      borderRight: 0,
                    }}
                  >
                    <Text
                      style={{ ...styles.tableCell, fontWeight: "semibold" }}
                    >
                      Hệ 10
                    </Text>
                  </View>
                </View>
              </View>
              <View
                style={{
                  ...styles.tableCol,
                  width: "15%",
                  border: "0.5px solid black",
                  borderTop: 0,
                  borderBottom: 0,
                  borderRight: 0,
                }}
              >
                <Text style={{ ...styles.tableCell, fontWeight: "semibold" }}>
                  Điểm chữ
                </Text>
              </View>
            </View>
            {raw2.map((item, index) => {
              return item === null ? (
                <View
                  style={{
                    ...styles.tableRow,
                    width: "100%",
                    height: "35px",
                    border: "0.5px solid black",
                    borderTop: 0,
                  }}
                  wrap={false}
                  key={index}
                >
                  <View style={{ ...styles.tableCol, width: "10%" }}>
                    <Text style={styles.tableCell}>
                      {countTable2 + index + 1}
                    </Text>
                  </View>
                  <View
                    style={{
                      ...styles.tableCol,
                      width: "45%",
                      border: "0.5px solid black",
                      borderTop: 0,
                      borderBottom: 0,
                      borderRight: 0,
                    }}
                  >
                    <Text style={styles.tableCell}></Text>
                  </View>
                  <View
                    style={{
                      ...styles.tableCol,
                      width: "10%",
                      border: "0.5px solid black",
                      borderTop: 0,
                      borderBottom: 0,
                    }}
                  >
                    <Text style={styles.tableCell}></Text>
                  </View>
                  <View
                    style={{
                      ...styles.tableCol,
                      width: "10%",
                    }}
                  >
                    <Text style={styles.tableCell}></Text>
                  </View>
                  <View
                    style={{
                      ...styles.tableCol,
                      width: "10%",
                      border: "0.5px solid black",
                      borderTop: 0,
                      borderBottom: 0,
                      borderRight: 0,
                    }}
                  >
                    <Text style={styles.tableCell}></Text>
                  </View>
                  <View
                    style={{
                      ...styles.tableCol,
                      width: "15%",
                      border: "0.5px solid black",
                      borderTop: 0,
                      borderBottom: 0,
                      borderRight: 0,
                    }}
                  >
                    <Text style={styles.tableCell}></Text>
                  </View>
                </View>
              ) : item.isChungChi ? (
                <View
                  style={{
                    ...styles.tableRow,
                    width: "100%",
                    height: "35px",
                    border: "0.5px solid black",
                    borderTop: 0,
                  }}
                  wrap={false}
                  key={index}
                >
                  <View style={{ ...styles.tableCol, width: "10%" }}>
                    <Text style={styles.tableCell}>
                      {countTable2 + index + 1}
                    </Text>
                  </View>
                  <View
                    style={{
                      ...styles.tableCol,
                      width: "45%",
                      border: "0.5px solid black",
                      borderTop: 0,
                      borderBottom: 0,
                      borderRight: 0,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: "8",
                        textAlign: "left",
                      }}
                    >
                      {item.ten}
                    </Text>
                  </View>
                  <View
                    style={{
                      ...styles.tableCol,
                      width: "10%",
                      border: "0.5px solid black",
                      borderTop: 0,
                      borderBottom: 0,
                    }}
                  >
                    <Text style={styles.tableCell}></Text>
                  </View>
                  <View
                    style={{
                      ...styles.tableCol,
                      width: "10%",
                    }}
                  >
                    <Text style={styles.tableCell}></Text>
                  </View>
                  <View
                    style={{
                      ...styles.tableCol,
                      width: "10%",
                      border: "0.5px solid black",
                      borderTop: 0,
                      borderBottom: 0,
                      borderRight: 0,
                    }}
                  >
                    <Text style={styles.tableCell}></Text>
                  </View>
                  <View
                    style={{
                      ...styles.tableCol,
                      width: "15%",
                      border: "0.5px solid black",
                      borderTop: 0,
                      borderBottom: 0,
                      borderRight: 0,
                    }}
                  >
                    <Text style={styles.tableCell}>Đạt</Text>
                  </View>
                </View>
              ) : (
                <View
                  style={{
                    ...styles.tableRow,
                    width: "100%",
                    height: "35px",
                    border: "0.5px solid black",
                    borderTop: 0,
                  }}
                  wrap={false}
                  key={index}
                >
                  <View style={{ ...styles.tableCol, width: "10%" }}>
                    <Text style={styles.tableCell}>
                      {countTable2 + index + 1}
                    </Text>
                  </View>
                  <View
                    style={{
                      ...styles.tableCol,
                      width: "45%",
                      border: "0.5px solid black",
                      borderTop: 0,
                      borderBottom: 0,
                      borderRight: 0,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: "8",
                        textAlign: "left",
                      }}
                    >
                      {item.tenmonhoc}
                    </Text>
                  </View>
                  <View
                    style={{
                      ...styles.tableCol,
                      width: "10%",
                      border: "0.5px solid black",
                      borderTop: 0,
                      borderBottom: 0,
                    }}
                  >
                    <Text style={styles.tableCell}>{item.khoiluong}</Text>
                  </View>
                  <View
                    style={{
                      ...styles.tableCol,
                      width: "10%",
                    }}
                  >
                    <Text style={styles.tableCell}>{item.diemthang4}</Text>
                  </View>
                  <View
                    style={{
                      ...styles.tableCol,
                      width: "10%",
                      border: "0.5px solid black",
                      borderTop: 0,
                      borderBottom: 0,
                      borderRight: 0,
                    }}
                  >
                    <Text style={styles.tableCell}>{item.diemthang10}</Text>
                  </View>
                  <View
                    style={{
                      ...styles.tableCol,
                      width: "15%",
                      border: "0.5px solid black",
                      borderTop: 0,
                      borderBottom: 0,
                      borderRight: 0,
                    }}
                  >
                    <Text style={styles.tableCell}>{item.diemchu}</Text>
                  </View>
                </View>
              );
            })}
            {/* {data.chung_chi.map((item, index) => {
              return (
                <View
                  style={{
                    ...styles.tableRow,
                    width: "100%",
                    height: "35px",
                    border: "0.5px solid black",
                    borderTop: 0,
                  }}
                  wrap={false}
                  key={index}
                >
                  <View style={{ ...styles.tableCol, width: "10%" }}>
                    <Text style={styles.tableCell}>
                      {raw2.length * 2 + index + 1}
                    </Text>
                  </View>
                  <View
                    style={{
                      ...styles.tableCol,
                      width: "45%",
                      border: "0.5px solid black",
                      borderTop: 0,
                      borderBottom: 0,
                      borderRight: 0,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: "8",
                        textAlign: "left",
                      }}
                    >
                      {item.ten}
                    </Text>
                  </View>
                  <View
                    style={{
                      ...styles.tableCol,
                      width: "10%",
                      border: "0.5px solid black",
                      borderTop: 0,
                      borderBottom: 0,
                    }}
                  >
                    <Text style={styles.tableCell}></Text>
                  </View>
                  <View
                    style={{
                      ...styles.tableCol,
                      width: "10%",
                    }}
                  >
                    <Text style={styles.tableCell}></Text>
                  </View>
                  <View
                    style={{
                      ...styles.tableCol,
                      width: "10%",
                      border: "0.5px solid black",
                      borderTop: 0,
                      borderBottom: 0,
                      borderRight: 0,
                    }}
                  >
                    <Text style={styles.tableCell}></Text>
                  </View>
                  <View
                    style={{
                      ...styles.tableCol,
                      width: "15%",
                      border: "0.5px solid black",
                      borderTop: 0,
                      borderBottom: 0,
                      borderRight: 0,
                    }}
                  >
                    <Text style={styles.tableCell}>Đạt</Text>
                  </View>
                </View>
              );
            })} */}
          </View>
        </View>
        <Text style={{ fontSize: "10px", marginLeft: "25px" }}>
          Tên đề tài tốt nghiệp:{" "}
          <Text style={{ fontWeight: "semibold" }}>{data.tt[0].tendoan}</Text>
        </Text>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            width: "100%",
          }}
        >
          <View
            style={{
              padding: "5px",
              width: "50%",
              marginLeft: "30px",
              gap: "5px",
            }}
          >
            <Text style={{ fontSize: "10px" }}>
              Điểm trung bình toàn khoá (hệ 4):{" "}
              <Text style={{ fontWeight: "semibold" }}>
                {data.tbtk[0].diem4}
              </Text>
            </Text>
            <Text style={{ fontSize: "10px" }}>
              Tổng số tín chỉ tích luỹ:{" "}
              <Text style={{ fontWeight: "semibold" }}>
                {data.addition[0].tongtinchi}
              </Text>
            </Text>
            <Text style={{ fontSize: "10px" }}>
              Xếp hạng tốt nghiệp:{" "}
              <Text style={{ fontWeight: "semibold" }}>
                {data.tbtk[0].tbtk_xeploai4}
              </Text>
            </Text>
            <Text style={{ fontSize: "10px" }}>
              Số hiệu văn bằng:{" "}
              <Text style={{ fontWeight: "semibold" }}>
                {data.addition[0].sohieubang}
              </Text>
            </Text>
            <Text style={{ fontSize: "10px" }}>
              Số vào sổ cấp bằng:{" "}
              <Text style={{ fontWeight: "semibold" }}>
                {data.addition[0].sovaoso}
              </Text>
            </Text>
          </View>
          <View
            style={{
              padding: "5px",
              display: "flex",
              flexDirection: "column",
              width: "50%",
              gap: "5px",
            }}
          >
            <Text
              style={{
                fontSize: "10px",
                textAlign: "right",
                fontStyle: "italic",
              }}
            >
              Hải Phòng, ngày {moment().date()} tháng {moment().month() + 1} năm{" "}
              {moment().year()}
            </Text>
            <Text
              style={{
                fontSize: "10px",
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              TL. HIỆU TRƯỞNG
            </Text>
            <Text
              style={{
                fontSize: "10px",
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              TRƯỞNG PHÒNG ĐÀO TẠO - QLKH
            </Text>
          </View>
        </View>
        <Text
          style={styles.pageNumber}
          render={({ pageNumber, totalPages }) =>
            `Trang ${pageNumber} / ${totalPages}`
          }
          fixed
        />
      </Page>
    </Document>
  );
};

//---------------------------------------------------------------------------------------------------------
const Doc2 = ({ data }) => {
  moment().locale("vi");
  const year = [
    ...new Set(data.diem_toan_khoa.map((item) => item.namhoc)),
  ].sort((a, b) => a.localeCompare(b));

  // const [date, setDate] = useState(moment());
  // // console.log(moment().year());
  // useEffect(() => {
  //   let time = () => {
  //     setDate(moment());
  //   };

  //   setInterval(time, 1000);

  //   return () => {
  //     clearInterval(time);
  //   };
  // }, []);

  // console.log(date);
  return (
    <Document>
      <Page size="A4" orientation="portrait" style={styles.page}>
        <Text
          style={{
            position: "absolute",
            color: "rgba(219, 220, 219, 0.52)",
            transform: "rotate(-45deg)",
            top: "300",
            left: "80",
            fontSize: "70",
            zIndex: 0,
          }}
          fixed
        >
          HPU.EDU.VN
        </Text>
        <View style={{ display: "flex", flexDirection: "row" }}>
          <View>
            <Image
              src={logo}
              style={{
                objectFit: "cover",
                width: "70px",
                height: "70px",
              }}
            />
          </View>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              width: "100%",
              justifyContent: "space-between",
            }}
          >
            <View
              style={{
                marginTop: "25px",
                gap: "5px",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Text
                style={{
                  fontWeight: "bold",
                  fontSize: "8px",
                  alignSelf: "center",
                }}
              >
                BỘ GIÁO DỤC VÀ ĐÀO TẠO
              </Text>
              <Text
                style={{
                  fontWeight: "bold",
                  fontSize: "8px",
                  alignSelf: "center",
                  borderBottom: "1px solid black",
                }}
              >
                TRƯỜNG ĐẠI HỌC QUẢN LÝ VÀ CÔNG NGHỆ HẢI PHÒNG
              </Text>
            </View>
            <View style={{ gap: "5px", display: "flex", marginTop: "25px" }}>
              <Text
                style={{
                  fontWeight: "bold",
                  fontSize: "8px",
                }}
              >
                CỘNG HOÀ XÃ HỘI CHỦ NGHĨA VIỆT NAM
              </Text>
              <Text
                style={{
                  fontWeight: "bold",
                  fontSize: "6px",
                  display: "flex",
                  alignSelf: "center",
                  borderBottom: "1px solid black",
                }}
              >
                Độc lập - Tự do - Hạnh Phúc
              </Text>
            </View>
          </View>
        </View>
        <Text
          style={{
            fontWeight: "bold",
            fontSize: "20px",
            display: "flex",
            alignSelf: "center",
            marginBottom: "10px",
          }}
        >
          BẢNG KẾT QUẢ HỌC TẬP
        </Text>
        <View style={{ display: "flex", flexDirection: "row", gap: "5px" }}>
          <View
            style={{
              display: "flex",
              flexDirection: "column",
              width: "50%",
              gap: "5px",
            }}
          >
            <View
              style={{ display: "flex", width: "100%", flexDirection: "row" }}
            >
              <Text style={{ width: "50%", fontSize: "10px" }}>Họ và tên</Text>
              <Text
                style={{ width: "50%", fontWeight: "bold", fontSize: "10px" }}
              >
                : {data.tt[0].hoten}
              </Text>
            </View>
            <View
              style={{ display: "flex", width: "100%", flexDirection: "row" }}
            >
              <Text style={{ width: "50%", fontSize: "10px" }}>Ngày sinh</Text>
              <Text
                style={{ width: "50%", fontWeight: "bold", fontSize: "10px" }}
              >
                :{" "}
                {data.tt[0].ngaysinh
                  .split("T")[0]
                  .split("-")
                  .reverse()
                  .join("-")}
              </Text>
            </View>
            <View
              style={{ display: "flex", width: "100%", flexDirection: "row" }}
            >
              <Text style={{ width: "50%", fontSize: "10px" }}>Lớp học</Text>
              <Text
                style={{ width: "50%", fontWeight: "bold", fontSize: "10px" }}
              >
                : {data.tt[0].malop}
              </Text>
            </View>
            <View
              style={{ display: "flex", width: "100%", flexDirection: "row" }}
            >
              <Text style={{ width: "50%", fontSize: "10px" }}>
                Chuyên ngành
              </Text>
              <Text
                style={{ width: "50%", fontWeight: "bold", fontSize: "10px" }}
              >
                : {data.tt[0].tennganh}
              </Text>
            </View>
          </View>

          <View
            style={{
              display: "flex",
              flexDirection: "column",
              width: "50%",
              gap: "5px",
            }}
          >
            <View
              style={{ display: "flex", width: "100%", flexDirection: "row" }}
            >
              <Text style={{ width: "50%", fontSize: "10px" }}>
                Mã sinh viên
              </Text>
              <Text
                style={{ width: "50%", fontWeight: "bold", fontSize: "10px" }}
              >
                : {data.tt[0].masinhvien}
              </Text>
            </View>
            <View
              style={{ display: "flex", width: "100%", flexDirection: "row" }}
            >
              <Text style={{ width: "50%", fontSize: "10px" }}>Nơi sinh</Text>
              <Text
                style={{ width: "50%", fontWeight: "bold", fontSize: "10px" }}
              >
                : {data.tt[0].noisinh}
              </Text>
            </View>
            <View
              style={{ display: "flex", width: "100%", flexDirection: "row" }}
            >
              <Text style={{ width: "50%", fontSize: "10px" }}>Khoá học</Text>
              <Text
                style={{ width: "50%", fontWeight: "bold", fontSize: "10px" }}
              >
                : {data.tt[0].makhoahoc}
              </Text>
            </View>
            <View
              style={{ display: "flex", width: "100%", flexDirection: "row" }}
            >
              <Text style={{ width: "50%", fontSize: "10px" }}>
                Bậc đào tạo
              </Text>
              <Text
                style={{ width: "50%", fontWeight: "bold", fontSize: "10px" }}
              >
                : {data.tt[0].tenhedaotao}
              </Text>
            </View>
          </View>
        </View>

        <View style={{ display: "flex", flexDirection: "column" }}>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              width: "100%",
            }}
            fixed
          >
            <View style={{ ...styles.table, width: "50%" }}>
              <View
                style={{
                  ...styles.tableRow,
                  width: "100%",
                  border: "0.5px solid black",
                }}
              >
                <View
                  style={{
                    ...styles.tableCol,
                    width: "15%",
                  }}
                >
                  <Text style={{ ...styles.tableCell, fontWeight: "bold" }}>
                    TT
                  </Text>
                </View>
                <View
                  style={{
                    ...styles.tableCol,
                    width: "55%",
                    border: "0.5px solid black",
                    borderBottom: 0,
                    borderRight: 0,
                    borderTop: 0,
                  }}
                >
                  <Text style={{ ...styles.tableCell, fontWeight: "bold" }}>
                    TÊN MÔN HỌC
                  </Text>
                </View>
                <View
                  style={{
                    ...styles.tableCol,
                    width: "15%",
                    border: "0.5px solid black",
                    borderBottom: 0,
                    borderRight: 0,
                    borderTop: 0,
                  }}
                >
                  <Text style={{ ...styles.tableCell, fontWeight: "bold" }}>
                    Số TC
                  </Text>
                </View>
                <View
                  style={{
                    ...styles.tableCol,
                    width: "15%",
                    border: "0.5px solid black",
                    borderBottom: 0,
                    borderRight: 0,
                    borderTop: 0,
                  }}
                >
                  <Text style={{ ...styles.tableCell, fontWeight: "bold" }}>
                    ĐIỂM
                  </Text>
                </View>
              </View>
            </View>
            <View style={{ ...styles.table, width: "50%" }}>
              <View
                style={{
                  ...styles.tableRow,
                  width: "100%",
                  border: "0.5px solid black",
                  borderLeft: 0,
                }}
              >
                <View
                  style={{
                    ...styles.tableCol,
                    width: "15%",
                  }}
                >
                  <Text style={{ ...styles.tableCell, fontWeight: "bold" }}>
                    TT
                  </Text>
                </View>
                <View
                  style={{
                    ...styles.tableCol,
                    width: "55%",
                    border: "0.5px solid black",
                    borderBottom: 0,
                    borderRight: 0,
                    borderTop: 0,
                  }}
                >
                  <Text style={{ ...styles.tableCell, fontWeight: "bold" }}>
                    TÊN MÔN HỌC
                  </Text>
                </View>
                <View
                  style={{
                    ...styles.tableCol,
                    width: "15%",
                    border: "0.5px solid black",
                    borderBottom: 0,
                    borderRight: 0,
                    borderTop: 0,
                  }}
                >
                  <Text style={{ ...styles.tableCell, fontWeight: "bold" }}>
                    Số TC
                  </Text>
                </View>
                <View
                  style={{
                    ...styles.tableCol,
                    width: "15%",
                    border: "0.5px solid black",
                    borderBottom: 0,
                    borderRight: 0,
                    borderTop: 0,
                  }}
                >
                  <Text style={{ ...styles.tableCell, fontWeight: "bold" }}>
                    ĐIỂM
                  </Text>
                </View>
              </View>
            </View>
          </View>
          {year.map((item, index) => {
            let subdata = data.diem_toan_khoa.filter(
              (el) => el.namhoc === item
            );
            if (subdata.length % 2 !== 0) {
              subdata.push(null);
            }
            // console.log(subdata);
            // console.log(subdata);
            // let table1 = subdata.length > 1 ? subdata.slice(0, subdata.length / 2 + 1);
            // let table2 = subdata.slice(subdata.length / 2 + 1);
            return (
              <Fragment key={index}>
                <View
                  style={{ ...styles.tableRow, width: "100%" }}
                  wrap={false}
                >
                  <View
                    style={{
                      ...styles.tableCol,
                      width: "100%",
                      border: "0.5px solid black",
                      borderTop: 0,
                    }}
                  >
                    <Text style={{ ...styles.tableCell, fontWeight: "bold" }}>
                      Năm học: {item} - Điểm TBCM:{" "}
                      {data.tb_nam.find((el1) => el1.namhoc === item).diem}
                    </Text>
                  </View>
                </View>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    width: "100%",
                  }}
                >
                  <View style={{ ...styles.table, width: "50%" }}>
                    {subdata.length <= 2 ? (
                      <View
                        style={{
                          ...styles.tableRow,
                          width: "100%",
                          height: "35px",
                          border: "0.5px solid black",
                          borderTop: 0,
                        }}
                        wrap={false}
                      >
                        <View
                          style={{
                            ...styles.tableCol,
                            width: "15%",
                          }}
                        >
                          <Text style={styles.tableCell}>{subdata[0].stt}</Text>
                        </View>
                        <View
                          style={{
                            ...styles.tableCol,
                            width: "55%",
                            border: "0.5px solid black",
                            borderBottom: 0,
                            borderTop: 0,
                            borderRight: 0,
                          }}
                        >
                          <Text style={{ fontSize: "8px", textAlign: "left" }}>
                            {subdata[0].tenmonhoc}
                          </Text>
                        </View>
                        <View
                          style={{
                            ...styles.tableCol,
                            width: "15%",
                            border: "0.5px solid black",
                            borderBottom: 0,
                            borderTop: 0,
                            borderRight: 0,
                          }}
                        >
                          <Text style={styles.tableCell}>
                            {subdata[0].khoiluong}
                          </Text>
                        </View>
                        <View
                          style={{
                            ...styles.tableCol,
                            width: "15%",
                            border: "0.5px solid black",
                            borderBottom: 0,
                            borderTop: 0,
                            borderRight: 0,
                          }}
                        >
                          <Text style={styles.tableCell}>
                            {subdata[0].diemthang10}
                          </Text>
                        </View>
                      </View>
                    ) : (
                      subdata
                        .slice(0, subdata.length / 2)
                        .map((item, index) => (
                          <View
                            style={{
                              ...styles.tableRow,
                              width: "100%",
                              height: "35px",
                              border: "0.5px solid black",
                              borderTop: 0,
                            }}
                            wrap={false}
                            key={index}
                          >
                            <View style={{ ...styles.tableCol, width: "15%" }}>
                              <Text style={styles.tableCell}>{item.stt}</Text>
                            </View>
                            <View
                              style={{
                                ...styles.tableCol,
                                width: "55%",
                                border: "0.5px solid black",
                                borderBottom: 0,
                                borderTop: 0,
                                borderRight: 0,
                              }}
                            >
                              <Text
                                style={{ fontSize: "8px", textAlign: "left" }}
                              >
                                {item.tenmonhoc}
                              </Text>
                            </View>
                            <View
                              style={{
                                ...styles.tableCol,
                                width: "15%",
                                border: "0.5px solid black",
                                borderBottom: 0,
                                borderTop: 0,
                                borderRight: 0,
                              }}
                            >
                              <Text style={styles.tableCell}>
                                {item.khoiluong}
                              </Text>
                            </View>
                            <View
                              style={{
                                ...styles.tableCol,
                                width: "15%",
                                border: "0.5px solid black",
                                borderBottom: 0,
                                borderTop: 0,
                                borderRight: 0,
                              }}
                            >
                              <Text style={styles.tableCell}>
                                {item.diemthang10}
                              </Text>
                            </View>
                          </View>
                        ))
                    )}
                  </View>
                  <View style={{ ...styles.table, width: "50%" }}>
                    {subdata.length <= 2 ? (
                      <View
                        style={{
                          ...styles.tableRow,
                          width: "100%",
                          height: "35px",
                        }}
                        wrap={false}
                      >
                        <View style={{ ...styles.tableCol, width: "15%" }}>
                          <Text style={styles.tableCell}></Text>
                        </View>
                        <View style={{ ...styles.tableCol, width: "55%" }}>
                          <Text
                            style={{ fontSize: "8px", textAlign: "left" }}
                          ></Text>
                        </View>
                        <View style={{ ...styles.tableCol, width: "15%" }}>
                          <Text style={styles.tableCell}></Text>
                        </View>
                        <View style={{ ...styles.tableCol, width: "15%" }}>
                          <Text style={styles.tableCell}></Text>
                        </View>
                      </View>
                    ) : (
                      subdata.slice(subdata.length / 2).map((item, index) =>
                        item === null ? (
                          <View
                            style={{
                              ...styles.tableRow,
                              width: "100%",
                              height: "35px",
                              border: "0.5px solid black",
                              borderTop: 0,
                              borderLeft: 0,
                            }}
                            wrap={false}
                            key={index}
                          >
                            <View style={{ ...styles.tableCol, width: "15%" }}>
                              <Text style={styles.tableCell}></Text>
                            </View>
                            <View
                              style={{
                                ...styles.tableCol,
                                width: "55%",
                                border: "0.5px solid black",
                                borderBottom: 0,
                                borderTop: 0,
                                borderRight: 0,
                              }}
                            >
                              <Text
                                style={{ fontSize: "8px", textAlign: "left" }}
                              ></Text>
                            </View>
                            <View
                              style={{
                                ...styles.tableCol,
                                width: "15%",
                                border: "0.5px solid black",
                                borderBottom: 0,
                                borderTop: 0,
                                borderRight: 0,
                              }}
                            >
                              <Text style={styles.tableCell}></Text>
                            </View>
                            <View
                              style={{
                                ...styles.tableCol,
                                width: "15%",
                                border: "0.5px solid black",
                                borderBottom: 0,
                                borderTop: 0,
                                borderRight: 0,
                              }}
                            >
                              <Text style={styles.tableCell}></Text>
                            </View>
                          </View>
                        ) : (
                          <View
                            style={{
                              ...styles.tableRow,
                              width: "100%",
                              height: "35px",
                              border: "0.5px solid black",
                              borderTop: 0,
                              borderLeft: 0,
                            }}
                            wrap={false}
                            key={index}
                          >
                            <View style={{ ...styles.tableCol, width: "15%" }}>
                              <Text style={styles.tableCell}>{item.stt}</Text>
                            </View>
                            <View
                              style={{
                                ...styles.tableCol,
                                width: "55%",
                                border: "0.5px solid black",
                                borderBottom: 0,
                                borderTop: 0,
                                borderRight: 0,
                              }}
                            >
                              <Text
                                style={{ fontSize: "8px", textAlign: "left" }}
                              >
                                {item.tenmonhoc}
                              </Text>
                            </View>
                            <View
                              style={{
                                ...styles.tableCol,
                                width: "15%",
                                border: "0.5px solid black",
                                borderBottom: 0,
                                borderTop: 0,
                                borderRight: 0,
                              }}
                            >
                              <Text style={styles.tableCell}>
                                {item.khoiluong}
                              </Text>
                            </View>
                            <View
                              style={{
                                ...styles.tableCol,
                                width: "15%",
                                border: "0.5px solid black",
                                borderBottom: 0,
                                borderTop: 0,
                                borderRight: 0,
                              }}
                            >
                              <Text style={styles.tableCell}>
                                {item.diemthang10}
                              </Text>
                            </View>
                          </View>
                        )
                      )
                    )}
                  </View>
                </View>
              </Fragment>
            );
          })}
        </View>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            width: "100%",
          }}
        >
          <View style={{ padding: "5px", width: "50%", marginLeft: "30px" }}>
            <Text
              style={{
                fontSize: "10px",
                fontWeight: "bold",
                textAlign: "center",
                marginTop: "35px",
              }}
            >
              CÁN BỘ KIỂM TRA
            </Text>
          </View>
          <View
            style={{
              padding: "5px",
              display: "flex",
              flexDirection: "column",
              width: "50%",
              gap: "5px",
            }}
          >
            <Text
              style={{
                fontSize: "10px",
                textAlign: "center",
                fontStyle: "italic",
              }}
            >
              Hải Phòng, ngày {moment().date()} tháng {moment().month() + 1} năm{" "}
              {moment().year()}
            </Text>
            <Text
              style={{
                fontSize: "10px",
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              TL. HIỆU TRƯỞNG
            </Text>
            <Text
              style={{
                fontSize: "10px",
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              TRƯỞNG PHÒNG ĐÀO TẠO - QLKH
            </Text>
          </View>
        </View>
        {/* <Text
          style={{
            position: "absolute",
            fontSize: 10,
            bottom: 30,
            right: "18.897637795px",
            textAlign: "center",
            fontStyle: "italic",
          }}
          fixed
        >
          Bản báo cáo này được xuất ra từ phần mềm thăm dò công tác giảng dạy
          lúc {moment().format("HH:mm:ss")} ngày {moment().date()} tháng{" "}
          {moment().month() + 1} năm {moment().year()}
        </Text> */}
        <Text
          style={styles.pageNumber}
          render={({ pageNumber, totalPages }) =>
            `Trang ${pageNumber} / ${totalPages}`
          }
          fixed
        />
      </Page>
    </Document>
  );
};

//-----------------------------------------------------------------------------------------------------------------------

const Doc3 = ({ data }) => {
  moment().locale("vi");
  // const [date, setDate] = useState(moment());
  // // console.log(moment().year());
  // useEffect(() => {
  //   let time = () => {
  //     setDate(moment());
  //   };

  //   setInterval(time, 1000);

  //   return () => {
  //     clearInterval(time);
  //   };
  // }, []);

  // console.log(date);
  return (
    <Document>
      <Page size="A4" orientation="portrait" style={styles.page}>
        <Text
          style={{
            position: "absolute",
            color: "rgba(219, 220, 219, 0.52)",
            transform: "rotate(-45deg)",
            top: "300",
            left: "80",
            fontSize: "70",
            zIndex: 0,
          }}
          fixed
        >
          HPU.EDU.VN
        </Text>
        <View style={{ display: "flex", flexDirection: "row" }}>
          <View>
            <Image
              src={logo}
              style={{
                objectFit: "cover",
                width: "70px",
                height: "70px",
              }}
            />
          </View>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              width: "100%",
              justifyContent: "space-between",
            }}
          >
            <View
              style={{
                marginTop: "25px",
                gap: "5px",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Text
                style={{
                  fontWeight: "bold",
                  fontSize: "8px",
                  alignSelf: "center",
                }}
              >
                BỘ GIÁO DỤC VÀ ĐÀO TẠO
              </Text>
              <Text
                style={{
                  fontWeight: "bold",
                  fontSize: "8px",
                  alignSelf: "center",
                  borderBottom: "1px solid black",
                }}
              >
                TRƯỜNG ĐẠI HỌC QUẢN LÝ VÀ CÔNG NGHỆ HẢI PHÒNG
              </Text>
            </View>
            <View style={{ gap: "5px", display: "flex", marginTop: "25px" }}>
              <Text
                style={{
                  fontWeight: "bold",
                  fontSize: "8px",
                }}
              >
                CỘNG HOÀ XÃ HỘI CHỦ NGHĨA VIỆT NAM
              </Text>
              <Text
                style={{
                  fontWeight: "bold",
                  fontSize: "8px",
                  display: "flex",
                  alignSelf: "center",
                  borderBottom: "1px solid black",
                }}
              >
                Độc lập - Tự do - Hạnh Phúc
              </Text>
            </View>
          </View>
        </View>
        <Text
          style={{
            fontWeight: "bold",
            fontSize: "20px",
            display: "flex",
            alignSelf: "center",
          }}
        >
          PHỤ LỤC VĂN BẰNG
        </Text>
        <View style={{ width: "100%", display: "flex", flexDirection: "row" }}>
          <View
            style={{
              display: "flex",
              flexDirection: "column",
              paddingLeft: "30px",
              gap: "3px",
              width: "50%",
            }}
          >
            <Text style={{ fontSize: "12px" }}>
              Mã sinh viên:{" "}
              <Text style={{ fontWeight: "semibold" }}>
                {data.tt[0].masinhvien}
              </Text>
            </Text>
            <Text style={{ fontSize: "12px" }}>
              Họ và tên:{" "}
              <Text style={{ fontWeight: "semibold" }}>{data.tt[0].hoten}</Text>
            </Text>
            <Text style={{ fontSize: "12px" }}>
              Giới tính:{" "}
              <Text style={{ fontWeight: "semibold" }}>
                {capitalizeFirstLetter(data.tt[0].gioitinh)}
              </Text>
            </Text>
            <Text style={{ fontSize: "12px" }}>
              Ngày sinh:{" "}
              <Text style={{ fontWeight: "semibold" }}>
                {data.tt[0].ngaysinh
                  .split("T")[0]
                  .split("-")
                  .reverse()
                  .join("-")}
              </Text>
            </Text>
            <Text style={{ fontSize: "12px" }}>
              Trình độ đào tạo:{" "}
              <Text style={{ fontWeight: "semibold" }}>
                {capitalizeFirstLetter(data.tt[0].daotao)}
              </Text>
            </Text>
          </View>
          <View
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "3px",
              width: "50%",
            }}
          >
            <Text style={{ fontSize: "12px" }}>
              Khoá:{" "}
              <Text style={{ fontWeight: "semibold" }}>
                {data.tt[0].makhoahoc}
              </Text>
            </Text>
            <Text style={{ fontSize: "12px" }}>
              Thời gian đào tạo:{" "}
              <Text style={{ fontWeight: "semibold" }}>
                {data.addition[0].sonamhoc} năm
              </Text>
            </Text>
            <Text style={{ fontSize: "12px" }}>
              Ngôn ngữ đào tạo:{" "}
              <Text style={{ fontWeight: "semibold" }}>Tiếng việt</Text>
            </Text>
            <Text style={{ fontSize: "12px" }}>
              Hình thức đào tạo:{" "}
              <Text style={{ fontWeight: "semibold" }}>
                {data.tt[0].tenhedaotao}
              </Text>
            </Text>
            <Text style={{ fontSize: "12px" }}>
              Chuyên ngành:{" "}
              <Text style={{ fontWeight: "semibold" }}>
                {data.tt[0].tennganh}
              </Text>
            </Text>
          </View>
        </View>
        <Text
          style={{
            fontWeight: "bold",
            fontSize: "14px",
            display: "flex",
            alignSelf: "center",
          }}
        >
          KẾT QUẢ HỌC TẬP
        </Text>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            width: "100%",
            paddingLeft: "10px",
            gap: "5px",
          }}
        >
          <View style={{ ...styles.table, width: "100%" }}>
            <View
              style={{
                ...styles.tableRow,
                width: "100%",
                border: "0.5px solid black",
              }}
              fixed
            >
              <View style={{ ...styles.tableCol, width: "10%" }}>
                <Text style={{ ...styles.tableCell, fontWeight: "semibold" }}>
                  Số TT
                </Text>
              </View>
              <View
                style={{
                  ...styles.tableCol,
                  width: "50%",
                  border: "0.5px solid black",
                  borderRight: 0,
                  borderTop: 0,
                  borderBottom: 0,
                }}
              >
                <Text style={{ ...styles.tableCell, fontWeight: "semibold" }}>
                  Tên học phần
                </Text>
              </View>
              <View
                style={{
                  ...styles.tableCol,
                  width: "10%",
                  border: "0.5px solid black",
                  borderRight: 0,
                  borderTop: 0,
                  borderBottom: 0,
                }}
              >
                <Text style={{ ...styles.tableCell, fontWeight: "semibold" }}>
                  Số tín chỉ
                </Text>
              </View>
              <View
                style={{
                  flexDirection: "column",
                  width: "20%",
                  border: "0.5px solid black",
                  borderRight: 0,
                  borderTop: 0,
                  borderBottom: 0,
                }}
              >
                <View
                  style={{
                    ...styles.tableCol,
                    height: "31px",
                    border: "0.5px solid black",
                    borderTop: 0,
                    borderLeft: 0,
                    borderRight: 0,
                  }}
                >
                  <Text style={{ ...styles.tableCell, fontWeight: "semibold" }}>
                    Điểm số
                  </Text>
                </View>
                <View style={{ flexDirection: "row", width: "100%" }}>
                  <View
                    style={{
                      ...styles.tableCol,
                      width: "50%",
                      height: "31px",
                    }}
                  >
                    <Text
                      style={{ ...styles.tableCell, fontWeight: "semibold" }}
                    >
                      Hệ 4
                    </Text>
                  </View>
                  <View
                    style={{
                      ...styles.tableCol,
                      width: "50%",
                      height: "31px",
                      border: "0.5px solid black",
                      borderTop: 0,
                      borderRight: 0,
                      borderBottom: 0,
                    }}
                  >
                    <Text
                      style={{ ...styles.tableCell, fontWeight: "semibold" }}
                    >
                      Hệ 10
                    </Text>
                  </View>
                </View>
              </View>
              {/* <View style={{ ...styles.tableCol, width: "10%",fontWeight: "bold" }}>
                <Text style={styles.tableCell}>ĐSH 4 </Text>
              </View>
              <View style={{ ...styles.tableCol, width: "10%",fontWeight: "bold" }}>
                <Text style={styles.tableCell}>ĐSH 10</Text>
              </View> */}
              <View
                style={{
                  ...styles.tableCol,
                  width: "10%",
                  border: "0.5px solid black",
                  borderRight: 0,
                  borderTop: 0,
                  borderBottom: 0,
                }}
              >
                <Text style={{ ...styles.tableCell, fontWeight: "semibold" }}>
                  Điểm chữ
                </Text>
              </View>
            </View>
            {data.diem_toan_khoa.map((item, index) => {
              return (
                <View
                  style={{
                    ...styles.tableRow,
                    width: "100%",
                    border: "0.5px solid black",
                    borderTop: 0,
                  }}
                  wrap={false}
                  key={index}
                >
                  <View style={{ ...styles.tableCol, width: "10%" }}>
                    <Text style={styles.tableCell}>{index + 1}</Text>
                  </View>
                  <View
                    style={{
                      ...styles.tableCol,
                      width: "50%",
                      border: "0.5px solid black",
                      borderTop: 0,
                      borderRight: 0,
                      borderBottom: 0,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: "8",
                        textAlign: "left",
                      }}
                    >
                      {item.tenmonhoc}
                    </Text>
                  </View>
                  <View
                    style={{
                      ...styles.tableCol,
                      width: "10%",
                      border: "0.5px solid black",
                      borderTop: 0,
                      borderRight: 0,
                      borderBottom: 0,
                    }}
                  >
                    <Text style={styles.tableCell}>{item.khoiluong}</Text>
                  </View>
                  <View
                    style={{
                      ...styles.tableCol,
                      width: "10%",
                      border: "0.5px solid black",
                      borderTop: 0,
                      borderRight: 0,
                      borderBottom: 0,
                    }}
                  >
                    <Text style={styles.tableCell}>{item.diemthang4}</Text>
                  </View>
                  <View
                    style={{
                      ...styles.tableCol,
                      width: "10%",
                      border: "0.5px solid black",
                      borderTop: 0,
                      borderRight: 0,
                      borderBottom: 0,
                    }}
                  >
                    <Text style={styles.tableCell}>{item.diemthang10}</Text>
                  </View>
                  <View
                    style={{
                      ...styles.tableCol,
                      width: "10%",
                      border: "0.5px solid black",
                      borderTop: 0,
                      borderRight: 0,
                      borderBottom: 0,
                    }}
                  >
                    <Text style={styles.tableCell}>{item.diemchu}</Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>
        <Text style={{ fontSize: "10px", marginLeft: "10px" }}>
          Tên đề tài tốt nghiệp:{" "}
          <Text style={{ fontWeight: "semibold" }}>{data.tt[0].tendoan}</Text>
        </Text>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            width: "100%",
          }}
        >
          <View
            style={{
              padding: "5px",
              width: "50%",
              marginLeft: "6px",
              gap: "5px",
            }}
          >
            <Text style={{ fontSize: "10px" }}>
              Điểm trung bình toàn khoá (hệ 4):{" "}
              <Text style={{ fontWeight: "semibold" }}>
                {data.tbtk[0].tbtk_diem4}
              </Text>
            </Text>
            <Text style={{ fontSize: "10px" }}>
              Tổng số tín chỉ tích luỹ:{" "}
              <Text style={{ fontWeight: "semibold" }}>
                {data.addition[0].tongtinchi}
              </Text>
            </Text>
            <Text style={{ fontSize: "10px" }}>
              Xếp hạng tốt nghiệp:{" "}
              <Text style={{ fontWeight: "semibold" }}>
                {data.tbtk[0].tbtk_xeploai4}
              </Text>
            </Text>
            <Text style={{ fontSize: "10px" }}>
              Số hiệu văn bằng:{" "}
              <Text style={{ fontWeight: "semibold" }}>
                {data.addition[0].sohieubang}
              </Text>
            </Text>
            <Text style={{ fontSize: "10px" }}>
              Số vào sổ cấp bằng:{" "}
              <Text style={{ fontWeight: "semibold" }}>
                {data.addition[0].sovaoso}
              </Text>
            </Text>
          </View>
          <View
            style={{
              padding: "5px",
              display: "flex",
              flexDirection: "column",
              width: "50%",
              gap: "5px",
            }}
          >
            <Text
              style={{
                fontSize: "10px",
                textAlign: "right",
                fontStyle: "italic",
              }}
            >
              <Text style={{ fontStyle: "italic" }}>Hải Phòng, </Text>
              ngày {moment().date()} tháng {moment().month() + 1} năm{" "}
              {moment().year()}
            </Text>
            <Text
              style={{
                marginLeft: "50px",
                fontSize: "10px",
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              TL. HIỆU TRƯỞNG
            </Text>
            <Text
              style={{
                marginLeft: "50px",
                fontSize: "10px",
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              TRƯỞNG PHÒNG ĐÀO TẠO - QLKH
            </Text>
          </View>
        </View>
        <Text
          style={styles.pageNumber}
          render={({ pageNumber, totalPages }) =>
            `Trang ${pageNumber} / ${totalPages}`
          }
          fixed
        />
      </Page>
    </Document>
  );
};

//------------------------------------------------------------------------------------------------------------------------

export default function Index({ studentCode, type }) {
  const { getToken } = useAuth();

  // const role = useQuery({
  //   queryKey: ["VBCC_ROLE"],
  //   queryFn: async () => {
  //     return await fetch(`${import.meta.env.VITE_APP_VBCC_API_ROLE}`, {
  //       method: "GET",
  //       headers: {
  //         authorization: `Bearer ${await getToken({
  //           template: import.meta.env.VITE_APP_VBCC_ROLE_TEMPLATE,
  //         })}`,
  //       },
  //     })
  //       .then((res) => res.json())
  //       .then((res) =>
  //         res.result.length > 0
  //           ? res.result[0]
  //           : { role_id: 1, user_code: null }
  //       );
  //   },
  // });

  const { data, isFetching, isLoading } = useQuery({
    queryKey: ["VBCC_DETAIL_SV", studentCode],
    queryFn: async () => {
      return await fetch(
        `${import.meta.env.VITE_APP_VBCC_DATA}${studentCode}`,
        {
          method: "GET",
          headers: {
            authorization: `Bearer ${await getToken({
              template: import.meta.env.VITE_APP_EDU_VBCC_TEMPLATE,
            })}`,
          },
        }
      ).then((res) => res.json());
    },
    enabled: !!studentCode && !!type,
  });

  console.log(data);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const ref = useRef();
  const document = useMemo(
    () =>
      data ? (
        type.value === 1 ? (
          <Doc1
            data={{
              ...data,
              diem_toan_khoa: data.diem_toan_khoa.map((item, index) => ({
                ...item,
                stt: index + 1,
              })),
            }}
          />
        ) : type.value === 2 ? (
          <Doc2
            data={{
              ...data,
              diem_toan_khoa: data.diem_toan_khoa.map((item, index) => ({
                ...item,
                stt: index + 1,
              })),
            }}
          />
        ) : type.value === 3 ? (
          <Doc3
            data={{
              ...data,
              diem_toan_khoa: data.diem_toan_khoa.map((item, index) => ({
                ...item,
                stt: index + 1,
              })),
            }}
          />
        ) : (
          <></>
        )
      ) : (
        <></>
      ),
    [data, type.value]
  );

  const [instance, UpdateInstance] = usePDF({
    document,
  });

  useEffect(() => {
    if (data?.tt.length > 0) {
      UpdateInstance(document);
      setPageNumber(1);
    }
  }, [data, type.value]);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  if (isFetching && isLoading)
    return (
      <div className="flex flex-col gap-[15px]">
        {/* <BiArrowBack
          size={"40px"}
          className="cursor-pointer"
          onClick={() => {
            setDataPass((pre) => ({
              masv: null,
              toggle: !pre.toggle,
              type: null,
            }));
          }}
        /> */}
        <ReactLoading
          type="spin"
          color="#0083C2"
          width={"50px"}
          height={"50px"}
          className="self-center"
        />
      </div>
    );

  if (data?.tt.length === 0)
    return <h5>Không tìm thấy sinh viên hoặc đã có lỗi xảy ra!</h5>;

  return instance.loading ? (
    <div className="flex flex-col gap-[15px]">
      {/* <BiArrowBack
          size={"40px"}
          className="cursor-pointer"
          onClick={() => {
            setDataPass((pre) => ({
              masv: null,
              toggle: !pre.toggle,
              type: null,
            }));
          }}
        /> */}
      <ReactLoading
        type="spin"
        color="#0083C2"
        width={"50px"}
        height={"50px"}
        className="self-center"
      />
    </div>
  ) : (
    <div className="flex flex-col gap-[15px]">
      {instance.loading || instance.error ? (
        <ReactLoading
          type="spin"
          color="#0083C2"
          width={"25px"}
          height={"25px"}
          className="self-end"
        />
      ) : (
        <a
          href={instance.url}
          download="Diem.pdf"
          className="selfBtn w-fit self-end"
        >
          Tải PDF
        </a>
      )}
      <div>
        {instance.url ? (
          <div ref={ref} className="flex flex-col items-center gap-[10px] ">
            <div className="flex min-h-[842px]">
              <DocumentViewer
                className="shadow-[0_2px_5px_0_#88898d] rounded-[3px] border-bordercl min-w-[595px] flex justify-center"
                file={{ url: instance.url }}
                onLoadSuccess={onDocumentLoadSuccess}
                loading={() => (
                  <ReactLoading
                    type="spin"
                    color="#0083C2"
                    width={"25px"}
                    height={"25px"}
                    className="self-center mt-[20px]"
                  />
                )}
                error={() => <h3>Đã có lỗi xảy ra!</h3>}
              >
                <PageViewer
                  pageNumber={pageNumber}
                  loading={() => (
                    <ReactLoading
                      type="spin"
                      color="#0083C2"
                      width={"25px"}
                      height={"25px"}
                      className="self-center mt-[20px]"
                    />
                  )}
                  scale={1.5}
                />
              </DocumentViewer>
            </div>
            {numPages ? (
              <div className="join grid grid-cols-2">
                <button
                  className={`join-item btn btn-outline ${
                    pageNumber <= 1
                      ? "text-black border-bordercl bg-bordercl cursor-not-allowed hover:bg-bordercl hover:border-bordercl hover:text-black"
                      : "text-black border-bordercl hover:bg-primary hover:border-bordercl"
                  }`}
                  onClick={(e) => {
                    if (pageNumber <= 1) {
                      e.preventDefault();
                    } else {
                      ref.current.scrollIntoView({ behavior: "smooth" });
                      setPageNumber((pre) => pre - 1);
                    }
                  }}
                >
                  Trang trước
                </button>
                <button
                  className={`join-item btn btn-outline ${
                    pageNumber >= numPages
                      ? "text-black border-bordercl bg-bordercl cursor-not-allowed hover:bg-bordercl hover:border-bordercl hover:text-black"
                      : "text-black border-bordercl hover:bg-primary hover:border-bordercl"
                  }`}
                  onClick={(e) => {
                    if (pageNumber >= numPages) {
                      e.preventDefault();
                    } else {
                      ref.current.scrollIntoView({ behavior: "smooth" });
                      setPageNumber((pre) => pre + 1);
                    }
                  }}
                >
                  Trang sau
                </button>
              </div>
            ) : (
              <></>
            )}
          </div>
        ) : (
          <></>
        )}
      </div>
      {/* <PDFViewer style={{ width: "100%", height: "90vh" }} showToolbar={true}>
        {type.value === 1 ? (
          <Doc1
            data={{
              ...data,
              diem_toan_khoa: data.diem_toan_khoa.map((item, index) => ({
                ...item,
                stt: index + 1,
              })),
            }}
          />
        ) : type.value === 2 ? (
          <Doc2
            data={{
              ...data,
              diem_toan_khoa: data.diem_toan_khoa.map((item, index) => ({
                ...item,
                stt: index + 1,
              })),
            }}
          />
        ) : type.value === 3 ? (
          <Doc3
            data={{
              ...data,
              diem_toan_khoa: data.diem_toan_khoa.map((item, index) => ({
                ...item,
                stt: index + 1,
              })),
            }}
          />
        ) : (
          <></>
        )}
      </PDFViewer> */}
    </div>
  );
}
