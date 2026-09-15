import { useState } from "react";
import { Send, Loader2, AlertCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import data from "@/data/portfolio.json";
import { sendContactEmail } from "@/actions/contact";
import { toast } from "sonner"; 

const contactSchema = z.object({
  name: z.string().min(2, "Name is too short"),
  email: z.string().email("Invalid email address"),
  message: z.string().min(1, "Message cannot be empty"),
});

type ContactFormValues = z.infer<typeof contactSchema>;

export function ContactPanel() {
  const [sent, setSent] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    mode: "onChange",
    delayError: 500,
  });

  const onSubmit = async (values: ContactFormValues) => {
    setSubmitError(null);
    try {
      const response = await sendContactEmail({ data: values });
      if (response?.success) {
        setSent(true);
        reset();
        toast.success("Message sent successfully!");
        setTimeout(() => setSent(false), 5000);
      } else {
        setSubmitError("Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error(error);
      setSubmitError("Something went wrong. Please try again.");
      toast.error("Failed to send message. Please try again.");
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {submitError && (
          <div className="flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400">
            <AlertCircle className="h-4 w-4" />
            <p>{submitError}</p>
          </div>
        )}

        <div className="space-y-1">
          <input
            {...register("name")}
            type="text"
            placeholder="Name"
            className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white placeholder:text-white/35 outline-none transition focus:border-emerald-400/50 focus:bg-white/10"
          />
          {errors.name && (
            <p className="text-xs text-red-400">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <input
            {...register("email")}
            type="email"
            placeholder="Email"
            className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white placeholder:text-white/35 outline-none transition focus:border-emerald-400/50 focus:bg-white/10"
          />
          {errors.email && (
            <p className="text-xs text-red-400">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <textarea
            {...register("message")}
            rows={4}
            placeholder="Message"
            className="w-full resize-none rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white placeholder:text-white/35 outline-none transition focus:border-emerald-400/50 focus:bg-white/10"
          />
          {errors.message && (
            <p className="text-xs text-red-400">{errors.message.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center gap-2 rounded-lg border border-white/15 bg-white/10 px-4 py-2 text-sm font-medium transition hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
          {isSubmitting ? "Sending..." : sent ? "Message sent!" : "Send message"}
        </button>
      </form>
    </div>
  );
}
