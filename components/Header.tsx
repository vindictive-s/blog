import React from "react";
import Link from "next/link";

const styled = {
  headerContainer: "flex justify-between p-5 max-w-7xl mx-auto",
  container: "flex items-center space-x-5",
  logoImage: "w-44 object-contain cursor-pointer",
  navigation: "hidden md:inline-flex items-center space-x-5",
  followBtn: "text-white bg-green-600 px-4 py-1 rounded-full",
  accountNav: "flex items-center space-x-5 text-green-600",
  getStartedBtn: "border px-4 py-1 rounded-full border-green-600",
};

const Header = () => {
  return (
    <header className={styled.headerContainer}>
      <div className={styled.container}>
        <Link href="/">
          <img
            className={styled.logoImage}
            src="https://links.papareact.com/yvf"
            alt=""
          />
        </Link>
        <div className={styled.navigation}>
          <h3>About</h3>
          <h3>Contact</h3>
          <h3 className={styled.followBtn}>Follow</h3>
        </div>
      </div>
      <div className={styled.accountNav}>
        <h3>Sign In</h3>
        <h3 className={styled.getStartedBtn}>Get Started</h3>
      </div>
    </header>
  );
};

export default Header;
