// src/components/NewsletterForm.tsx
import { useForm } from "react-hook-form";
import { useState } from "react";
import { createNewsletterSubscriber } from "@/lib/newsletters";

type FormData = {
  email: string;
};

export default function NewsletterForm() {
  const { register, handleSubmit, reset } = useForm<FormData>();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setMessage("");

    try {
      await createNewsletterSubscriber(data.email);
      setMessage("Subscribed successfully!");
      reset();
    } catch (error) {
      setMessage("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-md w-full max-w-md mx-auto">
      <h3 className="text-lg font-semibold mb-3">Subscribe to Our Newsletter</h3>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col space-y-3">
        <input
          type="email"
          placeholder="Enter your email"
          {...register("email", { required: true })}
          className="p-3 border border-gray-300 rounded-xl"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white py-2 px-4 rounded-xl hover:bg-blue-700 transition"
        >
          {loading ? "Subscribing..." : "Subscribe"}
        </button>
        {message && <p className="text-sm text-gray-700">{message}</p>}
      </form>
    </div>
  );
}
