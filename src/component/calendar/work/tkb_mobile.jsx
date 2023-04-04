import FullCalendar from "@fullcalendar/react"; // must go before plugins
import listPlugin from "@fullcalendar/list";
import momentPlugin from "@fullcalendar/moment";
import viLocale from "@fullcalendar/core/locales/vi";

export default function TKBMobile({ data }) {
  // console.log(screenSize)
  // const [size, setSize] = useState(screenSize);

  // useEffect(() => {
  //   setSize(screenSize);
  // }, [screenSize]);

  // console.log(size)

  return (
    <FullCalendar
      plugins={[listPlugin, momentPlugin]}
      locales={[viLocale]}
      initialView={"listWeek"}
      contentHeight={"auto"}
      headerToolbar={{
        start: "",
        center: "listDay,listWeek,listMonth,listYear",
        end: "",
      }}
      buttonText={{
        today: "Hôm nay",
        month: "Tháng",
        week: "Tuần",
        day: "Hôm nay",
        year: "Năm",
      }}
      events={data}
      eventContent={(eventInfo) => {
        return (
          <p>
            {eventInfo.event.title} - {eventInfo.event.extendedProps.phong} -{" "}
            {eventInfo.event.extendedProps.ma_lop}
          </p>
        );
      }}
    />
  );
}
