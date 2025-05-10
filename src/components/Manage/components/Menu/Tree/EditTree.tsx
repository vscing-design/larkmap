import { Button } from "@/components/vscing-design";
import { memo, useRef } from "react";

interface IProps {
  value: string;
  onConfirm: (value: any) => void;
  onCancel: () => void;
}

const EditTree = (props: IProps) => {

  const { onConfirm, onCancel } = props;

  const inputRef = useRef<HTMLInputElement>(null);

  const handleConfirm = () => {
    const value = inputRef.current?.value;
    if (value) {
      onConfirm && onConfirm(value);
    }
  }

  return <div className="vbg-color-main vshadow-color-layout border border-solid vborder-color-default p-24px b-rounded-12px">
    <div className="vcolor-title text-16px font-600 line-height-24px">重命名文件夹</div>
    <input ref={inputRef} placeholder="输入文件夹名称" className="mt-32px w-320px form-item-input focus:vborder-color-active" />
    <div className="mt-32px flex justify-end items-center gap-12px">
      <Button onClick={() => onCancel && onCancel()} className="vbg-color-subCard vcolor-title font-500 text-14px px-16px py-8px line-height-24px b-rounded-8px">取消</Button>
      <Button onClick={() => handleConfirm() } className="vbg-color-button vcolor-dark font-500 text-14px px-16px py-8px line-height-24px b-rounded-8px">保存</Button>
    </div>
  </div>
}

export default memo(EditTree);