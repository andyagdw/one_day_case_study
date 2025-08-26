// React
import { useEffect, useState } from "react";
// Utils
import {formatDate} from "../../utils/dateUtils";
import { RECENT_ORDERS_KEY } from "../../utils/constants";
// Styles
import styles from "./RecentOrders.module.css";
// Components
import Modal from "../../components/modal/Modal";
// Data
import { DEFAULT_ORDERS } from "../../data/pizzas";


export default function RecentOrders() {
  const [orders, setOrders] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(false);

  const handleClick = (orderId) => {
    setSelectedOrderId(orderId);
    setModalOpen(true);
  };

  useEffect(() => {
    try {
      const recentOrders = localStorage.getItem(RECENT_ORDERS_KEY);
      if (recentOrders) {
        setOrders(JSON.parse(recentOrders));
      } else {
        localStorage.setItem(RECENT_ORDERS_KEY, JSON.stringify(DEFAULT_ORDERS));
        setOrders(DEFAULT_ORDERS);
      }
    } catch (e) {
      // fallback to defaults it localstorage is unavailable
      setOrders(DEFAULT_ORDERS);
      console.error(e);
    }
  }, []);

  return (
    <>
      <section aria-labelledby="recent-orders-heading">
        <h2 className={styles.heading} id="recent-orders-heading">
          My Recent Orders
        </h2>
        {orders.length === 0 ? (
          <p>No recent orders</p>
        ) : (
          <ul className={styles.recentOrdersWrapper}>
            {orders.map((order) => {
              return (
                <li key={order.id}>
                  <div className={styles.recentOrderWrapper}>
                    <div className="pizza-background-img"></div>
                    <div className={styles.pizzaInfo}>
                      <p>
                        {order.name} |{" "}
                        <span className={styles.orderSize}>{order.size}</span>
                      </p>
                      <p>Quantity: {order.qty}</p>
                      {/* Ensures trailing zeros show */}
                      <p>Price: £{order.total.toFixed(2)}</p>
                      <p>
                        Order date:{" "}
                        <time>
                          {formatDate(order.date)}
                        </time>
                      </p>
                    </div>
                    <div className={styles.btnWrapper}>
                      <button
                        className={styles.reorderBtn}
                        onClick={() => handleClick(order.id)}
                      >
                        Reorder
                      </button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>
      <Modal isOpen={modalOpen} setModalOpen={setModalOpen} orderId={selectedOrderId} />
    </>
  );
}
