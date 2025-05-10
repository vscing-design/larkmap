import { useRef } from "react";
import Content from "./components/Content";
import Menu from "./components/Menu";
import { Context } from './Context';

const Manage = () => {

  // 管理组件的ref
  const manageRef = useRef<any>({
    // 是否可以移动Website 包含url和folder
    isWebsiteMove: false,
    // 是否可以移动Tree
    isMove: false,
    // 移动的元素句柄
    moveElem: null,
    // 移动的节点数据
    moveNode: null,
    // 移动的位置
    movePosition: null,
    // 预览元素
    previewElem: null,
  });

  return <Context.Provider value={{
    manageState: manageRef.current
  }}>
    <div className="flex">
      <Menu />
      <Content />
    </div>
  </Context.Provider>
}

export default Manage;