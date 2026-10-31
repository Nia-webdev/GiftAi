import { PAYMENT_METHODS } from "../utils/orders";

function PaymentMethods({
  method,
  onMethodChange,
  mobile,
  onMobileChange,
  error,
}) {
  const selected = PAYMENT_METHODS.find((item) => item.id === method);

  return (
    <div>
      <p className="mb-3 text-sm font-semibold text-slate-200">
        Payment Method
      </p>

      <div className="grid gap-3 sm:grid-cols-3">
        {PAYMENT_METHODS.map((item) => {
          const active = item.id === method;

          return (
            <label
              key={item.id}
              className={`cursor-pointer rounded-xl border p-4 transition duration-500 ease-out ${
                active
                  ? "border-cyan-400 bg-cyan-400/10"
                  : "border-[#164E82] bg-[#071D3A] hover:border-cyan-400/50"
              }`}
            >
              <input
                type="radio"
                name="paymentMethod"
                value={item.id}
                checked={active}
                onChange={() => onMethodChange(item.id)}
                className="sr-only"
              />

              <span className="text-2xl">{item.icon}</span>

              <p className="mt-2 text-sm font-bold">{item.label}</p>

              <p className="mt-1 text-xs leading-5 text-[#94ABC1]">
                {item.description}
              </p>
            </label>
          );
        })}
      </div>

      {selected?.wallet && (
        <div className="mt-4">
          <label
            htmlFor="walletNumber"
            className="mb-2 block text-sm text-slate-300"
          >
            {selected.label} mobile number
          </label>

          <input
            id="walletNumber"
            type="tel"
            inputMode="numeric"
            maxLength={11}
            value={mobile}
            onChange={(event) =>
              onMobileChange(event.target.value.replace(/\D/g, ""))
            }
            placeholder="03XXXXXXXXX"
            className="w-full rounded-lg border border-[#164E82] bg-[#071D3A] px-4 py-3 outline-none focus:border-[#22D3EE]"
          />

          <p className="mt-2 text-xs text-[#94ABC1]">
            Demo mode: no real payment is taken. Only the last 4 digits are
            saved with the order.
          </p>
        </div>
      )}

      {error && <p className="mt-3 text-sm text-rose-300">{error}</p>}
    </div>
  );
}

export default PaymentMethods;