"use client";

import { useState } from "react";
import { MapPin, Truck, Clock, CheckCircle, ShieldCheck, Loader2, RotateCcw } from "lucide-react";

export default function PincodeChecker() {
  const [pincode, setPincode] = useState("");
  const [result, setResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCheck = async () => {
    if (!/^\d{6}$/.test(pincode)) {
      setError("Enter a valid 6-digit pincode");
      return;
    }

    setIsLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch(`/api/delivery-check?pincode=${pincode}`);
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to check");
        return;
      }

      setResult(data);
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        marginTop: "24px",
        padding: "16px",
        borderRadius: "12px",
        border: "1px solid var(--color-border)",
        backgroundColor: "var(--color-surface-elevated)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
        <MapPin style={{ width: "16px", height: "16px", color: "var(--color-accent)" }} />
        <span style={{ fontSize: "14px", fontWeight: 600 }}>Delivery & Services</span>
      </div>

      <div style={{ display: "flex", gap: "8px" }}>
        <input
          type="text"
          inputMode="numeric"
          maxLength={6}
          placeholder="Enter pincode"
          value={pincode}
          onChange={(e) => {
            setPincode(e.target.value.replace(/\D/g, ""));
            setResult(null);
            setError("");
          }}
          onKeyDown={(e) => e.key === "Enter" && handleCheck()}
          style={{
            flex: 1,
            padding: "10px 14px",
            borderRadius: "8px",
            border: "1px solid var(--color-border)",
            fontSize: "14px",
            outline: "none",
            backgroundColor: "#fff",
          }}
        />
        <button
          onClick={handleCheck}
          disabled={isLoading || pincode.length !== 6}
          style={{
            padding: "10px 18px",
            borderRadius: "8px",
            backgroundColor: "var(--color-accent)",
            color: "#fff",
            fontSize: "13px",
            fontWeight: 600,
            border: "none",
            cursor: "pointer",
            opacity: isLoading || pincode.length !== 6 ? 0.6 : 1,
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          {isLoading ? <Loader2 style={{ width: "14px", height: "14px", animation: "spin 1s linear infinite" }} /> : "Check"}
        </button>
      </div>

      {error && (
        <p style={{ fontSize: "12px", color: "var(--color-error, #e53e3e)", marginTop: "8px" }}>
          {error}
        </p>
      )}

      {result && (
        <div style={{ marginTop: "14px" }}>
          {result.available ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {/* Delivery estimate */}
              <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                <Truck style={{ width: "16px", height: "16px", color: "var(--color-success, #38a169)", marginTop: "2px", flexShrink: 0 }} />
                <div>
                  <p style={{ fontSize: "13px", fontWeight: 600 }}>
                    Get it by{" "}
                    <span style={{ color: "var(--color-success, #38a169)" }}>
                      {result.estimated_delivery}
                    </span>
                  </p>
                  {result.city && (
                    <p style={{ fontSize: "11px", color: "var(--color-text-muted)" }}>
                      Delivering to {result.city}
                    </p>
                  )}
                </div>
              </div>

              {/* COD available */}
              {result.cod_available && (
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <CheckCircle style={{ width: "16px", height: "16px", color: "var(--color-success, #38a169)", flexShrink: 0 }} />
                  <p style={{ fontSize: "13px" }}>Cash on Delivery available</p>
                </div>
              )}

              {/* Free shipping */}
              {result.free_shipping && (
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <CheckCircle style={{ width: "16px", height: "16px", color: "var(--color-success, #38a169)", flexShrink: 0 }} />
                  <p style={{ fontSize: "13px" }}>Free shipping on orders above ₹999</p>
                </div>
              )}

              {/* Return policy */}
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <RotateCcw style={{ width: "16px", height: "16px", color: "var(--color-text-muted)", flexShrink: 0 }} />
                <p style={{ fontSize: "13px" }}>7-day easy returns</p>
              </div>

              {/* Made to order */}
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <Clock style={{ width: "16px", height: "16px", color: "var(--color-text-muted)", flexShrink: 0 }} />
                <p style={{ fontSize: "13px", color: "var(--color-text-secondary)" }}>
                  Made-to-order · Includes 2-3 days processing
                </p>
              </div>
            </div>
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <MapPin style={{ width: "16px", height: "16px", color: "var(--color-error, #e53e3e)", flexShrink: 0 }} />
              <p style={{ fontSize: "13px", color: "var(--color-error, #e53e3e)" }}>
                {result.message || "Delivery not available to this pincode"}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
