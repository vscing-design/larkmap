import HeaderLogo from "@/components/common/HeaderLogo";
import Unclassified from "./Unclassified";

const Header = () => {

  return <div className="w-100%">
    {/* logo */}
    <div className="box-border w-100% p-24px">
      <HeaderLogo />
    </div>
    {/* 书签组 */}
    {/* 未分类 */}
    <Unclassified />
  </div>
}

export default Header;