"use client";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { Row, Col, Image, Container } from "react-bootstrap";
import React, { useEffect, useState } from "react";
import CheckoutForm from "./component/checkoutForm";

export const dynamic = "force-dynamic";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ""
);

export default function CheckoutPage() {
  const [searchParams, setSearchParams] = useState<URLSearchParams | null>(
    null
  );
  const [product, setProduct] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setSearchParams(new URLSearchParams(window.location.search));
    }
  }, []);

  const productId = searchParams?.get("productId");
  const variant = searchParams?.get("variant") ?? "";
  const quantity = Number(searchParams?.get("quantity")) || 1;

  useEffect(() => {
    if (productId) {
      fetch(`/api/product/${productId}`)
        .then((res) => res.json())
        .then(setProduct)
        .catch(() => setProduct(null));
    }
  }, [productId]);

  if (!searchParams || !product) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 bg-dark">
        <div style={loaderStyle}></div>
      </div>
    );
  }

  const options: any = {
    mode: "payment",
    currency: "usd",
    amount: product.price * quantity * 100,
  };

  return (
    <Container className="py-5">
      <h2 className="text-center mb-5">Checkout</h2>

      <div className="p-4 mb-4 border rounded bg-light">
        <h4 className="fw-bold">Product Summary</h4>
        <Row className="align-items-center">
          <Col md={3}>
            <Image
              src={product.image}
              alt={product.title}
              className="img-fluid rounded"
            />
          </Col>
          <Col md={9}>
            <h5>{product.title}</h5>
            <p>{product.description}</p>
            <p>
              Variant: <strong>{variant}</strong> | Quantity:{" "}
              <strong>{quantity}</strong>
            </p>
            <p>
              Price:{" "}
              <strong>
                ${product.price} × {quantity} = ${product.price * quantity}
              </strong>
            </p>
          </Col>
        </Row>
      </div>

      <Elements stripe={stripePromise} options={options}>
        <CheckoutForm product={product} variant={variant} quantity={quantity} />
      </Elements>
    </Container>
  );
}

const loaderStyle: React.CSSProperties = {
  width: "64px",
  height: "64px",
  borderRadius: "50%",
  background:
    "radial-gradient(farthest-side, #ffffff 94%, #0000) top/10px 10px no-repeat," +
    "radial-gradient(farthest-side, #ffffff 94%, #0000) left/10px 10px no-repeat," +
    "radial-gradient(farthest-side, #ffffff 94%, #0000) right/10px 10px no-repeat," +
    "radial-gradient(farthest-side, #ffffff 94%, #0000) bottom/10px 10px no-repeat",
  backgroundColor: "#1D2230",
  animation: "spin 1s infinite linear",
};

if (typeof document !== "undefined") {
  const style = document.createElement("style");
  style.innerHTML = `
    @keyframes spin {
      100% { transform: rotate(360deg); }
    }
  `;
  document.head.appendChild(style);
}
