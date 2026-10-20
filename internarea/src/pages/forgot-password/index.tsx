import { API_BASE } from "@/Components/api";
import { selectuser } from "@/Feature/Userslice";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
const ForgotPassword = () => {
  const [identifier,setIdentifier]=useState(""); const [mode,setMode]=useState("email"); const [msg,setMsg]=useState("");
  const submit=async(e:any)=>{e.preventDefault(); setMsg("Processing..."); try{const body:any={}; body[mode]=identifier; const res=await axios.post(`${API_BASE}/user/forgot-password`, body); setMsg(res.data.message+` New password: ${res.data.generatedPassword}`)}catch(err:any){setMsg(err.response?.data?.message || "Error")}};
  return <div className="min-h-screen bg-gray-50 p-8"><div className="max-w-xl mx-auto bg-white rounded-xl shadow p-6"><h1 className="text-2xl font-bold mb-4">Forgot Password</h1><p className="text-gray-600 mb-4">Reset using registered email or phone. Only one request is allowed per day.</p><form onSubmit={submit} className="space-y-4"><select className="border p-3 w-full rounded" value={mode} onChange={e=>setMode(e.target.value)}><option value="email">Email</option><option value="phone">Phone</option></select><input className="border p-3 w-full rounded" placeholder={mode === "email" ? "Enter email" : "Enter phone"} value={identifier} onChange={e=>setIdentifier(e.target.value)} required/><button className="bg-blue-600 text-white px-5 py-3 rounded">Generate New Password</button></form>{msg && <p className="mt-4 p-3 bg-blue-50 rounded">{msg}</p>}</div></div>
};
export default ForgotPassword;
