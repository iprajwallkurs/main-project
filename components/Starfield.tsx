"use client"

import { useEffect, useRef } from "react"

export default function Starfield() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const animRef = useRef<number>()

  useEffect(() => {
    const canvas = canvasRef.current!
    const ctx = canvas.getContext("2d")!
    let width = 0
    let height = 0

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    type Star = { x: number; y: number; z: number; r: number; tw: number }
    let stars: Star[] = []
    const STAR_DENSITY = 0.00035 // stars per pixel (slightly higher)

    const resize = () => {
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
      const targetCount = Math.max(100, Math.floor(width * height * STAR_DENSITY))
      // Rebuild stars to fit new size
      stars = Array.from({ length: targetCount }, () => newStar())
    }

    const rand = (min: number, max: number) => Math.random() * (max - min) + min

    const newStar = (): Star => ({
      x: Math.random() * width,
      y: Math.random() * height,
      z: rand(0.3, 1.0), // depth factor (closer = brighter/larger)
      r: rand(0.4, 1.6),
      tw: rand(0, Math.PI * 2), // twinkle phase
    })

    const draw = (t: number) => {
      if (!ctx) return
      // space background (subtle veil for contrast)
      ctx.clearRect(0, 0, width, height)
      ctx.fillStyle = 'rgba(0,0,0,0.22)'
      ctx.fillRect(0, 0, width, height)
      // starfield
      for (let i = 0; i < stars.length; i++) {
        const s = stars[i]
        // slow parallax drift to the left/up
        s.x -= 0.02 * s.z
        s.y -= 0.01 * s.z
        if (s.x < -2 || s.y < -2) {
          // wrap around to the opposite edge
          s.x = width + Math.random() * 4
          s.y = height + Math.random() * 2
          s.z = rand(0.3, 1.0)
          s.r = rand(0.4, 1.6)
        }
        const twinkle = 0.6 + 0.5 * Math.sin(t * 0.002 + s.tw)
        const radius = Math.max(0.2, s.r * s.z * twinkle)
        const alpha = 0.55 + 0.45 * twinkle

        const grd = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, radius * 2.5)
        grd.addColorStop(0, `rgba(255,255,255,${alpha})`)
        grd.addColorStop(1, "rgba(255,255,255,0)")
        ctx.fillStyle = grd
        ctx.beginPath()
        ctx.arc(s.x, s.y, radius * 2.5, 0, Math.PI * 2)
        ctx.fill()
      }

      // soft nebula glow layers
      ctx.globalCompositeOperation = "lighter"
      const nebulaAlpha = 0.06
      const nebula = ctx.createLinearGradient(0, 0, width, height)
      nebula.addColorStop(0.1, `rgba(99,102,241,${nebulaAlpha})`) // indigo
      nebula.addColorStop(0.5, `rgba(14,165,233,${nebulaAlpha})`) // sky
      nebula.addColorStop(0.9, `rgba(16,185,129,${nebulaAlpha})`) // emerald
      ctx.fillStyle = nebula
      ctx.fillRect(0, 0, width, height)
      ctx.globalCompositeOperation = "source-over"
    }

    const loop = (now: number) => {
      if (!prefersReduced) {
        draw(now)
      }
      animRef.current = requestAnimationFrame(loop)
    }

    resize()
    window.addEventListener("resize", resize)
    if (prefersReduced) {
      // Render a single static frame for reduced motion users
      draw(0)
    } else {
      animRef.current = requestAnimationFrame(loop)
    }

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current)
      window.removeEventListener("resize", resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0 opacity-[0.65] [image-rendering:pixelated]"
      aria-hidden="true"
    />
  )
}
