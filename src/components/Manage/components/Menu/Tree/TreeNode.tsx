import Images from "@/assets";
import useTheme from "@/hooks/useTheme";
import { Directory } from "@/utils/bookmarks";
import { useCallback, useContext, useState } from "react";
import { useBookmarksStore } from "@/stores";
import { Context } from "@/components/Manage/Context";
import { Model } from "@/components/vscing-design";
import { TreeContext } from "./TreeContext";
import "./index.less";
import AddTree from "./AddTree";
import EditTree from "./EditTree";
import DisbandTree from "./DisbandTree";

interface IProps {
  level: number;
  node: Directory;
}

const moveInterval = 8;

const TreeNode = (props: IProps) => {

  const { level, node } = props;
  const { id, name, children } = node;

  // 是否暗黑
  const { isDark } = useTheme();
  // 当前选中文件夹
  const currentDirectory = useBookmarksStore((state) => state.currentDirectory);
  // 设置当前选中文件夹
  const updateCurrentDirectory = useBookmarksStore((state) => state.updateCurrentDirectory);
  // 全局事件
  const { manageState } = useContext(Context);
  const { expandList, onDirectoryChange, setExpandList, onChangeTree } = useContext(TreeContext);
  // 更多操作管理
  const [moreShow, setMoreShow] = useState(false); // false 不显示，true 显示
  // 弹窗类型
  const [modelType, setModelType] = useState(0); // 0 不显示，1 新增，2 重命名，3 解散

  // 展开收起
  const onExpand = useCallback(() => {
    const newExpandList = [...expandList];
    if (newExpandList.includes(id)) {
      newExpandList.splice(newExpandList.indexOf(id), 1);
    } else {
      newExpandList.push(id);
    }
    setExpandList(newExpandList);
  }, [id, expandList, setExpandList]);

  // 移动开关
  const onMove = useCallback(() => {
    manageState.isMove = true;
  }, []);

  // 点击事件
  const onClick = useCallback(() => {
    if(!manageState.isMove) {
      updateCurrentDirectory(node);
    }
  }, [manageState, node]);

  // 更多操作
  const onMore = useCallback((event: any) => {
    event.stopPropagation();
    setMoreShow(!moreShow);
  }, [moreShow]);

  // mousedown 事件在定点设备（如鼠标或触摸板）按钮在元素内按下时，会在该元素上触发。
  const onMouseDown = (e: any) => {
    e.preventDefault();
    if (manageState.isMove && id !== "0") {
      if (id && !expandList.includes(id)) {
        onExpand();
      }

      manageState.moveElem = e.currentTarget;
      manageState.moveNode = node;
      // 创建拖动预览元素
      manageState.previewElem = document.createElement('div');
      manageState.previewElem.style.width = `${e.currentTarget.offsetWidth}px`;
      manageState.previewElem.style.height = `${e.currentTarget.offsetHeight}px`;
      manageState.previewElem.style.paddingLeft = `${16 * level}px`;
      manageState.previewElem.className = 'vbg-color-subCard flex items-center position-fixed top-0 left-0 pointer-events-none z-1000 opacity-80 border-rd-8px w-224px h-44px';
      manageState.previewElem.innerHTML = `
        <img src="${isDark ? Images.darkMenuMove : Images.lightMenuMove}" class="treeNodeMove cursor-move position-absolute left-2px w-12px h-12px mr-2px" />
        <div class="w-14px h-14px mr-2px"></div>
        <img class="w-16px h-16px  mr-8px" src="${isDark ? Images.darkMoveFolder : Images.lightMoveFolder}" />
        <div class="font-500 text-14px line-height-20px vcolor-subTitle">${name}</div>
      `;
      document.body.appendChild(manageState.previewElem);
      // 移动位置
      manageState.previewElem.style.transform = `translate(${e.pageX}px, ${e.pageY}px)`;
    }
  }

  // mousemove 事件在定点设备（通常指鼠标）的光标在元素内移动时，会在该元素上触发。
  const onMouseMove = (e: any) => {
    if (manageState.isMove && id !== "0" && e.currentTarget !== manageState.moveElem) {
      if (id && !expandList.includes(id)) {
        onExpand();
      }

      const rect = e.currentTarget.getBoundingClientRect();
      const y = e.clientY;

      if (y < rect.top + moveInterval) {
        manageState.movePosition = 1;
      } else if (y > rect.bottom - moveInterval) {
        manageState.movePosition = 3;
      } else if (!(y < rect.top + moveInterval || y > rect.bottom - moveInterval)) {
        manageState.movePosition = 2;
      }

      e.currentTarget.classList.toggle('move-select-top', y < rect.top + moveInterval);
      e.currentTarget.classList.toggle('move-select-bottom', y > rect.bottom - moveInterval);
      e.currentTarget.classList.toggle('move-select', !(y < rect.top + moveInterval || y > rect.bottom - moveInterval));
    } else if (manageState.isWebsiteMove && id !== "0") {
      if (id && !expandList.includes(id)) {
        onExpand();
      }
      const rect = e.currentTarget.getBoundingClientRect();
      const y = e.clientY;
      e.currentTarget.classList.toggle('move-select', y >= rect.top || y <=  rect.bottom);
    }
  }

  // mouseout 事件在定点设备（通常是鼠标）移动至元素或其子元素之外时，会在该元素上触发。
  const onMouseOut = (e: any) => {
    if (manageState.isMove && e.currentTarget !== manageState.moveElem) {
      e.currentTarget.classList.remove('move-select-top', 'move-select-bottom', 'move-select');
      manageState.movePosition = 0;
    } else if (manageState.isWebsiteMove) {
      e.currentTarget.classList.remove('move-select');
    }
  }

  // mousedown 事件在定点设备（如鼠标或触摸板）按钮在元素内释放时，在该元素上触发。
  const onMouseUp = (e: any) => {
    // 数据处理
    if (manageState.isMove && e.currentTarget !== manageState.moveElem 
      && manageState.moveNode.id && id && manageState.moveNode.id !== id) {
      e.currentTarget.classList.remove('move-select-top', 'move-select-bottom', 'move-select');
      onChangeTree(manageState.moveNode, node, manageState.movePosition);
    } else if (manageState.isWebsiteMove) {
      e.currentTarget.classList.remove('move-select');
    }
  }

  // 调起弹窗
  const onModel = (event: any, newModelType: number) => {
    event.stopPropagation();
    setMoreShow(false);
    setModelType(newModelType);
  }

  // 确认
  const onConfirm = (value: string) => {
    console.log('%c [ value ]-159', 'font-size:13px; background:pink; color:#bf2c9f;', value)
    onDirectoryChange(modelType, node, value);
    setModelType(0);
  }

  // 取消
  const onCancel = () => {
    setModelType(0);
  }

  return <>
    <div 
      onClick={onClick}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseOut={onMouseOut}
      onMouseUp={onMouseUp} 
      data-id={id}
      className={`${currentDirectory?.id === id ? "vbg-color-subCard":""} treeNode relative box-border cursor-pointer border border-solid border-transparent flex items-center justify-between border-rd-8px hover:vbg-color-subCard h-44px mt-4px`}
    >
      <div style={{ paddingLeft: 16 * level }} className="flex items-center position-relative">
        {id !== "0" && <img onMouseDown={() => onMove()} className="treeNodeMove cursor-move select-none position-absolute left-2px w-12px h-12px mr-2px" src={isDark ? Images.darkMenuMove : Images.lightMenuMove} />}
        <div onClick={() => onExpand()} className="w-14px h-14px mr-2px">
          {children?.length > 0 && <img className={`w-100% h-100% ${expandList.includes(id) ? "":"transform-rotate--90"}`} src={isDark? Images.darkMenuArrow : Images.lightMenuArrow} />}
        </div>
        {id === "0" ? <img className="w-16px h-16px mr-8px" src={isDark ? Images.darkHomeFolder : Images.lightHomeFolder} /> :
        <img className="w-16px h-16px  mr-8px" src={isDark? Images.darkFolder : Images.lightFolder} />}
        <div className={`font-500 text-14px line-height-20px ${id === "0" ? 'vcolor-title':'vcolor-subTitle'}`}>{name}</div>
      </div>
      <div className="w-16px h-16px mr-12px" onClick={onMore}>
        {id === "0" ? <img className="w-100% h-100%" src={isDark ? Images.darkMenuAdd : Images.lightMenuAdd} /> : 
        <img className="w-100% h-100%" src={isDark ? Images.darkMenuMore : Images.lightMenuMore} />}
      </div>
      {
        moreShow && <div className="vbg-color-main vshadow-color-layout border border-solid vborder-color-default absolute z-1000 top-36px left-106px b-rounded-8px p-4px">
          <div className="flex items-center gap-8px py-10px px-12px" onClick={(e) => onModel(e, 1)}>
            <img className="w-14px h-14px" src={isDark ? Images.darkMore1 : Images.lighitMore1} />
            <div className="vcolor-subTitle font-500 text-13px line-height-20px min-w98px">创建子文件夹</div>
          </div>
          {
            id === "0" ? null : <>
              <div className="flex items-center gap-8px py-10px px-12px" onClick={(e) => onModel(e, 2)}>
                <img className="w-14px h-14px" src={isDark ? Images.darkMore2 : Images.lighitMore2} />
                <div className="vcolor-subTitle font-500 text-13px line-height-20px min-w98px">重命名</div>
              </div>
              <div className="flex items-center gap-8px py-10px px-12px" onClick={(e) => onModel(e, 3)}>
                <img className="w-14px h-14px" src={isDark ? Images.darkMore3 : Images.lighitMore3} />
                <div className="vcolor-subTitle font-500 text-13px line-height-20px min-w98px">解散</div>
              </div>
            </>
          }
        </div>
      }
    </div>
    {expandList.includes(id) && children.map((child: Directory) => (
      <TreeNode
        key={child.id}
        level={level + 1}
        node={child}
      />
    ))}
    {
      <Model open={modelType > 0}>
        {modelType === 1 && <AddTree onConfirm={onConfirm} onCancel={onCancel} />}
        {modelType === 2 && <EditTree value={node.name} onConfirm={onConfirm} onCancel={onCancel} />}
        {modelType === 3 && <DisbandTree onConfirm={onConfirm} onCancel={onCancel} />}
      </Model>
    }
  </>
}

export default TreeNode;