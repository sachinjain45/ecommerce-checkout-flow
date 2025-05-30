/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useFormik } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Form, Button, Alert, Row, Col, Spinner } from "react-bootstrap";
import React, { useState } from "react";

export const dynamic = "force-dynamic";

export default function CheckoutForm({ product, variant, quantity }: any) {
  const router = useRouter();
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [cardError, setCardError] = useState<string | null>(null);

  const formik = useFormik({
    initialValues: {
      fullName: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      state: "",
    },
    validationSchema: Yup.object({
      fullName: Yup.string()
        .matches(/^[A-Za-z\s]+$/, "Only letters are allowed")
        .required("Full Name is required"),
      email: Yup.string().email("Invalid email").required("Email is required"),
      phone: Yup.string()
        .matches(/^\d+$/, "Only numbers are allowed")
        .required("Phone is required"),
      address: Yup.string()
        .matches(/^[A-Za-z0-9\s,.-]+$/, "Invalid address")
        .required("Address is required"),
      city: Yup.string()
        .matches(/^[A-Za-z\s]+$/, "Only letters are allowed")
        .required("City is required"),
      state: Yup.string()
        .matches(/^[A-Za-z\s]+$/, "Only letters are allowed")
        .required("State is required"),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      setError("");

      if (cardError) {
        setLoading(false);
        setError(cardError);
        return;
      }

      try {
        const cardElement = elements?.getElement(CardElement);
        if (!stripe || !elements || !cardElement)
          throw new Error("Stripe not loaded");

        const intentRes = await fetch("/api/create-payment-intent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: product.price * quantity * 100,
            product: {
              _id: product._id,
              variant,
              quantity,
            },
            customer: values,
          }),
        });

        const { clientSecret } = await intentRes.json();

        const confirmResult = await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: cardElement,
            billing_details: {
              name: values.fullName,
              email: values.email,
              phone: values.phone,
              address: {
                line1: values.address,
                city: values.city,
                state: values.state,
              },
            },
          },
        });

        if (confirmResult.error) {
          throw new Error(confirmResult.error.message);
        }

        const paymentIntent = confirmResult.paymentIntent;

        const orderResp = await fetch("/api/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            customer: values,
            product: {
              _id: product._id,
              variant,
              quantity,
            },
            paymentMethodId: paymentIntent.payment_method,
            paymentIntentId: paymentIntent.id,
          }),
        });

        const result = await orderResp.json();
        if (result.status === "approved") {
          router.push(`/thank-you/${result.orderNumber}`);
        } else {
          throw new Error("Transaction not approved");
        }
      } catch (err: any) {
        setError(err.message || "Something went wrong");
        console.log("cardError", cardError);

        fetch("/api/sendMailDecline", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: values.fullName,
            email: values?.email,
            phone: values?.phone,
            error: err.message || "Unknown error",
            product,
            variant,
            quantity,
          }),
        });
      } finally {
        setLoading(false);
      }
    },
  });

  const handleCardChange = (event: any) => {
    if (event.error) {
      setCardError(event.error.message);
    } else {
      setCardError(null);
    }
  };

  return (
    <Form onSubmit={formik.handleSubmit}>
      {error && <Alert variant="danger">{error}</Alert>}

      <Form.Group className="mb-3">
        <Form.Label>Email</Form.Label>
        <Form.Control
          type="email"
          name="email"
          placeholder="Enter your email"
          value={formik.values.email}
          onChange={formik.handleChange}
          isInvalid={!!formik.errors.email && formik.touched.email}
        />
        <Form.Control.Feedback type="invalid">
          {formik.errors.email}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Phone</Form.Label>
        <Form.Control
          type="tel"
          name="phone"
          placeholder="Enter phone number"
          inputMode="numeric"
          pattern="\d*"
          value={formik.values.phone}
          onChange={formik.handleChange}
          isInvalid={!!formik.errors.phone && formik.touched.phone}
        />
        <Form.Control.Feedback type="invalid">
          {formik.errors.phone}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Full Name</Form.Label>
        <Form.Control
          type="text"
          name="fullName"
          placeholder="Enter your full name"
          pattern="[A-Za-z\s]+"
          value={formik.values.fullName}
          onChange={formik.handleChange}
          isInvalid={!!formik.errors.fullName && formik.touched.fullName}
        />
        <Form.Control.Feedback type="invalid">
          {formik.errors.fullName}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Address</Form.Label>
        <Form.Control
          type="text"
          name="address"
          placeholder="Enter your address"
          value={formik.values.address}
          onChange={formik.handleChange}
          isInvalid={!!formik.errors.address && formik.touched.address}
        />
        <Form.Control.Feedback type="invalid">
          {formik.errors.address}
        </Form.Control.Feedback>
      </Form.Group>

      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>City</Form.Label>
            <Form.Control
              type="text"
              name="city"
              placeholder="City name"
              pattern="[A-Za-z\s]+"
              value={formik.values.city}
              onChange={formik.handleChange}
              isInvalid={!!formik.errors.city && formik.touched.city}
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.city}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>State</Form.Label>
            <Form.Control
              type="text"
              name="state"
              placeholder="State name"
              pattern="[A-Za-z\s]+"
              value={formik.values.state}
              onChange={formik.handleChange}
              isInvalid={!!formik.errors.state && formik.touched.state}
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.state}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>

      <h5 className="mt-4 mb-3">Payment</h5>
      <Form.Group className="mb-3">
        <Form.Label>Card Details</Form.Label>
        <div className="border p-2 rounded">
          <CardElement onChange={handleCardChange} />
        </div>
        {cardError && (
          <div style={{ color: "red", marginTop: "0.5rem" }}>{cardError}</div>
        )}
      </Form.Group>

      <Button
        type="submit"
        className="w-100 mt-3"
        disabled={loading || !stripe || !!cardError}
      >
        {loading ? (
          <>
            <Spinner animation="border" size="sm" className="me-2" />
            Processing...
          </>
        ) : (
          "Pay Now"
        )}
      </Button>
    </Form>
  );
}
