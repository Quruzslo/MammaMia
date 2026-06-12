import {
  FaFacebook,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaClock,
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="w-full bg-neutral-950/90 backdrop-blur-md border-t border-neutral-850 mt-auto text-gray-300">
      <div className="w-[90%] md:w-[80%] max-w-[1400px] mx-auto py-12 md:py-20 grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-6 items-start">
        {/* 1. Oszlop: Brand & Mottó */}
        <div className="flex flex-col gap-3">
          <span className="text-teal-400 font-bold uppercase tracking-widest text-xs block">
            Minden nap frissen
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-gray-100 tracking-tight leading-tight">
            Heti menü <span className="text-teal-400">kiszállítás</span>
          </h1>
          <h2 className="text-lg font-semibold text-neutral-400 italic">
            Mamma Mia Kifőzde
          </h2>
          <p className="text-sm text-neutral-500 max-w-xs mt-2 leading-relaxed">
            Házias ízek, gyors kiszállítás. Rendeld meg a heti menüdet
            kényelmesen otthonodba vagy irodádba!
          </p>
        </div>

        {/* 2. Oszlop: Elérhetőség & Nyitvatartás (A korábbi üres helyett) */}
        <div className="flex flex-col gap-5 pt-2">
          <h3 className="text-white font-bold text-sm uppercase tracking-wider border-b border-neutral-800 pb-2">
            Kapcsolat & Nyitvatartás
          </h3>

          <div className="flex flex-col gap-3 text-sm">
            <div className="flex items-center gap-3">
              <FaClock className="text-teal-400 shrink-0" size={16} />
              <div>
                <p className="text-neutral-400 text-xs">Hétfő - Péntek</p>
                <p className="font-medium text-gray-200">11:00 - 15:00</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <FaPhoneAlt className="text-teal-400 shrink-0" size={16} />
              <div>
                <p className="text-neutral-400 text-xs">Rendelésfelvétel</p>
                <a
                  href="tel:+36301234567"
                  className="font-medium text-gray-200 hover:text-teal-400 transition-colors"
                >
                  +36 30 123 4567
                </a>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <FaMapMarkerAlt className="text-teal-400 shrink-0" size={16} />
              <div>
                <p className="text-neutral-400 text-xs">Címünk</p>
                <p className="font-medium text-gray-200">
                  Kaposvár, Kaposfüredi út, 7409
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Oszlop: Térkép & Közösségi média */}
        <div className="flex flex-col gap-4 w-full max-w-[400px] justify-self-start md:justify-self-end">
          <div className="w-full h-[180px] rounded-xl overflow-hidden border border-neutral-800 shadow-xl relative group/map">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3216.3434660034095!2d17.775670412349772!3d46.414491670984866!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47683f0057e6b25d%3A0xc6d10f8e86b3fa34!2sMamma%20Mia!5e1!3m2!1shu!2shu!4v1779900529552!5m2!1shu!2shu"
              className="w-full h-full border-0 absolute inset-0 md:grayscale md:opacity-80 md:contrast-125 transition-all duration-300 group-hover/map:grayscale-0 group-hover/map:opacity-100"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>

          {/* Közösségi Link  */}
          <a
            className="flex items-center justify-between w-full p-3 rounded-xl bg-neutral-900/60 border border-neutral-800/80 hover:border-teal-500/30 transition-all duration-300 group"
            href="https://www.facebook.com/mammamiakifozde"
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="flex flex-row gap-3 items-center">
              <FaFacebook
                size={20}
                className="fill-neutral-400 transition-colors duration-300 group-hover:fill-blue-500"
              />
              <p className="text-neutral-400 text-xs sm:text-sm font-medium transition-colors duration-300 group-hover:text-white">
                Kövess minket Facebookon is!
              </p>
            </div>
            <span className="text-neutral-600 group-hover:text-teal-400 transition-colors text-xs">
              ➔
            </span>
          </a>
        </div>
      </div>

      {/* Alsó copyright sáv */}
      <div className="w-full border-t border-neutral-900 bg-neutral-950 py-4 text-center text-xs text-neutral-600">
        © {new Date().getFullYear()} Mamma Mia Kifőzde. Minden jog fenntartva.
      </div>
    </footer>
  );
}
