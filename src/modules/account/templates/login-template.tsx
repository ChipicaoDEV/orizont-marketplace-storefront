"use client"

import { useState } from "react"
import Image from "next/image"

import Register from "@modules/account/components/register"
import Login from "@modules/account/components/login"

export enum LOGIN_VIEW {
  SIGN_IN = "sign-in",
  REGISTER = "register",
}

const LoginTemplate = () => {
  const [currentView, setCurrentView] = useState("sign-in")

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 h-full -m-6 small:-m-10 min-h-[600px]">
      {/* Form Column */}
      <div className="flex flex-col items-center justify-center p-8 small:p-12 xl:p-16">
        {currentView === "sign-in" ? (
          <Login setCurrentView={setCurrentView} />
        ) : (
          <Register setCurrentView={setCurrentView} />
        )}
      </div>

      {/* Visual Column (Hidden on mobile) */}
      <div className="hidden lg:flex relative overflow-hidden bg-gray-900">
        <Image
          src="/banners/account-bg.png"
          alt="Orizont Architecture"
          fill
          className="object-cover opacity-60"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-12 flex flex-col justify-end">
          <div className="space-y-4">
            <div className="w-12 h-1 bg-[#F27A1A] rounded-full" />
            <h2 className="text-3xl font-bold text-white tracking-tight leading-tight">
              Construiește-ți viitorul cu Orizont
            </h2>
            <p className="text-gray-300 text-base max-w-sm font-medium leading-relaxed">
              Materiale de construcții de elită și servicii profesionale într-un singur loc.
            </p>
            <div className="pt-8 flex items-center gap-x-12">
              <div>
                <p className="text-[#F27A1A] font-bold text-2xl tracking-tight">10k+</p>
                <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Produse</p>
              </div>
              <div>
                <p className="text-[#F27A1A] font-bold text-2xl tracking-tight">24/7</p>
                <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Suport</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginTemplate
