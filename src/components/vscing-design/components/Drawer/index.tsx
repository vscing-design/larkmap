import { memo, useEffect } from "react";
import { createPortal } from "react-dom";
import './index.less';

interface IProps {
  open: boolean;
  children: React.ReactNode;
}

const Drawer = (props: IProps) => {

  const { open, children } = props;

  useEffect(() => {
    if(open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    }
  }, [open]);

  if (!open) return null;

  return createPortal(
    <div className="drawer bg-transparent fixed top-0 left-0 w-100vw h-100vh overflow-auto z-1000">
      <div className={`${open ? 'drawer-overlay-show' : 'drawer-overlay-hide'} vmask-color-main w-100vw h-100vh`}></div>
      <div className={`${open ? 'drawer-content-show' : 'drawer-content-hide'} box-border w-400px h-100vh absolute right-0 top-0 flex items-center justify-center p-8px z-1`}>
        {children}
      </div>
    </div>,
    document.body
  )
}

export default memo(Drawer);