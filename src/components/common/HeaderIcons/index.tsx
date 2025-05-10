import { Moon, Sun } from "lucide-react";
import useTheme from "@/hooks/useTheme";
import Images from "@/assets";
import { Icons } from "@/assets/icons";
import { ThemeEnum } from "@/enums";
import { Button } from "@/components/vscing-design";

const HeaderIcons = () => {

  const { isDark, toggleTheme } = useTheme();

  return <div className="flex gap-[16px]">
    <Button className="left-icon-item">
      <img src={Images.beer} width={16} />
    </Button>
    <Button className="left-icon-item">
      <Icons.gitHub width={16} />
    </Button>
    <Button className="left-icon-item" onClick={(event: React.MouseEvent<HTMLButtonElement>) => toggleTheme(event, isDark ? ThemeEnum.LIGHT : ThemeEnum.DARK)}>
      <Moon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Sun className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
    </Button>
  </div>
}

export default HeaderIcons;