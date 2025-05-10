import Images from "@/assets";
import useTheme from "@/hooks/useTheme";

const Tips = () => {

  const { isDark } = useTheme();

  return <div className="w-100% box-border px-16px vbg-color-card flex items-center gap-8px h-48px b-rounded-8px mb-16px">
    <img src={isDark ? Images.darkTips : Images.hightTips} className="w-16px h-16px" />
    <div className="text-13px font-normal font-400 line-height-22px">未分类中的网站不会对外展示，若需展示请将其移动到我的书签中。</div>
  </div>
}

export default Tips;