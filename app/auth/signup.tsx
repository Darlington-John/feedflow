import { useState } from "react";
import ClassicInput from "../dashboard/components/inputs/classic-inputs";
import AsyncButton from "../dashboard/components/buttons/async-button";
interface SignupProps {
  email: string;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
  password: string;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
  error?: string;
  setError?: React.Dispatch<React.SetStateAction<string>>;
  errorContent?: string;
  // currentAction?: string;
  setCurrentAction?: React.Dispatch<React.SetStateAction<string>>;
  username: string;
  setUsername: React.Dispatch<React.SetStateAction<string>>;
  submit: (action: string) => void;
  loading: boolean;
  success: boolean;
}

const Signup = ({
  email,
  password,
  setEmail,
  setPassword,
  setError,
  errorContent,
  error,
  // currentAction,
  setCurrentAction,
  username,
  setUsername,
  submit,
  success,
  loading,
}: SignupProps) => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const toggleVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };
  return (
    <div className="flex items-center w-full flex-col gap-3 ">
      <ClassicInput
        value={username}
        setValue={setUsername}
        setError={setError}
        errorContent={errorContent}
        error={error}
        label="username*"
        inputType="text"
        name="firstName"
      />

      <ClassicInput
        value={email}
        setValue={setEmail}
        setError={setError}
        errorContent={errorContent}
        error={error}
        label="email*"
        inputType="email"
        name="email"
        serverError={["This email is already in use, login instead."]}
      />

      <ClassicInput
        value={password}
        label="password*"
        setValue={setPassword}
        setError={setError}
        errorContent={errorContent}
        error={error}
        name="password"
        inputType={passwordVisible ? "text" : "password"}
        password
        toggleVisibility={toggleVisibility}
        passwordVisible={passwordVisible}
      />

      <div className="flex flex-col gap-3 w-full  text-sm pt-5">
        <h1 className="text-white">
          Already have an account?{" "}
          <button
            className="text-powder-blue"
            onClick={() => {
              setCurrentAction?.("log-in");
              setError?.("");
            }}
          >
            Log In
          </button>
        </h1>
      </div>
      {error !== "This email is already in use, login instead." && (
        <h1 className="text-red text-center text-sm sf-light">{error}</h1>
      )}
      <AsyncButton
        onClick={() => submit("sign-up")}
        success={success}
        loading={loading}
        disabled={!email || !password || !username}
        action="Sign Up"
      />
    </div>
  );
};

export default Signup;
