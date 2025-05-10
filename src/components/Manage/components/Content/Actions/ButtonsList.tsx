import { memo, useState } from "react";
import useTheme from "@/hooks/useTheme";
import { useBookmarksStore } from "@/stores";
import { Button } from "@/components/vscing-design";
import Images from "@/assets";
import UrlDrawer from "../UrlDrawer";

const ButtonsList = () => {

  const { isDark } = useTheme();

  // 文件夹列表
  const directoryList = useBookmarksStore(state => state.directoryList);
  // 获取当前的目录
  const currentDirectory = useBookmarksStore(state => state.currentDirectory);
  // 更新选中的目录
  const updateDirectoryList = useBookmarksStore(state => state.updateDirectoryList);

  // 是否打开抽屉
  const [open, setOpen] = useState(false);

  // 添加网站
  const addWebsite = () => {
    console.log('添加网站');
    setOpen(true);
  }

  // 一键清理
  const clearAll = () => {
    updateDirectoryList(directoryList, []);
  }

  return <div className="flex items-center gap-16px">
    <Button onClick={() => addWebsite()} className="vbg-color-button flex items-center b-rounded-6px px-12px h-36px">
      <img src={isDark ? Images.darkUrlsAdd : Images.lighitUrlsAdd} width={14} height={14} />
      <span className="vcolor-dark flex items-center ml-6px h-22px font-500 text-13px">添加网站</span>
    </Button>
    {
      !currentDirectory && <Button onClick={() => clearAll()} className="vbg-color-subCard flex items-center b-rounded-6px px-12px h-36px">
        <img src={isDark ? Images.darkUrlsClear : Images.lighitUrlsClear} width={14} height={14} />
        <span className="vcolor-title flex items-center ml-6px h-22px font-500 text-13px">一键清理</span>
      </Button>
    }

    <UrlDrawer 
      open={open} 
      currentUrl={null}
      onClose={() => setOpen(false)} 
    />
  </div>
}

export default memo(ButtonsList);