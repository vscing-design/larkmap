import { memo, useEffect, useRef, useState } from "react";
import { Button, Drawer } from "@/components/vscing-design";
import useTheme from "@/hooks/useTheme";
import { nanoid, Url } from "@/utils/bookmarks";
import dayjs from "dayjs";
import Images from "@/assets";
import { useBookmarksStore } from "@/stores";
import { cloneDeep } from "lodash-es";

interface IProps {
  open: boolean;
  currentUrl: Url | null;
  onClose: () => void;
}

const UrlDrawer = (props: IProps) => {

  const { open, currentUrl, onClose } = props;

  const { isDark } = useTheme();

  // 获取当前的书签夹
  const currentBookmark = useBookmarksStore(state => state.currentBookmark);
  // 文件夹列表
  const directoryList = useBookmarksStore(state => state.directoryList);
  // 当前选中文件夹下标
  const directoryIndexMap = useBookmarksStore(state => state.directoryIndexMap);
  // 获取当前的目录
  const currentDirectory = useBookmarksStore(state => state.currentDirectory);
  // 更新选中的目录
  const updateDirectoryList = useBookmarksStore(state => state.updateDirectoryList);

  // icon
  const [icon, setIcon] = useState<string>("");
  // 表单项
  const urlRef = useRef<HTMLInputElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const descRef = useRef<HTMLInputElement>(null);
  // 文件资源句柄
  const fileRef = useRef<Blob>(null);

  // 初始化
  useEffect(() => {
    if(open && currentUrl) {
      if (urlRef.current) {
        urlRef.current.value = currentUrl?.url ?? "";
      }
      if (nameRef.current) {
        nameRef.current.value = currentUrl?.name ?? "";
      }
      if (descRef.current) {
        descRef.current.value = currentUrl?.desc ?? "";
      }
      setIcon(currentUrl?.icon ?? "");
    }
  }, [open, currentUrl]);

  // 获取网站信息
  const getWebsiteInfo = () => {
    console.log('获取网站信息');
  }

  // 文件上传事件
  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    console.log('%c [ files ]-46', 'font-size:13px; background:pink; color:#bf2c9f;', files)
    if (files && files[0]) {
      // 将 File 对象设置为 field 的值
      fileRef.current = files[0];
      if (fileRef.current) {
        const fileSize = fileRef.current.size / 1024 / 1024; // Convert bytes to megabytes
        const fileType = fileRef.current.type;

        if (fileSize < 1 && (fileType === 'image/png' || fileType === 'image/jpeg')) {
          // File is less than 1MB and is a PNG or JPEG
          const reader = new FileReader();
          reader.onload = function (e) {
            console.log('%c [ e ]-58', 'font-size:13px; background:pink; color:#bf2c9f;', e)
            if (e.target && e.target.result) {
              setIcon(e.target.result as string);
            }
          };
          reader.readAsDataURL(fileRef.current);
        } else {
          alert('File must be less than 1MB and be a PNG or JPEG');
        }
      }

    }
  }

  // 取消事件
  const onCancel = () => {
    onClose && onClose();
  }

  // 提交事件
  const onSubmit = async () => {
    const url = new Url(
      `url_${nanoid(5)}`,
      nameRef.current?.value ?? "",
      descRef.current?.value ?? "",
      currentDirectory?.id ?? "",
      icon,
      urlRef.current?.value ?? "",
      `${dayjs().unix() ?? ""}`,
      `${dayjs().unix() ?? ""}`,
    );
    if (currentDirectory) {
      const index = directoryIndexMap[currentDirectory.id];
      const newDirectoryList = cloneDeep(directoryList);
      if(currentUrl?.id) {
        newDirectoryList[index].urls.forEach((item) => {
          if (item.id === currentUrl?.id) {
            item.name = url.name;
            item.desc = url.desc;
            item.icon = url.icon;
            item.url = url.url;
            item.lastModified = `${dayjs().unix() ?? ""}`;
          }
        })
      } else {
        newDirectoryList[index].urls.push(url);
      }
      updateDirectoryList(newDirectoryList, null);
    } else {
      const newUnassignedUrls = [...(currentBookmark?.unassignedUrls ?? [])];
      if(currentUrl?.id) {
        newUnassignedUrls.forEach((item) => {
          if (item.id === currentUrl?.id) {
            item.name = url.name;
            item.desc = url.desc;
            item.icon = url.icon;
            item.url = url.url;
            item.lastModified = `${dayjs().unix() ?? ""}`;
          }
        })
      } else {
        newUnassignedUrls.push(url);
      }
      updateDirectoryList(directoryList, newUnassignedUrls);
    }
    onCancel();
  }

  return <Drawer open={open} >
    <div className="w-100% h-100% box-border vbg-color-main vshadow-color-layout flex flex-col border border-solid vborder-color-default b-rounded-12px p-24px">
      <div className="flex-1">
        <div className="vcolor-title font-600 text-16px line-height-24px">添加网站</div>
        <div className="mt-32px">
          <div className="vcolor-title font-500 text-14px line-height-24px">网址</div>
          <div className="flex items-center box-border w-100% border border-solid vborder-color-default hover:vborder-color-active b-rounded-8px py-8px px-16px mt-12px">
            <input ref={urlRef} className="bg-transparent vcolor-title border-0 flex-1 font-400 text-14px line-height-24px outline-none" />
            <div onClick={() => getWebsiteInfo()} className="cursor-pointer vcolor-title flex-grow-0 font-500 text-14px line-height-24px">获取网站信息</div>
          </div>
        </div>
        <div className="mt-24px">
          <div className="vcolor-title font-500 text-14px line-height-24px">名称</div>
          <div className="flex items-center box-border w-100% border border-solid vborder-color-default hover:vborder-color-active b-rounded-8px py-8px px-16px mt-12px">
            <input ref={nameRef} className="bg-transparent vcolor-title border-0 flex-1 font-400 text-14px line-height-24px outline-none" />
          </div>
        </div>
        <div className="mt-24px">
          <div className="vcolor-title font-500 text-14px line-height-24px">描述<span className="vcolor-default font-400 text-13px line-height-20px ml-4px">(可选)</span></div>
          <div className="flex items-center box-border w-100% border border-solid vborder-color-default hover:vborder-color-active b-rounded-8px py-8px px-16px mt-12px">
            <input ref={descRef} className="bg-transparent vcolor-title border-0 flex-1 font-400 text-14px line-height-24px outline-none" />
          </div>
        </div>
        <div className="mt-24px">
          <div className="vcolor-title font-500 text-14px line-height-24px">图标</div>
          <div className="vcolor-default font-400 text-13px line-height-20px mt-4px">48*48px JPG/PNG 小于 1MB</div>
          <div className="flex items-center gap-16px mt-12px">
            <div className="flex flex-col justify-center items-center">
              <img className="w-48px h-48px" src={isDark ? Images.darkUrlsIcon : Images.lighitUrlsIcon} />
              <div className="vcolor-default font-400 text-12px line-height-20px mt-4px">默认</div>
            </div>
            <div className="flex flex-col justify-center items-center">
              <div className="cursor-pointer overflow-hidden relative flex justify-center items-center border border-dashed vborder-color-default b-rounded-8px w-48px h-48px">
                {icon ? <img className="cursor-pointer w-48px h-48px" src={icon} /> : <img className="cursor-pointer w-24px h-24px" src={isDark ? Images.darkUrlsIconAdd : Images.lighitUrlsIconAdd} />}
                <input type="file" onChange={(e) => onFileChange(e)} accept=".jpg, .png" className="cursor-pointer! absolute top-0 left-0 opacity-0 w-48px h-48px" />
              </div>
              <div className="vcolor-default font-400 text-12px line-height-20px mt-4px">上传</div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-end gap-12px h-40px">
        <Button onClick={() => onCancel()} className="vbg-color-subCard vcolor-title h-40px b-rounded-8px font-500 text-14px px-12px">取消</Button>
        <Button onClick={() => onSubmit()} className="vbg-color-button vcolor-dark h-40px b-rounded-8px font-500 text-14px px-12px">{currentUrl?.id ? "保存":"添加并继续"}</Button>
      </div>
    </div>
  </Drawer>
}

export default memo(UrlDrawer);