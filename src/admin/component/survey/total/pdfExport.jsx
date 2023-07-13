import "../../../../App.css";
import {
  Page,
  Text,
  View,
  Document,
  Image,
  PDFDownloadLink,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import logoPDF from "../../../../assets/logoPDF.png";
import FontRegular from "../../../../assets/Montserrat/Montserrat-Regular.ttf";
import FontItalic from "../../../../assets/Montserrat/Montserrat-Italic.ttf";
import FontBold from "../../../../assets/Montserrat/Montserrat-Bold.ttf";
import BoldItalic from "../../../../assets/Montserrat/Montserrat-BoldItalic.ttf";
import moment from "moment/moment";

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
    paddingBottom: "75.590551181px",
    fontFamily: "montserrat",
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
    // borderStyle: "solid",
    // borderWidth: 1,
    // borderRightWidth: 0,
    // borderBottomWidth: 0,
  },
  tableRow: {
    flexDirection: "row",
  },
  tableCol: {
    border: "1px solid black",
    // borderStyle: "solid",
    // borderWidth: 1,
    // borderLeftWidth: 0,
    // borderTopWidth: 0,
    alignItems: "center",
    justifyContent: "center",
    padding: "5px",
  },
  tableCell: {
    fontSize: 10,
    alignSelf: "center",
    textAlign: "center",
  },
  // section: {
  //   margin: 10,
  //   padding: 10,
  //   flexGrow: 1,
  // },
});

const WrapText = (text) => {
  return (
    <View
      style={{
        width: "10%",
        flexDirection: "row",
        flexWrap: "wrap",
        borderStyle: "solid",
        borderWidth: 1,
        // borderLeftWidth: 0,
        // borderTopWidth: 0,
        alignContent: "center",
        justifyContent: "center",
        padding: "5px",
      }}
    >
      {text?.match(/\w+|\W+/g)?.map((seg, i) => (
        <Text
          style={{ fontSize: "10", textAlign: "center", alignSelf: "center" }}
          key={i}
        >
          {seg}
        </Text>
      ))}
    </View>
  );
};

function Doc({ data, name }) {
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
      <Page size="A4" orientation="landscape" style={styles.page}>
        <View style={{ display: "flex", flexDirection: "row" }}>
          <View>
            <Image
              src={logoPDF}
              style={{
                objectFit: "cover",
                width: "50px",
                height: "50px",
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
            <Text
              style={{
                fontWeight: "bold",
                fontSize: "10px",
              }}
            >
              TRƯỜNG ĐẠI HỌC QUẢN LÝ VÀ CÔNG NGHỆ HẢI PHÒNG
            </Text>
            <View style={{ gap: "15px", display: "flex" }}>
              <Text
                style={{
                  fontWeight: "bold",
                  fontSize: "10px",
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
            fontSize: "16px",
            display: "flex",
            alignSelf: "center",
            marginTop: "60px",
            marginBottom: "40px",
          }}
        >
          TỔNG HỢP KẾT QUẢ PHẢN HỒI Ý KIẾN
        </Text>
        <View style={styles.table}>
          <View style={{ ...styles.tableRow }} fixed>
            <View style={{ ...styles.tableCol, width: "5%" }}>
              <Text style={styles.tableCell}>STT</Text>
            </View>
            <View style={{ ...styles.tableCol, width: "10%" }}>
              <Text style={styles.tableCell}>Mã lớp</Text>
            </View>
            <View style={{ ...styles.tableCol, width: "10%" }}>
              <Text style={styles.tableCell}>Mã môn</Text>
            </View>
            <View style={{ ...styles.tableCol, width: "10%" }}>
              <Text style={styles.tableCell}>Tên môn</Text>
            </View>
            <View style={{ ...styles.tableCol, width: "5%" }}>
              <Text style={styles.tableCell}>Số tín chỉ</Text>
            </View>
            <View style={{ ...styles.tableCol, width: "10%" }}>
              <Text style={styles.tableCell}>Giảng viên</Text>
            </View>
            <View style={{ ...styles.tableCol, width: "5%" }}>
              <Text style={styles.tableCell}>Khoa</Text>
            </View>
            <View
              style={{
                flexDirection: "column",
                width: "15%",
              }}
            >
              <View style={{ ...styles.tableCol, height: "61px" }}>
                <Text style={styles.tableCell}>Phản hồi của sinh viên</Text>
              </View>
              <View style={{ flexDirection: "row", height: "110px" }}>
                <View
                  style={{
                    ...styles.tableCol,
                    width: "33.3%",
                    height: "110px",
                  }}
                >
                  <Text style={styles.tableCell}>Điểm TB (d1)</Text>
                </View>
                <View
                  style={{
                    ...styles.tableCol,
                    width: "33.3%",
                    height: "110px",
                  }}
                >
                  <Text style={styles.tableCell}>Đã phản hồi</Text>
                </View>
                <View
                  style={{
                    ...styles.tableCol,
                    width: "33.4%",
                    height: "110px",
                  }}
                >
                  <Text style={styles.tableCell}>Sĩ số</Text>
                </View>
              </View>
            </View>
            <View
              style={{
                flexDirection: "column",
                width: "15%",
              }}
            >
              <View style={{ ...styles.tableCol, height: "61px" }}>
                <Text style={styles.tableCell}>Phản hồi của đồng nghiệp</Text>
              </View>
              <View style={{ flexDirection: "row", height: "110px" }}>
                <View style={{ ...styles.tableCol, width: "33.3%" }}>
                  <Text style={styles.tableCell}>Điểm TB (d2)</Text>
                </View>
                <View
                  style={{
                    ...styles.tableCol,
                    width: "33.3%",
                    height: "110px",
                  }}
                >
                  <Text style={styles.tableCell}>Đã phản hồi</Text>
                </View>
                <View
                  style={{
                    ...styles.tableCol,
                    width: "33.4%",
                    height: "110px",
                  }}
                >
                  <Text style={styles.tableCell}>
                    Số giảng viên được phân công dự giờ
                  </Text>
                </View>
              </View>
            </View>
            <View
              style={{
                flexDirection: "column",
                width: "5%",
              }}
            >
              <View style={{ ...styles.tableCol, height: "61px" }}>
                <Text style={styles.tableCell}>Quản lý đào tạo</Text>
              </View>
              <View style={{ flexDirection: "row" }}>
                <View style={{ ...styles.tableCol, height: "110px" }}>
                  <Text style={styles.tableCell}>Điểm TB (d3)</Text>
                </View>
              </View>
            </View>
            {/* <View style={{ ...styles.tableCol, width: "5%" }}>
                <Text style={styles.tableCell}>Điểm TB (d2)</Text>
              </View>
              <View style={{ ...styles.tableCol, width: "5%" }}>
                <Text style={styles.tableCell}>Đã phản hồi</Text>
              </View>
              <View style={{ ...styles.tableCol, width: "5%" }}>
                <Text style={styles.tableCell}>
                  Số giảng viên được phân công dự giờ
                </Text>
              </View> */}
            {/* <View style={{ ...styles.tableCol, width: "5%" }}>
                <Text style={styles.tableCell}>Điểm TB (d3)</Text>
              </View> */}
            <View style={{ ...styles.tableCol, width: "5%" }}>
              <Text style={styles.tableCell}>
                Tổng điểm = 0.8 x d1 + 0.4 x d2 + 0.2 x d3
              </Text>
            </View>
            <View style={{ ...styles.tableCol, width: "5%" }}>
              <Text style={styles.tableCell}>Xếp loại</Text>
            </View>
          </View>
          {data.map((item, index) => {
            return (
              <View key={index} style={styles.tableRow} wrap={false}>
                <View style={{ ...styles.tableCol, width: "5%" }}>
                  <Text style={styles.tableCell}>{item.stt}</Text>
                </View>
                {/* <View style={{ ...styles.tableCol, width: "10%" }}>
                    <Text style={styles.tableCell}>{item.subject_code}</Text>
                  </View> */}
                {/* <View style={{ ...styles.tableCol, width: "10%" }}>
                    <Text style={{ ...styles.tableCell }}>
                      {WrapText(item.class_code)}
                    </Text>
                  </View> */}
                {WrapText(item.subject_code)}
                {WrapText(item.class_code)}
                <View style={{ ...styles.tableCol, width: "10%" }}>
                  <Text style={styles.tableCell}>{item.class_name}</Text>
                </View>
                <View style={{ ...styles.tableCol, width: "5%" }}>
                  <Text style={styles.tableCell}>{item.so_tc}</Text>
                </View>
                <View style={{ ...styles.tableCol, width: "10%" }}>
                  <Text style={styles.tableCell}>{item.name}</Text>
                </View>
                <View style={{ ...styles.tableCol, width: "5%" }}>
                  <Text style={styles.tableCell}>{item.khoa}</Text>
                </View>
                <View style={{ ...styles.tableCol, width: "5%" }}>
                  <Text style={styles.tableCell}>{item.student_result}</Text>
                </View>
                <View style={{ ...styles.tableCol, width: "5%" }}>
                  <Text style={styles.tableCell}>{item.count_sv_resonded}</Text>
                </View>
                <View style={{ ...styles.tableCol, width: "5%" }}>
                  <Text style={styles.tableCell}>{item.total_student}</Text>
                </View>
                <View style={{ ...styles.tableCol, width: "5%" }}>
                  <Text style={styles.tableCell}>{item.teacher_result}</Text>
                </View>
                <View style={{ ...styles.tableCol, width: "5%" }}>
                  <Text style={styles.tableCell}>{item.count_gv_resonded}</Text>
                </View>
                <View style={{ ...styles.tableCol, width: "5%" }}>
                  <Text style={styles.tableCell}>{item.total_teacher}</Text>
                </View>
                <View style={{ ...styles.tableCol, width: "5%" }}>
                  <Text style={styles.tableCell}>{item.qldt_result}</Text>
                </View>
                <View style={{ ...styles.tableCol, width: "5%" }}>
                  <Text style={styles.tableCell}>{item.result_evaluate}</Text>
                </View>
                <View style={{ ...styles.tableCol, width: "5%" }}>
                  <Text style={styles.tableCell}>{item.xep_loai}</Text>
                </View>
              </View>
            );
          })}
        </View>
        <View
          style={{
            flexDirection: "row",
            width: "100%",
            minHeight: "50px",
            marginTop: "30px",
            justifyContent: "space-around",
          }}
          wrap={false}
        >
          <Text
            style={{
              fontWeight: "bold",
              fontSize: 10,
              textAlign: "center",
            }}
          >
            HT
          </Text>
          <Text
            style={{
              fontWeight: "bold",
              fontSize: 10,
              textAlign: "center",
            }}
          >
            PHÒNG HC - TH
          </Text>
          <Text
            style={{
              fontWeight: "bold",
              fontSize: 10,
              textAlign: "center",
            }}
          >
            PHÒNG TC - PC - ĐBCL
          </Text>
          <Text
            style={{
              fontWeight: "bold",
              fontSize: 10,
              textAlign: "center",
            }}
          >
            PHÒNG ĐT - QLKH
          </Text>
          <View>
            <Text
              style={{
                fontWeight: "bold",
                fontSize: 10,
                textAlign: "center",
                alignSelf: "center",
              }}
            >
              Người xuất dữ liệu
            </Text>
            <Text
              style={{
                fontWeight: "bold",
                fontSize: 10,
                textAlign: "center",
                marginTop: "45px",
                alignSelf: "center",
              }}
            >
              {name}
            </Text>
          </View>
        </View>
        <Text
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
          ngày {moment().date()} tháng {moment().month() + 1} năm{" "}
          {moment().year()}
        </Text>
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
}

function Index({ data, name }) {
  // const d = new Date();
  //   moment().locale("vi");
  return (
    <PDFDownloadLink
      document={<Doc data={data} name={name} />}
      fileName={`BaoCao_CTGD.pdf`}
    >
      Download
    </PDFDownloadLink>
  );
}

export default Index;
