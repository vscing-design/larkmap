import "./index.less";
import { Icons } from '@/assets/icons';

const Loading = () => {

  return <div className="w-[100vw] h-[100vh] flex justify-center items-center text-16px">
    <Icons.spinner className="mr-2 h-8 w-8 animate-spin" />
    Loading...
  </div>
}

export default Loading;