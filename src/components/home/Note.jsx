import { motion } from "framer-motion";
import { Info } from "lucide-react";
import { Link } from "react-router-dom";

const Note = () => {
  return (
    <section
      aria-label="Reminder Note"
      className="py-12 bg-[#112240] text-white w-full overflow-hidden"
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: true }}
        className="max-w-4xl mx-auto px-6"
      >
        <motion.div
          whileHover={{ scale: 1.05, boxShadow: "0 0 20px #22d3ee" }}
          className="flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-2xl shadow-xl transition-all duration-300 cursor-pointer"
        >
          <Info size={22} className="animate-pulse text-white" />
          <p className="text-base sm:text-lg font-semibold tracking-wide">
            Don’t forget to visit other pages too!
          </p>
        </motion.div>

        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link to="/whoiam">
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="bg-slate-700 hover:bg-slate-600 transition-colors px-5 py-2 rounded-xl text-white font-semibold"
            >
              Who I Am
            </motion.button>
          </Link>
          <Link to="/certificates">
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="bg-cyan-600 hover:bg-cyan-500 transition-colors px-5 py-2 rounded-xl text-white font-semibold"
            >
              Certificates
            </motion.button>
          </Link>
          <Link to="/projects">
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="bg-blue-600 hover:bg-blue-500 transition-colors px-5 py-2 rounded-xl text-white font-semibold"
            >
              Projects
            </motion.button>
          </Link>
          <Link to="/blog">
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="bg-purple-600 hover:bg-purple-500 transition-colors px-5 py-2 rounded-xl text-white font-semibold"
            >
              Blog
            </motion.button>
          </Link>
        </div>
      </motion.div>
    </section>
  );
};

export default Note;
