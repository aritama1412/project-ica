"use client";

import Image from "next/image";
import logo from "../../../../../public/images/logos/logo1.jpg";
import { useState } from "react";
import { Button } from "@heroui/react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie"; // Import js-cookie for managing cookies
import { showErrorToast } from "@/components/toast/ToastNotification";

const LoginPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = () => {
    setIsLoading(true);

    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: userName,
        password: password,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setIsLoading(false);

        if (data.status === "success") {
          // Store token in cookies
          Cookies.set("authToken", data.data.token, {
            expires: 365, // 1 day
            secure: process.env.NODE_ENV === "production",
            sameSite: "Strict",
          });

          // Redirect to admin dashboard
          router.push("/admin/dashboard");
        } else {
          showErrorToast("Username atau password salah.");
          console.error(data.message);
        }
      })
      .catch((error) => {
        setIsLoading(false);
        showErrorToast("Terjadi kesalahan. Silahkan coba lagi.");
        console.log("Error:", error);
      });
  };

  return (
    <section className="bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <a
          href="#"
          className="flex items-center mb-2 text-2xl font-semibold text-gray-900 dark:text-white"
        >
          <Image
            width={64}
            height={64}
            className="w-16 h-16 mr-2"
            src={logo} priority
            alt="logo"
          />
          Toko Bunga
        </a>
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Sign in
            </h1>
            <div className="space-y-4 md:space-y-6">
              <div>
                <label
                  htmlFor="username"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  onChange={(e) => setUserName(e.target.value)}
                  className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Username"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  required
                />
              </div>
              <Button
                color="primary"
                variant="solid"
                onClick={handleLogin}
                isLoading={isLoading}
                className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
              >
                Log in
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LoginPage;
