import { memo, useEffect } from "react";
import { createPortal } from "react-dom";

interface IProps {
  open: boolean;
  children: React.ReactNode;
}

const Model = (props: IProps) => {

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
    <div className="model fixed top-0 left-0 w-100vw h-100vh overflow-auto z-1000">
      <div className="model-overlay vmask-color-main w-100% h-100%"></div>
      <div className="model-content w-100% h-100% absolute top-0 left-0 flex items-center justify-center z-1">
        {children}
      </div>
    </div>,
    document.body
  )
}

export default memo(Model);