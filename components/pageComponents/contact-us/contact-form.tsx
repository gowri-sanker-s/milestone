"use client";

import React, { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { 
  User, 
  Mail, 
  Phone, 
  HelpCircle, 
  FileText, 
  BookOpen, 
  Feather, 
  Send, 
  Loader2 
} from "lucide-react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { funnel } from "@/lib/fonts";

// Validation schema with conditional requirements using refine
const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
  reason: z.enum(["query", "book_request", "other"], {
    message: "Please select a reason for contact",
  }),
  description: z.string().min(10, "Message must be at least 10 characters"),
  bookName: z.string().optional(),
  author: z.string().optional(),
}).refine((data) => {
  if (data.reason === "book_request") {
    return !!data.bookName && data.bookName.trim().length > 0;
  }
  return true;
}, {
  message: "Book name is required for book requests",
  path: ["bookName"],
}).refine((data) => {
  if (data.reason === "book_request") {
    return !!data.author && data.author.trim().length > 0;
  }
  return true;
}, {
  message: "Author is required for book requests",
  path: ["author"],
});

type ContactFormValues = z.infer<typeof contactSchema>;

const defaultValues: ContactFormValues = {
  name: "",
  email: "",
  phone: "",
  reason: "query",
  description: "",
  bookName: "",
  author: "",
};

export default function ContactForm() {
  const [isPending, startTransition] = useTransition();

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues,
  });

  const selectedReason = form.watch("reason");

  const onSubmit = (values: ContactFormValues) => {
    startTransition(async () => {
      // Simulate API submission
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      console.log("Contact Form Submitted Successfully:", values);
      
      toast.success("Message Sent Successfully!", {
        description: `Thank you, ${values.name}. We've received your request and will get back to you shortly.`,
      });

      form.reset(defaultValues);
    });
  };

  return (
    <Form {...form}>
      <form 
        onSubmit={form.handleSubmit(onSubmit)} 
        className={`space-y-6 ${funnel.className} bg-primary-border/20 p-6 md:p-8 rounded-3xl border border-primary-border/40 shadow-xs`}
      >
        <div className="space-y-1">
          <h2 className="text-2xl font-bold text-primary-text">Send us a Message</h2>
          <p className="text-sm opacity-80">Fill out the form below and our team will get in touch with you.</p>
        </div>

        {/* Name & Email Group */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="relative">
                <FormLabel className="text-primary-text/95 font-semibold flex items-center gap-1.5">
                  <User size={15} /> Name
                </FormLabel>
                <FormControl>
                  <Input 
                    placeholder="John Doe" 
                    className="rounded-xl border-primary-text/20 focus-visible:border-primary-text/45 transition-colors pl-4 bg-primary-bg/10" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-primary-text/95 font-semibold flex items-center gap-1.5">
                  <Mail size={15} /> Email
                </FormLabel>
                <FormControl>
                  <Input 
                    type="email" 
                    placeholder="john@example.com" 
                    className="rounded-xl border-primary-text/20 focus-visible:border-primary-text/45 transition-colors pl-4 bg-primary-bg/10" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Phone & Reason Group */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-primary-text/95 font-semibold flex items-center gap-1.5">
                  <Phone size={15} /> Phone (Optional)
                </FormLabel>
                <FormControl>
                  <Input 
                    placeholder="+1 (555) 000-0000" 
                    className="rounded-xl border-primary-text/20 focus-visible:border-primary-text/45 transition-colors pl-4 bg-primary-bg/10" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="reason"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-primary-text/95 font-semibold flex items-center gap-1.5">
                  <HelpCircle size={15} /> Reason for Contact
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full rounded-xl border border-primary-text/20 bg-primary-bg/10 h-10 px-4">
                      <SelectValue placeholder="Select a reason" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="border border-primary-text/20 bg-primary-bg/95 backdrop-blur-md rounded-xl shadow-md">
                    <SelectItem value="query" className="hover:bg-primary-border/60 cursor-pointer rounded-lg">Query / General Info</SelectItem>
                    <SelectItem value="book_request" className="hover:bg-primary-border/60 cursor-pointer rounded-lg">Book Request</SelectItem>
                    <SelectItem value="other" className="hover:bg-primary-border/60 cursor-pointer rounded-lg">Other</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Conditional Fields for Book Request */}
        <AnimatePresence mode="wait">
          {selectedReason === "book_request" && (
            <motion.div
              key="book-details-fields"
              initial={{ opacity: 0, height: 0, scale: 0.95 }}
              animate={{ opacity: 1, height: "auto", scale: 1 }}
              exit={{ opacity: 0, height: 0, scale: 0.95 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden space-y-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
                <FormField
                  control={form.control}
                  name="bookName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-primary-text/95 font-semibold flex items-center gap-1.5">
                        <BookOpen size={15} className="text-primary-text/80 animate-pulse" /> Book Name
                      </FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="e.g. The Lord of the Rings" 
                          className="rounded-xl border-primary-text/20 focus-visible:border-primary-text/45 transition-colors pl-4 bg-primary-bg/10" 
                          {...field} 
                          value={field.value ?? ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="author"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-primary-text/95 font-semibold flex items-center gap-1.5">
                        <Feather size={15} className="text-primary-text/80" /> Author
                      </FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="e.g. J.R.R. Tolkien" 
                          className="rounded-xl border-primary-text/20 focus-visible:border-primary-text/45 transition-colors pl-4 bg-primary-bg/10" 
                          {...field} 
                          value={field.value ?? ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Message Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-primary-text/95 font-semibold flex items-center gap-1.5">
                <FileText size={15} /> Description
              </FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="How can we help you? Write your message here..." 
                  className="rounded-xl border-primary-text/20 focus-visible:border-primary-text/45 transition-colors pl-4 min-h-32 bg-primary-bg/10" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit button with micro-animation & status */}
        <Button
          type="submit"
          disabled={isPending}
          className="w-full bg-primary-text text-primary-bg hover:bg-primary-text/90 active:scale-98 transition-all duration-200 py-3 rounded-full font-bold text-[16px] shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          {isPending ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Sending Message...</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>Send Message</span>
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}
