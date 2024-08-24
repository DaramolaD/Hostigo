import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import * as apiClient from "../api-client";
import { useAppContext } from "../contexts/useAppContext";
import { useNavigate } from "react-router-dom";

export type RegisterFormData = {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
};

const Register = () => {
  const navigate = useNavigate();
  const { showToast } = useAppContext();
  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>();

  const mutations = useMutation({
    mutationFn: apiClient.register,
    onSuccess: () => {
      showToast({ message: "Registration is a Success!", type: "SUCCESS" });
      navigate("/");
    },
    onError: (error: Error) => {
      showToast({ message: error.message, type: "ERROR" });
    },
  });
  const onSubmit = handleSubmit((data) => {
    mutations.mutate(data);
  });
  return (
    <form action="" className="flex flex-col gap-5" onSubmit={onSubmit}>
      <h2 className="text-2xl font-bold">Create an Account</h2>
      <div className="flex flex-col md:flex-row gap-5">
        <label className="text-gray-700 text-sm font-bold flex-1">
          First Name
          <input
            type="text"
            className="border rounded w-full py-1 px-2 font-normal"
            {...register("firstName", { required: "This field is required" })}
          />
          {errors.firstName && (
            <span className="text-red-500">{errors.firstName.message}</span>
          )}
        </label>
        <label className="text-gray-700 text-sm font-bold flex-1">
          Last Name
          <input
            type="text"
            className="border rounded w-full py-1 px-2 font-normal"
            {...register("lastName", { required: "This field is required" })}
          />
          {errors.lastName && (
            <span className="text-red-500">{errors.lastName.message}</span>
          )}
        </label>
      </div>
      <label className="text-gray-700 text-sm font-bold flex-1">
        Email
        <input
          type="email"
          className="border rounded w-full py-1 px-2 font-normal"
          {...register("email", { required: "This field is required" })}
        />
        {errors.email && (
          <span className="text-red-500">{errors.email.message}</span>
        )}
      </label>
      <label className="text-gray-700 text-sm font-bold flex-1">
        Password
        <input
          type="password"
          className="border rounded w-full py-1 px-2 font-normal"
          {...register("password", {
            required: "This field is required",
            minLength: { value: 6, message: "Password must be 6 characters" },
          })}
        />
        {errors.password && (
          <span className="text-red-500">{errors.password.message}</span>
        )}
      </label>
      <label className="text-gray-700 text-sm font-bold flex-1">
        Confirm Password
        <input
          type="password"
          className="border rounded w-full py-1 px-2 font-normal"
          {...register("confirmPassword", {
            validate: (val) => {
              if (!val) {
                return "This field is required";
              } else if (watch("password") !== val) {
                return "Your passwords don't match";
              }
            },
          })}
        />
        {errors.confirmPassword && (
          <span className="text-red-500">{errors.confirmPassword.message}</span>
        )}
      </label>
      <span>
        {/* <button
          type="submit"
          className="bg-blue-600 text-white p-2 font-bold hover:bg-blue-500"
        >
          Create Account
        </button> */}

        <button
          type="submit"
          className={`bg-blue-600 text-white p-2 font-bold flex items-center justify-center ${
            mutations.isPending
              ? "hover:bg-blue-600 cursor-not-allowed"
              : "hover:bg-blue-500"
          }`}
          disabled={mutations.isPending}
        >
          {mutations.isPending ? (
            <div className="flex items-center gap-1 space-x-1">
              <span>Creating</span>
              <div className="flex items-center gap-1">
                <span className="h-2 w-2 bg-white rounded-full animate-bounce"></span>
                <span className="h-2 w-2 bg-white rounded-full animate-bounce delay-150"></span>
                <span className="h-2 w-2 bg-white rounded-full animate-bounce delay-300"></span>
              </div>
            </div>
          ) : (
            "Create Account"
          )}
        </button>
      </span>
    </form>
  );
};

export default Register;
