import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { User, Mail, Lock, Eye, EyeOff, TrendingUp, ShieldCheck, BadgeCheck, Sparkles } from "lucide-react";
import { axiosRequest, SaveTokens } from "../../utils/axios";

const schema = yup.object({
  name:     yup.string().min(2, "At least 2 characters").required("Name is required"),
  email:    yup.string().email("Invalid email address").required("Email is required"),
  password: yup.string().min(8, "Min 8 characters").matches(/[A-Z]/, "Need one uppercase").matches(/[0-9]/, "Need one number").required("Password is required"),
});

type FormData = yup.InferType<typeof schema>;

export default function Register() {
  const navigate = useNavigate();
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const { register, handleSubmit, formState: { errors, isValid } } = useForm<FormData>({
    resolver: yupResolver(schema),
    mode: "onSubmit",
  });

  async function onSubmit(data: FormData) {
    setLoading(true);
    setServerError("");
    try {
      const res = await axiosRequest.post("auth/register", data);
      SaveTokens(res.data.accessToken, res.data.refreshToken);
      navigate("/dashboard");
    } catch (err: any) {
      setServerError(err?.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex bg-white">

      {/* LEFT — photo panel */}
      <div className="hidden lg:flex lg:w-[52%] xl:w-[55%] relative overflow-hidden flex-col justify-between p-12">
        <img
          src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1400&q=90&auto=format&fit=crop"
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/85 via-emerald-800/65 to-slate-900/85" />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-white/15 border border-white/25 backdrop-blur-sm flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-bold text-white tracking-tight">Debt<span className="text-emerald-300">Flow</span></span>
        </div>

        {/* Hero text */}
        <div className="relative z-10 space-y-5">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 backdrop-blur-md rounded-full px-4 py-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-semibold text-white/90">12,400+ users debt-free</span>
          </div>

          <h2 className="text-4xl xl:text-5xl font-bold text-white leading-[1.15] tracking-tight">
            Take control<br />of your <span className="text-emerald-300">financial</span><br />future.
          </h2>
          <p className="text-white/65 text-[15px] leading-relaxed max-w-xs">
            Map your debt, automate your payoff plan, and watch your balances shrink — month by month.
          </p>

          <div className="flex gap-3 pt-1">
            {[{ v: "$2.1B", l: "Debt tracked" }, { v: "94%", l: "Success rate" }, { v: "18mo", l: "Avg. payoff" }].map(s => (
              <div key={s.l} className="flex-1 bg-white/10 border border-white/15 backdrop-blur-sm rounded-2xl p-4">
                <p className="text-xl font-bold text-white">{s.v}</p>
                <p className="text-[11px] text-white/55 mt-0.5 font-medium">{s.l}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonial */}
        <div className="relative z-10 flex items-start gap-3 bg-white/10 border border-white/15 backdrop-blur-sm rounded-2xl p-4">
          <img src="https://avatars.mds.yandex.net/i?id=0aec08dc489497d8a4b577f3c9d53f4bd26ceb78-4033943-images-thumbs&n=13" alt="Ibrohim" className="w-10 h-10 rounded-full object-cover border-2 border-white/25 shrink-0" />
          <div>
            <p className="text-sm text-white/85 italic leading-snug">"Paid off $31k in 14 months. DebtFlow kept me honest every single week."</p>
            <p className="text-xs text-white/45 mt-1.5 font-medium">Mukhtorov I. — Developer, Dushanbe · ⭐⭐⭐⭐⭐</p>
          </div>
        </div>
      </div>

      {/* RIGHT — form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 sm:px-10 lg:px-14 xl:px-20">
        <div className="w-full max-w-[380px] space-y-7">

          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-500 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-white" />
            </div>
            <span className="text-base font-bold text-gray-900">Debt<span className="text-emerald-500">Flow</span></span>
          </div>

          <div>
            <h1 className="text-[26px] font-bold text-gray-900 tracking-tight">Create your account</h1>
            <p className="mt-1 text-sm text-gray-400">Free forever — no credit card needed.</p>
          </div>

          {/* {serverError && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3">
              <Sparkles className="w-4 h-4 shrink-0" />
              {serverError}
            </div>
          )} */}

          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">

            {/* Name */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest">Full Name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 pointer-events-none" />
                <input
                  type="text" placeholder="Enter your name" autoComplete="name"
                  className="w-full pl-10 pr-4 py-3 text-sm rounded-xl border border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-300 outline-none focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-100 transition-all"
                  {...register("name")}
                />
              </div>
              {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 pointer-events-none" />
                <input
                  type="email" placeholder="Enter your email" autoComplete="email"
                  className="w-full pl-10 pr-4 py-3 text-sm rounded-xl border border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-300 outline-none focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-100 transition-all"
                  {...register("email")}
                />
              </div>
              {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 pointer-events-none" />
                <input
                  type={showPw ? "text" : "password"} placeholder="Enter your password" autoComplete="new-password"
                  className="w-full pl-10 pr-11 py-3 text-sm rounded-xl border border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-300 outline-none focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-100 transition-all"
                  {...register("password")}
                />
                <button type="button" onClick={() => setShowPw(p => !p)} tabIndex={-1}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 transition-colors">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
            </div>

            <button type="submit" disabled={loading}
              className="w-full py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-semibold tracking-wide transition-all active:scale-[0.98] shadow-lg shadow-emerald-100 flex items-center justify-center gap-2 mt-2">
              {loading ? (
                <><svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/></svg> Creating…</>
              ) : "Create account →"}
            </button>
          </form>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-gray-100" />
            <span className="text-[11px] text-gray-300 font-medium">secure & encrypted</span>
            <div className="flex-1 h-px bg-gray-100" />
          </div>

          <p className="text-center text-sm text-gray-400">
            Already have an account?{" "}
            <Link to="/login" className="text-emerald-500 font-semibold hover:text-emerald-600 transition-colors">Sign in</Link>
          </p>

          <div className="flex justify-center gap-6 pt-2 border-t border-gray-100">
            {[{ Icon: ShieldCheck, l: "256-bit SSL" }, { Icon: BadgeCheck, l: "No credit card" }, { Icon: BadgeCheck, l: "Free forever" }].map(({ Icon, l }) => (
              <div key={l} className="flex items-center gap-1.5">
                <Icon className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-[11px] text-gray-400">{l}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
