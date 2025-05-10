import Header from "./Header";
import Tree from "./Tree";
import Footer from "./Footer";

const Menu = () => {
  return <div className="vbg-color-card flex-grow-0 flex-shrink-0 flex-basis-240px min-h-100vh flex flex-col items-start">
    <Header />
    <Tree />
    <Footer />
  </div>
}

export default Menu;