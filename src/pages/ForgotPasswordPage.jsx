import React, { useState, useEffect } from "react";
import { Input, Button, InputOtp } from "@heroui/react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../adapters/api";

const ForgotPasswordPage = ({ isEmployer }) => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const [resendTimeout, setResendTimeout] = useState(0);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const endpoint = isEmployer ? "/employer" : "/artisan";

  useEffect(() => {
    if (resendTimeout > 0) {
      const timer = setTimeout(() => setResendTimeout(resendTimeout - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimeout]);

  const sendOTPMutation = useMutation(
    async () => {
      const res = await apiClient.post(`${endpoint}/forgot-password`, {
        email,
      });
      return res.data;
    },
    {
      onSuccess: () => {
        setStep(2);
        setResendTimeout(300); // 5 minutes
        toast.success("OTP sent successfully");
      },
      onError: (err) => {
        setError(err.response.data.msg);
        toast.error(err.response.data.msg);
      },
    },
  );

  const verifyOTPMutation = useMutation(
    async () => {
      const res = await apiClient.post(`${endpoint}/verify-otp`, {
        email,
        otp,
      });
      return res.data;
    },
    {
      onSuccess: () => {
        setStep(3);
        toast.success("OTP verified successfully");
      },
      onError: (err) => {
        setError(err.response.data.msg);
        toast.error(err.response.data.msg);
      },
    },
  );

  const resetPasswordMutation = useMutation(
    async () => {
      const res = await apiClient.post(`${endpoint}/reset-password`, {
        email,
        otp,
        newPassword,
      });
      return res.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["notifications"]);
        navigate(isEmployer ? "/employer/login" : "/artisan/login");
        toast.success("Password reset successful");
      },
      onError: (err) => {
        setError(err.response.data.msg);
        toast.error(err.response.data.msg);
      },
    },
  );

  const handleSendOTP = () => {
    sendOTPMutation.mutate();
  };

  const handleVerifyOTP = () => {
    verifyOTPMutation.mutate();
  };

  const handleResetPassword = () => {
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      toast.error("Passwords do not match");
      return;
    }
    resetPasswordMutation.mutate();
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Forgot Password</h1>
      {step === 1 && (
        <div className="space-y-4">
          <Input
            label="Email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
          />
          <Button
            onPress={handleSendOTP}
            color="primary"
            disabled={resendTimeout > 0}
          >
            {resendTimeout > 0 ? `Resend OTP in ${resendTimeout}s` : "Send OTP"}
          </Button>
        </div>
      )}
      {step === 2 && (
        <div className="space-y-4">
          <InputOtp
            label="Enter OTP"
            name="otp"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            length={6}
            isInvalid={!!error}
            errorMessage={error}
          />
          <Button onPress={handleVerifyOTP} color="primary">
            Verify OTP
          </Button>
        </div>
      )}
      {step === 3 && (
        <div className="space-y-4">
          <Input
            label="New Password"
            name="newPassword"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter new password"
          />
          <Input
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm new password"
          />
          <Button onPress={handleResetPassword} color="primary">
            Reset Password
          </Button>
        </div>
      )}
    </div>
  );
};

export default ForgotPasswordPage;
