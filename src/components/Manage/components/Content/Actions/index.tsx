import ButtonsList from "./ButtonsList";
import UrlsLayout from "./UrlsLayout";

const Actions = () => {

  return <div className="flex">
    <UrlsLayout />
    <div className="flex items-center justify-center w-32px">
      <div className="border border-solid vborder-color-active w-0px h-12px"></div>
    </div>
    <ButtonsList />
  </div>
}

export default Actions;