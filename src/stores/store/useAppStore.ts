import { ThemeEnum } from '@/enums';
import { setupStore } from '../utils';
import type { StateCreator } from 'zustand';

// 定义状态接口
interface IAppState {
  // 主题
  theme?: ThemeEnum.DARK | ThemeEnum.LIGHT;
  updateTheme: (newTheme: ThemeEnum.DARK | ThemeEnum.LIGHT) => void;
}

// 拆分配置函数并添加类型注解
const storeConfig: StateCreator<IAppState> = (set) => ({
   // 主题
   theme: undefined,
   updateTheme: (newTheme: ThemeEnum.DARK | ThemeEnum.LIGHT) => set({ theme: newTheme }),
});

// 创建 store
export default setupStore<IAppState>(storeConfig as any, 'appStore');
