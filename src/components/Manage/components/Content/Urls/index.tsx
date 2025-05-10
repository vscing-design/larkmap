import Images from "@/assets";
import { Directory, Url } from "@/utils/bookmarks";
import "./index.less";
import { useBookmarksStore } from "@/stores";
import useTheme from "@/hooks/useTheme";
import { useRef, useState } from "react";
import { cloneDeep } from "lodash-es";
import UrlDrawer from "../UrlDrawer";

interface UrlsProps {
  currentDirectory: Directory | null;
  urlsList: Url[];
  selectedMap: Record<string, Url | Directory>;
  onMouseDown: (e: any, innerHTML: string) => void;
}

const Urls = (props: UrlsProps) => {

  // 布局模式
  const layoutMode = useBookmarksStore(state => state.layoutMode);
  // 更新选中的网页
  const updateSelectedMap = useBookmarksStore(state => state.updateSelectedMap);
  // 获取当前的书签夹
  const currentBookmark = useBookmarksStore(state => state.currentBookmark);
  // 文件夹列表
  const directoryList = useBookmarksStore(state => state.directoryList);
  // 当前选中文件夹下标
  const directoryIndexMap = useBookmarksStore(state => state.directoryIndexMap);
  // 获取当前的目录
  const currentDirectory = useBookmarksStore(state => state.currentDirectory);
  // 更新选中的目录
  const updateDirectoryList = useBookmarksStore(state => state.updateDirectoryList);

  const { isDark } = useTheme();

  const { urlsList, selectedMap, onMouseDown } = props;

  //右键菜单
  const currentUrl = useRef<Url | null>(null);
  const [urlId, setUrlId] = useState<string>("");
  // 是否打开抽屉
  const [open, setOpen] = useState<boolean>(false);

  // 点击事件 按住shift多选，否则单选
  const handleClick = (e: any, url: Url) => {
    const newSelectedMap = e.shiftKey ? {...selectedMap} : {};
    if (newSelectedMap[url.id]) {
      delete newSelectedMap[url.id];
    } else {
      newSelectedMap[url.id] = url;
    }
    updateSelectedMap(newSelectedMap);
  }

  // 右键事件
  const handleContextMenu = (e: any, url: Url) => {
    e.preventDefault(); // 阻止上下文菜单的显示
    console.log('%c [ e, url ]-39', 'font-size:13px; background:pink; color:#bf2c9f;', e, url);
    setUrlId(url?.id);
    currentUrl.current = url;
  }

  // 阻止冒泡事件
  const handleMouseDown = (e: any) => {
    if (Object.keys(selectedMap).length === 0) return;
    // 创建拖动预览元素
    const firstValue = Object.values(selectedMap)[0] as Url;
    const innerHTML = `
      <div class="layout${layoutMode} vbg-color-card! vborder-color-active cursor-move select-none box-border border border-solid vborder-color-default b-rounded-12px p-15px opacity-80">
        <div class="url-icon vbg-color-card flex items-center justify-center b-rounded-6px w-36px h-36px">
          <img src="${firstValue.icon ? firstValue.icon : (isDark ? Images.darkUrl : Images.lighitUrl)}" class="w-18px h-18px" />
        </div>
        <div class="url-info url-icon-preview">
          <div class="url-info-title vcolor-title overflow-hidden text-ellipsis whitespace-nowrap font-normal font-500 text-11px line-height-15px">
            ${firstValue.name}
          </div>
          ${firstValue.desc ? `<div class="url-info-desc vcolor-desc overflow-hidden text-ellipsis whitespace-nowrap font-normal font-400 text-10px line-height-15px mt-3px">
            ${firstValue.desc ?? ""}
          </div>` : ""}
        </div>
      </div>
      <div class="absolute left-0 top-0 w-28px h-28px flex items-center justify-center vbg-color-button vcolor-dark font-700 b-rounded-50% text-12px line-height-12px">${Object.keys(selectedMap).length || 0}</div>
    `;
    onMouseDown(e, innerHTML);
  }

  // 右键事件
  const onModel = (e: any, newModelType: number) => {
    e.stopPropagation();
    if (newModelType === 1) {
      window.open(currentUrl.current?.url);
    } else if (newModelType === 2) {
      setOpen(true);
    } else if (newModelType === 3) {
      if (currentDirectory) {
        const index = directoryIndexMap[currentDirectory.id];
        const newDirectoryList = cloneDeep(directoryList);
        newDirectoryList[index].urls.push(currentUrl.current!);
        updateDirectoryList(newDirectoryList, null);
      } else {
        const newUnassignedUrls = [...(currentBookmark?.unassignedUrls ?? [])];
        newUnassignedUrls.push(currentUrl.current!);
        updateDirectoryList(directoryList, newUnassignedUrls);
      }
    } else if (newModelType === 4) {
      if (currentDirectory) {
        const index = directoryIndexMap[currentDirectory.id];
        const newDirectoryList = cloneDeep(directoryList);
        newDirectoryList[index].urls = currentDirectory.urls.filter((item: Url) => item.id !== currentUrl.current!.id);
        updateDirectoryList(newDirectoryList, null);
      } else {
        let newUnassignedUrls = [...(currentBookmark?.unassignedUrls ?? [])];
        newUnassignedUrls = newUnassignedUrls.filter((item: Url) => item.id !== currentUrl.current!.id);
        updateDirectoryList(directoryList, newUnassignedUrls);
      }
    }
    setUrlId("");
  }

  return <div className="url-list flex flex-wrap gap-16px" onMouseDown={handleMouseDown}>
    {
      urlsList.map((url: Url) => {
        return <div key={url.id} onClick={(e) => handleClick(e, url)} onContextMenu={(e) => handleContextMenu(e, url)} className={`layout${layoutMode} ${selectedMap?.[url.id] ? 'vbg-color-card! vborder-color-active cursor-move':''} relative select-none box-border border border-solid vborder-color-default b-rounded-12px p-20px`}>
          <div className="url-icon vbg-color-card flex items-center justify-center b-rounded-8px w-48px h-48px">
            <img src={url.icon ? url.icon : (isDark ? Images.darkUrl : Images.lighitUrl)} className="w-24px h-24px" />
          </div>
          <div className="url-info">
            <div className="url-info-title vcolor-title overflow-hidden text-ellipsis whitespace-nowrap font-normal font-500 text-14px line-height-20px">
              {url.name}
            </div>
            {url.desc && <div className="url-info-desc vcolor-desc overflow-hidden text-ellipsis whitespace-nowrap font-normal font-400 text-13px line-height-20px mt-4px">
              {url.desc}
            </div>}
          </div>
          {
            urlId && urlId === url.id && <div className={`${layoutMode === 1 ? 'top-80px right--100px' : (layoutMode === 2 ? 'top-60px right--100px' : 'top-100px right--100px')} vbg-color-main vshadow-color-layout border border-solid vborder-color-default absolute z-100 b-rounded-8px p-4px`}>
              <div className="cursor-pointer flex items-center gap-8px py-10px px-12px" onClick={(e) => onModel(e, 1)}>
                <img className="w-14px h-14px" src={isDark ? Images.darkUrl1 : Images.lighitUrl1} />
                <div className="vcolor-subTitle font-500 text-13px line-height-20px min-w98px">在新标签页打开</div>
              </div>
              <div className="cursor-pointer flex items-center gap-8px py-10px px-12px" onClick={(e) => onModel(e, 2)}>
                <img className="w-14px h-14px" src={isDark ? Images.darkUrl2 : Images.lighitUrl2} />
                <div className="vcolor-subTitle font-500 text-13px line-height-20px min-w98px">编辑</div>
              </div>
              <div className="cursor-pointer flex items-center gap-8px py-10px px-12px" onClick={(e) => onModel(e, 3)}>
                <img className="w-14px h-14px" src={isDark ? Images.darkUrl3 : Images.lighitUrl3} />
                <div className="vcolor-subTitle font-500 text-13px line-height-20px min-w98px">创建副本</div>
              </div>
              <div className="cursor-pointer flex items-center gap-8px py-10px px-12px" onClick={(e) => onModel(e, 3)}>
                <img className="w-14px h-14px" src={isDark ? Images.darkUrl4 : Images.lighitUrl4} />
                <div className="vcolor-subTitle font-500 text-13px line-height-20px min-w98px">删除</div>
              </div>
            </div>
          }
        </div>
      })
    }

    <UrlDrawer 
      open={open} 
      currentUrl={currentUrl.current ?? null}
      onClose={() => setOpen(false)} 
    />
  </div>
}

export default Urls;