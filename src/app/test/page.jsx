import React from "react";

// This function can be named anything
async function getProducts() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/products/get-all-products`, {
    cache: "no-store",
  });
  const products = await res.json();

  return products;
}

export default async function Test() {
  const products = await getProducts();

  console.log("products", products);
  const data = [];
  return <div>page</div>;
}
