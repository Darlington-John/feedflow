import AsyncButton from "~/app/dashboard/components/buttons/async-button";
import ClassicInput from "~/app/dashboard/components/inputs/classic-inputs";

interface forgotProps {
  error: string;
  setError: React.Dispatch<React.SetStateAction<string>>;
  isChecking: boolean;
  email: string;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
  success: boolean;
  submit: (action: string) => void;
}
const ForgotPassword = ({
  error,
  setError,
  isChecking,
  success,
  submit,
  email,
  setEmail,
}: forgotProps) => {
  return (
    <div className="flex items-center flex-col gap-4 w-full">
      <h1 className="text-sm text-grey-blue text-center">
        You’re about to reset your password. Enter your email so we send
        instructions to reset your password.
      </h1>
      <div className="flex flex-col w-full">
        <ClassicInput
          inputType="email"
          error={error}
          name="email"
          value={email}
          errorContent="All fields are required"
          setValue={setEmail}
          setError={setError}
          label="Your email"
          autofocus={true}
          serverError={["No account found with this email address."]}
        />
      </div>
      {error !== "No account found with this email address." && (
        <div className="flex gap-2 items-center ">
          <div className="p-1  bg-pink rounded-full "></div>
          <h1 className="text-sm text-red">{error}</h1>
        </div>
      )}

      <AsyncButton
        action="Continue"
        loading={isChecking}
        success={success}
        disabled={!email}
        onClick={() => submit("forgot-password")}
      />
    </div>
  );
};

export default ForgotPassword;
