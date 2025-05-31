// hooks/useCheckoutForm.ts
"use client";

import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { useRouter } from "next/navigation";

export const useCheckoutForm = (
  product: any,
  variant: any,
  quantity: number
) => {
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
      zipCode: "",
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
      zipCode: Yup.string()
        .matches(/^\d{5}(-\d{4})?$/, "Invalid ZIP code")
        .required("ZIP Code is required"),
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
        fetch("/api/sendMailDecline", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: formik.values.fullName,
            email: formik.values.email,
            phone: formik.values.phone,
            zipCode: formik.values.zipCode,
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

  return {
    formik,
    loading,
    error,
    cardError,
    handleCardChange,
    stripe,
  };
};
