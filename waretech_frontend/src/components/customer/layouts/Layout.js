import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import Chatbox from "./../../modals/Chatbox";
import ScrollToTop from "../../../utils/ScrollToTop";
import ScrollToTopButton from "../../admin/buttons/ScrollToTopButton";

const Layout = () => {
  return (
    <>
      <Header />
      <ScrollToTop />
      <main style={{ minHeight: "80vh" }}>
        <Outlet />
      </main>
      <Chatbox />
      <Footer />
      <ScrollToTopButton />
    </>
  );
};

export default Layout;
