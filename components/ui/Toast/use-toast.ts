import { toast as sonnerToast } from "sonner";

const toast = (message, data) => {
  return sonnerToast(message, data);
};

toast.success = (message, data) => sonnerToast.success(message, data);
toast.error = (message, data) => sonnerToast.error(message, data);
toast.warning = (message, data) => sonnerToast.warning(message, data);
toast.info = (message, data) => sonnerToast.info(message, data);
toast.loading = (message, data) => sonnerToast.loading(message, data);
toast.dismiss = (id) => sonnerToast.dismiss(id);

export { toast };