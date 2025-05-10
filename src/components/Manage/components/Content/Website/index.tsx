import { useBookmarksStore } from "@/stores";
import { Directory, Url } from "@/utils/bookmarks";
import { useContext, useMemo } from "react";
import { Context } from "@/components/Manage/Context";
import Tips from "../Tips";
import Directorys from "../Directorys";
import Urls from "../Urls";
import Empty from "../Empty";
import { cloneDeep } from "lodash-es";

const dragThreshold = 3;

const Website = () => {

  const { manageState } = useContext(Context);

  // 获取当前的书签夹
  const currentBookmark = useBookmarksStore(state => state.currentBookmark);
  // 文件夹列表
  const directoryList = useBookmarksStore(state => state.directoryList);
  // 获取当前的目录
  const currentDirectory = useBookmarksStore(state => state.currentDirectory);
  // 获取当前选中的目录
  const selectedMap = useBookmarksStore(state => state.selectedMap);
  // 更新选中的目录
  const updateDirectoryList = useBookmarksStore(state => state.updateDirectoryList);

  // 获取当前目录的所有书签
  const directoryChildren = useMemo(() => {
    if(!currentDirectory) return [];
    return currentDirectory.children;
  }, [currentDirectory]);

  // 获取当前目录的所有url
  const urlsList = useMemo(() => {
    if(!currentDirectory) {
      return currentBookmark?.unassignedUrls || [];
    }
    return currentDirectory.urls;
  }, [currentBookmark, currentDirectory]);

  const onMouseDown = (e: any, innerHTML: string) => {
    if (Object.keys(selectedMap).length === 0) return;
    // 标记
    manageState.isWebsiteMove = false;
    // 记录鼠标按下的位置
    let dragX = e.pageX, dragY = e.pageY;

    // 创建拖动预览元素
    manageState.previewElem = document.createElement('div');
    manageState.previewElem.className = `position-fixed top-0 left-0 pointer-events-none z-1000 p-14px`;
    manageState.previewElem.innerHTML = innerHTML;

    // 移动位置
    manageState.previewElem.style.transform = `translate(${dragX}px, ${dragY}px)`;

    // 鼠标移动事件
    const onMouseMove = (moveEvent: any) => {
      const dx = Math.abs(moveEvent.pageX - dragX);
      const dy = Math.abs(moveEvent.pageY - dragY);

      console.log('%c [ manageState.isWebsiteMove, y ]-65', 'font-size:13px; background:pink; color:#bf2c9f;', manageState.isWebsiteMove, dx >= dragThreshold || dy >= dragThreshold)
      
      if (!manageState.isWebsiteMove && (dx >= dragThreshold || dy >= dragThreshold)) {
        manageState.isWebsiteMove = true;
        document.body.appendChild(manageState.previewElem);
      }
      
      if (manageState.isWebsiteMove) {
        dragX = moveEvent.pageX;
        dragY = moveEvent.pageY;
        // 移动位置
        if (manageState.previewElem) {
          manageState.previewElem.style.transform = `translate(${dragX}px, ${dragY}px)`;
        }
      }
    };

    // 鼠标释放事件
    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('contextmenu', onContextMenu);
      
      if (!manageState.isWebsiteMove) return;
      
      const targetFolder: any = document.elementFromPoint(dragX!, dragY!)?.closest('.treeNode');
      
      if (targetFolder) {
        const newDirectoryList = cloneDeep(directoryList);
        console.log(`将 ${Object.keys(selectedMap)} 移动到文件夹 ${targetFolder.dataset.id}`, newDirectoryList);
        // 根据目标文件夹的ID进行分类操作
        newDirectoryList.forEach((node: Directory) => {
          if (node.id === targetFolder.dataset.id) {
            console.log('%c [  ]-95', 'font-size:13px; background:pink; color:#bf2c9f;', )
            Object.values(selectedMap).forEach((value: Url | Directory) => {
              console.log('%c [  ]-97', 'font-size:13px; background:pink; color:#bf2c9f;', value)
              if (value.id.includes('url_')) {
                console.log('%c [  ]-99', 'font-size:13px; background:pink; color:#bf2c9f;', )
                node.urls.push(value as Url);
              } else {
                node.children.push(value as Directory);
              }
            })
          }
        })
        // 删除url列表中的url
        const newAddUnassignedUrl = (currentBookmark?.unassignedUrls || []).filter(url => {
          return !selectedMap[url.id];
        });
        console.log('%c [ newDirectoryList ]-108', 'font-size:13px; background:pink; color:#bf2c9f;', newDirectoryList)
        // 重新构建目录树
        updateDirectoryList(newDirectoryList, newAddUnassignedUrl);
      }
      
      // 清理状态
      manageState.isWebsiteMove = false;
      if (manageState.previewElem) {
        document.body.removeChild(manageState.previewElem);
        manageState.previewElem = null;
      }
    };

    // 上下文菜单事件
    const onContextMenu = (e: MouseEvent) => {
      e.preventDefault(); // 阻止上下文菜单的显示
      onMouseUp(); // 触发鼠标释放事件
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
    document.addEventListener('contextmenu', onContextMenu);
  }

  return currentBookmark?.unassignedUrls?.length === 0 && (urlsList?.length === 0 && directoryChildren.length === 0) ? <Empty /> : <div className="w-100% box-border flex-1 overflow-y-auto flex flex-col items-start px-32px">
    {(currentBookmark?.unassignedUrls || []).length > 0 && !currentDirectory && <Tips />}
    {currentDirectory && <Directorys 
      currentDirectory={currentDirectory}
      directoryChildren={directoryChildren} 
      selectedMap={selectedMap}
      onMouseDown={onMouseDown}
    />}
    <Urls 
      currentDirectory={currentDirectory}
      urlsList={urlsList} 
      selectedMap={selectedMap}
      onMouseDown={onMouseDown}
    />
  </div>
}

export default Website;