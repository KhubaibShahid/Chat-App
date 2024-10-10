import LOGO from "../assets/Gossip-logo.svg";
import { Link } from "react-router-dom";
import { signInWithEmailAndPassword, auth } from "../config/firebase";
import { useForm } from "react-hook-form";
import { useState } from "react";
import Spinner from "../components/loading";


function LoginPage() {

  const { register, handleSubmit } = useForm();

  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  function onSubmit(d) {
    setIsLoading(true);
    signInWithEmailAndPassword(auth, d.email, d.password)
      .then((userCredential) => {
        // Signed in 
        setError(false)
        const user = userCredential.user;
        // ...  auth/invalid-credential
      })
      .catch((error) => {
        setIsLoading(true);
        const errorCode = error.code;
        const errorMessage = error.message;
        setError(true);
        setIsLoading(false)
      });
  }


  return (
    <>
    {isLoading ? <div className="absolute w-full h-svh top-0 left-0 backdrop-blur-sm">
      <Spinner className="flex justify-center mt-60"></Spinner>
    </div> : <></>}
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img alt="Your Company" src={LOGO} className="mx-auto w-120" />
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Sign in to your account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <div className="flex justify-between items-center">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Email address
                </label>
                {error ?
                <div className="text-sm text-red-400">
                  Please enter correct email & password
                </div> : <></>
                }
              </div>
              <div className="mt-2">
                <input
                  {...register("email")}
                  placeholder="abc@example.com"
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset  ${error ? `ring-red-400` : `ring-gray-300`} placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring- sm:text-sm sm:leading-6`}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Password
                </label>
                {error ? 
                <div className="text-sm text-red-400">
                  Please enter correct email & password
                </div> : <></>
                }
              </div>
              <div className="mt-2">
                <input
                  {...register("password")}
                  placeholder="Enter minimum 6 character"
                  id="password"
                  name="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ${error ? `ring-red-400` : `ring-gray-300`} placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6`}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md clr-primary px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Login
              </button>
            </div>
          </form>

          <p className="mt-10 text-center text-sm text-gray-500">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
            >
              Register
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}

export default LoginPage;
