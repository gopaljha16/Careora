"use client";

import React from "react";
import { Flame } from "lucide-react";
import { motion } from "framer-motion";

export function StreakBadge({ count = 0 }: { count?: number }) {
  if (count === 0) return null;
  
  return (
    <motion.div 
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="flex items-center gap-1.5 bg-gradient-to-r from-orange-100 to-amber-100 text-orange-700 px-3 py-1 rounded-full font-bold text-sm border border-orange-200 shadow-sm"
    >
      <Flame className="w-4 h-4 text-orange-500 fill-orange-500 animate-pulse" />
      <span>{count} Day Streak!</span>
    </motion.div>
  );
}
