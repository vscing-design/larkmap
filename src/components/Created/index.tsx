import { useCallback, useState } from "react";
import Header from "./components/Header";
import ModeList from "./components/ModeList";
import FormCard from "./components/FormCard";
import ImportLoading from "./components/ImportLoading";
import { nanoid, readAsStringAsync, Title, traverseBookmarkData } from "@/utils/bookmarks";
import useBookmarksStore from "@/stores/store/useBookmarksStore";
import { sleep } from "@/utils";

const Created = () => {

  // 存储书签数据
  const updateBookmarkList = useBookmarksStore((state) => state.updateBookmarkList);

  const [mode, setMode] = useState<number>(1);
  const [loading, setLoading] = useState<number>(0); // loading状态 0 非loading 1 导入中 2 导入成功 3 导入失败

  const onCreated = useCallback(async(bookmarkName: string, bookmarkFile: Blob | null) => {
    try {
      // 导入文件
      setLoading(1);
      // 数据处理
      const newBookmarks: Title[] = [];
      const titleId = `title_${nanoid(5)}`;
      const titleNode = new Title(titleId, bookmarkName);
      if (bookmarkFile) {
        const fileData = await readAsStringAsync(bookmarkFile!);
        traverseBookmarkData(fileData, titleNode);
      }
      // 赋值
      newBookmarks.push(titleNode);
      // 等待
      await sleep(1000);
      // 保存数据
      updateBookmarkList(newBookmarks);
      setLoading(2);
    } catch (err) {
      console.log('%c [ err ]-38', 'font-size:13px; background:pink; color:#bf2c9f;', err)
      setLoading(3);
    }
  }, []);

  return <div>
    <Header />

    <div className="flex items-center justify-center vcolor-title letter-spacing-0 text-20px line-height-28px mt-40px">
      导入或创建书签库
    </div>

    <ModeList 
      mode={mode}
      setMode={setMode}
    />

    <FormCard
      mode={mode}
      onCreated={onCreated}
    />


    {
      loading > 0 && <ImportLoading 
        status={loading} 
        onConfirm={() => {
          setLoading(0);
        }}
      />
    }
  </div>
}

export default Created;