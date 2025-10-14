"use client"

import React, { useEffect, useMemo, useState } from "react"

type CountdownProps = {
  // Target date in local time (e.g. 2025-10-22T12:00:00-03:00)
  target: string
  label?: string
}

function pad(n: number) {
  return n.toString().padStart(2, "0")
}

export const Countdown: React.FC<CountdownProps> = ({ target, label }) => {
  const targetDate = useMemo(() => new Date(target), [target])
  const [remaining, setRemaining] = useState<number>(() => {
    return Math.max(0, targetDate.getTime() - Date.now())
  })

  useEffect(() => {
    const id = setInterval(() => {
      setRemaining(Math.max(0, targetDate.getTime() - Date.now()))
    }, 1000)
    return () => clearInterval(id)
  }, [targetDate])

  const totalSeconds = Math.floor(remaining / 1000)
  const days = Math.floor(totalSeconds / (24 * 3600))
  const hours = Math.floor((totalSeconds % (24 * 3600)) / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  const isOver = remaining <= 0

  return (
    <div className="w-full text-center">
      {label ? (
        <p className="mb-2 text-sm uppercase tracking-widest text-emerald-400/90">{label}</p>
      ) : null}

      {!isOver ? (
        <div className="mx-auto inline-flex items-stretch gap-2 rounded-xl bg-white/5 p-3 ring-1 ring-white/10">
          <TimeBlock value={String(days)} unit="dias" />
          <Separator />
          <TimeBlock value={pad(hours)} unit="horas" />
          <Separator />
          <TimeBlock value={pad(minutes)} unit="min" />
          <Separator />
          <TimeBlock value={pad(seconds)} unit="seg" />
        </div>
      ) : (
        <div className="mx-auto inline-flex items-center gap-3 rounded-xl bg-emerald-500/10 px-4 py-3 ring-1 ring-emerald-400/30">
          <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
          <span className="font-semibold text-emerald-300">Liberado!</span>
        </div>
      )}
    </div>
  )
}

function Separator() {
  return <span className="self-stretch w-px bg-white/10" />
}

function TimeBlock({ value, unit }: { value: string; unit: string }) {
  return (
    <div className="min-w-[64px]">
      <div className="rounded-lg bg-black/40 px-3 py-2 text-2xl font-bold tabular-nums text-white">
        {value}
      </div>
      <div className="mt-1 text-[10px] uppercase tracking-wider text-gray-400">{unit}</div>
    </div>
  )
}
