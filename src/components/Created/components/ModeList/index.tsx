import Images from "@/assets";
import { getModeList } from "./config";
import useTheme from "@/hooks/useTheme";
import { memo, useMemo } from "react";

// TODO: 每块 box-shadow: 0px 4px 12px 0px #FFFFFF inset; 丝滑切换图标

interface IProps {
  mode: number;
  setMode: (mode: number) => void;
}
const ModeList = (props: IProps) => {

  const { mode, setMode } = props;

  const { isDark } = useTheme();

  const modeList = useMemo(() => {
    return getModeList(isDark);
  }, [isDark]);

  return <div className="flex items-center justify-center gap-16px mt-48px">
    {
      modeList.map((item) => {
        const isActive = mode === item.key;
        return <div key={item.key} onClick={() => setMode(item.key)} className={`model-list-item ${isActive ? 'vbg-color-card vborder-color-active position-relative' : ''}`}>
          <img src={item.icon} className="w-20px h-20px" />
          <div className={`font-400 mt-12px text-12px line-height-20px letter-spacing-0 ${isActive ? 'vcolor-title':'vcolor-default'}`}>{item.title}</div>
          {isActive && <div className="flex items-center justify-center vbg-color-subCard position-absolute right-0 top-0 w-24px h-20px b-rounded-tr-8px b-rounded-bl-8px">
            {
              isDark ? <img src={Images.darkCheck} className="w-16px h-16px" /> :
              <img src={Images.lightCheck} className="w-16px h-16px" />
            }
          </div>}
        </div>
      })
    }
  </div>
}

export default memo(ModeList);