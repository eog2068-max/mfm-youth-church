import {
  Heart,
  DollarSign,
  Users,
  Briefcase,
  Flame,
  Sparkles,
  Compass,
  ShieldCheck,
  GraduationCap,
  Star,
} from "lucide-react";
import { type LucideIcon } from "lucide-react";

export type TestimonyCategory =
  | "healing"
  | "provision"
  | "family"
  | "career"
  | "salvation"
  | "miracle"
  | "guidance"
  | "protection"
  | "academic"
  | "other";

export interface Testimony {
  id: string;
  name: string;
  isAnonymous: boolean;
  title: string;
  body: string;
  category: TestimonyCategory;
  date: string;
  likes: number;
  avatarInitials: string;
  tags: string[];
}

export const categoryIcons: Record<TestimonyCategory, LucideIcon> = {
  healing: Heart,
  provision: DollarSign,
  family: Users,
  career: Briefcase,
  salvation: Flame,
  miracle: Sparkles,
  guidance: Compass,
  protection: ShieldCheck,
  academic: GraduationCap,
  other: Star,
};

export const categoryColors: Record<
  TestimonyCategory,
  { bg: string; text: string; border: string }
> = {
  healing: { bg: "bg-red-50", text: "text-red-700", border: "border-red-100" },
  provision: {
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-100",
  },
  family: {
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-100",
  },
  career: { bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-100" },
  salvation: {
    bg: "bg-red-50",
    text: "text-red-700",
    border: "border-red-100",
  },
  miracle: {
    bg: "bg-purple-50",
    text: "text-purple-700",
    border: "border-purple-100",
  },
  guidance: {
    bg: "bg-cyan-50",
    text: "text-cyan-700",
    border: "border-cyan-100",
  },
  protection: {
    bg: "bg-teal-50",
    text: "text-teal-700",
    border: "border-teal-100",
  },
  academic: {
    bg: "bg-purple-50",
    text: "text-purple-700",
    border: "border-purple-100",
  },
  other: { bg: "bg-gray-50", text: "text-gray-700", border: "border-gray-100" },
};

export const categoryLabels: Record<TestimonyCategory, string> = {
  healing: "Healing",
  provision: "Provision",
  family: "Family",
  career: "Career",
  salvation: "Salvation",
  miracle: "Miracle",
  guidance: "Guidance",
  protection: "Protection",
  academic: "Academic",
  other: "Other",
};

export const testimonies: Testimony[] = [
  {
    id: "t1",
    name: "Sister Chidinma Okafor",
    isAnonymous: false,
    title: "Healed of Fibroid Without Surgery",
    body: "I want to return all glory to God for what He has done in my life. In January 2024, I was diagnosed with a large fibroid after months of heavy bleeding and severe abdominal pain. The doctor at National Hospital, Abuja, recommended an immediate surgery and gave me a date for myomectomy. I was terrified. I am a single mother with no one to look after my two children if anything went wrong. That Sunday, I came to Youth Assembly and the pastor laid hands on me during the prayer line. From that moment, I believed God for my healing. I continued to attend the Friday prayer meetings, fasting and praying with the brethren. To the glory of God, when I went back for a scan three months later, the doctor was shocked. The fibroid had shrunk significantly. By the sixth month, it was completely gone. No surgery, no medication. The doctor called it a medical miracle. I am now completely free and my cycle has returned to normal. God of Youth is indeed a God of possibilities. I am so grateful to the prayer team and our pastor for standing with me in faith. If God did it for me, He will do it for you.",
    category: "healing",
    date: "2025-06-15",
    likes: 47,
    avatarInitials: "CO",
    tags: ["healing", "fibroid", "miracle", "prayer line"],
  },
  {
    id: "t2",
    name: "Brother Emeka Nwankwo",
    isAnonymous: false,
    title: "Got My Dream Job After Three Years of Unemployment",
    body: "I stand here to testify to the goodness of God. After graduating from University of Lagos in 2021 with a degree in Accounting, I spent three agonising years at home, applying for jobs without success. I attended over thirty interviews and each time, I was told the position had been filled. My parents were struggling, my younger siblings needed school fees, and the shame was unbearable. People in the neighbourhood started calling me a lazy boy. During one of our mid-week services, Pastor preached about Job and how God restored his fortunes double-fold. Something stirred in my spirit that day. I joined the workers in the church and started serving faithfully in the ushering department. In March this year, a member of our church who works at the Central Bank told me about an opening. I applied and went through the rigorous recruitment process. To cut the long story short, I received my appointment letter in May. Not only did I get a job, but I was posted to a choice department with an excellent salary package. God has also blessed me with a car through the same job. I want to encourage anyone going through a period of waiting. God has not forgotten you. Your season of laughter is coming. Keep serving God faithfully.",
    category: "career",
    date: "2025-06-20",
    likes: 62,
    avatarInitials: "EN",
    tags: ["career", "job", "provision", "breakthrough"],
  },
  {
    id: "t3",
    name: "Sister Amina Ibrahim",
    isAnonymous: false,
    title: "Safe Delivery After Doctors Gave Up Hope",
    body: "I am here to testify that God is alive and He still performs miracles. I got married in 2019 and had two miscarriages before getting pregnant again in 2024. At five months, the doctors discovered I had placenta previa, a condition where the placenta covers the cervix. I was placed on strict bed rest and told there was a high chance I would lose the baby or my own life. The fear was indescribable. I was admitted at Garki Hospital for two months. The church prayer team visited me every week and we prayed fervently. Our pastor called me regularly and encouraged me with scriptures. At thirty-seven weeks, I started bleeding heavily. It was an emergency. The doctors prepared my husband for the worst-case scenario. But I held on to Psalm 91 and kept declaring that no evil shall befall me. To the glory of God, the surgery went well and I delivered a beautiful baby boy, weighing 3.5 kilogrammes. Both of us are perfectly healthy. The surgeon said it was miraculous that we came out without complications. My son is now four months old and he is a living testimony of God's faithfulness. I dedicate this testimony to every woman trusting God for the fruit of the womb. God will surely visit you.",
    category: "miracle",
    date: "2025-07-02",
    likes: 89,
    avatarInitials: "AI",
    tags: ["safe delivery", "miracle", "baby", "healing"],
  },
  {
    id: "t4",
    name: "Anonymous",
    isAnonymous: true,
    title: "US Visa Approved After Four Previous Denials",
    body: "I want to glorify the name of the Lord for favour and open doors. I had been applying for a US visa since 2020 and was denied four consecutive times. Each denial broke my spirit further. I had an admission to pursue my Master's degree at a university in Texas, but without the visa, the admission was useless. The fifth time I applied, I was discouraged. People told me to give up and look for a school in Nigeria instead. But I knew God had spoken to me about going to the US. I brought it before the church during a special prayer programme in January. The prayer warriors laid hands on me and prayed with vehemence. I also fasted for seven days before my interview date in March. When I got to the embassy, there was peace in my heart that I cannot explain. The consular officer asked me only three questions and then said the words I had been longing to hear for years: your visa has been approved. I wept right there at the counter. I am now in Texas pursuing my programme on full scholarship that came through unexpectedly. God made a way where there seemed to be no way. I am forever grateful to God and to the Youth Assembly family for standing with me in prayer. Your testimony is next in Jesus' name.",
    category: "provision",
    date: "2025-06-28",
    likes: 73,
    avatarInitials: "AN",
    tags: ["visa", "open doors", "favour", "scholarship"],
  },
  {
    id: "t5",
    name: "Brother Tunde Adeyemi",
    isAnonymous: false,
    title: "My Provision Store Was Rescued From Collapse",
    body: "I want to appreciate God for His marvellous deeds in my business. I own a provision store in Utako Market and for the past two years, business had been terribly slow. Customers stopped coming, debts piled up, and my suppliers were threatening to stop supplying me goods. I owed over two million naira and was on the verge of losing my shop. I could barely feed my family and pay my children's school fees. I was depressed and considered closing down completely. During our church's convention in August, the guest minister prophesied that there was someone in the congregation whose business would experience a sudden turnaround. I claimed that word with all my heart. The very next week, a major catering company came looking for a regular supplier of food items and provisions. They signed a contract with me worth over five million naira per quarter. I used part of the payment to clear all my debts and even expanded my shop. Now, I have two additional staff and my business is thriving. My wife and children are happy again. I tithed faithfully even during the dry season, and I believe that was the key. God is indeed a rewarder of those who diligently seek Him. Do not give up on your business. God will turn it around.",
    category: "provision",
    date: "2025-07-10",
    likes: 55,
    avatarInitials: "TA",
    tags: ["business", "provision", "breakthrough", "debt cancellation"],
  },
  {
    id: "t6",
    name: "Sister Funke Balogun",
    isAnonymous: false,
    title: "My Husband Returned Home After Two Years of Separation",
    body: "I am full of gratitude to God for restoring my marriage. My husband and I separated in 2023 after a serious misunderstanding that led him to move out of our home. He stopped communicating with me and the children for months. I was devastated, broken, and confused. As a Christian, I knew divorce was not an option, but the pain was almost unbearable. I brought the matter to the prayer department at Youth Assembly and the prayer warriors took it up. Every Friday, they prayed with me and fasted on my behalf. I also continued to pray at home, standing on Malachi 2:16 that God hates divorce. I never spoke ill of my husband to anyone, even when people mocked me. In February this year, out of the blue, my husband called me. He was weeping on the phone, asking for forgiveness. He said God had been dealing with him and he could no longer live in disobedience. That Sunday, he came to church with me and we renewed our vows before the congregation. God has completely restored our home. There is now more love, peace, and joy than we ever had before. My husband has even rededicated his life to Christ. To anyone trusting God for family restoration, please hold on. God is a restorer of homes.",
    category: "family",
    date: "2025-07-05",
    likes: 94,
    avatarInitials: "FB",
    tags: ["marriage restoration", "family", "prayer", "reconciliation"],
  },
  {
    id: "t7",
    name: "Brother David Okonkwo",
    isAnonymous: false,
    title: "Graduated With First Class After Repeating a Year",
    body: "I stand here to encourage every student who feels like giving up. In my second year at the University of Nigeria, Nsukka, I had a terrible academic session. I failed four courses and was asked to repeat the year. The shame was overwhelming. My friends who were ahead of me mocked me, and my parents were deeply disappointed. I almost dropped out of school. But something kept me going, and that was the prayers of the saints. I confided in my cell group leader at Youth Assembly, and he mobilised the group to pray with me. I also attended the Back to School Prayer programme organised by the church. When I resumed my repeated year, I noticed a dramatic change. I could understand things I could not before. Concepts that seemed difficult became clear. I graduated not just with a good degree but with First Class Honours in Electrical Engineering. I was the best graduating student in my department and received three awards. I have also secured a fully funded PhD position at a university in Germany. God turned my shame into fame. I want every student reading this to know that your current situation is not your final destination. Trust God, study hard, and never give up. The same God who did it for me will do it for you.",
    category: "academic",
    date: "2025-06-10",
    likes: 81,
    avatarInitials: "DO",
    tags: ["academic", "first class", "university", "PhD"],
  },
  {
    id: "t8",
    name: "Sister Ngozi Anyanwu",
    isAnonymous: false,
    title: "Divine Protection During an Armed Robbery Attack",
    body: "I want to testify about the protective power of God. On the 14th of March this year, I was travelling from Abuja to Enugu by road. Around 8pm, somewhere along the Keffi-Abuja road, our bus was ambushed by armed robbers. They shot into the air, ordered everyone out, and made us lie face down on the tarred road. They collected our phones, bags, and valuables at gunpoint. One of the robbers even pointed a gun directly at my head and asked for my ATM card PIN. In that moment, I silently prayed and remembered Psalm 91:7, that a thousand shall fall at my side and ten thousand at my right hand, but it shall not come near me. The robber suddenly looked distracted, moved to the next person, and moments later, they fled when they heard the sound of a distant siren. Everyone on that bus survived without any physical injury. A pregnant woman on the bus who had been crying throughout later testified that she did not go into premature labour despite the trauma. I lost my phone and some money, but my life was preserved. I believe the prayers of my pastor and the church family covered me that night. God's protection is real and I am a living witness. Please, never underestimate the power of prayer for protection.",
    category: "protection",
    date: "2025-03-20",
    likes: 67,
    avatarInitials: "NA",
    tags: ["protection", "safety", "travel", "armed robbery"],
  },
  {
    id: "t9",
    name: "Brother Kayode Ogundimu",
    isAnonymous: false,
    title: "I Found My Wife Through Divine Guidance",
    body: "I want to bless the name of the Lord for leading me to my life partner. After several failed relationships and heartbreaks, I decided to take a break and focus on my spiritual life. I was thirty-four and my family was putting pressure on me to get married. I committed the matter to God during our forty-day fast at the beginning of the year. I told God I did not want to choose by myself anymore. I wanted Him to lead me. In March, I attended a church wedding of a friend in Lagos. There, I met a lady who was also a guest. We got talking and discovered we had so much in common, from our love for ministry to our vision for family. We became friends and later realised that God was orchestrating something beautiful. What amazed me most was that she had also been praying for her husband during the same forty-day fast, and she had written down specific qualities she wanted, which perfectly matched who I am. We got engaged in May and will be getting married in December. I want to encourage every single brother and sister waiting for a godly spouse. Do not rush. Commit your desire to God, serve Him faithfully, and He will give you the desires of your heart. God's timing is always perfect and His choice is always the best.",
    category: "guidance",
    date: "2025-07-12",
    likes: 58,
    avatarInitials: "KO",
    tags: ["marriage", "guidance", "divine connection", "partner"],
  },
  {
    id: "t10",
    name: "Sister Halima Bello",
    isAnonymous: false,
    title: "Survived a Terrible Car Accident Without a Scratch",
    body: "I am here to give glory to God for sparing my life. On the 5th of May, I was driving along the Nnamdi Azikiwe Expressway in Abuja when a trailer lost control and rammed into my car from behind. The impact was so severe that my car was pushed across two lanes and crashed into the road divider. The entire back of my car was completely mangled. Passersby who came to help were shocked to find me still conscious and without a single scratch on my body. Not even a bruise. The paramedics who arrived at the scene examined me and could not believe I had walked away from such a devastating crash unharmed. They took me to the hospital for observation, and after a full body scan and X-rays, the doctor confirmed there was absolutely nothing wrong with me. I was discharged the same day. My car was a write-off, but my life was preserved. I know it was not by my power or by my driving skill. It was the Lord who kept me. Just the week before, our pastor had prayed a special prayer of protection over the congregation and declared that no evil shall befall us. I believe that prayer covered me. I am alive today solely by the grace of God. Please join me in thanking God for His merciful protection over our lives and those of our loved ones.",
    category: "miracle",
    date: "2025-05-10",
    likes: 102,
    avatarInitials: "HB",
    tags: ["accident", "protection", "miracle", "safety"],
  },
  {
    id: "t11",
    name: "Anonymous",
    isAnonymous: true,
    title: "Gave My Life to Christ and Found True Peace",
    body: "I want to share my testimony of salvation because I know there is someone out there who needs to hear this. I grew up in a Muslim home and knew nothing about Jesus Christ. My life was filled with fear, anxiety, and a deep emptiness that nothing could fill. I tried money, parties, relationships, and even spiritualists, but nothing brought lasting peace. In January this year, a colleague invited me to Youth Assembly. I came reluctantly, just to please her. But from the moment I stepped into the church, I felt something I had never felt before. It was like a warm embrace. The worship was heavenly and the Word that day spoke directly to my heart. The pastor preached about the love of Jesus and how He came to give us abundant life. At the altar call, I could not hold back the tears. I gave my life to Christ that very day and the peace that flooded my heart was indescribable. It has been six months now and my life has completely transformed. My family initially rejected me, but they are now seeing the positive change in my life. My mother even asked me to pray for her last week. Jesus is real and He changes lives. If you are searching for meaning and peace, I invite you to give Jesus a chance. He will not disappoint you.",
    category: "salvation",
    date: "2025-07-15",
    likes: 118,
    avatarInitials: "AN",
    tags: ["salvation", "new birth", "peace", "transformation"],
  },
  {
    id: "t12",
    name: "Brother Olumide Fasanya",
    isAnonymous: false,
    title: "Secured Accommodation After Months of House Hunting",
    body: "I want to thank God for providing a home for my family. In February, my landlord gave me a six-month notice to vacate my apartment because he wanted to renovate and increase the rent. I had a wife and two young children and the thought of being homeless was terrifying. Abuja is very expensive and finding an affordable apartment is extremely difficult. I searched for months across Utako, Gwarimpa, Kubwa, and even as far as Mararaba. Every time I found something, either the agents demanded outrageous fees or the houses were in terrible condition. I was paying over three hundred thousand naira in agent fees alone without success. My savings were running out and the pressure was immense. I brought the matter before God during one of our Sunday services and the pastor prayed with me. Two weeks later, a member of the church who I had never spoken to before approached me after service. She said the Lord laid it on her heart to help me. She happened to be a property manager and she had a two-bedroom flat that was about to become available in Gwarimpa at a price well below market rate. She waived the agent fees entirely. We moved in April and it is a beautiful, spacious apartment in a secure estate. God used a stranger to bless my family. I am so overwhelmed by God's goodness. Truly, God will provide all your needs according to His riches in glory.",
    category: "provision",
    date: "2025-06-05",
    likes: 44,
    avatarInitials: "OF",
    tags: ["housing", "accommodation", "provision", "divine favour"],
  },
];

export function getTestimoniesByCategory(
  cat: TestimonyCategory
): Testimony[] {
  return testimonies.filter((t) => t.category === cat);
}

export function getRecentTestimonies(count: number): Testimony[] {
  return [...testimonies]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, count);
}