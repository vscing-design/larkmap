/**
 * 
 * @returns font-family: PingFang SC;
font-weight: 500;
font-size: 13px;
line-height: 22px;
letter-spacing: 0%;
text-align: center;

 */

import Images from "@/assets";
import useTheme from "@/hooks/useTheme";

const Footer = () => {

  const { isDark } = useTheme();

  return <div className="vbg-color-footer box-border w-100% px-24px py-20px">
    <div className="vbg-color-subCard flex items-center justify-center gap-6px b-rounded-6px w-192px h-36px">
      <div className="vcolor-title letter-spacing-0 font-500 text-13px line-height-22px">预览书签库</div>
      <img className="inline-block w-14px h-14px" src={isDark ? Images.darkFarrow : Images.lightFarrow} />
    </div>
  </div>
}

export default Footer;