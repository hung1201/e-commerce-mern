import React, { Fragment, memo } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
const SliderCom = () => {
  const { products } = useSelector((state) => state.productsSlide);
  return (
    <div
      id="carouselExampleIndicators"
      className="carousel slide"
      data-ride="carousel"
      style={{ backgroundColor: "#e9e9e9" }}>
      <ol className="carousel-indicators">
        {products &&
          products
            .slice(-3)
            .map((product, key) => (
              <li
                data-target="#carouselExampleIndicators"
                data-slide-to={key}
                key={key}
                className={`active ${product._id}`}></li>
            ))}
      </ol>
      <div className="carousel-inner">
        {products &&
          products.slice(-3).map((product, key) => (
            <Fragment key={key}>
              <Link
                className={`carousel-item ${key == 0 ? "active" : ""}`}
                key={key}
                style={{ width: "100%", height: "400px" }}
                to={`/products/${product._id}`}>
                <img
                  className="d-flex w-80 h-100 carousel__image"
                  src={product.images[0].url}
                  alt="First slide"
                  style={{ margin: "auto" }}
                />
              </Link>
            </Fragment>
          ))}
      </div>
      <a
        className="carousel-control-prev"
        href="#carouselExampleIndicators"
        role="button"
        data-slide="prev">
        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
        <span className="sr-only">Previous</span>
      </a>
      <a
        className="carousel-control-next"
        href="#carouselExampleIndicators"
        role="button"
        data-slide="next">
        <span className="carousel-control-next-icon" aria-hidden="true"></span>
        <span className="sr-only">Next</span>
      </a>
    </div>
  );
};
export default memo(SliderCom);
