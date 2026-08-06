import { useState } from "react";
import { ExclamationCircleIcon } from "@heroicons/react/24/outline";


type Prop = {
  onComplete: () => void;
};


export default function FamilyInfoPrompt({onComplete}: Prop) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");

  function validateAndSubmit() {
    if (!name.trim() || !phone.trim()) {
      setError("Missing information. Please fill in all fields.");
      return;
    }

    const phoneRegex = /^[0-9+\-\s()]{7,}$/;

    if (!phoneRegex.test(phone)) {
      setError("Invalid phone number.");
      return;
    }

    setError("");
    onComplete();
  }

  return (
    <div className = "flex items-center justify-center">

      <div className = "bg-white shadow-2xl rounded-xl p-8 w-[400px] border border-gray-200">

        <h1 className = "text-2xl font-bold text-[#1b2a4a]">
          Family & Friends
        </h1>


        <p className = "mt-3 text-[#D4621A]">
          Please enter your information
        </p>


        <div className = "mt-6">

          <label className = "block text-sm font-bold mb-1 text-[#1b2a4a]">
            Name:
          </label>

          <input 
            className = "w-full border rounded-lg px-3 py-2 outline-none placeholder:text-sm" 
            placeholder = "Enter your name" 
            value = {name}
            onChange={(e) => setName(e.target.value)}
          />

        </div>


        <div className = "mt-4">

          <label className = "block text-sm font-bold mb-1 text-[#1b2a4a]">
            Phone Number:
          </label>

          <input 
            type = "tel"
            className = "w-full border rounded-lg px-3 py-2 outline-none placeholder:text-sm" 
            placeholder = "Enter your phone number" 
            value = {phone}
            onChange={(e) => setPhone(e.target.value)}
          />

        </div>

        { error && (
          <div className = "mt-3 text-red-500 text-sm font-semibold flex items-center gap-1"> 
            <ExclamationCircleIcon className = "w-6 h-6" />

            <p>
              {error}
            </p>

          </div>
        )}

        


        <button
          onClick = {validateAndSubmit}
          className = "mt-6 w-full bg-[#d4621a] text-white py-2 rounded-xl hover:opacity-90"
        >
          Continue
        </button>


      </div>

    </div>
  );
}