import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"
import animationData from "@/assets/lottie-json.json";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const colors = [
  "bg-[#712c4a57] text-[#ff006e] border-[#ff006faa] border-[1px]",
  "bg-[#ffd60a2a] text-[#ffd60a] border-[#ffd60abb] border-[1px]",
  "bg-[#06d6a02a] text-[#06d6a0] border-[#06d6a0bb] border-[1px]",
  "bg-[#4cc9f02a] text-[#4cc9f0] border-[#4cc9f0bb] border-[1px]"
];

export const getColor = (index) => {
  if (index < 0 || index >= colors.length) {
    return colors[0];
  }
  return colors[index];
}

export const animationDefault = {
  loop: true,
  autoplay: true,
    animationData: animationData,
}