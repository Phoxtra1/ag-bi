
import { useForm } from "react-hook-form";
import { account } from "@/lib/appwrite";
import { ID } from "appwrite";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data: any) => {
    try {
      await account.create(ID.unique(), data.email, data.password, data.name);
      await account.createEmailPasswordSession(data.email, data.password);
      navigate("/dashboard");
    } catch (error: any) {
      alert("Signup failed: " + error.message);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-semibold mb-4">Sign Up</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input
          type="text"
          placeholder="Full Name"
          {...register("name", { required: true })}
          className="w-full p-2 border rounded"
        />
        {errors.name && <span className="text-red-500">Name is required</span>}

        <input
          type="email"
          placeholder="Email"
          {...register("email", { required: true })}
          className="w-full p-2 border rounded"
        />
        {errors.email && <span className="text-red-500">Email is required</span>}

        <input
          type="password"
          placeholder="Password"
          {...register("password", { required: true })}
          className="w-full p-2 border rounded"
        />
        {errors.password && <span className="text-red-500">Password is required</span>}

        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
          Create Account
        </button>
      </form>
    </div>
  );
}
