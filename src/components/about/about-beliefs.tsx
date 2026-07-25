"use client";

import { motion } from "framer-motion";
import { SectionWrapper, SectionTitle } from "@/components/home/section-wrapper";
import { CheckCircle } from "lucide-react";

const beliefs = [
  {
    title: "The Holy Bible",
    content:
      "We believe the Bible is the inspired, infallible, and authoritative Word of God. It is without error in all it affirms and is the supreme and final authority in all matters of faith and conduct. We study, meditate on, and live by its teachings daily.",
  },
  {
    title: "The Trinity",
    content:
      "We believe in one God, eternally existing in three Persons — God the Father, God the Son (Jesus Christ), and God the Holy Spirit. These three are co-equal and co-eternal, one in nature, power, and glory, yet distinct in their persons and functions.",
  },
  {
    title: "The Deity of Jesus Christ",
    content:
      "We believe in the deity of the Lord Jesus Christ — His virgin birth, His sinless life, His miraculous works, His atoning death on the cross, His bodily resurrection, His ascension to the right hand of the Father, and His personal return in power and glory.",
  },
  {
    title: "Salvation by Grace",
    content:
      "We believe that salvation is a gift of God received by faith alone in the Lord Jesus Christ. Man is saved by grace through faith, not by works of righteousness which we have done, but according to His mercy. All who repent and believe in Christ are born again by the Holy Spirit.",
  },
  {
    title: "The Holy Spirit",
    content:
      "We believe in the present ministry of the Holy Spirit, by whose indwelling the Christian is enabled to live a godly life. We believe in the baptism of the Holy Spirit, the gifts of the Spirit, and the fruit of the Spirit as outlined in the Scriptures for the edification of the Church and the glory of God.",
  },
  {
    title: "The Church",
    content:
      "We believe the Church is the body of Christ, composed of all born-again believers regardless of denomination. The local church is God&apos;s instrument for evangelism, discipleship, worship, fellowship, and service. We are called to gather regularly and to spur one another on toward love and good deeds.",
  },
  {
    title: "Water Baptism",
    content:
      "We believe in water baptism by immersion in the name of the Father, the Son, and the Holy Spirit, in obedience to the commandment of our Lord Jesus Christ. It is an outward symbol of the inward transformation that has taken place in the life of a believer.",
  },
  {
    title: "The Second Coming",
    content:
      "We believe in the personal, visible, and glorious return of the Lord Jesus Christ. This blessed hope motivates us to live holy lives, to be watchful, and to occupy diligently until He comes. We also believe in the resurrection of both the saved and the lost — the saved to eternal life and the lost to eternal condemnation.",
  },
];

export function AboutBeliefs() {
  return (
    <SectionWrapper className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          title="What We Believe"
          subtitle="Our statement of faith is rooted in the eternal Word of God and aligned with the foundational beliefs of The Redeemed Christian Church of God worldwide."
        />

        <div className="grid md:grid-cols-2 gap-6 mt-12">
          {beliefs.map((belief, index) => (
            <motion.div
              key={belief.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              className="group p-6 md:p-7 rounded-2xl border border-gray-100 hover:border-[#1A237E]/15 hover:shadow-lg hover:shadow-[#1A237E]/5 transition-all duration-300 bg-white"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#F0F4FF] flex items-center justify-center shrink-0 group-hover:bg-[#1A237E] transition-colors duration-300">
                  <CheckCircle className="size-5 text-[#1A237E] group-hover:text-white transition-colors duration-300" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#1A237E] mb-2">{belief.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{belief.content}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}