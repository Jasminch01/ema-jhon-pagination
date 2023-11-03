import React, { useEffect, useState } from "react";
import {
  addToDb,
  deleteShoppingCart,
  getShoppingCart,
} from "../../utilities/fakedb";
import Cart from "../Cart/Cart";
import Product from "../Product/Product";
import "./Shop.css";
import { Link, useLoaderData } from "react-router-dom";
import { faCropSimple } from "@fortawesome/free-solid-svg-icons";

const Shop = () => {
  const [products, setProducts] = useState([]);
  const cart = useLoaderData();
  const [currentPage, setCurrentPage] = useState(0);
  const [itmesPerPage, setItemsPerPages] = useState(10);
  const [count, setCount] = useState(0);
  console.log(count);

  const pages = Math.ceil(count / itmesPerPage);

  const numberOfPages = [...Array(pages).keys()];
//   console.log(numberOfPages);

  
//   useEffect(() => {
//       fetch("http://localhost:5000/products")
//       .then((res) => res.json())
//       .then((data) => setProducts(data));
//     }, []);
    
    useEffect(() => {
      fetch("http://localhost:5000/productsCount")
        .then((res) => res.json())
        .then((data) => setCount(data.count));
    }, []);

  useEffect(() => {
    fetch(
      `http://localhost:5000/products?page=${currentPage}&size=${itmesPerPage}`
    )
      .then((res) => res.json())
      .then((data) => setProducts(data));
  }, [currentPage, itmesPerPage]);

  //   useEffect(() => {
  //     const storedCart = getShoppingCart();
  //     const savedCart = [];
  //     // step 1: get id of the addedProduct
  //     for (const id in storedCart) {
  //       // step 2: get product from products state by using id
  //       const addedProduct = products.find((product) => product._id === id);
  //       if (addedProduct) {
  //         // step 3: add quantity
  //         const quantity = storedCart[id];
  //         addedProduct.quantity = quantity;
  //         // step 4: add the added product to the saved cart
  //         savedCart.push(addedProduct);
  //       }
  //       // console.log('added Product', addedProduct)
  //     }
  //     // step 5: set the cart
  //     setCart(savedCart);
  //   }, [products]);

  const handleItemsPerPage = (e) => {
    const value = parseInt(e.target.value);
    setItemsPerPages(value);
    setCurrentPage(0);
  };

  const handlePrev = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };
  const handleNext = () => {
    if (currentPage < numberOfPages.length - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleAddToCart = (product) => {
    // cart.push(product); '
    let newCart = [];
    // const newCart = [...cart, product];
    // if product doesn't exist in the cart, then set quantity = 1
    // if exist update quantity by 1
    const exists = cart.find((pd) => pd._id === product._id);
    if (!exists) {
      product.quantity = 1;
      newCart = [...cart, product];
    } else {
      exists.quantity = exists.quantity + 1;
      const remaining = cart.filter((pd) => pd._id !== product._id);
      newCart = [...remaining, exists];
    }

    setCart(newCart);
    addToDb(product._id);
  };

  const handleClearCart = () => {
    setCart([]);
    deleteShoppingCart();
  };

  return (
    <div className="shop-container">
      <div className="products-container">
        {products.map((product) => (
          <Product
            key={product._id}
            product={product}
            handleAddToCart={handleAddToCart}
          ></Product>
        ))}
      </div>
      <div className="cart-container">
        <Cart cart={cart} handleClearCart={handleClearCart}>
          <Link className="proceed-link" to="/orders">
            <button className="btn-proceed">Review Order</button>
          </Link>
        </Cart>
      </div>
      <div className="my-20 text-center">
        <div>
          <p>currentPage : {currentPage}</p>
          <button className="px-4 py-2" onClick={handlePrev}>
            Prev
          </button>
          {numberOfPages.map((page) => (
            <button
              className={
                currentPage === page
                  ? "px-4 py-2 mr-3 bg-green-500 text-white "
                  : "px-4 py-2 mr-3 bg-slate-100"
              }
              onClick={() => setCurrentPage(page)}
              key={page}
            >
              {page}
            </button>
          ))}
          <button onClick={handleNext} className="px-4 py-2">
            Next
          </button>
          <select name="" id="" onChange={handleItemsPerPage}>
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default Shop;
