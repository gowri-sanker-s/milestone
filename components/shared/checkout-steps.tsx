import React from "react";

const CheckoutSteps = ({ current = 0 }) => {
  return (
    <div className="flex gap-4 justify-between">
      {["User Login", "Shipping Address", "Payment Method", "Place Order"].map(
        (step, index) => (
          <div key={index} className="flex">
            <div>{step}</div>
            {index < 3 && <div> - </div>}
          </div>
        ),
      )}
    </div>
  );
};

export default CheckoutSteps;
