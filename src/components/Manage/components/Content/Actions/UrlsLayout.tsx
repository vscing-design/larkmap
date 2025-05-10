import { memo, useMemo, useState } from "react";
import Images from "@/assets";
import { Button } from "@/components/vscing-design";
import useTheme from "@/hooks/useTheme";
import { useBookmarksStore } from "@/stores";

const UrlsLayout = () => {

  // 布局模式
  const layoutMode = useBookmarksStore(state => state.layoutMode);
  const updateLayoutMode = useBookmarksStore(state => state.updateLayoutMode);

  const { isDark } = useTheme();

  // 布局模式切换
  const [showLayout, setShowLayout] = useState<boolean>(false);

  // 布局模式列表
  const layoutList = useMemo(() => {
    return [
      {
        icon: layoutMode === 1 ? (isDark ? Images.darkLayout11 : Images.lightLayout11) : (isDark ? Images.darkLayout1 : Images.lightLayout1),
        value: 1
      },
      {
        icon: layoutMode === 2 ? (isDark ? Images.darkLayout21 : Images.lightLayout21) : (isDark ? Images.darkLayout2 : Images.lightLayout2),
        value: 2
      },
      {
        icon: layoutMode === 3 ? (isDark ? Images.darkLayout31 : Images.lightLayout31) : (isDark ? Images.darkLayout3 : Images.lightLayout3),
        value: 3
      }
    ]
  }, [layoutMode, isDark]);

  return <Button className="relative left-icon-item" onClick={() => setShowLayout(!showLayout)}>
    <img src={isDark ? Images.darkLists : Images.lightLists} width={16} />
    {showLayout && <div className="vbg-color-main border border-solid vborder-color-default vshadow-color-layout flex flex-col items-center b-rounded-8px p-8px gap-8px absolute z-1 top-44px left-50% transform-translate-x--50%">
      {
        layoutList.map((item) => {
          return <div key={item.value} onClick={() => updateLayoutMode(item.value)}>
            <img src={item.icon} className="w-56px h-40px" />
          </div>
        })
      }
    </div>}
  </Button>
}

export default memo(UrlsLayout);