import React, { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import Swal from "sweetalert2";
import useAxios from "../../Hooks/useAxios";
import useAuth from "../../Hooks/useAuth";

const FundingForm = ({ closeForm, queryClient }) => {
  const stripe = useStripe();
  const elements = useElements();
  const axiosInstance = useAxios();
  const { user } = useAuth();
  const [isPaying, setIsPaying] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsPaying(true); // ✅ start loading
    const amount = parseFloat(e.target.amount.value);

    if (!stripe || !elements || isNaN(amount) || amount <= 0) {
      setIsPaying(false);
      return Swal.fire("Error", "Invalid input", "error");
    }

    try {
      const { data: clientSecret } = await axiosInstance.post(
        "/create-payment-intent",
        { amount }
      );

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: user.displayName,
            email: user.email,
          },
        },
      });

      if (result.error) {
        Swal.fire("Payment Failed", result.error.message, "error");
      } else if (result.paymentIntent.status === "succeeded") {
        const paymentData = {
          name: user.displayName,
          email: user.email,
          amount,
          createdAt: new Date(),
          transactionId: result.paymentIntent.id,
        };

        await axiosInstance.post("/fundings", paymentData);
        queryClient.invalidateQueries({ queryKey: ["fundings"] });
        Swal.fire("Thank You!", "Your fund was received", "success");
        closeForm();
      }
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Payment process failed", "error");
    } finally {
      setIsPaying(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="border border-secondary max-w-xl mx-auto p-6 rounded-lg shadow mb-8 space-y-4"
    >
      <h3 className="text-lg text-primary font-semibold">Donate Now</h3>
      <input
        type="number"
        name="amount"
        placeholder="Enter amount"
        className="input input-bordered w-full"
        required
        min={1}
      />
      <div className="border p-2 rounded">
        <CardElement />
      </div>
      <div className="flex justify-end gap-2">
        <button type="button" className="btn btn-ghost" onClick={closeForm}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary" disabled={isPaying}>
          {isPaying ? "Paying..." : "Pay"}
        </button>
      </div>
    </form>
  );
};

export default FundingForm;
