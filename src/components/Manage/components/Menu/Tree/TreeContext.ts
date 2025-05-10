import type { Directory } from "@/utils/bookmarks";
import React from "react";

interface IProps {
  expandList: string[];
  onDirectoryChange: (modelType: number, node: Directory, value: string) => void;
  onChangeTree: (moveNode: Directory, currNode: Directory, position: number) => void;
  setExpandList: (list: string[]) => void;
}

export const TreeContext = React.createContext<IProps>({
  expandList: [],
  onDirectoryChange: () => {},
  onChangeTree: () => {},
  setExpandList: () => {}
});