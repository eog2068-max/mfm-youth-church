"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Search, Camera, ZoomIn, ChevronLeft, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";

interface Photo {
  id: string;
  title: string;
  date: string;
  category: string;
  description?: string;
}

const mockPhotos: Photo[] = [
  { id: "p1", title: "Sunday Worship Service", date: "2025-07-13", category: "Services", description: "A powerful time of worship and the Word" },
  { id: "p2", title: "Children Church Graduation", date: "2025-07-06", category: "Events", description: "Celebrating our children's milestone" },
  { id: "p3", title: "Special Thanksgiving Service", date: "2025-07-04", category: "Services", description: "A service dedicated to thanking God" },
  { id: "p4", title: "Choir Rehearsal", date: "2025-06-29", category: "Ministry", description: "The choir preparing for Sunday service" },
  { id: "p5", title: "Bible Study Session", date: "2025-06-25", category: "Services", description: "Midweek spiritual nourishment" },
  { id: "p6", title: "Community Outreach", date: "2025-06-22", category: "Outreach", description: "Reaching out to the Utako community" },
  { id: "p7", title: "Youth Conference 2025", date: "2025-06-15", category: "Events", description: "Empowering the next generation" },
  { id: "p8", title: "Prayer Mountain Retreat", date: "2025-06-10", category: "Events", description: "A time of consecration and prayer" },
  { id: "p9", title: "Ushering Department Training", date: "2025-06-08", category: "Ministry", description: "Excellence in service" },
  { id: "p10", title: "Easter Sunday Celebration", date: "2025-04-20", category: "Services", description: "Celebrating the resurrection of Christ" },
  { id: "p11", title: "Good Friday Service", date: "2025-04-18", category: "Services", description: "Reflecting on the sacrifice of Jesus" },
  { id: "p12", title: "Welfare Distribution", date: "2025-04-12", category: "Outreach", description: "Sharing love with the community" },
];

const photoCategories = ["All", "Services", "Events", "Ministry", "Outreach"];

export function PhotoGallery() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const filtered = mockPhotos.filter((p) => {
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === "All" || p.category === category;
    return matchSearch && matchCat;
  });

  const openPhoto = (photo: Photo, index: number) => {
    setSelectedPhoto(photo);
    setSelectedIndex(index);
  };

  const navigate = (dir: number) => {
    const newIdx = selectedIndex + dir;
    if (newIdx >= 0 && newIdx < filtered.length) {
      setSelectedPhoto(filtered[newIdx]);
      setSelectedIndex(newIdx);
    }
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
          <Input
            placeholder="Search photos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 rounded-xl border-gray-200 bg-white h-10 focus:border-[#4A148C]/30"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {photoCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                category === cat
                  ? "bg-[#4A148C] text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Masonry-style grid */}
      <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
        {filtered.map((photo, i) => (
          <motion.div
            key={photo.id}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.4, delay: i * 0.04 }}
            onClick={() => openPhoto(photo, i)}
            className="group cursor-pointer break-inside-avoid"
          >
            <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-[#E8EDFF] to-[#F3E5F5] shadow-sm hover:shadow-lg transition-all duration-300">
              {/* Photo placeholder with varying heights for masonry effect */}
              <div
                className={`w-full flex items-center justify-center relative ${
                  i % 3 === 0 ? "aspect-[4/3]" : i % 3 === 1 ? "aspect-square" : "aspect-[3/4]"
                }`}
              >
                <Camera className="size-10 text-[#4A148C]/10" />
              </div>

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <p className="text-white text-sm font-semibold">{photo.title}</p>
                  <p className="text-white/70 text-xs mt-0.5">{photo.date}</p>
                </div>
                <div className="absolute top-3 right-3">
                  <ZoomIn className="size-5 text-white/80" />
                </div>
              </div>

              {/* Category tag */}
              <span className="absolute top-3 left-3 bg-white/90 text-[#4A148C] text-[10px] px-2 py-0.5 rounded-md font-medium">
                {photo.category}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center"
          >
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedPhoto(null)} />

            {/* Navigation arrows */}
            {selectedIndex > 0 && (
              <button
                onClick={(e) => { e.stopPropagation(); navigate(-1); }}
                className="absolute left-3 z-10 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
              >
                <ChevronLeft className="size-6" />
              </button>
            )}
            {selectedIndex < filtered.length - 1 && (
              <button
                onClick={(e) => { e.stopPropagation(); navigate(1); }}
                className="absolute right-3 z-10 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
              >
                <ChevronRight className="size-6" />
              </button>
            )}

            {/* Content */}
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="relative z-10 max-w-4xl w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-gradient-to-br from-[#E8EDFF] to-[#F3E5F5] rounded-2xl aspect-video flex items-center justify-center relative">
                <Camera className="size-16 text-[#4A148C]/15" />
                <span className="absolute text-sm text-[#4A148C]/30 font-medium">Photo</span>
              </div>
              <div className="mt-3 text-center">
                <p className="text-white font-semibold text-lg">{selectedPhoto.title}</p>
                {selectedPhoto.description && (
                  <p className="text-white/60 text-sm mt-1">{selectedPhoto.description}</p>
                )}
                <p className="text-white/40 text-xs mt-1">{selectedPhoto.date}</p>
              </div>
              {/* Close */}
              <button
                onClick={() => setSelectedPhoto(null)}
                className="absolute -top-3 -right-3 p-2 rounded-full bg-white text-gray-600 hover:text-gray-900 shadow-lg transition-colors"
              >
                <X className="size-5" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}