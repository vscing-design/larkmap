import Images from "@/assets";
import { Button } from "@/components/vscing-design";
import useTheme from "@/hooks/useTheme";
import { useMemo } from "react";

interface IProps {
  status: number;
  onConfirm?: () => void;
}

interface IResult {
  icon: string;
  desc: string;
  btnText: string;
}

// TODO: box-shadow: 0px 12px 24px -5px #00000029; box-shadow: 0px 4px 10px -5px #0000000F; box-shadow: 0px 8px 24px 0px #F4F4F5A3 inset;
const ImportLoading = (props: IProps) => {

  const { status, onConfirm } = props;

  const { isDark } = useTheme();

  const importResult: Record<number, IResult> = useMemo(() => {
    return {
      1: {
        icon: isDark ? Images.darkImportLoading : Images.lightImportLoading,
        desc: "正在生成书签库，请稍后",
        btnText: "取消生成"
      },
      2: {
        icon: isDark ? Images.darkImportSuccess : Images.lightImportSuccess,
        desc: "书签库已生成",
        btnText: "立即查看"
      },
      3: {
        icon: isDark ? Images.darkImportFail : Images.lightImportFail,
        desc: "书签库生成失败，请检查书签文件后重试",
        btnText: "我知道啦"
      }
    }
  }, [isDark]);

  const result = importResult[status];

  return <div className="vmask-color-main flex items-center justify-center position-fixed top-0 left-0 w-100vw h-100vh vscing-backdrop-filter-blur-16">
    <div className="vbg-color-main flex flex-col items-center justify-center border border-solid vborder-color-default w-400px h-340px b-rounded-12px">
      <div className="flex items-center justify-center vgradient-color-card border-rd-50% w-64px h-64px">
        <img src={result['icon']} className="w-24px h-24px" />
      </div>
      <div className="vcolor-default font-400 letter-spacing-0 text-14px line-height-20px mt-16px">{result['desc']}</div>
      <Button onClick={() => onConfirm && onConfirm()} className="vbg-color-subCard vcolor-title flex items-center justify-center mt-40px px-16px py-8px b-rounded-8px font-500 letter-spacing-0 text-14px line-height-24px">{result['btnText']}</Button>
    </div>
  </div>
}

export default ImportLoading;