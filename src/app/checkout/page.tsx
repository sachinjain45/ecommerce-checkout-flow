"use client";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { Row, Col, Image, Container, Card } from "react-bootstrap";
import React, { useEffect, useState } from "react";
import CheckoutForm from "./component/checkoutForm";

export const dynamic = "force-dynamic";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string
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
      <h2 className="text-center mb-5 fw-bold text-primary">Checkout</h2>

      <Row>
        <Col md={6}>
          <Card className="shadow-sm mb-4 mb-md-0">
            <Card.Header className="bg-white">
              <h4 className="mb-0">Payment Details</h4>
            </Card.Header>
            <Card.Body>
              <Elements stripe={stripePromise} options={options}>
                <CheckoutForm
                  product={product}
                  variant={variant}
                  quantity={quantity}
                />
              </Elements>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card className="shadow-sm">
            <Card.Header className="bg-white">
              <h4 className="mb-0">Product Summary</h4>
            </Card.Header>
            <Card.Body>
              <Row className="align-items-center">
                <Col md={12} className="mb-3">
                  <Image
                    src={product.image}
                    alt={product.title}
                    rounded
                    fluid
                    style={{ maxHeight: "180px", objectFit: "cover" }}
                  />
                </Col>
                <Col md={12}>
                  <h5 className="fw-semibold">{product.title}</h5>
                  <p className="text-muted small">{product.description}</p>
                  <p className="mb-1">
                    Variant: <strong>{variant || "Default"}</strong>
                  </p>
                  <p className="mb-1">
                    Quantity: <strong>{quantity}</strong>
                  </p>
                  <p className="fs-5 fw-bold mt-3">
                    Total: ${product.price * quantity}
                  </p>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
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
