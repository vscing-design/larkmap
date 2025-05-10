import config from '@/config';
import localforage from 'localforage';

// 默认配置（可覆盖）
const DEFAULT_CONFIG = {
  driver: [localforage.INDEXEDDB, localforage.LOCALSTORAGE],
  name: config.storeKey || 'vscing',
  version: 1.0,
  // size        : 4980736, // Size of database, in bytes. WebSQL-only for now.
  storeName: 'vscing', // Should be alphanumeric, with underscores.
  description: '数据存储',
};

// 封装的存储模块
class Storage {

  private config: LocalForageOptions = DEFAULT_CONFIG;

  constructor(config = {}) {
    this.config = { ...this.config, ...config };
    this.init();
  }

  // 初始化配置和驱动
  async init() {
    try {
      // 应用配置
      localforage.config(this.config);

      // 验证配置生效
      console.log('当前配置:', {
        name: this.config.name,
        storeName: this.config.storeName,
        driver: localforage.driver(),
      });
      
    } catch (err) {
      console.warn('尝试设置配置失败，使用回退驱动:', err);
      // 自动回退到其他可用驱动
    }
  }

  // 封装常用方法
  async getItem(key: string) {
    try {
      return await localforage.getItem<string>(key);
    } catch (err) {
      console.error('读取失败:', err);
      throw err;
    }
  }

  async setItem(key: string, value: any) {
    try {
      await localforage.setItem(key, value);
      return true;
    } catch (err) {
      console.error('存储失败:', err);
      throw err;
    }
  }

  async removeItem(key: string) {
    try {
      await localforage.removeItem(key);
      return true;
    } catch (err) {
      console.error('删除失败:', err);
      throw err;
    }
  }

  async clear() {
    try {
      await localforage.clear();
      return true;
    } catch (err) {
      console.error('清空存储失败:', err);
      throw err;
    }
  }
}

// 导出默认配置和 Storage 类
export default new Storage();