import Images from "@/assets";
import useTheme from "@/hooks/useTheme";
import useBookmarksStore from "@/stores/store/useBookmarksStore";

const Unclassified = () => {

  const { isDark } = useTheme();

  // 当前选中文件夹
  const currentDirectory = useBookmarksStore((state) => state.currentDirectory);
  // 设置当前选中文件夹
  const updateCurrentDirectory = useBookmarksStore((state) => state.updateCurrentDirectory);

  return <div onClick={() => updateCurrentDirectory(null)} className={`${!currentDirectory ? "vbg-color-subCard" : ""} box-border cursor-pointer border border-solid border-transparent flex items-center border-rd-8px hover:vbg-color-subCard h-44px mt-4px px-8px`}>
    <div className="w-14px h-14px mr-2px"></div>
    <img className="w-16px h-16px mr-8px" src={isDark ? Images.darkUnclassified : Images.lighitUnclassified} />
    <div className={`vcolor-subTitle font-500 text-14px line-height-20px`}>未分类</div>
  </div>
}

export default Unclassified;