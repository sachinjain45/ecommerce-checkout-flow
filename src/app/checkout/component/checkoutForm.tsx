"use client";

import React from "react";
import { Form, Button, Alert, Row, Col, Spinner } from "react-bootstrap";
import { CardElement } from "@stripe/react-stripe-js";
import { useCheckoutForm } from "./useCheckoutForm";

export default function CheckoutForm({ product, variant, quantity }: any) {
  const { formik, loading, error, cardError, handleCardChange, stripe } =
    useCheckoutForm(product, variant, quantity);

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

      <Form.Group className="mb-3">
        <Form.Label>ZIP Code</Form.Label>
        <Form.Control
          type="text"
          name="zipCode"
          placeholder="Enter ZIP Code"
          value={formik.values.zipCode}
          onChange={formik.handleChange}
          isInvalid={!!formik.errors.zipCode && formik.touched.zipCode}
        />
        <Form.Control.Feedback type="invalid">
          {formik.errors.zipCode}
        </Form.Control.Feedback>
      </Form.Group>

      <h5 className="mt-4 mb-3">Payment</h5>
      <Form.Group className="mb-3">
        <Form.Label>Card Details</Form.Label>
        <div className="border p-2 rounded">
          <CardElement
            options={{
              hidePostalCode: true,
              style: {
                base: {
                  fontSize: "16px",
                  color: "#32325d",
                  "::placeholder": {
                    color: "#aab7c4",
                  },
                },
                invalid: {
                  color: "#fa755a",
                  iconColor: "#fa755a",
                },
              },
            }}
            onChange={handleCardChange}
          />
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
