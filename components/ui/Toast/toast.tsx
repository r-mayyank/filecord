"use client";

import * as React from "react";
import { Toaster as Sonner } from "sonner";
import { cva, type VariantProps } from "class-variance-authority";

const Toaster = ({ ...props }) => {
  return (
    <Sonner
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-card group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:rounded-ele group-[.toaster]:p-4",
          description:
            "group-[.toast]:text-muted-foreground group-[.toast]:text-sm",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground group-[.toast]:rounded-ele group-[.toast]:px-3 group-[.toast]:py-1.5",
          cancelButton:
            "group-[.toast]:bg-accent group-[.toast]:text-accent-foreground group-[.toast]:rounded-ele group-[.toast]:px-3 group-[.toast]:py-1.5",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };