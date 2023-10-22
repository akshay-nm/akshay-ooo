"use client";
import React, { useState } from "react";
import ReactTyped from "react-typed";

import { Montserrat, Bebas_Neue } from "next/font/google";
import { classNames } from "./utils";
import { AnimatePresence, motion } from "framer-motion";

const mainFont = Montserrat({ weight: ["400"], subsets: ["latin"] });
const typedFont = Montserrat({
  weight: ["200"],
  subsets: ["latin"],
});

const mainStyles = classNames(
  mainFont.className,
  "text-4xl",
  "flex flex-col p-6"
);
const typedStyles = classNames(
  typedFont.className,
  "inline-block h-[370px] overflow-hidden"
);

const createReactTypedPayloadString = (...values: string[]) =>
  values.join(" <br />");

const ChatButtonTooltip = () => (
  <ReactTyped
    strings={[
      createReactTypedPayloadString(
        "This is a fancy way of saying",
        "that you can reach me at",
        "",
        '<a href="mailto:akshay.nm92@gmail.com">akshay.nm92@gmail.com</a>',
        "",
        "and I'll get back to you as soon as I can.",
        "",
        "Cheers!"
      ),
    ]}
    typeSpeed={10}
  />
);

export const HiThereSection = () => {
  const [showChatTooltip, setShowChatTooltip] = useState(false);
  return (
    <div className={mainStyles}>
      <div className="mb-10">Hi there,</div>
      <div className={typedStyles}>
        <span>are you </span>
        <br />
        <ReactTyped
          strings={[
            createReactTypedPayloadString(
              " a skilled technical individual",
              "seeking a reliable partner",
              "to deliver consistent and predictable results?"
            ),

            createReactTypedPayloadString(
              " a non-technical visionary",
              "in search of",
              "a dependable partner who can guide you",
              "towards your next billion-dollar idea?"
            ),

            createReactTypedPayloadString(
              " a dedicated team with everything in place",
              "seeking an extra hand on deck",
              "to support your endeavors?"
            ),

            createReactTypedPayloadString(
              " an individual",
              "aspiring to create an outstanding portfolio like this one?"
            ),
          ]}
          typeSpeed={20}
          backDelay={1000}
          backSpeed={10}
          loop
        />
      </div>
      <br />
      <div>
        <span>
          Well, let&apos;s have a{" "}
          <span
            className="relative"
            onMouseEnter={() => setShowChatTooltip(true)}
            onMouseLeave={() => setShowChatTooltip(false)}
          >
            <button className="animate-pulse hover:animate-none hover:underline">
              chat!
            </button>

            <AnimatePresence>
              {showChatTooltip && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="absolute w-64 text-xs bg-black text-white shadow-xl left-0 p-4 rounded"
                >
                  <ChatButtonTooltip />
                </motion.span>
              )}
            </AnimatePresence>
          </span>
        </span>
      </div>
    </div>
  );
};
