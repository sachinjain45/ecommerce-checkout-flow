"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Row, Col, Button, Container, Spinner } from "react-bootstrap";

type Product = {
  _id: string;
  title: string;
  description: string;
  price: number;
  image: string;
  variants: string[];
  sizes?: string[];
};

export default function LandingPage() {
  const [product, setProduct] = useState<Product | null>(null);
  const [variant, setVariant] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  const [size, setSize] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch("/api/product");
        const data: Product = await res.json();
        setProduct(data);

        if (data.variants.length === 1) {
          setVariant(data.variants[0]);
        }
      } catch (err) {
        console.error("Failed to fetch product", err);
      }
    };

    fetchProduct();

    // Add keyframe style for loader
    const style = document.createElement("style");
    style.innerHTML = `
      @keyframes spin {
        100% { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const handleBuyNow = () => {
    if (!product || !variant || quantity < 1) return;

    setLoading(true);
    setTimeout(() => {
      router.push(
        `/checkout?productId=${product._id}&variant=${variant}&quantity=${quantity}&size=${size}`
      );
    }, 1000);
  };

  if (!product) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 bg-dark">
        <div style={loaderStyle}></div>
      </div>
    );
  }

  return (
    <Container
      className="py-5 text-white"
      style={{ backgroundColor: "#1D2230", borderRadius: "12px" }}
    >
      <Row className="align-items-start">
        <Col md={6} className="d-flex justify-content-center mb-4 mb-md-0">
          <img
            src={product.image}
            alt={product.title}
            style={{
              maxWidth: "100%",
              borderRadius: "12px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
              backgroundColor: "#fff",
            }}
          />
        </Col>

        <Col md={6}>
          <h2 className="fw-bold">{product.title.toUpperCase()}</h2>
          <h4 className="mb-4">CLASSIC BACKPACK</h4>

          <div className="mb-3">
            <label style={{ fontSize: "14px", color: "#aaa" }}>Color</label>
            <div className="d-flex flex-wrap gap-2 mt-2">
              {product.variants.map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setVariant(v)}
                  disabled={loading}
                  className="fw-bold"
                  style={{
                    padding: "8px 16px",
                    borderRadius: "20px",
                    backgroundColor: variant === v ? "#fff" : "#2A2F45",
                    color: variant === v ? "#1D2230" : "#fff",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>

          {product.sizes && (
            <div className="mb-3">
              <label style={{ fontSize: "14px", color: "#aaa" }}>Size</label>
              <div className="d-flex flex-wrap gap-2 mt-2">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSize(s)}
                    disabled={loading}
                    className="fw-bold"
                    style={{
                      padding: "8px 16px",
                      borderRadius: "20px",
                      backgroundColor: size === s ? "#fff" : "#2A2F45",
                      color: size === s ? "#1D2230" : "#fff",
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mb-3">
            <label style={{ fontSize: "14px", color: "#aaa" }}>Quantity</label>
            <div className="d-flex align-items-center gap-3 mt-2">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={loading}
                style={buttonStyle}
              >
                –
              </button>
              <span className="fw-bold fs-5">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity(quantity + 1)}
                disabled={loading}
                style={buttonStyle}
              >
                +
              </button>
            </div>
          </div>

          <div className="fw-bold my-3 fs-5">${product.price.toFixed(2)}</div>

          <Button
            onClick={handleBuyNow}
            disabled={!variant || quantity < 1 || loading}
            variant="light"
            className="text-dark fw-bold px-4 py-2"
            style={{ borderRadius: "8px" }}
          >
            {loading ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                  className="me-2"
                />
                Processing...
              </>
            ) : (
              "Buy it now"
            )}
          </Button>
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

const buttonStyle: React.CSSProperties = {
  backgroundColor: "#2A2F45",
  color: "#fff",
  border: "none",
  borderRadius: "8px",
  padding: "4px 12px",
  fontSize: "20px",
  fontWeight: "bold",
  cursor: "pointer",
};
