import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Forgot Password",
};

const ForgotPasswordPage = () => {
  return (
    <div className="flex justify-center items-center min-h-[400px]">
      <div className="text-center space-y-4">
        <h1 className="text-2xl font-bold">Forgot Password</h1>
        <p className="text-muted-foreground">This page is under construction.</p>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
