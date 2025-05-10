import { IBookmarksSerach, IBookmarksTree } from '@/types/bookmarks';
import { customAlphabet } from 'nanoid';

// 随机文件Id
export const nanoid = customAlphabet('1234567890', 10);

// 数据结构
export class Url {

  id: string;
  name: string;
  desc: string;
  directoryId: string;
  icon: string;
  url: string;
  addDate: string;
  lastModified: string;

  constructor(id: string, name: string, desc: string, directoryId: string, icon: string, url: string, addDate: string, lastModified: string) {
    this.id = id;
    this.name = name;
    this.desc = desc;
    this.directoryId = directoryId;
    this.icon = icon;
    this.url = url;
    this.addDate = addDate;
    this.lastModified = lastModified;
  }
}

export class Directory {

  id: string;
  name: string;
  directoryId: string;
  addDate: string; // 新增日期
  lastModified: string; // 最后修改日期
  children: Directory[];
  urls: Url[];

  constructor(id: string, name: string, directoryId: string, addDate: string, lastModified: string) {
    this.id = id;
    this.name = name;
    this.directoryId = directoryId;
    this.addDate = addDate;
    this.lastModified = lastModified;
    this.children = [];
    this.urls = [];
  }

  addDirectory(directory: Directory) {
    this.children.push(directory);
  }

  removeDirectory(directoryId: string) {
    this.children = this.children.filter(directory => directory.id !== directoryId);
  }

  addUrl(url: Url) {
    this.urls.push(url);
  }

  removeUrl(urlId: string) {
    this.urls = this.urls.filter(url => url.id !== urlId);
  }
}

export class Title {

  id: string;
  name: string;
  directorys: Directory[];
  unassignedUrls: Url[];

  constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
    this.directorys = []; // 存储目录
    this.unassignedUrls = []; // 存储未分配的网址
  }

  addDirectory(directory: Directory) {
    this.directorys.push(directory);
  }

  removeDirectory(directoryId: string) {
    this.directorys = this.directorys.filter(directory => directory.id !== directoryId);
  }

  addUnassignedUrl(url: Url) {
    this.unassignedUrls.push(url);
  }

  removeUnassignedUrl(urlId: string) {
    this.unassignedUrls = this.unassignedUrls.filter(url => url.id !== urlId);
  }
}

// 读取html文件
export const readAsStringAsync = async (file: Blob): Promise<IBookmarksTree[]> => {
  const result: IBookmarksTree[] = [];
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      const bookmarksHtml = e.target.result;
      const parser = new DOMParser();
      const root: Document = parser.parseFromString(bookmarksHtml, "text/html");
      walkBookmarksTree(root, result);
      resolve(result);
    };
    reader.onerror = () => {
      reject(result);
    };
    reader.readAsText(file);
  });
}

// 解析html文件
export function walkBookmarksTree(root: Document | Element, result: IBookmarksTree[]) {
  try {
    let node: HTMLDListElement = root.querySelector("dl")!;
    let els = node.children;
    if (els && els.length > 0) {
      for (let i = 0; i < els.length; i++) {
        let item = els[i];
        // p标签直接跳过
        if (item.tagName === "P") {
          continue;
        }
        // dt标签
        if (item.tagName === "DT") {
          let h3Node = item.querySelector("h3");
          let aNode = item.querySelector("a");
          let dlNode = item.querySelector("dl");
          if (h3Node && dlNode) {
            let child: IBookmarksTree = {
              id: `folder_${nanoid(5)}`,
              name: h3Node.innerText ?? "",
              folder: true,
              addDate: h3Node.getAttribute("add_date"),
              lastModified: h3Node.getAttribute("last_modified"),
              children: [],
            };
            walkBookmarksTree(item, child.children!);
            result.push(child);
          } else if (aNode) {
            result.push({
              id: `url_${nanoid(5)}`,
              name: aNode.innerText ?? "",
              url: aNode.href ?? "",
              addDate: aNode.getAttribute("add_date") ?? "",
              icon: aNode.getAttribute("icon") ?? "",
            })
          }
        }
      }
    }
  } catch (error) {
    console.error("解析html文件失败");
  }
}

// 遍历书签数据
export const traverseBookmarkData = (data: IBookmarksTree[], node: Title | Directory) => {
  data.forEach((item: any, index: number) => {

    let newNode: any = null;

    if (item.name === "书签栏" && index === 0) {
      item.children && traverseBookmarkData(item.children, node);
    } else if (item.folder) {
      // 是书签名下的目录
      if (node instanceof Title) {
        newNode = new Directory(item.id, item.name, "", item.addDate, item.lastModified);
        node.addDirectory(newNode);
      } else if (node instanceof Directory) {
        newNode = new Directory(item.id, item.name, node.id, item.addDate, item.lastModified);
        node.addDirectory(newNode);
      }
    } else if (!item.folder) {
      // 是书签名下的网址
      if (node instanceof Title) {
        newNode = new Url(item.id, item.name, "", "", item.icon, item.url, item.addDate, item.lastModified);
        node.addUnassignedUrl(newNode);
      } else if (node instanceof Directory) {
        newNode = new Url(item.id, item.name, "", node.id, item.icon, item.url, item.addDate, item.lastModified);
        node.addUrl(newNode);
      }
    }
    // 递归遍历子节点
    if (newNode && item.children) {
      item.children && traverseBookmarkData(item.children, newNode);
    }
  })
}

// 遍历书签数据
export const traverseBookmarks = (data: IBookmarksTree[], node: Title | Directory, serachList: IBookmarksSerach[]) => {
  data.forEach((item: any, index: number) => {

    let newNode: any = null;

    if (item.name === "书签栏" && index === 0) {
      item.children && traverseBookmarks(item.children, node, serachList);
    } else if (item.folder) {

      // 是书签名下的目录
      if (node instanceof Title) {
        newNode = new Directory(item.id, item.name, "", item.addDate, item.lastModified);
        node.addDirectory(newNode);
      } else if (node instanceof Directory) {
        newNode = new Directory(item.id, item.name, node.id, item.addDate, item.lastModified);
        node.addDirectory(newNode);
      }

      serachList.push({
        id: item.id, // 唯一值 
        name: item.name, // 名称
        desc: item.desc ?? '', // 描述
        type: "folder", // 类型 folder url
        icon: item.icon ?? '', // icon 只有网址才有
        url: item.url ?? '', // url 只有网址才有
      })
    } else if (!item.folder) {
      // 是书签名下的网址
      if (node instanceof Title) {
        newNode = new Url(item.id, item.name, "", "", item.icon, item.url, item.addDate, item.lastModified);
        node.addUnassignedUrl(newNode);
      } else if (node instanceof Directory) {
        newNode = new Url(item.id, item.name, "", node.id, item.icon, item.url, item.addDate, item.lastModified);
        node.addUrl(newNode);
      }

      serachList.push({
        id: item.id, // 唯一值 
        name: item.name, // 名称
        desc: item.desc ?? '', // 描述
        type: "url", // 类型 folder url
        icon: item.icon ?? '', // icon 只有网址才有
        url: item.url ?? '', // url 只有网址才有
      })
    }

    if (newNode && item.children) {
      item.children && traverseBookmarks(item.children, newNode, serachList);
    }
  })
}

// 将树形结构转换为带有索引和映射表的扁平数组
export function flattenTree(tree: Directory[]) {
  const newDirectoryList: Directory[] = [];
  const newDirectoryIndexMap: Record<string, number> = {};
  const newSerachList: Url[] = [];

  let currentIndex = 0;

  function traverse(node: Directory) {
    newDirectoryList.push(node);
    newDirectoryIndexMap[node.id] = currentIndex;
    if (node.urls && node.urls.length > 0) {
      node.urls.forEach((url: any) => {
        newSerachList.push(url);
      });
    }
    currentIndex++;

    if (node.children && node.children.length > 0) {
      node.children.forEach((child: any) => traverse(child));
    }
  }

  tree.forEach(node => traverse(node));
  return {newDirectoryList, newDirectoryIndexMap, newSerachList};
}

// 根据更新后的扁平数组重建树形结构
export function rebuildTree(flatArray: Directory[]) {
  const newDirectoryTree: Directory[] = [];
  const newDirectoryMap = new Map<string, Directory>();
  const newSerachList: Url[] = [];

  flatArray.forEach(node => {
    node.children = [];
    newDirectoryMap.set(node.id, node);
    if (node.urls && node.urls.length > 0) {
      newSerachList.push(...node.urls);
    }
  });

  flatArray.forEach(node => {
    if (node.directoryId === "" && newDirectoryMap.get(node.id)) {
      newDirectoryTree.push(newDirectoryMap.get(node.id)!);
    } else {
      const parentNode = newDirectoryMap.get(node.directoryId);
      if (parentNode && newDirectoryMap.get(node.id)) {
        parentNode.children.push(newDirectoryMap.get(node.id)!);
      }
    }
  });

  return { newDirectoryTree, newSerachList, newDirectoryMap };
}

