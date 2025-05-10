import Header from "./Header";
import Website from "./Website";

const Content = () => {
  return <div className="flex-1 h-100vh flex flex-col items-start overflow-hidden">
    <Header />
    <Website />
  </div>
}

export default Content;