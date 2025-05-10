export interface IBookmarksTree {
  id: string;
  name: string;
  url?: string;
  icon?: string;
  folder?: boolean;
  addDate: string | null;
  lastModified?: string | null;
  children?: IBookmarksTree[];
}

export interface IBookmarksSerach {
  id: string;
  name: string;
  desc: string;
  type: string;
  icon: string;
  url: string;
}

