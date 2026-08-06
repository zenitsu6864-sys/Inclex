import { Suspense } from "react";
import ResetPasswordClient from "./ResetPasswordClient";

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F8F7F4]" />}>
      <ResetPasswordClient />
    </Suspense>
  );
}