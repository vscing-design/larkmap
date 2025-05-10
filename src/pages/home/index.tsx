import { useEffect, useState } from "react";
import { Loading } from "@/components/vscing-design";
import Created from "@/components/Created";
import useBookmarksStore from "@/stores/store/useBookmarksStore";
import Manage from "@/components/Manage";

const Home = () => {

  // 获取书签库列表
  const bookmarkList = useBookmarksStore((state) => state.bookmarkList);
  // 获取选中书签库
  const currentBookmark = useBookmarksStore((state) => state.currentBookmark);
  // 更新选中书签库
  const updateCurrentBookmark = useBookmarksStore((state) => state.updateCurrentBookmark);

  // 0 加载中 1 创建页 2 管理页
  const [status, setStatus] = useState<number>(0);

  // 初始化状态
  useEffect(() => {
    if (bookmarkList.length > 0) {
      !currentBookmark && updateCurrentBookmark(bookmarkList[0]);
      setTimeout(() => {
        setStatus(2);
      }, 1000);
    } else {
      setTimeout(() => {
        setStatus(1);
      }, 1000);
    }
  }, [bookmarkList, currentBookmark])

  return <>
    {status === 0 && <Loading />}
    {status === 1 && <Created />}
    {status === 2 && <Manage />}
  </>
}

export default Home;