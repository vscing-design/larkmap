import useBookmarksStore from "@/stores/store/useBookmarksStore";
import { Directory, nanoid } from "@/utils/bookmarks";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
// import { cloneDeep } from "lodash-es";
import TreeNode from "./TreeNode";
import { Context } from "@/components/Manage/Context";
import { TreeContext } from "./TreeContext";
import dayjs from "dayjs";

const Tree = () => {

  const { manageState } = useContext(Context);
  console.log('%c [ manageState ]-10', 'font-size:13px; background:pink; color:#bf2c9f;', manageState)

  // 获取当前的书签夹
  const currentBookmark = useBookmarksStore(state => state.currentBookmark);
  // 文件夹列表
  const directoryList = useBookmarksStore(state => state.directoryList);
  // 当前选中文件夹下标
  const directoryIndexMap = useBookmarksStore(state => state.directoryIndexMap);
  // 设置文件夹列表
  const updateDirectoryList = useBookmarksStore(state => state.updateDirectoryList);

  // 展开的列表
  const [expandList, setExpandList] = useState<string[]>(["0"]);

  // 获取Tree数据源
  const treeData = useMemo(() => {
    const tree: Directory[] = [];
    if(!currentBookmark) return tree;
    const root = new Directory("0", "我的书签", "", "", "");
    root.children = currentBookmark.directorys;
    root.urls = currentBookmark.unassignedUrls;
    tree.push(root);
    return tree;
  }, [currentBookmark]);

  // 改变数据源
  const onChangeTree = useCallback((moveNode: Directory, targetNode: Directory, position: number) => {
    console.log('%c [ prevNode, nextNode ]-37', 'font-size:13px; background:pink; color:#bf2c9f;', 
      moveNode, targetNode, position);

    // 查找被移动元素的索引
    const moveIndex = directoryIndexMap[moveNode.id]!;
    // 查找目标元素的索引
    const targetIndex = directoryIndexMap[targetNode.id]!;

    // 移除被移动元素
    const newDirectoryList = [...directoryList];
    newDirectoryList.splice(moveIndex, 1);

    // 判断方位
    moveNode.children = [];
    moveNode.directoryId = targetNode.directoryId;
    switch (position) {
      case 1:
        // 插入到目标节点之前
        newDirectoryList.splice(targetIndex, 0, moveNode);
        break;
      case 2:
        // prevNode放置在node里面第一个，并移除prevNode数据
        moveNode.directoryId = targetNode.id;
        newDirectoryList.push(moveNode);
        break;
      case 3:
        // 插入到目标节点之后
        newDirectoryList.splice(targetIndex + 1, 0, moveNode);
        break;
    }
    updateDirectoryList(newDirectoryList, null);
  }, []);

  // 鼠标移动相关
  useEffect(() => {
    console.log('%c [ dayjs() ]-75', 'font-size:13px; background:pink; color:#bf2c9f;', dayjs().valueOf())
    // 鼠标移动事件
    const handleMouseMove = (e: any) => {
      if (manageState.isMove && manageState.previewElem) {
        manageState.previewElem.style.transform = `translate(${e.pageX}px, ${e.pageY}px)`;
      }
    }

    // 鼠标释放事件
    const handleMouseUp = () => {
      if (manageState.isMove) {
        // 移动结束
        manageState.isMove = false;
        manageState.moveElem = null;
        manageState.moveNode = null;
        manageState.movePosition = null;
        if (manageState.previewElem) {
          document.body.removeChild(manageState.previewElem);
          manageState.previewElem = null;
        }
      }
    }

    // 上下文菜单事件
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault(); // 阻止上下文菜单的显示
      handleMouseUp(); // 触发鼠标释放事件
    }

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('contextmenu', handleContextMenu);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('contextmenu', handleContextMenu);
      manageState.previewElem && document.body.removeChild(manageState.previewElem);
    };
  }, []);

  // 文件夹列表改变
  const onDirectoryChange = useCallback((modelType: number, node: Directory, value: string) => {
    console.log('%c [ modelType, value ]-118', 'font-size:13px; background:pink; color:#bf2c9f;', modelType, value);
    const newDirectoryList = [...directoryList];
    const newUnassignedUrls = [...currentBookmark?.unassignedUrls || []];
    if(modelType === 1) {
      // 新增
      const newDirectory: Directory = new Directory(`folder_${nanoid(5)}`, value, "", `${dayjs().unix() ?? ""}`, `${dayjs().unix() ?? ""}`);
      newDirectoryList.push(newDirectory);
    } else if (modelType === 2) {
      // 重命名
      const directoryIndex: number = directoryIndexMap[node.id]!;
      newDirectoryList[directoryIndex].name = value;
    } else if (modelType === 3) {
      // 解散
      const directoryIndex: number = directoryIndexMap[node.id]!;
      newUnassignedUrls.push(...node.urls);
      newDirectoryList.splice(directoryIndex, 1);
    }
    updateDirectoryList(newDirectoryList, newUnassignedUrls);
  }, [currentBookmark, directoryList, directoryIndexMap, updateDirectoryList]);

  return <TreeContext.Provider value={{
    expandList: expandList,
    onDirectoryChange: onDirectoryChange,
    setExpandList: setExpandList,
    onChangeTree: onChangeTree
  }}>
    <div className="box-border flex-1 w-100% px-8px">
      {(treeData || []).map((node: Directory) => (
        <TreeNode 
          key={node.id} 
          level={0}
          node={node}
        />
      ))}
    </div>
  </TreeContext.Provider>
}

export default Tree;