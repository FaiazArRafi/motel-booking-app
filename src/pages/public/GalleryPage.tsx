import React, { useState, useEffect } from 'react';
import { galleryService } from '../../services/galleryService';
import { GalleryImage } from '../../types/gallery';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { Image as ImageIcon } from 'lucide-react';

export const GalleryPage: React.FC = () => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeModalImage, setActiveModalImage] = useState<GalleryImage | null>(null);

  useEffect(() => {
    galleryService.getGallery()
      .then(setImages)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const categories = ['All', 'Exterior', 'Lobby', 'Rooms', 'Bathroom', 'Amenities', 'Parking'];

  const filtered = images.filter(img =>
    selectedCategory === 'All' ? true : img.category === selectedCategory
  );

  return (
    <div className="min-h-screen bg-stone-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-bold text-amber-700 uppercase tracking-widest">
            Visual Tour
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
            Motel Photo Gallery
          </h1>
          <p className="text-sm text-stone-500 leading-relaxed">
            Take a look inside our clean rooms, cozy lobby lounge, exterior courtyard, and modern amenities.
          </p>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap justify-center gap-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`py-2 px-4 rounded-xl text-xs font-bold transition ${
                selectedCategory === cat
                  ? 'bg-amber-800 text-white shadow-sm'
                  : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <LoadingSpinner label="Loading photo gallery..." />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filtered.map(item => (
              <div
                key={item.imageId}
                onClick={() => setActiveModalImage(item)}
                className="group relative aspect-[4/3] rounded-3xl overflow-hidden bg-stone-200 border border-stone-200 shadow-sm hover:shadow-xl transition cursor-pointer"
              >
                <img
                  src={item.url}
                  alt={item.title}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-6 flex flex-col justify-end">
                  <span className="text-[11px] font-bold text-amber-300 uppercase tracking-wider">{item.category}</span>
                  <h4 className="text-white font-bold text-base">{item.title}</h4>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Lightbox Modal */}
        {activeModalImage && (
          <div
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setActiveModalImage(null)}
          >
            <div className="max-w-4xl w-full space-y-3">
              <img
                src={activeModalImage.url}
                alt={activeModalImage.title}
                className="max-h-[80vh] w-auto mx-auto rounded-2xl shadow-2xl object-contain"
              />
              <div className="text-center text-white">
                <h3 className="font-bold text-lg">{activeModalImage.title}</h3>
                <span className="text-xs text-amber-400 font-semibold uppercase">{activeModalImage.category}</span>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
