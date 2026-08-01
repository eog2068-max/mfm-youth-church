"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Play, Clock, Eye, ArrowRight, Film } from "lucide-react";
import { Input } from "@/components/ui/input";
import { SectionWrapper, SectionTitle } from "@/components/home/section-wrapper";
import { FeaturedVideo } from "./featured-video";
import { VideoCard, SeriesCard } from "./video-card";
import { VideoPlayerModal } from "./video-player-modal";
import {
  mockVideos,
  mockSeries,
  videoCategories,
} from "./video-data";
import type { Video, Series } from "./video-data";

export function VideoGalleryMain() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [selectedSeries, setSelectedSeries] = useState<Series | null>(null);
  const [playingVideo, setPlayingVideo] = useState<Video | null>(null);
  const [showAllVideos, setShowAllVideos] = useState(false);

  const featuredVideo = mockVideos.find((v) => v.isFeatured) || mockVideos[0];

  // Filter videos
  const filteredVideos = useMemo(() => {
    return mockVideos.filter((v) => {
      const matchSearch =
        v.title.toLowerCase().includes(search.toLowerCase()) ||
        v.speaker.toLowerCase().includes(search.toLowerCase());
      const matchCat = category === "All" || v.category === category;
      const matchSeries = !selectedSeries || v.seriesId === selectedSeries.id;
      return matchSearch && matchCat && matchSeries;
    });
  }, [search, category, selectedSeries]);

  // Videos for the player modal (from the current context)
  const playlistVideos = useMemo(() => {
    if (selectedSeries) {
      return mockVideos.filter((v) => v.seriesId === selectedSeries.id);
    }
    return filteredVideos;
  }, [selectedSeries, filteredVideos]);

  const openVideo = (video: Video) => {
    setPlayingVideo(video);
  };

  return (
    <section className="py-12 md:py-16 bg-[#F8FAFF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionWrapper>
          <SectionTitle
            title="Video Gallery"
            subtitle="Watch powerful sermons, inspiring messages, and complete service recordings from Youth Church"
          />
        </SectionWrapper>

        {/* Featured Video */}
        {!selectedSeries && !showAllVideos && (
          <SectionWrapper>
            <FeaturedVideo video={featuredVideo} onPlay={openVideo} />
          </SectionWrapper>
        )}

        {/* Series Section */}
        {!selectedSeries && !showAllVideos && (
          <SectionWrapper>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl md:text-2xl font-bold text-[#4A148C]">Sermon Series</h2>
              <button
                onClick={() => setShowAllVideos(true)}
                className="text-sm text-[#4A148C] hover:text-[#1A0033] font-medium flex items-center gap-1 transition-colors"
              >
                View All Videos
                <ArrowRight className="size-4" />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {mockSeries.map((series, i) => (
                <SeriesCard
                  key={series.id}
                  series={series}
                  index={i}
                  onClick={setSelectedSeries}
                  isActive={false}
                />
              ))}
            </div>
          </SectionWrapper>
        )}

        {/* Inside a Series */}
        {selectedSeries && (
          <div className="mb-8">
            <button
              onClick={() => setSelectedSeries(null)}
              className="text-sm text-[#4A148C] hover:text-[#1A0033] font-medium flex items-center gap-1.5 transition-colors mb-2"
            >
              <ArrowLeft className="size-4 rotate-180" />
              Back to Series
            </button>
            <h2 className="text-2xl md:text-3xl font-bold text-[#4A148C]">{selectedSeries.name}</h2>
            <p className="text-sm text-gray-500 mt-1">{selectedSeries.description}</p>
            <p className="text-xs text-gray-400 mt-1">{selectedSeries.videoCount} videos</p>
          </div>
        )}

        {/* All Videos View */}
        {showAllVideos && (
          <div className="mb-8">
            <button
              onClick={() => setShowAllVideos(false)}
              className="text-sm text-[#4A148C] hover:text-[#1A0033] font-medium flex items-center gap-1.5 transition-colors mb-2"
            >
              <ArrowLeft className="size-4 rotate-180" />
              Back to Featured
            </button>
          </div>
        )}

        {/* Controls Bar */}
        <SectionWrapper>
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between mb-6">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
              <Input
                placeholder="Search videos..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 rounded-xl border-gray-200 bg-white h-10 focus:border-[#4A148C]/30"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {videoCategories.map((cat) => (
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
        </SectionWrapper>

        {/* Results count */}
        <p className="text-sm text-gray-500 mb-6">
          <span className="font-semibold text-[#4A148C]">{filteredVideos.length}</span> video{filteredVideos.length !== 1 ? "s" : ""}
          {selectedSeries && (
            <span> in <span className="font-medium text-gray-700">{selectedSeries.name}</span></span>
          )}
        </p>

        {/* Video Grid */}
        {filteredVideos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredVideos.map((video, i) => (
              <VideoCard
                key={video.id}
                video={video}
                index={i}
                series={selectedSeries || mockSeries.find((s) => s.id === video.seriesId)}
                onPlay={openVideo}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <Film className="size-8 text-gray-300" />
            </div>
            <h3 className="text-lg font-semibold text-gray-700">No videos found</h3>
            <p className="text-sm text-gray-500 mt-1">Try adjusting your search or filter.</p>
          </div>
        )}
      </div>

      {/* Video Player Modal */}
      <AnimatePresence>
        {playingVideo && (
          <VideoPlayerModal
            videos={playlistVideos}
            initialVideo={playingVideo}
            onClose={() => setPlayingVideo(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}