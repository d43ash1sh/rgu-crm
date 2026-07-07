import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { getGalleryItems } from '../api';

const categories = ['All', 'Cultural', 'Gatherings', 'Ceremonies'];

export default function Gallery() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedImage, setSelectedImage] = useState(null);
  const [galleryImages, setGalleryImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getGalleryItems()
      .then(data => {
        const mapped = data.map((item, idx) => ({
          ...item,
          id: item._id || idx
        }));
        setGalleryImages(mapped);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const getCategoryCount = (category) => {
    if (category === 'All') return galleryImages.length;
    return galleryImages.filter(img => img.category === category).length;
  };

  const filteredImages = activeCategory === 'All'
    ? galleryImages
    : galleryImages.filter(img => img.category === activeCategory);

  const handleNext = (e) => {
    e.stopPropagation();
    const currentIndex = filteredImages.findIndex(img => img.id === selectedImage.id);
    const nextIndex = (currentIndex + 1) % filteredImages.length;
    setSelectedImage(filteredImages[nextIndex]);
  };

  const handlePrev = (e) => {
    e.stopPropagation();
    const currentIndex = filteredImages.findIndex(img => img.id === selectedImage.id);
    const prevIndex = (currentIndex - 1 + filteredImages.length) % filteredImages.length;
    setSelectedImage(filteredImages[prevIndex]);
  };

  return (
    <div className="bg-surface font-body text-on-surface min-h-screen flex flex-col antialiased selection:bg-primary/20 selection:text-primary">
      <Navbar />

      <main className="flex-1 relative pt-32 pb-24 px-8 max-w-7xl mx-auto w-full z-10">
        <div className="absolute inset-0 pointer-events-none radial-dots z-[-1] opacity-50"></div>

        {/* Page Header */}
        <header className="mb-16 text-center max-w-2xl mx-auto">
          <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black tracking-widest uppercase mb-4">
            Archives
          </span>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter leading-tight mb-4 text-slate-900">
            Visual Gallery
          </h1>
          <p className="text-lg text-slate-500 font-light leading-relaxed">
            Relive the milestones, cultural celebrations, and community initiatives of the RGU Assam Students' Forum.
          </p>
        </header>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
          {categories.map((category) => {
            const isActive = activeCategory === category;
            const count = getCategoryCount(category);
            return (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${
                  isActive
                    ? 'bg-primary text-white shadow-lg shadow-primary/25 scale-105'
                    : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50 active:scale-95'
                }`}
              >
                <span>{category === 'All' ? 'All Snapshots' : category}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-black ${
                  isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-400'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Image Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredImages.map((image) => (
              <motion.div
                key={image.id}
                layout
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                onClick={() => setSelectedImage(image)}
                className="group aspect-[4/3] relative rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-350 cursor-pointer bg-slate-50 border border-slate-200/50"
              >
                <img
                  src={image.src}
                  alt={image.title || image.category}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                />
                
                {/* Visual hover caption */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                  <span className="text-white/60 text-[10px] font-black uppercase tracking-wider mb-1">
                    {image.category}
                  </span>
                  
                  {image.title ? (
                    <h3 className="text-white text-base font-bold leading-tight mb-2 group-hover:translate-y-0 translate-y-2 transition-transform duration-300">
                      {image.title}
                    </h3>
                  ) : (
                    <h3 className="text-white/40 text-sm font-semibold italic mb-2 group-hover:translate-y-0 translate-y-2 transition-transform duration-300">
                      Snapshot
                    </h3>
                  )}

                  <span className="text-white/50 text-[10px] flex items-center gap-1.5 font-medium group-hover:translate-y-0 translate-y-2 transition-transform duration-300 delay-75">
                    <span className="material-symbols-outlined text-[12px]">calendar_month</span>
                    {image.date}
                  </span>
                </div>

                {/* Corner category badge */}
                <div className="absolute top-4 left-4 bg-white/80 backdrop-blur-md px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider text-slate-600 shadow-sm border border-slate-200/10 group-hover:opacity-0 transition-opacity duration-300">
                  {image.category}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Empty State */}
        {filteredImages.length === 0 && (
          <div className="text-center py-20 bg-white/50 backdrop-blur-xl border border-slate-200 rounded-[2rem] max-w-md mx-auto">
            <span className="material-symbols-outlined text-5xl text-slate-350 mb-4 block">image_not_supported</span>
            <p className="text-lg text-slate-500 font-bold">No Snapshots Found</p>
            <p className="text-sm text-slate-400 mt-1">There are no files uploaded in this filter tab.</p>
          </div>
        )}

        {/* Lightbox Modal */}
        <AnimatePresence>
          {selectedImage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedImage(null)}
              className="fixed inset-0 z-50 bg-black/96 flex flex-col items-center justify-center p-4 md:p-8 select-none"
            >
              {/* Close button */}
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-6 right-6 text-white/75 hover:text-white bg-white/10 hover:bg-white/20 p-3 rounded-full transition-all hover:scale-105 active:scale-95 cursor-pointer"
              >
                <span className="material-symbols-outlined text-2xl block">close</span>
              </button>

              {/* Navigation buttons */}
              <button
                onClick={handlePrev}
                className="absolute left-4 md:left-8 text-white/75 hover:text-white bg-white/10 hover:bg-white/20 p-4 rounded-full transition-all hover:scale-105 active:scale-95 z-10 cursor-pointer"
              >
                <span className="material-symbols-outlined text-3xl block">arrow_back_ios_new</span>
              </button>
              <button
                onClick={handleNext}
                className="absolute right-4 md:right-8 text-white/75 hover:text-white bg-white/10 hover:bg-white/20 p-4 rounded-full transition-all hover:scale-105 active:scale-95 z-10 cursor-pointer"
              >
                <span className="material-symbols-outlined text-3xl block">arrow_forward_ios</span>
              </button>

              {/* Active Slide Container */}
              <motion.div
                initial={{ scale: 0.96, y: 15 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.96, y: 15 }}
                onClick={(e) => e.stopPropagation()}
                className="relative max-w-5xl w-full max-h-[80vh] flex items-center justify-center rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/5 bg-slate-950"
              >
                <img
                  src={selectedImage.src}
                  alt={selectedImage.title || selectedImage.category}
                  className="max-w-full max-h-[80vh] object-contain"
                />
                
                {/* Meta details footer inside lightbox */}
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/95 via-black/70 to-transparent p-6 md:p-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
                  <div className="space-y-1.5">
                    <span className="inline-block px-2.5 py-0.5 rounded-full bg-primary text-white text-[9px] font-black uppercase tracking-wider">
                      {selectedImage.category}
                    </span>
                    {selectedImage.title && (
                      <h2 className="text-white text-xl md:text-2xl font-black tracking-tight leading-tight">
                        {selectedImage.title}
                      </h2>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-white/60 text-xs font-bold uppercase tracking-wider shrink-0">
                    <span className="material-symbols-outlined text-sm">calendar_month</span>
                    {selectedImage.date}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
}
