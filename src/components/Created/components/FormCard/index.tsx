import Images from "@/assets";
import { Button } from "@/components/vscing-design";
import useTheme from "@/hooks/useTheme";
import { memo, useRef, useState } from "react";

interface IProps {
  mode: number;
  onCreated?: (bookmarksName: string, bookmarksFile: Blob | null) => void;
}

// TODO: 块 box-shadow: 0px 4px 12px 0px #FFFFFF inset;
const FormCard = (props: IProps) => {

  const { mode, onCreated } = props;

  const { isDark } = useTheme();

  const [validate, setValidate] = useState<string[]>([]); // 验证信息
  const [fileName, setFileName] = useState<string>(''); // 文件名
  // 输入框资源句柄
  const inputRef = useRef<HTMLInputElement>(null);
  // 文件资源句柄
  const fileRef = useRef<Blob>(null);

  // 输入框事件
  const onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;
    if (inputValue) {
      setValidate(validate.filter((item) => item !== 'input'));
    }
  }

  // 文件上传事件
  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files[0]) {
      // 将 File 对象设置为 field 的值
      fileRef.current = files[0];
      if (validate.includes('upload')) {
        setValidate(validate.filter((item) => item!== 'upload'));
      }
      setFileName(files[0].name);
    }
  }

  // 提交事件
  const onSubmit = async () => {
    const bookmarksName = inputRef.current?.value || '';
    const newValidate = [];
    if (!bookmarksName) {
      newValidate.push('input');
    }
    if (mode === 1 && !fileRef.current) {
      newValidate.push('upload');
    }
    if(newValidate.length > 0) {
      setValidate(newValidate);
      return;
    }
    onCreated && onCreated(bookmarksName, fileRef.current);
  }

  return <div className="flex items-center justify-center mt-24px">
    <div className="vbg-color-card border border-solid vborder-color-default b-rounded-12px px-64px py-48px">
      <div className="form-item">
        <div className="form-item-title">书签库名字</div>
        <input ref={inputRef} onChange={(e) => onInputChange(e)} min={1} max={50} className="form-item-input focus:vborder-color-active" placeholder="如：设计导航" />
        {
          validate.includes('input') && <div className="form-item-input-error">名称不能为空</div>
        }
      </div>
      <div className={`form-item mt-24px ${mode === 2 ? 'hidden':''}`}>
        <div className="form-item-title">书签文件</div>
        <div className="form-item-upload hover:vborder-color-active">
          <input type="file" onChange={(e) => onFileChange(e)} accept="text/html, .html" className="position-absolute top-0 left-0 opacity-0 w-360px h-120px cursor-pointer" />
          <img className="w-24px h-24px" src={isDark ? Images.darkAdd : Images.lightAdd} />
          <div className="vcolor-desc mt-8px font-400 text-12px line-height-20px">导入 .html 格式的书签文件</div>
        </div>
        {
          fileName && <div className="vcolor-desc font-400 text-13px line-height-20px">已导入：{fileName}</div>
        }
        {
          validate.includes('upload') && <div className="form-item-input-error">书签文件不能为空</div>
        }
      </div>
      <Button onClick={() => onSubmit()} className="flex items-center justify-center vbg-color-button vcolor-dark b-rounded-8px w-360px h-40px mt-32px">立即{mode === 1 ? "生成":"创建"}</Button>
    </div>
  </div>
}

export default memo(FormCard);