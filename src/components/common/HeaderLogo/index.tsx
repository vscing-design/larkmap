import Images from "@/assets";
import useTheme from "@/hooks/useTheme";

const HeaderLogo = () => {

  const { isDark } = useTheme();

  return <div className="w-[122px] h-[24px]">
    <img className="w-100% h-100%" src={isDark ? Images.darkLogo : Images.lightLogo} />
  </div>
}

export default HeaderLogo;