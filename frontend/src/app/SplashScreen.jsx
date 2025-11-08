"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

export default function SplashScreen({ onFinish }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      if (onFinish) onFinish();
    }, 2000); // 3 seconds
    return () => clearTimeout(timer);
  }, [onFinish]);

  if (!visible) return null;

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="fixed inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 to-green-100 text-center"
    >
      <motion.div
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
        className="bg-white p-6 rounded-full shadow-xl"
      >
        <Image
           src="/heartbeat.jpg"
          alt="Healthcare Logo"
          width={80}
          height={80}
        />
      </motion.div>
      <h1 className="mt-6 text-2xl font-semibold text-green-700">
        SmartCare Health Portal
      </h1>
      <p className="text-gray-500">Bringing healthcare closer to you</p>
    </motion.div>
  );
}
