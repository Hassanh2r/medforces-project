// src/app/confirm-email/page.js
"use client";

import { Suspense } from "react";
import ConfirmEmailForm from "./confirm-email-form";

export default function ConfirmEmailPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ConfirmEmailForm />
    </Suspense>
  );
}
