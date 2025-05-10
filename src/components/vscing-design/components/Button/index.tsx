import { ReactNode } from "react";

export interface ButtonProps {
  className?: string;
  children: ReactNode | string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

const Button = (props: ButtonProps) => {

  const {
    className = "",
    children,
    onClick
  } = props;

  return <button className={`inline-flex items-center justify-center bg-transparent pa-0 border-none cursor-pointer ${className}`} onClick={onClick}>
    {children}
  </button>
}

export default Button;