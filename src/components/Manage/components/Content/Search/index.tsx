import Images from "@/assets";
import useTheme from "@/hooks/useTheme";
import "./index.less";
import { useMemo, useState } from "react";
import { useBookmarksStore } from "@/stores";

const Search = () => {

  const { isDark } = useTheme();

  // 获取搜索列表
  const searchList = useBookmarksStore(state => state.searchList);

  // 搜索框的值
  const [value, setValue] = useState("");

  // 输入框改变事件
  const onChange = (e: any) => {
    const value = e.target.value;
    setValue(value);
  }

  // 过滤搜索列表
  const filterSearchList = useMemo(() => {
    if (value === "") return [];
    return searchList.filter(item => item.name.includes(value));
  }, [searchList, value]);
  
  console.log('%c [ filterSearchList ]-25', 'font-size:13px; background:pink; color:#bf2c9f;', filterSearchList)

  return <div className={`${value ? "search-warp" : ""} position-absolute top-15px left-50% transform-translate-x--50%`}>
    <div className="w-100% box-border border-solid vborder-color-default flex items-center gap-8px px-16px py-8px border-rounded-24px">
      <img src={isDark ? Images.darkSearch : Images.lighitSearch} className="w-16px h-16px" />
      <input type="text" placeholder="搜索网站" onChange={onChange} className="vinput-placeholder flex-1 vbg-color-main vcolor-title border-0 p-0 outline-0 font-400 w-208px h-24px text-14px line-height-24px" />
    </div>
    <div className="search-list hidden! w-100% flex-1 overflow-x-hidden overflow-y-auto flex flex-col items-start">
      {
        filterSearchList.map((item, index) => {
          return <div key={index} style={{ cursor: `url(${isDark ? Images.darkCursor : Images.lighitCursor}), pointer` }} className="hover:vbg-color-subCard box-border w-100% flex items-center border-rounded-8px gap-12px px-16px py-12px border-rounded-8px">
            <img src={item.icon ? item.icon : (isDark ? Images.darkUrl : Images.lighitUrl)} className="w-16px h-16px" />
            <div className="flex-1 max-w-292px">
              <div className="whitespace-nowrap overflow-hidden text-ellipsis vcolor-title font-500 text-14px line-height-20px">{item.name}</div>
              {item.desc && <div className="overflow-hidden text-ellipsis font-400 text-12px line-height-20px">{item.desc}</div>}
            </div>
          </div>
        })
      }
    </div>
  </div>
}

export default Search;