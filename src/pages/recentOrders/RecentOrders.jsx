// React
import { useEffect, useState } from "react";
// Utils
import {formatDate} from "../../utils/dateUtils";
import { RECENT_ORDERS_KEY } from "../../utils/constants";
// Styles
import styles from "./RecentOrders.module.css";
// Components
import Modal from "../../components/modal/Modal";

const DEFAULT_ORDERS = [
  {
    id: 1,
    name: "Pepperoni Feast",
    size: "Large",
    qty: 1,
    total: 9.99,
    date: "2025-08-20",
  },
  {
    id: 2,
    name: "Veggie Delight",
    size: "Medium",
    qty: 2,
    total: 11.48,
    date: "2025-08-14",
  },
  {
    id: 3,
    name: "BBQ Chicken",
    size: "Small",
    qty: 1,
    total: 7.49,
    date: "2025-07-30",
  },
  {
    id: 4,
    name: "Margherita",
    size: "Large",
    qty: 3,
    total: 31.5,
    date: "2025-06-18",
  },
  {
    id: 5,
    name: "Hawaiian",
    size: "Medium",
    qty: 1,
    total: 10.4,
    date: "2025-05-05",
  },
];

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
                      <p>Price: £{order.total}</p>
                      <p>
                        Order date:{" "}
                        <time dateTime={formatDate(order.date)}>
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
