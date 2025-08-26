// Styles
import styles from "./Header.module.css";

export default function Header() {
  return (
    <header className={[styles.header, "padding-inline"].join(" ")}>
      <h1>Pizza Hut</h1>
    </header>
  );
}
