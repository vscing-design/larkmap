import HeaderLogo from "@/components/common/HeaderLogo";
import HeaderIcons from "@/components/common/HeaderIcons";

function Header() {

  return <div className="flex justify-between items-center max-w-[1440px] w-full h-[72px] mx-auto pl-[24px] pr-[32px]">
    <HeaderLogo />
    <HeaderIcons />
  </div>
}

export default Header;