import { toast as sonnerToast } from "sonner";

type ToastOptions = {
  description?: string;
  type?: "default" | "error" | "success" | "info" | "warning";
  action?: {
    label: string;
    onClick: () => void;
  };
};

export function toast(
  messageOrOptions: string | ToastOptions,
  opts?: ToastOptions,
) {
  if (typeof messageOrOptions === "string") {
    const options = opts ?? {};
    const { type = "default", ...rest } = options;
    if (type === "error") return sonnerToast.error(messageOrOptions, rest);
    if (type === "success") return sonnerToast.success(messageOrOptions, rest);
    return sonnerToast(messageOrOptions, rest);
  }

  const { description = "", type = "default", ...rest } = messageOrOptions;
  if (type === "error") return sonnerToast.error(description, rest);
  if (type === "success") return sonnerToast.success(description, rest);
  return sonnerToast(description, rest);
}
