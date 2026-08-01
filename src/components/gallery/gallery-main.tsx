"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Camera, ArrowLeft, Grid3X3, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { SectionWrapper, SectionTitle } from "@/components/home/section-wrapper";
import { AlbumCard } from "./album-card";
import { FullLightbox } from "./full-lightbox";
import {
  mockAlbums,
  mockPhotos,
  galleryCategories,
} from "./gallery-data";
import type { Album, Photo } from "./gallery-data";

export function GalleryMain() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [viewMode, setViewMode] = useState<"albums" | "all">("albums");
  const [showLightbox, setShowLightbox] = useState(false);

  // Filter albums
  const filteredAlbums = useMemo(() => {
    return mockAlbums.filter((a) => {
      const matchSearch =
        a.name.toLowerCase().includes(search.toLowerCase()) ||
        a.description.toLowerCase().includes(search.toLowerCase());
      const matchCat = category === "All" || a.category === category;
      return matchSearch && matchCat;
    });
  }, [search, category]);

  // Filter all photos (for "All Photos" view)
  const filteredPhotos = useMemo(() => {
    return mockPhotos.filter((p) => {
      const matchSearch =
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        (p.description && p.description.toLowerCase().includes(search.toLowerCase()));
      const matchCat = category === "All" || p.category === category;
      return matchSearch && matchCat;
    });
  }, [search, category]);

  const albumPhotos = selectedAlbum
    ? mockPhotos.filter((p) => p.albumId === selectedAlbum.id)
    : [];

  const openAlbum = (album: Album) => {
    setSelectedAlbum(album);
  };

  const openPhotoLightbox = (photo: Photo, index: number, photos: Photo[]) => {
    // Find this photo in the full photos array for navigation
    const globalIndex = mockPhotos.findIndex((p) => p.id === photo.id);
    setLightboxIndex(globalIndex >= 0 ? globalIndex : index);
    setShowLightbox(true);
  };

  return (
    <section className="py-16 md:py-20 bg-[#F8FAFF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionWrapper>
          <SectionTitle
            title="Photo Gallery"
            subtitle="Relive the beautiful moments and memories from our services, events, and community life at Youth Church"
          />
        </SectionWrapper>

        {/* Controls Bar */}
        <SectionWrapper>
          <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between mb-8">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
              <Input
                placeholder="Search albums or photos..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 rounded-xl border-gray-200 bg-white h-11 focus:border-[#4A148C]/30"
              />
            </div>

            <div className="flex items-center gap-3">
              {/* Category filter */}
              <div className="relative">
                <SlidersHorizontal className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400 pointer-events-none" />
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="pl-10 pr-8 h-11 rounded-xl border border-gray-200 bg-white text-sm text-gray-700 appearance-none cursor-pointer focus:outline-none focus:border-[#4A148C]/30 focus:ring-2 focus:ring-[#4A148C]/10"
                >
                  {galleryCategories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* View toggle: Albums vs All Photos */}
              <div className="flex items-center bg-white rounded-xl border border-gray-200 p-1">
                <button
                  onClick={() => { setViewMode("albums"); setSelectedAlbum(null); }}
                  className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
                    viewMode === "albums" && !selectedAlbum
                      ? "bg-[#4A148C] text-white"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <Grid3X3 className="size-3.5" />
                  Albums
                </button>
                <button
                  onClick={() => { setViewMode("all"); setSelectedAlbum(null); }}
                  className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
                    viewMode === "all" && !selectedAlbum
                      ? "bg-[#4A148C] text-white"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <Camera className="size-3.5" />
                  All Photos
                </button>
              </div>
            </div>
          </div>
        </SectionWrapper>

        {/* Back breadcrumb when inside an album */}
        <AnimatePresence mode="wait">
          {selectedAlbum && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="mb-6"
            >
              <button
                onClick={() => setSelectedAlbum(null)}
                className="inline-flex items-center gap-2 text-sm text-[#4A148C] hover:text-[#1A0033] font-medium transition-colors"
              >
                <ArrowLeft className="size-4" />
                Back to Albums
              </button>
              <h2 className="text-2xl md:text-3xl font-bold text-[#4A148C] mt-2">
                {selectedAlbum.name}
              </h2>
              <p className="text-sm text-gray-500 mt-1">{selectedAlbum.description}</p>
              <p className="text-xs text-gray-400 mt-1">
                {albumPhotos.length} photos &middot;{" "}
                {new Date(selectedAlbum.date).toLocaleDateString("en-NG", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {!selectedAlbum && viewMode === "albums" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            {filteredAlbums.map((album, i) => (
              <AlbumCard key={album.id} album={album} index={i} onClick={openAlbum} />
            ))}
          </div>
        )}

        {!selectedAlbum && viewMode === "all" && (
          <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
            {filteredPhotos.map((photo, i) => (
              <motion.div
                key={photo.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.4, delay: i * 0.03 }}
                onClick={() => openPhotoLightbox(photo, i, filteredPhotos)}
                className="group cursor-pointer break-inside-avoid"
              >
                <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-[#E8EDFF] to-[#F3E5F5] shadow-sm hover:shadow-lg transition-all duration-300">
                  <div
                    className={`w-full flex items-center justify-center ${
                      i % 4 === 0
                        ? "aspect-[4/3]"
                        : i % 4 === 1
                        ? "aspect-square"
                        : i % 4 === 2
                        ? "aspect-[3/4]"
                        : "aspect-[16/9]"
                    }`}
                  >
                    <Camera className="size-8 text-[#4A148C]/10" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <p className="text-white text-sm font-semibold truncate">{photo.title}</p>
                      <p className="text-white/60 text-xs mt-0.5">
                        {new Date(photo.date).toLocaleDateString("en-NG", { month: "short", day: "numeric" })}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {selectedAlbum && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {albumPhotos.map((photo, i) => (
              <motion.div
                key={photo.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: i * 0.03 }}
                onClick={() => openPhotoLightbox(photo, i, albumPhotos)}
                className="group cursor-pointer aspect-square rounded-xl overflow-hidden bg-gradient-to-br from-[#E8EDFF] to-[#F3E5F5] relative"
              >
                <Camera className="size-6 text-[#4A148C]/10 absolute inset-0 m-auto" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-200 flex items-center justify-center">
                  <span className="text-white text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                    {photo.title}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {((!selectedAlbum && viewMode === "albums" && filteredAlbums.length === 0) ||
          (!selectedAlbum && viewMode === "all" && filteredPhotos.length === 0)) && (
          <div className="text-center py-20">
            <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <Camera className="size-8 text-gray-300" />
            </div>
            <h3 className="text-lg font-semibold text-gray-700">No photos found</h3>
            <p className="text-sm text-gray-500 mt-1">
              Try adjusting your search or filter.
            </p>
          </div>
        )}
      </div>

      {/* Full Lightbox */}
      {showLightbox && (
        <FullLightbox
          photos={mockPhotos}
          initialIndex={lightboxIndex}
          onClose={() => setShowLightbox(false)}
          onBackToAlbums={() => setShowLightbox(false)}
          albumName={selectedAlbum?.name || "All Photos"}
        />
      )}
    </section>
  );
}