import Images from "@/assets";
import { Button } from "@/components/vscing-design";
import useTheme from "@/hooks/useTheme";
import { useState } from "react";

const radioList = [
  {
    value: "1",
    label: "转移至未分类"
  },
  {
    value: "2",
    label: "直接删除"
  }
]

interface IProps {
  onConfirm: (value: any) => void;
  onCancel: () => void;
}

const DisbandTree = (props: IProps) => {

  const { onConfirm, onCancel } = props;

  const { isDark } = useTheme();
  // 单选
  const [radioValue, setRadioValue] = useState("1");

  const handleConfirm = () => {
    onConfirm && onConfirm(radioValue);
  }

  return <div className="vbg-color-main vshadow-color-layout border border-solid vborder-color-default p-24px b-rounded-12px">
  <div className="vcolor-title flex items-center gap-8px h-24px text-16px font-600">
    <img src={isDark ? Images.darkDisabled : Images.lighitDisabled} className="w-20px h-20px" />
    <div>重命名文件夹</div>
  </div>
  <div className="vcolor-default w-352px mt-8px font-400 text-13px line-height-20px">该操作无法撤销，解散该文件夹的同时，将文件夹中的网站：</div>

  <div className="mt-32px flex flex-col gap-8px">
    {
      radioList.map((item) => {
        return <div key={item.value} onClick={() => setRadioValue(item.value)} className="flex h-20px items-center gap-8px">
          {
            radioValue === item.value ? 
            <img src={isDark? Images.darkSelect : Images.lighitSelect} className="w-14px h-14px" /> : 
            <img src={isDark? Images.darkSelected : Images.lighitSelected} className="w-14px h-14px" />
          }
          <div className="vcolor-title font-500 text-13px line-height-20px">{item.label}</div>
        </div>
      })
    }
  </div>
  
  <div className="mt-32px flex justify-end items-center gap-12px">
    <Button onClick={() => onCancel && onCancel()} className="vbg-color-subCard vcolor-title font-500 text-14px px-16px py-8px line-height-24px b-rounded-8px">取消</Button>
    <Button onClick={() => handleConfirm() } className="vbg-color-button vcolor-dark font-500 text-14px px-16px py-8px line-height-24px b-rounded-8px">保存</Button>
  </div>
</div>
}

export default DisbandTree;