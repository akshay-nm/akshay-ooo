import { useId, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import clsx from 'clsx'

import { AudioPlayer } from '@/components/player/AudioPlayer'
import posterImage from '@/images/profile.jpg'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faGithub,
//   faInstagram,
//   faInstagramSquare,
  faLinkedin,
  faMediumM,
//   faYoutube,
} from '@fortawesome/free-brands-svg-icons'

function random(length, min, max, seed = 1) {
  return Array.from({ length }).map(() => {
    let rand = Math.sin(seed++) * 10000
    rand = rand - Math.floor(rand)
    return Math.floor(rand * (max - min + 1) + min)
  })
}

function Waveform() {
  let id = useId()
  let barCount = 100
  let barWidth = 2
  let barGap = 2
  let lengths = random(barCount, 40, 100)

  return (
    <svg aria-hidden="true" className="absolute left-0 top-0 h-20 w-full">
      <defs>
        <linearGradient id={`${id}-fade`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="40%" stopColor="white" />
          <stop offset="100%" stopColor="black" />
        </linearGradient>
        <linearGradient id={`${id}-gradient`}>
          <stop offset="0%" stopColor="#4989E8" />
          <stop offset="50%" stopColor="#6159DA" />
          <stop offset="100%" stopColor="#FF54AD" />
        </linearGradient>
        <mask id={`${id}-mask`}>
          <rect width="100%" height="100%" fill={`url(#${id}-pattern)`} />
        </mask>
        <pattern
          id={`${id}-pattern`}
          width={barCount * barWidth + barCount * barGap}
          height="100%"
          patternUnits="userSpaceOnUse"
        >
          {Array.from({ length: barCount }).map((_, index) => (
            <rect
              key={index}
              width={barWidth}
              height={`${lengths[index]}%`}
              x={barGap * (index + 1) + barWidth * index}
              fill={`url(#${id}-fade)`}
            />
          ))}
        </pattern>
      </defs>
      <rect
        width="100%"
        height="100%"
        fill={`url(#${id}-gradient)`}
        mask={`url(#${id}-mask)`}
        opacity="0.25"
      />
    </svg>
  )
}

function AboutSection(props) {
  let [isExpanded, setIsExpanded] = useState(false)

  return (
    <section {...props}>
      <h2 className="flex items-center font-mono text-sm font-medium leading-7 text-slate-900">
        <svg aria-hidden="true" className="h-2.5 w-2.5">
          <path
            d="M0 5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1V5Z"
            className="fill-violet-300"
          />
          <path
            d="M6 1a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V1Z"
            className="fill-teal-300"
          />
        </svg>
        <span className="ml-2.5">About me</span>
      </h2>
      <p
        className={clsx('mt-2 text-base leading-7 text-slate-700', {
          'lg:line-clamp-4': !isExpanded,
        })}
      >
        {/* On this page, I&apos;ll skim over some of my endeavours, occasionally
        deep diving into the process behind the deeds, without actually getting
        the full story. */}
        I&apos;m a big fan of the open source community but ironically I find it
        really difficult sharing things that I&apos;ve done. <br />I really love
        to sing whenever I get the chance.
        <br /> Currently living in Konohagakure. 🍜 <br />
        Occassionaly visit Northumbria too ⚔️
      </p>
      {!isExpanded && (
        <button
          type="button"
          className="mt-2 hidden text-sm font-bold leading-6 text-teal-500 hover:text-teal-700 active:text-teal-900 lg:inline-block"
          onClick={() => setIsExpanded(true)}
        >
          Show more
        </button>
      )}
    </section>
  )
}

export function Layout({ children }) {
  return (
    <>
      <div className="bg-slate-50 lg:fixed lg:inset-y-0 lg:left-0 lg:flex lg:w-112 lg:items-start lg:overflow-y-auto xl:w-120">
        <div className="hidden lg:sticky lg:top-0 lg:flex lg:w-16 lg:flex-none lg:items-center lg:whitespace-nowrap lg:py-12 lg:text-sm lg:leading-7 lg:[writing-mode:vertical-rl]">
          <span className="font-mono text-slate-500">Created by</span>
          <span className="mt-6 flex font-bold text-slate-900">
            <span className="after:mt-6 after:text-slate-400">
              Akshay Kumar
            </span>
            {/* <span className="mt-6">Wes Mantooth</span> */}
          </span>
        </div>
        <div className="relative z-10 mx-auto px-4 pb-4 pt-10 sm:px-6 md:max-w-2xl md:px-4 lg:min-h-full lg:flex-auto lg:border-x lg:border-slate-200 lg:py-12 lg:px-8 xl:px-12">
          <Link href="/">
            <a
              className="relative mx-auto block w-48 overflow-hidden rounded-lg bg-slate-200 shadow-xl shadow-slate-200 sm:w-64 sm:rounded-xl lg:w-auto lg:rounded-2xl"
              aria-label="Homepage"
            >
              <Image
                src={posterImage}
                alt=""
                layout="responsive"
                sizes="(min-width: 1024px) 20rem, (min-width: 640px) 16rem, 12rem"
                priority
              />
              <div className="absolute inset-0 rounded-lg ring-1 ring-inset ring-black/10 sm:rounded-xl lg:rounded-2xl" />
            </a>
          </Link>
          <div className="mt-10 text-center lg:mt-12 lg:text-left">
            <p className="text-xl font-bold text-slate-900">
              <Link href="/">
                <a>What&apos;s this?</a>
              </Link>
            </p>
            <p className="mt-3 text-lg font-medium leading-8 text-slate-700">
              This is a collection of things I&apos;ve worked on or have been
              part of.
            </p>
          </div>
          <AboutSection className="mt-12 hidden lg:block" />
          <section className="mt-10 lg:mt-12">
            <h2 className="sr-only flex items-center font-mono text-sm font-medium leading-7 text-slate-900 lg:not-sr-only">
              <svg aria-hidden="true" className="h-2.5 w-2.5">
                <path
                  d="M0 5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1V5Z"
                  className="fill-indigo-300"
                />
                <path
                  d="M6 1a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V1Z"
                  className="fill-blue-300"
                />
              </svg>
              <span className="ml-2.5">Links</span>
            </h2>
            <div className="h-px bg-gradient-to-r from-slate-200/0 via-slate-200 to-slate-200/0 lg:hidden" />
            <ul className="mt-4 flex justify-center space-x-10 text-base font-medium leading-7 text-slate-700 sm:space-x-8 lg:block lg:space-x-0 lg:space-y-4">
              <li className="flex">
                <a
                  className="group flex items-center"
                  href="https://www.linkedin.com/in/akshay-nm/"
                  target="_blank"
                  rel="noreferrer noopenner"
                >
                  <FontAwesomeIcon icon={faLinkedin} className="text-2xl" />
                  <span className="sr-only sm:hidden">LinkedIn</span>
                  <span className="hidden sm:ml-3 sm:block">LinkedIn</span>
                </a>
              </li>
              <li className="flex">
                <a
                  className="group flex items-center"
                  href="https://github.com/akshay-nm"
                  target="_blank"
                  rel="noreferrer noopenner"
                >
                  <FontAwesomeIcon icon={faGithub} className="text-2xl" />
                  <span className="sr-only sm:hidden">GitHub</span>
                  <span className="hidden sm:ml-3 sm:block">GitHub</span>
                </a>
              </li>
              {/*<li className="flex">
                <a
                  className="group flex items-center"
                  href="https://www.youtube.com/c/NightMoves"
                  target="_blank"
                  rel="noreferrer noopenner"
                >
                  <FontAwesomeIcon icon={faYoutube} className="text-2xl" />
                  <span className="sr-only sm:hidden">Youtube</span>
                  <span className="hidden sm:ml-3 sm:block">Youtube</span>
                </a>
              </li>
              <li className="flex">
                <a
                  className="group flex items-center"
                  href="https://www.instagram.com/nm.akshay/"
                  target="_blank"
                  rel="noreferrer noopenner"
                >
                  <FontAwesomeIcon icon={faInstagram} className="text-2xl" />
                  <span className="sr-only sm:hidden">Instagram</span>
                  <span className="hidden sm:ml-3 sm:block">Instagram</span>
                </a>
              </li>*/}
              <li className="flex">
                <a
                  className="group flex items-center"
                  href="https://akshay-nm.medium.com/"
                  target="_blank"
                  rel="noreferrer noopenner"
                >
                  <FontAwesomeIcon icon={faMediumM} className="text-2xl" />
                  <span className="sr-only sm:hidden">Medium</span>
                  <span className="hidden sm:ml-3 sm:block">Medium</span>
                </a>
              </li>
            </ul>
          </section>
        </div>
      </div>
      <div className="border-t border-slate-200 lg:relative lg:mb-28 lg:ml-112 lg:border-t-0 xl:ml-120">
        <Waveform />
        <div className="relative">{children}</div>
      </div>
      <div className="border-t border-slate-200 bg-slate-50 py-10 pb-40 sm:py-16 sm:pb-32 lg:hidden">
        <div className="mx-auto px-4 sm:px-6 md:max-w-2xl md:px-4">
          <AboutSection />
          <h2 className="mt-8 flex items-center font-mono text-sm font-medium leading-7 text-slate-900">
            <svg
              aria-hidden="true"
              viewBox="0 0 11 12"
              className="h-3 w-auto fill-slate-300"
            >
              <path d="M5.019 5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Zm3.29 7c1.175 0 2.12-1.046 1.567-2.083A5.5 5.5 0 0 0 5.019 7 5.5 5.5 0 0 0 .162 9.917C-.39 10.954.554 12 1.73 12h6.578Z" />
            </svg>
            <span className="ml-2.5">Created by</span>
          </h2>
          <div className="mt-2 flex text-sm font-bold leading-7 text-slate-900">
            <span className="after:ml-6 after:text-slate-400">
              Akshay Kumar
            </span>
          </div>
        </div>
      </div>
      {/* <div className="fixed inset-x-0 right-0 bottom-0 z-10 rounded-lg lg:left-112 xl:left-120">
        <AudioPlayer />
      </div> */}
    </>
  )
}
