"use client";
import { AnimatePresence, motion } from "framer-motion";
import React, { ReactNode, useState } from "react";
import {
  SiExpress,
  SiReact,
  SiMongodb,
  SiNodedotjs,
  SiJavascript,
  SiTypescript,
  SiHtml5,
  SiCss3,
  SiGithub,
  SiGithubactions,
  SiAmazon,
  SiNextdotjs,
  SiReacttable,
  SiCreatereactapp,
  SiReactquery,
  SiReactrouter,
  SiRedux,
  SiImmer,
  SiServerless,
  SiBootstrap,
  SiTailwindcss,
  SiTurborepo,
  SiLerna,
  SiConventionalcommits,
  SiGnubash,
  SiPowershell,
  SiThreedotjs,
} from "react-icons/si";
import { classNames } from "./utils";
import { Montserrat } from "next/font/google";

const TechStackRow = ({ children }: { children: ReactNode }) => (
  <div className="grid grid-cols-4 gap-x-4 gap-y-10">{children}</div>
);

const TechStackIcon = ({
  icon,
  title,
  description,
}: {
  icon: ReactNode;
  title: ReactNode;
  description: ReactNode;
}) => {
  const [showTooltip, setShowTooltip] = useState(false);
  return (
    <span
      className="relative"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {icon}

      <AnimatePresence>
        {showTooltip && (
          <motion.span
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.1 }}
            className={"absolute top-12"}
          >
            <span
              className={classNames(
                "inline-block",
                "w-24",
                "text-xs bg-black shadow-xl p-2 rounded z-10",
                "text-white font-semibold",
                description && "w-64"
              )}
            >
              <span className="grid grid-cols-1">
                <span>{title}</span>
                {description && <span className="mt-1">{description}</span>}
              </span>
            </span>
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
};

const typedFont = Montserrat({
  weight: ["200"],
  subsets: ["latin"],
});

export const TechStack = () => {
  return (
    <div className={classNames("p-6", typedFont.className)}>
      <div className="text-5xl mb-6">The How</div>
      <div className="grid grid-cols-1 gap-20">
        <TechStackRow>
          <TechStackIcon
            icon={<SiMongodb className="w-10 h-10 text-[#0FA54D]" />}
            title="MongoDB"
            description=""
          />
          <TechStackIcon
            icon={<SiExpress className="w-10 h-10" />}
            title="Express.js"
            description=""
          />
          <TechStackIcon
            icon={<SiReact className="w-10 h-10 text-[#61DADA]" />}
            title="React.js"
            description=""
          />
          <TechStackIcon
            icon={<SiNodedotjs className="w-10 h-10 text-[#43853D]" />}
            title="Node.js"
            description=""
          />
        </TechStackRow>
        <TechStackRow>
          <TechStackIcon
            icon={<SiNextdotjs className="w-10 h-10" />}
            title="Next.js"
            description="I can help you keep up with the latest changes"
          />
          <TechStackIcon
            icon={<SiCreatereactapp className="w-10 h-10 text-[#09D3AC]" />}
            title="Create react app"
            description=""
          />
        </TechStackRow>
        <TechStackRow>
          <TechStackIcon
            icon={<SiReacttable className="w-10 h-10 text-[#199EBA]" />}
            title="React table"
            description=""
          />
          <TechStackIcon
            icon={<SiReactquery className="w-10 h-10 text-[#F16230]" />}
            title="React query"
            description=""
          />
          <TechStackIcon
            icon={<SiReactrouter className="w-10 h-10" />}
            title="React router"
            description=""
          />
          <TechStackIcon
            icon={<SiRedux className="w-10 h-10 text-[#764ABC]" />}
            title="Redux"
            description=""
          />
          <TechStackIcon
            icon={<SiImmer className="w-10 h-10 text-[#00E7C3]" />}
            title="Immer"
            description=""
          />
          <TechStackIcon
            icon={<SiTailwindcss className="w-10 h-10 text-[#38BDF8]" />}
            title="TailwindCSS"
            description=""
          />
          <TechStackIcon
            icon={<SiBootstrap className="w-10 h-10 text-[#7710F1]" />}
            title="Bootstrap"
            description=""
          />
          <TechStackIcon
            icon={<SiThreedotjs className="w-10 h-10" />}
            title="Three.js"
            description=""
          />
        </TechStackRow>
        <TechStackRow>
          <TechStackIcon
            icon={<SiTypescript className="w-10 h-10 text-[#2F74C0]" />}
            title="TypeScript"
            description=""
          />
          <TechStackIcon
            icon={<SiJavascript className="w-10 h-10 text-[#EFD81D]" />}
            title="JavaScript"
            description=""
          />
        </TechStackRow>
        <TechStackRow>
          <TechStackIcon
            icon={<SiHtml5 className="w-10 h-10 text-[#F4470B]" />}
            title="HTML"
            description=""
          />
          <TechStackIcon
            icon={<SiCss3 className="w-10 h-10 text-[#146EB0]" />}
            title="CSS"
            description=""
          />
        </TechStackRow>
        <TechStackRow>
          <TechStackIcon
            icon={<SiGithub className="w-10 h-10" />}
            title="GitHub"
            description={
              <>
                <span>Check it out:</span>
                <br />
                <a href="https://github.com/akshay-nm" target="_blank">
                  @akshay-nm
                </a>
              </>
            }
          />
          <TechStackIcon
            icon={<SiTurborepo className="w-10 h-10" />}
            title="Turborepo"
            description=""
          />
          <TechStackIcon
            icon={<SiLerna className="w-10 h-10" />}
            title="Lerna"
            description=""
          />
          <TechStackIcon
            icon={<SiConventionalcommits className="w-10 h-10" />}
            title="Conventional commits"
            description=""
          />
        </TechStackRow>
        <TechStackRow>
          <TechStackIcon
            icon={<SiAmazon className="w-10 h-10" />}
            title="AWS"
            description=""
          />
          <TechStackIcon
            icon={<SiServerless className="w-10 h-10" />}
            title="Serverless Framework"
            description=""
          />
          <TechStackIcon
            icon={<SiGithubactions className="w-10 h-10" />}
            title="GitHub Actions"
            description=""
          />
          <TechStackIcon
            icon={<SiGnubash className="w-10 h-10" />}
            title="GNU Bash"
            description=""
          />
          <TechStackIcon
            icon={<SiPowershell className="w-10 h-10" />}
            title="Pwershell"
            description=""
          />
        </TechStackRow>
      </div>
    </div>
  );
};
