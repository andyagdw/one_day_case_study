// React
import { Link, useLocation } from "react-router";
import { useEffect, useState } from "react";
// Styles
import styles from "./Confirmation.module.css";
// Components
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
// Utils
import {
  formatDateYYYYMMDD,
  formatTimeIn15Minutes,
} from "../../utils/dateUtils";
// Constants
import { RECENT_ORDERS_KEY } from "../../utils/constants";

export default function Confirmation() {
  const location = useLocation();
  const [order, setOrder] = useState(null);

  const eta = formatTimeIn15Minutes();

  useEffect(() => {
    // prefer passed order object
    const passed = location?.state?.order ?? null;
    if (passed) {
      setOrder(passed);
      return;
    }

    // fallback: read recentOrders
    try {
      const raw = localStorage.getItem(RECENT_ORDERS_KEY);
      const orders = raw ? JSON.parse(raw) : [];
      if (orders.length) setOrder(orders[0]);
      else setOrder(null);
    } catch (e) {
      console.error(e);
      setOrder(null);
    }
  }, [location]);

  if (!order) {
    return (
      <div>
        <h2>Order confirmation</h2>
        <p>No recent order found.</p>
        <Link to="/">Back to home</Link>
      </div>
    );
  }

  return (
    <div className="wrapper">
      <Header />
      <main className="padding-inline">
        <section
          aria-labelledby="confirmation-heading"
          className={styles.section}
        >
          <h2 className={styles.heading} id="confirmation-heading">
            Order successfully placed!
          </h2>
          <div className={styles.sectionOne}>
            <p>
              Estimated time of arrival:{" "}
              <strong>
                <span className={styles.fontSizeBig}>
                  {eta} &#x28;approx.&#x29;
                </span>
              </strong>
            </p>
            <p>
              Order reference:{" "}
              <strong>
                <span className={styles.fontSizeBig}>#{order.id}</span>
              </strong>
            </p>
          </div>
          <div className={styles.sectionTwo}>
            <p>
              Name: <strong>{order.name}</strong>
            </p>
            <p>
              Size: <strong>{order.size}</strong>
            </p>
            <p>
              Quantity: <strong>{order.qty}</strong>
            </p>
            <p>
              Order date: <strong>{formatDateYYYYMMDD()}</strong>
            </p>
          </div>
          <div className={styles.sectionThree}>
            <Link to="/" replace>
              Back to recent orders
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
