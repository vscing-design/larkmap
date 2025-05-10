import HeaderIcons from "@/components/common/HeaderIcons";
import Search from "../Search";
import Actions from "../Actions";

const Header = () => {
  return <div className="position-relative box-border w-100% h-72px flex justify-between items-center px-32px mb-16px">
    <Actions />
    <Search />
    <HeaderIcons />
  </div>
}

export default Header;