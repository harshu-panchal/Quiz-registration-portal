import React, { useEffect } from "react";
import Modal from "./Modal";
import {
  User,
  Mail,
  GraduationCap,
  Phone,
  ShieldCheck,
  School,
  MapPin,
  Calendar,
  AlertCircle,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const studentSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(50),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  school: z.string().min(2, "School name is required"),
  studentClass: z.string().min(1, "Class/Grade is required"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  age: z.coerce
    .number()
    .min(5, "Age must be at least 5")
    .max(100, "Age must be under 100"),
});

const AddStudentModal = ({ isOpen, onClose, student = null }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      school: "",
      studentClass: "",
      city: "",
      state: "",
      age: "",
    },
  });

  useEffect(() => {
    if (student) {
      reset({
        name: student.name || "",
        email: student.email || "",
        phone: student.phone || "",
        school: student.school || "",
        studentClass: student.class || "",
        city: student.city || "",
        state: student.state || "",
        age: student.age || "",
      });
    } else {
      reset({
        name: "",
        email: "",
        phone: "",
        school: "",
        studentClass: "",
        city: "",
        state: "",
        age: "",
      });
    }
  }, [student, isOpen, reset]);

  const onSubmit = (data) => {
    console.log(student ? "Updating student:" : "Adding student:", data);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={student ? "Edit Student" : "Add New Student"}
      maxWidth="max-w-lg">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
              Full Name
            </label>
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-300 group-focus-within:text-primary-500 transition-colors" />
              <input
                {...register("name")}
                type="text"
                placeholder="e.g. Alex Johnson"
                className={`modern-input !pl-12 !py-3 bg-slate-50 border-transparent focus:bg-white w-full ${
                  errors.name ? "border-red-500 focus:ring-red-500/10" : ""
                }`}
              />
            </div>
            {errors.name && (
              <p className="text-[10px] font-bold text-red-500 ml-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {errors.name.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
              Email Address
            </label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-300 group-focus-within:text-primary-500 transition-colors" />
              <input
                {...register("email")}
                type="email"
                placeholder="alex@example.com"
                className={`modern-input !pl-12 !py-3 bg-slate-50 border-transparent focus:bg-white w-full ${
                  errors.email ? "border-red-500 focus:ring-red-500/10" : ""
                }`}
              />
            </div>
            {errors.email && (
              <p className="text-[10px] font-bold text-red-500 ml-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {errors.email.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
              Phone Number
            </label>
            <div className="relative group">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-300 group-focus-within:text-primary-500 transition-colors" />
              <input
                {...register("phone")}
                type="tel"
                placeholder="+91 00000 00000"
                className={`modern-input !pl-12 !py-3 bg-slate-50 border-transparent focus:bg-white w-full ${
                  errors.phone ? "border-red-500 focus:ring-red-500/10" : ""
                }`}
              />
            </div>
            {errors.phone && (
              <p className="text-[10px] font-bold text-red-500 ml-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {errors.phone.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                School Name
              </label>
              <div className="relative group">
                <School className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-300 group-focus-within:text-primary-500 transition-colors" />
                <input
                  {...register("school")}
                  type="text"
                  placeholder="e.g. St. Peters High"
                  className={`modern-input !pl-12 !py-3 bg-slate-50 border-transparent focus:bg-white w-full ${
                    errors.school ? "border-red-500 focus:ring-red-500/10" : ""
                  }`}
                />
              </div>
              {errors.school && (
                <p className="text-[10px] font-bold text-red-500 ml-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.school.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                Class / Grade
              </label>
              <div className="relative group">
                <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-300 group-focus-within:text-primary-500 transition-colors" />
                <input
                  {...register("studentClass")}
                  type="text"
                  placeholder="e.g. 10th Standard"
                  className={`modern-input !pl-12 !py-3 bg-slate-50 border-transparent focus:bg-white w-full ${
                    errors.studentClass
                      ? "border-red-500 focus:ring-red-500/10"
                      : ""
                  }`}
                />
              </div>
              {errors.studentClass && (
                <p className="text-[10px] font-bold text-red-500 ml-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />{" "}
                  {errors.studentClass.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                City
              </label>
              <div className="relative group">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-300 group-focus-within:text-primary-500 transition-colors" />
                <input
                  {...register("city")}
                  type="text"
                  placeholder="City"
                  className={`modern-input !pl-12 !py-3 bg-slate-50 border-transparent focus:bg-white w-full ${
                    errors.city ? "border-red-500 focus:ring-red-500/10" : ""
                  }`}
                />
              </div>
              {errors.city && (
                <p className="text-[10px] font-bold text-red-500 ml-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.city.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                State
              </label>
              <div className="relative group">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-300 group-focus-within:text-primary-500 transition-colors" />
                <input
                  {...register("state")}
                  type="text"
                  placeholder="State"
                  className={`modern-input !pl-12 !py-3 bg-slate-50 border-transparent focus:bg-white w-full ${
                    errors.state ? "border-red-500 focus:ring-red-500/10" : ""
                  }`}
                />
              </div>
              {errors.state && (
                <p className="text-[10px] font-bold text-red-500 ml-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.state.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                Age
              </label>
              <div className="relative group">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-300 group-focus-within:text-primary-500 transition-colors" />
                <input
                  {...register("age")}
                  type="number"
                  placeholder="Age"
                  className={`modern-input !pl-12 !py-3 bg-slate-50 border-transparent focus:bg-white w-full ${
                    errors.age ? "border-red-500 focus:ring-red-500/10" : ""
                  }`}
                />
              </div>
              {errors.age && (
                <p className="text-[10px] font-bold text-red-500 ml-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.age.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {!student && (
          <div className="p-4 bg-primary-50 rounded-2xl border border-primary-100 flex gap-3">
            <ShieldCheck className="w-5 h-5 text-primary-600 shrink-0" />
            <p className="text-[11px] text-primary-700 font-medium leading-relaxed">
              An invitation email will be sent to the student with their login
              credentials and a link to their initial assessment.
            </p>
          </div>
        )}

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 btn-modern-outline !py-3">
            Cancel
          </button>
          <button type="submit" className="flex-[2] btn-modern-primary !py-3">
            {student ? "Update Student" : "Add Student"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddStudentModal;
