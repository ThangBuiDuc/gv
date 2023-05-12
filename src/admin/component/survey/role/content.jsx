import "../../../../App.css";
import { useEffect } from "react";
import { useState } from "react";

import SubContent from "./subContent";
import { Fragment } from "react";

export default function Index({ data, setData }) {
  const [query, setQuery] = useState("");
  const [search, setSearch] = useState([]);

  useEffect(() => {
    if (query !== "")
      setSearch(
        data.filter((item) =>
          item.name.toLowerCase().includes(query.toLowerCase())
        )
      );
    else setSearch(data);
  }, [query, data]);
  return (
    <div className="flex flex-col gap-[30px]">
      <input
        type="search"
        placeholder="Nhập thông tin tìm kiếm"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="border-solid border-[1px] border-bordercl text-[16px] rounded-[10px] p-[10px] w-[30%] self-end"
      />
      <div className="flex flex-col gap-[50px]">
        {search.length > 0 ? (
          search.map((item, index) => {
            return (
              <Fragment key={index}>
                <SubContent
                  item={item}
                  adminCount={
                    data.filter(
                      (item) =>
                        item.role_id ===
                        parseInt(import.meta.env.VITE_ROLE_ADMIN)
                    ).length
                  }
                  setData={setData}
                />
              </Fragment>
            );
          })
        ) : (
          <div className="flex justify-center">
            <h3>Không tìm thấy kết quả</h3>
          </div>
        )}
      </div>
    </div>
  );
}
