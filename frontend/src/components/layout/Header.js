import React, { Fragment, useState } from "react";
import { Link } from "react-router-dom";
import Search from "./Search";
import { Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useAlert } from "react-alert";
import { logout } from "../../action/userActions";
import styled from "styled-components/macro";
import { getProducts } from "../../action/productActions";
// ===================================================================
const Header = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [price, setPrice] = useState([1, 10000]);
  const [category, setCategory] = useState("");
  const [rating, setRating] = useState(0);
  const alert = useAlert();
  const dispatch = useDispatch();
  const { cartItems } = useSelector((state) => state.cart);
  const { user, loading } = useSelector((state) => state.userR);
  const logoutHandler = () => {
    dispatch(logout());
    alert.success("Logged out successfully");
  };
  let keyword;
  const logoClick = () => {
    dispatch(getProducts(keyword, currentPage, price, category, rating));
  };
  return (
    <Fragment>
      <nav className="navbar d-flex align-items-center">
        <div className="col-md-3 responsive">
          <div className="navbar-brand">
            <Logo to="/" onClick={logoClick}>
              <span>HUNGNH-SHOP</span>
            </Logo>
          </div>
        </div>
        <div className="col-7 col-md-6 col-sm-7 col-xs-7 ">
          <Route render={({ history }) => <Search history={history} />} />
        </div>
        <div className="col-5 col-md-3 col-sm-5 col-xs-5  text-center d-flex align-items-center justify-content-sm-start justify-content-start">
          <Link to="/cart" style={{ textDecoration: "none" }}>
            <span id="cart" className="ml-1">
              Cart
            </span>
            <span className="ml-1" id="cart_count">
              {user ? cartItems.length : "0"}
            </span>
          </Link>
          {user ? (
            <div className="dropdown d-inline">
              <Link
                to="/"
                className="btn dropdown-toggle text-white"
                type="button"
                id="dropDownMenuButton"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false">
                <figure className="avatar avatar-nav ml-1 mr-1">
                  <img
                    src={user.avatar && user.avatar.url}
                    alt={user && user.name}
                    className="rounded-circle"
                  />
                </figure>
                <span>{user && String(user.name).split(" ")[0]}</span>
              </Link>
              <div
                className="dropdown-menu mt-2"
                aria-labelledby="dropDownMenuButton">
                {user && user.role === "admin" && (
                  <Link className="dropdown-item" to="/dashboard">
                    Dashboard
                  </Link>
                )}
                <Link className="dropdown-item" to="/orders/me">
                  My Orders
                </Link>
                <Link className="dropdown-item" to="/me">
                  Profile
                </Link>
                <Link
                  className="dropdown-item text-danger"
                  to="/"
                  onClick={logoutHandler}>
                  Logout
                </Link>
              </div>
            </div>
          ) : (
            !loading && (
              <Link to="/login" className="btn ml-2" id="login_btn">
                <span>LOGIN</span>
                <i className=" fa fa-sign-in "></i>
              </Link>
            )
          )}
        </div>
      </nav>
      {/* <nav class="navbar navbar-expand-lg navbar-light bg-light">
  <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
    <span class="navbar-toggler-icon"></span>
  </button>
  <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
    <div class="navbar-nav d-flex w-100 justify-content-center align-items-center">
    {
            categories.map(category => (
                <Link className="nav-item nav-link mr-2" key={category}
                    style={{cursor:'pointer', color:'#fa0f0f'}}
                    onClick={()=>navHandler(category)}
                    to={`/`}
                    >
                    {category}
                </Link>
            ))
        }

    </div>
  </div>
</nav> */}
    </Fragment>
  );
};
const Logo = styled(Link)`
  font-style: italic;
  text-decoration: none !important;
  span {
    color: #fff;
  }
`;
export default Header;
