import Images from "@/assets";
import useTheme from "@/hooks/useTheme";
import { Directory, Url } from "@/utils/bookmarks";

interface DirectorysProps {
  currentDirectory: Directory | null;
  directoryChildren: Directory[];
  selectedMap: Record<string, Url | Directory>;
  onMouseDown: (e: any, innerHTML: string) => void;
}

const Directorys = (props: DirectorysProps) => {

  // 是否暗黑
  const { isDark } = useTheme();

  const { directoryChildren } = props;

  if (!directoryChildren) return null;

  return <div className="mb-24px flex flex-wrap items-center gap-x-16px gap-y-8px">
    {
      directoryChildren.map((node: Directory) => {
        return <div key={node.id} className="select-none flex flex-col items-center gap-4px p-8px b-rounded-8px">
          <img src={isDark ? Images.darkDirectory : Images.lighitDirectory} className="w-80px h-80px" />
          <div className="vcolor-default overflow-hidden text-ellipsis text-center font-500 font-normal w-112px text-13px line-height-20px">{node.name}</div>
        </div>
      })
    }
  </div>
}

export default Directorys;