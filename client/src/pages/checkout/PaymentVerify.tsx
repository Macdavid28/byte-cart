import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import api from "../../api/axios";
import { useCartStore } from "../../stores/cartStore";

const PaymentVerify = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "failed">("loading");
  const [orderNumber, setOrderNumber] = useState("");
  const clearLocalCart = useCartStore((s) => s.clearLocalCart);
  const reference = searchParams.get("reference");

  useEffect(() => {
    const verifyPayment = async () => {
      if (!reference) {
        setStatus("failed");
        return;
      }
      try {
        const res = await api.get(`/orders/verify?reference=${reference}`);
        if (res.data.success) {
          setStatus("success");
          setOrderNumber(res.data.order?.orderNumber || "");
          clearLocalCart();
        } else {
          setStatus("failed");
        }
      } catch {
        setStatus("failed");
      }
    };
    verifyPayment();
  }, [reference, clearLocalCart]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-slate-50">
      <div className="w-full max-w-md text-center">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8">
          {status === "loading" && (
            <>
              <Loader2 className="h-16 w-16 animate-spin text-blue-600 mx-auto mb-6" />
              <h1 className="text-2xl font-bold font-secondary text-slate-900 mb-2">
                Verifying Payment...
              </h1>
              <p className="text-slate-500">
                Please wait while we confirm your payment.
              </p>
            </>
          )}

          {status === "success" && (
            <>
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-100 mb-6">
                <CheckCircle className="h-10 w-10 text-emerald-600" />
              </div>
              <h1 className="text-2xl font-bold font-secondary text-slate-900 mb-2">
                Payment Successful!
              </h1>
              <p className="text-slate-500 mb-2">
                Your order has been placed successfully.
              </p>
              {orderNumber && (
                <p className="text-sm font-semibold text-blue-600 bg-blue-50 inline-block px-4 py-1.5 rounded-full mb-6">
                  Order: {orderNumber}
                </p>
              )}

              <div className="flex flex-col gap-3 mt-6">
                <Link to="/dashboard/orders" className="btn-primary py-3">
                  View My Orders
                </Link>
                <Link to="/products" className="btn-outline py-3">
                  Continue Shopping
                </Link>
              </div>
            </>
          )}

          {status === "failed" && (
            <>
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-100 mb-6">
                <XCircle className="h-10 w-10 text-red-600" />
              </div>
              <h1 className="text-2xl font-bold font-secondary text-slate-900 mb-2">
                Payment Failed
              </h1>
              <p className="text-slate-500 mb-6">
                Something went wrong with your payment. Please try again.
              </p>
              <div className="flex flex-col gap-3">
                <Link to="/cart" className="btn-primary py-3">
                  Return to Cart
                </Link>
                <Link to="/products" className="btn-outline py-3">
                  Continue Shopping
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentVerify;
