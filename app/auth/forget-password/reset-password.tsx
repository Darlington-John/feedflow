import { useState } from "react";
import AsyncButton from "~/app/dashboard/components/buttons/async-button";
import ClassicInput from "~/app/dashboard/components/inputs/classic-inputs";

interface resetProps {
  email: string;
  password: string;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
  error?: string;
  setError?: React.Dispatch<React.SetStateAction<string>>;
  errorContent?: string;
  // currentAction?: string;
  setCurrentAction?: React.Dispatch<React.SetStateAction<string>>;
  submit: (action: string) => void;
  loading: boolean;
  success: boolean;
}
const ResetPassword = ({
  email,
  password,
  setPassword,
  setError,
  errorContent,
  error,
  // currentAction,
  // setCurrentAction,
  submit,
  success,
  loading,
}: resetProps) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <div className="flex items-center w-full flex-col gap-3 ">
      <ClassicInput
        value={password}
        label="new password*"
        setValue={setPassword}
        setError={setError}
        errorContent={errorContent}
        error={error}
        inputType={isPasswordVisible ? "text" : "password"}
        password
        toggleVisibility={togglePasswordVisibility}
        passwordVisible={isPasswordVisible}
        serverError={["Incorrect password. Please try again."]}
      />

      {error && (
        <h1 className="text-red text-center text-sm sf-light">{error}</h1>
      )}

      <AsyncButton
        action="Reset"
        loading={loading}
        success={success}
        disabled={!email || !password}
        onClick={() => submit("forgot-password-reset")}
      />
    </div>
  );
};

export default ResetPassword;
