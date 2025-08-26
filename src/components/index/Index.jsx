// Components
import Header from "../header/Header"
import Footer from "../footer/Footer"
// Pages
import RecentOrders from "../../pages/recentOrders/RecentOrders";

export default function Index() {
  return (
    <div className="wrapper">
      <Header />
      <main className="padding-inline">
        <RecentOrders />
      </main>
      <Footer />
    </div>
  );
}
