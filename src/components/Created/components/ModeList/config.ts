import Images from "@/assets";

// 书签创建方式
export interface IModeItem {
  key: number;
  icon: any;
  title: string;
}
export const getModeList = (isDark: boolean): IModeItem[] => {
  return [
    {
      key: 1,
      icon: isDark ? Images.darkModeUser : Images.lightModeUser,
      title: "导入浏览器书签文件并自动生成"
    },
    {
      key: 2,
      icon: isDark ? Images.darkModeSys : Images.lightModeSys,
      title: "从零开始手动创建"
    }
  ]
};