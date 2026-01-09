import React, { useState } from "react";
import Modal from "./Modal";
import {
  Send,
  MessageSquare,
  Mail,
  Phone,
  Info,
  AlertCircle,
} from "lucide-react";
import StatusModal from "./StatusModal";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const contactSchema = z.object({
  message: z
    .string()
    .min(5, "Message must be at least 5 characters")
    .max(1000, "Message is too long"),
  contactMethod: z.enum(["Platform", "Email", "SMS"]),
});

const ContactStudentModal = ({ isOpen, onClose, student }) => {
  const [isSending, setIsSending] = useState(false);
  const [statusModal, setStatusModal] = useState({
    isOpen: false,
    type: "success",
    title: "",
    message: "",
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      message: "",
      contactMethod: "Platform",
    },
  });

  const contactMethod = watch("contactMethod");

  if (!student) return null;

  const onSend = (data) => {
    setIsSending(true);

    // Simulate API call
    setTimeout(() => {
      setIsSending(false);
      setStatusModal({
        isOpen: true,
        type: "success",
        title: "Message Sent",
        message: `Your message has been successfully delivered to ${student.name} via ${data.contactMethod}.`,
      });
      reset();
    }, 1500);
  };

  const handleStatusClose = () => {
    setStatusModal((prev) => ({ ...prev, isOpen: false }));
    onClose();
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={`Contact ${student.name}`}
        maxWidth="max-w-lg">
        <form onSubmit={handleSubmit(onSend)} className="space-y-6">
          <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <img
              src={student.avatar}
              alt={student.name}
              className="w-12 h-12 rounded-xl object-cover"
            />
            <div>
              <h4 className="font-black text-slate-900 text-sm">
                {student.name}
              </h4>
              <p className="text-[11px] text-slate-500 font-medium">
                {student.email}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                Contact Method
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: "Platform", icon: MessageSquare },
                  { id: "Email", icon: Mail },
                  { id: "SMS", icon: Phone },
                ].map((method) => (
                  <button
                    key={method.id}
                    type="button"
                    onClick={() => setValue("contactMethod", method.id)}
                    className={`flex flex-col items-center gap-2 p-3 rounded-2xl border transition-all ${
                      contactMethod === method.id
                        ? "bg-primary-50 border-primary-200 text-primary-600 shadow-sm"
                        : "bg-white border-slate-100 text-slate-400 hover:border-slate-200"
                    }`}>
                    <method.icon className="w-5 h-5" />
                    <span className="text-[10px] font-black uppercase tracking-widest">
                      {method.id}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                Your Message
              </label>
              <textarea
                {...register("message")}
                rows={5}
                placeholder="Type your message here..."
                className={`modern-input !py-4 bg-slate-50 border-transparent focus:bg-white w-full resize-none ${
                  errors.message ? "!border-red-200 !bg-red-50/50" : ""
                }`}
              />
              {errors.message && (
                <p className="text-[10px] text-red-500 font-bold flex items-center gap-1 mt-1 ml-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.message.message}
                </p>
              )}
            </div>
          </div>

          <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 flex gap-3">
            <Info className="w-5 h-5 text-blue-600 shrink-0" />
            <p className="text-[11px] text-blue-700 font-medium leading-relaxed">
              Messages sent via the platform are encrypted and stored for
              compliance.
              {contactMethod === "Email" &&
                " A copy will be sent to their registered email address."}
            </p>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 btn-modern-outline !py-3">
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSending}
              className="flex-[2] btn-modern-primary !py-3 flex items-center justify-center gap-2 disabled:opacity-50">
              {isSending ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              {isSending ? "Sending..." : "Send Message"}
            </button>
          </div>
        </form>
      </Modal>

      <StatusModal
        isOpen={statusModal.isOpen}
        onClose={handleStatusClose}
        type={statusModal.type}
        title={statusModal.title}
        message={statusModal.message}
      />
    </>
  );
};

export default ContactStudentModal;
