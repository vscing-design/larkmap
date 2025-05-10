import { flattenTree, rebuildTree, type Directory, type Title, type Url } from '@/utils/bookmarks';
import { setupStore } from '../utils';
import type { StateCreator } from 'zustand';
import { cloneDeep } from 'lodash-es';

// 定义状态接口
interface IAppState {
  // 网址布局
  layoutMode: number;
  // 书签库列表
  bookmarkList: Title[];
  // 当前选中书签库下标
  bookmarkIndexMap: Record<string, number>;
  // 当前选中书签库
  currentBookmark: Title | null;
  // 文件夹列表
  directoryList: Directory[];
  // 当前选中文件夹下标
  directoryIndexMap: Record<string, number>;
  // 当前选中文件夹
  currentDirectory: Directory | null;
  // 书签库网页搜索列表
  searchList: Url[];
  // 当前选中文件夹或网址
  selectedMap: Record<string, Directory | Url>;

  // 设置网址布局
  updateLayoutMode: (newLayoutMode: number) => void;
  // 设置书签库列表
  updateBookmarkList: (bookmarkList: Title[]) => void;
  // 设置存储书签数据、书签搜索数据、设置默认选中的书签库
  updateCurrentBookmark: (currentBookmark: Title | null) => void;
  // 设置文件夹列表
  updateDirectoryList: (directoryList: Directory[], newUnassignedUrls: Url[] | null) => void;
  // 设置当前选中文件夹
  updateCurrentDirectory: (currentDirectory: Directory | null) => void;
  // 设置选中文件夹或网址
  updateSelectedMap: (selectedMap: Record<string, Directory | Url>) => void;
}

// 拆分配置函数并添加类型注解
const storeConfig: StateCreator<IAppState> = (set) => ({
  // 网址布局
  layoutMode: 1,
  updateLayoutMode: (newLayoutMode: number) => set({ layoutMode: newLayoutMode }),

  // 书签库列表
  bookmarkList: [],
  // 当前选中书签库下标
  bookmarkIndexMap: {},
  // 设置书签库列表、设置当前选中书签库下标
  updateBookmarkList: (newBookmarkList: Title[]) => {
    const newBookmarkIndexMap: Record<string, number> = {};
    newBookmarkList.forEach((item, index) => {
      newBookmarkIndexMap[item.id] = index;
    });
    return set({
      bookmarkList: newBookmarkList,
      bookmarkIndexMap: newBookmarkIndexMap
    });
  },

  // 当前选中书签库
  currentBookmark: null,
  // 设置当前选中书签库
  updateCurrentBookmark: (newCurrentBookmark: Title | null) => set((state: IAppState) => {
    // 如果当前选中的书签库不存在，直接返回
    const currentBookmarkIndex = state.bookmarkIndexMap[newCurrentBookmark!.id];
    if (currentBookmarkIndex === undefined) {
      return state;
    }
    const { newDirectoryList, newDirectoryIndexMap, newSerachList } = flattenTree(newCurrentBookmark!.directorys);
    // 如果
    return {
      ...state,
      currentDirectory: null,
      currentBookmark: newCurrentBookmark,
      directoryList: newDirectoryList,
      directoryIndexMap: newDirectoryIndexMap,
      searchList: newSerachList,
      selectedMap: {}
    }
  }),

  // 文件夹列表
  directoryList: [],
  // 当前选中文件夹下标
  directoryIndexMap: {},
  // 设置文件夹列表、设置当前选中文件夹下标
  updateDirectoryList: (newDirectoryList: Directory[], newUnassignedUrls: Url[] | null) => set((state: IAppState) => {
     // 更新选中的文件夹
    let newCurrentDirectory: Directory | null = null;
    // 文件夹下标集合
    const newDirectoryIndexMap: Record<string, number> = {};
    newDirectoryList.forEach((item, index) => {
      if (item.id === state.currentDirectory!.id) {
        newCurrentDirectory = item;
      }
      newDirectoryIndexMap[item.id] = index;
    });
    // 生成树形结构
    const {newDirectoryTree, newSerachList} = rebuildTree(newDirectoryList);
    // 设置当前选中文件夹
    const newCurrentBookmark = cloneDeep(state.currentBookmark!);
    newCurrentBookmark.directorys = newDirectoryTree;
    // 处理未分配的网址
    if (newUnassignedUrls !== null) {
      newCurrentBookmark.unassignedUrls = newUnassignedUrls;
    }
    // 设置书签库列表
    const newBookmarkList = state.bookmarkList.map((item) => {
      if (item.id === newCurrentBookmark.id) {
        return newCurrentBookmark;
      } else {
        return item;
      }
    })
    return {
      ...state,
      directoryList: newDirectoryList,
      directoryIndexMap: newDirectoryIndexMap,
      currentDirectory: newCurrentDirectory,
      searchList: newSerachList,
      bookmarkList: newBookmarkList,
      currentBookmark: newCurrentBookmark,
      selectedMap: newUnassignedUrls ? {} : {...state.selectedMap}
    }
  }),

  // 当前选中文件夹
  currentDirectory: null,
  // 设置当前选中文件夹
  updateCurrentDirectory: (newCurrentDirectory: Directory | null) => set((state: IAppState) => {
    return {
      ...state,
      currentDirectory: newCurrentDirectory,
      selectedMap: {}
    }
  }),

  // 书签库网页搜索列表
  searchList: [],

  // 当前选中文件夹或网址
  selectedMap: {},
  // 设置当前选中文件夹或网址
  updateSelectedMap: (newSelectedMap: Record<string, Directory | Url>) => set((state: IAppState) => {
    return {
     ...state,
      selectedMap: newSelectedMap
    }
  })
});

// 创建 store
export default setupStore<IAppState>(storeConfig as any, 'bookmarksStore');
