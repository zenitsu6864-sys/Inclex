import { Suspense } from "react";
import LoginClient from "./LoginClient";

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#F8F7F4]">
          <div className="text-neutral-500">Loading...</div>
        </div>
      }
    >
      <LoginClient />
    </Suspense>
  );
}