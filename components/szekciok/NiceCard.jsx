"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Szepkartya from "../../public/otp_szepkartyanobg.png";

export default function NiceCard() {
  //  szülő konténer variánsa
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  //  egyes nyilak
  const arrowVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { type: "spring", stiffness: 100, damping: 15 },
    },
  };

  return (
    <section className="w-full flex flex-col md:flex-row p-[10px] bg-white/10 backdrop-blur-lg my-[35px] rounded-lg">
      {/* BAL OLDAL: A kártya kép */}
      <div className="w-full md:w-[50%] nicecard-bal flex flex-row">
        <div style={{ position: "relative", width: "100%", height: "350px" }}>
          <Image
            src={Szepkartya}
            fill
            style={{
              objectFit: "contain",
              padding: "10px",
            }}
            alt="Szépkártya elfogadó hetimenü kifőzde"
            loading="lazy"
          />
        </div>
      </div>

      {/* JOBB OLDAL: Animált nyilak és a maszkolt szöveg */}
      <div className="w-full md:w-[50%] nicecard-jobb items-center justify-center flex flex-col gap-4">
        <motion.div
          className="svg-wrapper flex flex-row flex-nowrap gap-0 justify-center items-center"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false }}
        >
          {[1, 2, 3, 4].map((index) => (
            <motion.svg
              key={index}
              variants={arrowVariants}
              fill="#f2ecd5"
              className="w-[25px] h-[25px] md:w-[40px] md:h-[40px]"
              viewBox="0 0 511.947 511.947"
              stroke="#1d3a22"
            >
              <g strokeWidth="0"></g>
              <g strokeLinecap="round" strokeLinejoin="round"></g>
              <g>
                <g>
                  <path d="M407.553,248.453L161.9,3.12c-4.16-4.16-10.88-4.16-15.04,0l-42.453,42.347c-4.16,4.16-4.16,10.88,0,15.04l195.733,195.52 l-195.733,195.52c-4.16,4.16-4.16,10.88,0,15.04l42.347,42.24c4.16,4.16,10.88,4.16,15.04,0l245.653-245.333 C411.713,259.44,411.713,252.613,407.553,248.453z M154.327,486.32l-27.307-27.2L322.753,263.6c4.16-4.16,4.16-10.88,0-15.04 L127.127,53.04l27.307-27.2L384.94,256.027L154.327,486.32z"></path>
                </g>
              </g>
            </motion.svg>
          ))}
        </motion.div>

        <div>
          <h2 className="text-[20px] md:text-[40px] [-webkit-text-stroke:1px_white] uppercase font-black text-center text-transparent bg-clip-text bg-fixed bg-cover bg-center bg-[url('/otp_szepkartyanobg.png')]">
            Szépkártya elfogadóhely
          </h2>
        </div>
      </div>
    </section>
  );
}
