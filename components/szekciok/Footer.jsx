export default function Footer() {
  return (
    <footer className="w-full p-4 bg bg-neutral-950/80">
      <div className="w-[90%] md:w-[80%] max-w-[1800px] grid grid-cols-1 md:grid-cols-3 mx-auto py-[100px] border-t border-white ">
        <div className="flex flex-col gap-3">
          <span className="text-teal-400 font-bold uppercase tracking-widest text-xs sm:text-sm block">
            Minden nap frissen
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-100 tracking-tight leading-tight">
            Heti menü <span className="text-teal-400">kiszállítás</span>
          </h1>
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-400 italic">
            Mamma Mia Kifőzde
          </h2>
        </div>
        <div></div>
        <div className="w-full max-w-[400px] h-[220px] rounded-xl overflow-hidden border border-neutral-700 shadow-md">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3216.3434660034095!2d17.775670412349772!3d46.414491670984866!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47683f0057e6b25d%3A0xc6d10f8e86b3fa34!2sMamma%20Mia!5e1!3m2!1shu!2shu!4v1779900529552!5m2!1shu!2shu"
            width="600"
            height="450"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>
    </footer>
  );
}
