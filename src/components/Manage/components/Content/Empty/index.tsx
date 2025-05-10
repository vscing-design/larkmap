import Images from "@/assets";
import useTheme from "@/hooks/useTheme";

const Empty = () => {

  const { isDark } = useTheme();
  
  return <div className="w-100% box-border flex-1 flex items-center justify-center">
    <div className="flex flex-col items-center">
      <img src={isDark ? Images.darkEmpty : Images.lightEmpty} className="w-80px h-80px mb-8px" />
      <div className="vcolor-default font-normal font-400 text-12px line-height-20px">暂无网站</div>
    </div>
  </div>
}

export default Empty;