"use client"

import { useState, useEffect, useCallback } from "react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const SLIDES = [
  {
    id: 1,
    title: "Materiale de construcții de elită",
    description: "Tot ce ai nevoie pentru proiectul tău, de la fundație până la acoperiș. Livrare rapidă oriunde în țară.",
    buttonText: "Vezi oferta completă",
    buttonLink: "/store",
    image: "/banners/oferta-1.png", // User will add this to public/
    bgClassName: "bg-[#F9FAFB]",
    accentColor: "#F27A1A",
  },
  {
    id: 2,
    title: "Grădina ta, spațiul tău ideal",
    description: "Sisteme de pavaj, mobilier de exterior și unelte profesionale. Reduceri de până la 20% în acest sezon.",
    buttonText: "Explorează categoria",
    buttonLink: "/store",
    image: "/banners/oferta-2.png", // User will add this to public/
    bgClassName: "bg-[#F0FDF4]",
    accentColor: "#16A34A",
  },

]

const PROMO_TILES = [
  {
    id: 1,
    tag: "PROMOȚIE",
    title: "Marea Curățenie",
    subtitle: "Până la -30%",
    link: "/collections/cleaning",
    className: "bg-gradient-to-br from-[#F27A1A] to-[#E65100] border-transparent shadow-lg shadow-orange-100/50",
    textClassName: "text-white",
    icon: (
      <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full fill-white/20">
        <path d="M40,-62.7C53.3,-54.1,66.5,-44.1,73.4,-30.9C80.2,-17.7,80.7,-1.3,76.5,14.1C72.3,29.5,63.4,43.9,51.1,54.7C38.8,65.5,23.1,72.7,6.8,71.5C-9.5,70.3,-26.4,60.8,-39.7,49.5C-52.9,38.3,-62.5,25.3,-67.2,10.6C-71.9,-4.1,-71.8,-20.5,-64.7,-34.1C-57.5,-47.7,-43.3,-58.5,-29.4,-66.8C-15.5,-75,1.9,-80.7,18.4,-77.1C34.9,-73.5,50.4,-60.7,40,-62.7Z" transform="translate(100 100)" />
      </svg>
    ),
  },
  {
    id: 2,
    tag: "NOUTĂȚI",
    title: "Noutăți Sezoniere",
    subtitle: "Vezi colecția 2026",
    link: "/products",
    className: "bg-gradient-to-br from-[#1E293B] to-[#0F172A] border-transparent shadow-lg shadow-slate-200/50",
    textClassName: "text-white",
    icon: (
      <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full fill-white/10">
        <path d="M44.7,-76.4C58.1,-69.2,69.5,-57.4,77.5,-43.3C85.5,-29.3,90.1,-13.1,88.5,2.4C86.9,17.9,79.1,32.7,68.4,44.2C57.7,55.7,44.1,63.9,30.3,70.2C16.5,76.5,2.4,80.9,-12.5,79.5C-27.4,78.1,-43.1,70.9,-55.8,60.6C-68.5,50.3,-78.2,36.9,-82.4,22.1C-86.6,7.3,-85.3,-8.9,-79.8,-24.1C-74.4,-39.3,-64.8,-53.4,-51.7,-60.8C-38.6,-68.2,-22,-68.9,-5.8,-60.3C10.4,-51.7,21.3,-60.7,44.7,-76.4Z" transform="translate(100 100)" />
      </svg>
    ),
  },
]

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % SLIDES.length)
  }, [])

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + SLIDES.length) % SLIDES.length)
  }

  useEffect(() => {
    if (isPaused) return
    const interval = setInterval(nextSlide, 6000)
    return () => clearInterval(interval)
  }, [nextSlide, isPaused])

  return (
    <section className="w-full bg-white">
      <div className="content-container py-6 sm:py-8 lg:py-10">
        <div className="flex flex-col lg:flex-row gap-4 xl:gap-6 min-h-[400px] lg:h-[500px]">

          {/* ── Main Carousel (70-75% width on LG+) ── */}
          <div
            className="flex-1 relative overflow-hidden rounded-2xl md:rounded-3xl shadow-sm border border-gray-100 group"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {/* Slides track */}
            <div
              className="absolute inset-0 transition-transform duration-700 ease-in-out flex"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {SLIDES.map((slide) => (
                <LocalizedClientLink
                  key={slide.id}
                  href={slide.buttonLink}
                  className="relative min-w-full h-full block overflow-hidden"
                >
                  <div
                    className="w-full h-full bg-center bg-no-repeat bg-cover transition-transform duration-700 "
                    style={{ backgroundImage: `url(${slide.image})`, backgroundColor: slide.accentColor + '10' }}
                  />
                </LocalizedClientLink>
              ))}
            </div>

            {/* Navigation Arrows */}
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-white/60 backdrop-blur-md text-gray-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-white shadow-sm"
              aria-label="Slide-ul anterior"
            >
              <svg className="w-5 h-5 md:w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-white/60 backdrop-blur-md text-gray-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-white shadow-sm"
              aria-label="Slide-ul următor"
            >
              <svg className="w-5 h-5 md:w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Progress Indicators */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-x-2">
              {SLIDES.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`
                    h-1.5 transition-all duration-300 rounded-full
                    ${currentSlide === idx ? "w-8 bg-white" : "w-2 bg-white/50 hover:bg-white/80"}
                  `}
                  aria-label={`Mergi la slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>

          {/* ── Side Promo Tiles (Hidden on small mobile, visible on desktop) ── */}
          <div className="flex flex-row lg:flex-col gap-4 w-full lg:w-[280px] xl:w-[320px]">
            {PROMO_TILES.map((promo) => (
              <LocalizedClientLink
                key={promo.id}
                href={promo.link}
                className={`
                  flex-1 relative overflow-hidden rounded-2xl border ${promo.className}
                  p-5 md:p-6 flex flex-col justify-between group/tile
                  transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5
                `}
              >
                <div className="relative z-10 flex flex-col gap-y-1">
                  <span className={`${promo.textClassName} text-[10px] md:text-xs font-black uppercase tracking-[0.1em] opacity-90`}>
                    {promo.tag}
                  </span>
                  <h3 className={`text-lg md:text-xl font-extrabold ${promo.textClassName} leading-tight`}>
                    {promo.title}
                  </h3>
                  <p className={`mt-1 text-sm ${promo.textClassName} opacity-80 font-medium`}>
                    {promo.subtitle}
                  </p>
                </div>

                <div className="relative z-10 mt-auto self-start">
                  <span className={`
                    inline-flex items-center gap-x-1.5 text-xs font-bold px-3 py-1.5
                    rounded-full bg-white/20 backdrop-blur-sm shadow-sm
                    ${promo.textClassName} group-hover/tile:bg-white/30 transition-colors
                  `}>
                    Vezi detalii
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>

                {/* Abstract background accent SVG */}
                <div className="absolute bottom-[-10%] right-[-10%] w-32 h-32 md:w-40 md:h-40 transition-transform duration-700 group-hover/tile:scale-110 group-hover/tile:-translate-x-3 group-hover/tile:-translate-y-3">
                  {promo.icon}
                </div>
              </LocalizedClientLink>
            ))}
          </div>

        </div>
      </div>

      <style jsx>{`
        @keyframes pulse-subtle {
          0%, 100% { opacity: 1; transform: scale(1.05); }
          50% { opacity: 0.95; transform: scale(1.02); }
        }
        .animate-pulse-subtle {
          animation: pulse-subtle 4s ease-in-out infinite;
        }
      `}</style>
    </section>
  )
}

export default Hero
