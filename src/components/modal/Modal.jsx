// Styles
import styles from "./Modal.module.css";
// React
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
// Utils
import { formatDateYYYYMMDD } from "../../utils/dateUtils";
import {
  DELIVERY_FEE,
  USER_PROFILE_KEY,
  RECENT_ORDERS_KEY,
} from "../../utils/constants";
// Data
import { SIZES, PIZZAS, QUANTITIES } from "../../data/pizzas";

export default function Modal({
  isOpen = false,
  orderId = null,
  setModalOpen = { setModalOpen },
}) {
  const modalRef = useRef(null);
  const navigate = useNavigate();
  // User details
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [telephoneNum, setTelephoneNum] = useState("");
  const [address, setAddress] = useState("");
  const [postcode, setPostcode] = useState("");
  const [step, setStep] = useState(1);

  // Represents the total number of steps to pay for a pizza
  const maxSteps = 3;
  const stepTitles = {
    1: "Review",
    2: "Edit Items",
    3: "Confirm and Pay",
  };

  // Order fields
  const [pizzaId, setPizzaId] = useState(PIZZAS[0].id);
  const [size, setSize] = useState(SIZES[1]); // default Medium
  const [qty, setQty] = useState(1);

  const getPizzaId = (id) => {
    return PIZZAS.find((p) => p.id === id) || PIZZAS[0];
  };

  const unitPrice = () => {
    const p = getPizzaId(pizzaId);
    return p && p.prices && p.prices[size] ? p.prices[size] : 0;
  };
  const subtotal = () => {
    return Math.round(unitPrice() * qty * 100) / 100;
  };
  const total = () => {
    return Math.round((subtotal() + DELIVERY_FEE) * 100) / 100;
  };
  const fmt = (n) => {
    return n.toLocaleString("en-GB", { style: "currency", currency: "GBP" });
  };

  const handleNext = (e) => {
    e.preventDefault();
    /*
    Note: when you click Next the app re-renders and replaces the Next button with the
    Confirm & Pay button under the mouse pointer before the browser finishes the
    click sequence. The browser then completes the click on the new Confirm & Pay
    button — which submits the form.
     */
    // Stops the click event from bubbling so it can't never reach the new button
    e.stopPropagation();
    if (step === 1) {
      if (
        !name.trim() ||
        !address.trim() ||
        !telephoneNum.trim() ||
        !email.trim() ||
        !postcode.trim()
      ) {
        alert("Please fill in all fields to continue");
        return;
      }
    }
    if (step < maxSteps) setStep(s => s + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(s => s - 1);
  };

  const handleConfirm = (e) => {
    e.preventDefault();
    const qtyNum = +qty || 1;
    const pizza = getPizzaId(pizzaId);
    const unit =
      pizza && pizza.prices && pizza.prices[size] ? pizza.prices[size] : 0;
    const subtotal = Math.round(unit * qtyNum * 100) / 100;
    const total = Math.round((subtotal + DELIVERY_FEE) * 100) / 100;

    // create id (timestamp) and a readable order reference
    const id = Date.now(); // numeric unique id
    const dateStr = formatDateYYYYMMDD(new Date());
    const orderRef = `ORD-${dateStr}-${String(id).slice(-5)}`; // e.g. ORD-2025-08-26-12345

    const newOrder = {
      id,
      orderRef,
      name: pizza.name,
      size,
      qty: qtyNum,
      unitPrice: unit,
      subtotal,
      fees: DELIVERY_FEE,
      total,
      date: dateStr,
    };

    // Save order
    try {
      const raw = localStorage.getItem(RECENT_ORDERS_KEY);
      const orders = raw ? JSON.parse(raw) : [];
      const updated = [newOrder, ...orders].slice(0, 10); // keep latest 10
      localStorage.setItem(RECENT_ORDERS_KEY, JSON.stringify(updated));

      const userProfile = {
        name: name.trim(),
        email: email.trim(),
        telephoneNum: telephoneNum.trim(),
        address: address.trim(),
        postcode: postcode.trim(),
      };
      localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(userProfile));
    } catch (e) {
      console.error("Failed to save order or profile", e);
    }
    // navigate and pass the full order object
    navigate("/confirmation", { state: { order: newOrder } });
  };

  useEffect(() => {
    if (!isOpen) return;
    modalRef.current.showModal();
    try {
      const savedProfile = localStorage.getItem(USER_PROFILE_KEY);
      if (savedProfile) {
        const profile = JSON.parse(savedProfile);
        setName(profile.name || "");
        setEmail(profile.email || "");
        setTelephoneNum(profile.telephoneNum || "");
        setAddress(profile.address || "");
        setPostcode(profile.postcode || "");
      } else {
        setName("John Doe");
        setEmail("jdoe@email.com");
        setTelephoneNum("123456");
        setAddress("23 Highway Road");
        setPostcode("AB1 5ZY");
      }
    } catch (e) {
      console.error("Error loading from local storage", e);
    }

    try {
      const saved = localStorage.getItem(RECENT_ORDERS_KEY);
      if (saved) {
        const orders = JSON.parse(saved);
        if (orderId) {
          const match = orders.find((o) => o.id === orderId);
          if (match) {
            const pizza =
              PIZZAS.find((p) => p.name === match.name) || PIZZAS[0];
            setPizzaId(pizza.id);
            setSize(match.size || SIZES[1]);
            setQty(match.qty || 1);
          } else if (orders.length) {
            const o = orders[0];
            const pizza = PIZZAS.find((p) => p.name === o.name) || PIZZAS[0];
            setPizzaId(pizza.id);
            setSize(o.size || SIZES[1]);
            setQty(o.qty || 1);
          }
        } else if (orders.length) {
          const o = orders[0];
          const pizza = PIZZAS.find((p) => p.name === o.name) || PIZZAS[0];
          setPizzaId(pizza.id);
          setSize(o.size || SIZES[1]);
          setQty(o.qty || 1);
        }
      }
    } catch (e) {
      console.error(e);
    }
  }, [isOpen, orderId]);

  return (
    <dialog id="my-modal" ref={modalRef} className={styles.dialog}>
      <div className={styles.closeDialogBtnWrapper}>
        {" "}
        <button
          type="button"
          className={styles.closeDialogBtn}
          aria-label="Close"
          onClick={() => {
            setStep(1); // Reset steps
            setModalOpen(false); // Reset state
            modalRef.current.close(); // Close modal
          }}
        >
        </button>
      </div>
      <form aria-label="confirm-details" onSubmit={handleConfirm}>
        <h3
          className={styles.stepHeading}
        >{`Step ${step} of ${maxSteps}: ${stepTitles[step]}`}</h3>
        {step === 1 && (
          <div className={styles.formSection}>
            <div className={styles.inputWrapper}>
              <label htmlFor="full-name">Name: </label>
              <input
                type="text"
                name="full-name"
                id="full-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className={styles.inputWrapper}>
              <label htmlFor="email">Email: </label>
              <input
                type="text"
                name="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                inputMode="email"
                required
              />
            </div>
            <div className={styles.inputWrapper}>
              <label htmlFor="telephone-num">Telephone: </label>
              <input
                type="text"
                name="telephone-num"
                id="telephone-num"
                value={telephoneNum}
                onChange={(e) => setTelephoneNum(e.target.value)}
                inputMode="tel"
                required
              />
            </div>
            <div className={styles.inputWrapper}>
              <label htmlFor="address">Address: </label>
              <input
                type="text"
                name="address"
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
            </div>
            <div className={styles.inputWrapper}>
              <label htmlFor="postcode">Postcode: </label>
              <input
                type="text"
                name="postcode"
                id="postcode"
                value={postcode}
                onChange={(e) => setPostcode(e.target.value)}
                required
              />
            </div>
          </div>
        )}
        {step === 2 && (
          <div className={styles.formSection}>
            <div className="pizza-background-img"></div>
            <div className={styles.selectWrapper}>
              <label htmlFor="pizza-select">Select Pizza:</label>
              <select
                name="pizza-select"
                value={pizzaId}
                id="pizza-select"
                onChange={(e) => {
                  setPizzaId(e.target.value);
                }}
              >
                {PIZZAS.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
            <div className={styles.selectWrapper}>
              <label htmlFor="size-select">Select Pizza:</label>
              <select
                name="size-select"
                value={size}
                id="size-select"
                onChange={(e) => setSize(e.target.value)}
              >
                {SIZES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <div className={styles.selectWrapper}>
              <label htmlFor="quantity-select">Quantity:</label>
              <select
                name="quantity-select"
                value={qty}
                id="quantity-select"
                onChange={(e) => setQty(+e.target.value)}
              >
                {QUANTITIES.map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <p>Unit price: {fmt(unitPrice())}</p>
              <p>Subtotal price: {fmt(subtotal())}</p>
              <p>
                <strong>
                  Total &#x28;incl. delivery&#x29;: {fmt(total())}
                </strong>
              </p>
            </div>
          </div>
        )}
        {step === 3 && (
          <div className={styles.formSection}>
            <p>
              You are using card ending in <strong>7562.</strong>{" "}
              <span className={styles.updatePaymentText}>
                Update payment option?
              </span>
            </p>
            <div className={styles.confirmSection}>
              <h4>User information</h4>
              <p>Name: {name}</p>
              <p>Email: {email}</p>
              <p>Telephone: {telephoneNum}</p>
              <p>Address: {address}</p>
              <p>Postcode: {postcode}</p>
            </div>
            <div className={styles.confirmSection}>
              <h4>Pizza details</h4>
              <p>Pizza name: {getPizzaId(pizzaId).name}</p>
              <p>Pizza size: {size}</p>
              <p>Quantity: {qty} </p>
            </div>
            <div className={styles.confirmSection}>
              <h4>Price</h4>
              <p>Delivery fee: {fmt(DELIVERY_FEE)}</p>
              <p>Subtotal: {fmt(subtotal())}</p>
              <p>
                <strong>Total: {fmt(total())}</strong>
              </p>
            </div>
          </div>
        )}
        <div className={styles.navigateBtnWrapper}>
          <button
            type="button"
            onClick={handleBack}
            disabled={step === 1}
            className={styles.button}
          >
            Back
          </button>
          {step < maxSteps ? (
            <button
              type="button"
              onClick={handleNext}
              className={styles.button}
            >
              Next
            </button>
          ) : (
            <button type="submit" className={[styles.submitBtn, styles.button].join(" ")}>
              Confirm & Pay
            </button>
          )}
        </div>
      </form>
    </dialog>
  );
}
