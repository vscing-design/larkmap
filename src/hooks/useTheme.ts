import { ThemeEnum } from "@/enums";
import { useAppStore } from "@/stores";
import { useEffect } from "react";

const useTheme = () => {

  const theme = useAppStore((state) => state.theme); // 仅订阅 theme
  const updateTheme = useAppStore((state: { updateTheme: any; }) => state.updateTheme);

  useEffect(() => {
    if(!theme) {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? ThemeEnum.DARK : ThemeEnum.LIGHT;
      document.documentElement.classList.toggle('dark', systemTheme === ThemeEnum.DARK);
      updateTheme(systemTheme);
    } else {
      document.documentElement.classList.toggle('dark', theme === ThemeEnum.DARK);
    }
  }, [theme]);

  const toggleTheme = (event: React.MouseEvent<HTMLButtonElement>, newTheme: ThemeEnum.DARK | ThemeEnum.LIGHT) => {
    const transition = document.startViewTransition(() => {
      document.documentElement.classList.toggle('dark', newTheme === ThemeEnum.DARK)
    })
    const x = event?.clientX || 0;
    const y = event?.clientY || 0;
    // 从点击点到窗口最远边缘的距离，这个距离即为圆的半径，用于确定一个圆形裁剪路径 (clip path) 的最大尺寸，以便覆盖整个视窗。
    // 勾股定理：a² + b² = c²
    const radius = Math.sqrt(Math.max(x, (window.innerWidth - x)) ** 2 + Math.max(y, (window.innerHeight - y)) ** 2)

    transition.ready.then(() => {
      // 实现过渡的过程 circle
      document.documentElement.animate(
        {
          clipPath: [
            `circle(0 at ${x}px ${y}px)`,
            `circle(${radius}px at ${x}px ${y}px)`,
          ]
        },
        {
          duration: 800,
          pseudoElement: '::view-transition-new(root)',
        }
      )
      updateTheme(newTheme);
    })
  }

  return {
    isDark: theme === ThemeEnum.DARK,
    toggleTheme
  }
}

export default useTheme;