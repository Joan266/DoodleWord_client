import React from "react";
import styles from './Menu.module.scss';
import MenuForm from "./components/MenuForm";

const Menu = () => {
  return (
    <div className={styles.menu}>
      <div className={styles.leftSideContainer}>
        <MenuForm />
      </div>
      <div className={styles.rightSideContainer}></div>
    </div>
  );
};

export default Menu;
