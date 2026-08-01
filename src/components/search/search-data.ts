export interface SearchResult {
  id: string;
  type:
    | "sermon"
    | "event"
    | "announcement"
    | "devotional"
    | "testimony"
    | "page"
    | "leader"
    | "ministry"
    | "gallery";
  title: string;
  description: string;
  url: string;
  date: string;
  tags: string[];
  meta: Record<string, string>;
}

export type SearchCategory =
  | "all"
  | "sermons"
  | "events"
  | "announcements"
  | "devotionals"
  | "testimonies"
  | "pages"
  | "people"
  | "ministries"
  | "media";

export interface TypeConfig {
  icon: string;
  label: string;
  color: string;
  bgColor: string;
  borderColor: string;
  textColor: string;
  hrefPrefix: string;
}

export const typeConfig: Record<string, TypeConfig> = {
  sermon: {
    icon: "BookOpen",
    label: "Sermon",
    color: "bg-purple-100 text-purple-800 border-purple-200",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
    textColor: "text-purple-800",
    hrefPrefix: "/sermons",
  },
  event: {
    icon: "Calendar",
    label: "Event",
    color: "bg-green-100 text-green-800 border-green-200",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
    textColor: "text-green-800",
    hrefPrefix: "/events",
  },
  announcement: {
    icon: "Megaphone",
    label: "Announcement",
    color: "bg-amber-100 text-amber-800 border-amber-200",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
    textColor: "text-amber-800",
    hrefPrefix: "/announcements",
  },
  devotional: {
    icon: "Heart",
    label: "Devotional",
    color: "bg-rose-100 text-rose-800 border-rose-200",
    bgColor: "bg-rose-50",
    borderColor: "border-rose-200",
    textColor: "text-rose-800",
    hrefPrefix: "/devotionals",
  },
  testimony: {
    icon: "Star",
    label: "Testimony",
    color: "bg-purple-100 text-purple-800 border-purple-200",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
    textColor: "text-purple-800",
    hrefPrefix: "/testimonies",
  },
  page: {
    icon: "FileText",
    label: "Page",
    color: "bg-slate-100 text-slate-800 border-slate-200",
    bgColor: "bg-slate-50",
    borderColor: "border-slate-200",
    textColor: "text-slate-800",
    hrefPrefix: "",
  },
  leader: {
    icon: "Users",
    label: "Leader",
    color: "bg-purple-100 text-purple-800 border-purple-200",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
    textColor: "text-purple-800",
    hrefPrefix: "/leadership",
  },
  ministry: {
    icon: "HandsPraying",
    label: "Ministry",
    color: "bg-teal-100 text-teal-800 border-teal-200",
    bgColor: "bg-teal-50",
    borderColor: "border-teal-200",
    textColor: "text-teal-800",
    hrefPrefix: "/join-ministry",
  },
  gallery: {
    icon: "Image",
    label: "Media",
    color: "bg-red-100 text-red-800 border-red-200",
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
    textColor: "text-red-800",
    hrefPrefix: "/gallery",
  },
};

export const categoryMap: Record<
  SearchCategory,
  SearchResult["type"][] | null
> = {
  all: null,
  sermons: ["sermon"],
  events: ["event"],
  announcements: ["announcement"],
  devotionals: ["devotional"],
  testimonies: ["testimony"],
  pages: ["page"],
  people: ["leader"],
  ministries: ["ministry"],
  media: ["gallery"],
};

const mockSearchResults: SearchResult[] = [
  // Sermons
  {
    id: "ser1",
    type: "sermon",
    title: "Walking in Divine Health",
    description:
      "God desires that you walk in divine health. This powerful sermon explores the biblical foundation for healing and wholeness, drawing from Isaiah 53:5 and 3 John 1:2. Learn how to appropriate the healing that Christ purchased on the cross.",
    url: "/sermons#ser1",
    date: "2025-07-13",
    tags: ["healing", "health", "faith", "divine health"],
    meta: { speaker: "Pastor Adebayo", category: "Sunday Service" },
  },
  {
    id: "ser2",
    type: "sermon",
    title: "The Power of Thanksgiving",
    description:
      "Thanksgiving is a spiritual weapon that opens doors and multiplies blessings. In this message, discover how cultivating a lifestyle of gratitude transforms your prayer life and invites God's supernatural intervention in every circumstance.",
    url: "/sermons#ser2",
    date: "2025-07-06",
    tags: ["thanksgiving", "gratitude", "praise", "blessing"],
    meta: { speaker: "Pastor Adebayo", category: "Sunday Service" },
  },
  {
    id: "ser3",
    type: "sermon",
    title: "Understanding Grace",
    description:
      "A foundational teaching on what grace truly is, how it differs from mercy and the law, and why it is the bedrock of the Christian faith. Grace is not a licence to sin but the power to live righteously.",
    url: "/sermons#ser12",
    date: "2025-05-25",
    tags: ["grace", "salvation", "foundation", "faith"],
    meta: { speaker: "Pastor Adebayo", category: "Sunday Service" },
  },
  {
    id: "ser4",
    type: "sermon",
    title: "Praying with Authority",
    description:
      "You have been given authority in the name of Jesus. This sermon empowers believers to pray with boldness, shifting from passive prayers to commanding, faith-filled declarations that enforce the will of God on earth.",
    url: "/sermons#ser8",
    date: "2025-06-25",
    tags: ["prayer", "authority", "faith", "declaration"],
    meta: { speaker: "Pastor Adebayo", category: "Faith Clinic" },
  },
  {
    id: "ser5",
    type: "sermon",
    title: "The Secret Place of Prayer",
    description:
      "The most powerful prayers are birthed in the secret place. Jesus modelled this lifestyle, rising early to pray in solitary places. Learn how to cultivate and maximise your personal prayer closet.",
    url: "/sermons#ser7",
    date: "2025-07-02",
    tags: ["prayer", "intimacy", "secret place", "devotion"],
    meta: { speaker: "Pastor Adebayo", category: "Bible Study" },
  },

  // Events
  {
    id: "evt1",
    type: "event",
    title: "Special Thanksgiving Service",
    description:
      "Join us for a special service of thanksgiving as we appreciate God for His faithfulness over the first half of the year. There will be special ministrations, testimonies, and thanksgiving offerings.",
    url: "/events#evt1",
    date: "2025-07-20",
    tags: ["thanksgiving", "service", "celebration", "praise"],
    meta: { location: "Main Sanctuary", time: "9:00 AM" },
  },
  {
    id: "evt2",
    type: "event",
    title: "Youth Conference 2025",
    description:
      "An annual conference designed to ignite, equip, and empower young people for kingdom impact. Features guest speakers, worship sessions, breakout workshops, and networking opportunities.",
    url: "/events#evt2",
    date: "2025-08-15",
    tags: ["youth", "conference", "empowerment", "young adults"],
    meta: { location: "Church Auditorium", time: "10:00 AM" },
  },
  {
    id: "evt3",
    type: "event",
    title: "MFM Holy Ghost Congress",
    description:
      "The annual Holy Ghost Congress of Mountain of Fire and Miracles Ministries. A gathering of millions of believers worldwide for supernatural encounters, miracles, and divine empowerment.",
    url: "/events#evt3",
    date: "2025-12-08",
    tags: ["congress", "holy ghost", "miracles", "MFM"],
    meta: { location: "Redemption Camp", time: "6:00 PM" },
  },
  {
    id: "evt4",
    type: "event",
    title: "Marriage Enrichment Seminar",
    description:
      "A practical seminar for couples looking to strengthen their marriages. Topics include communication, financial stewardship, intimacy, and raising godly children together.",
    url: "/events#evt4",
    date: "2025-08-23",
    tags: ["marriage", "family", "seminar", "couples"],
    meta: { location: "Fellowship Hall", time: "4:00 PM" },
  },
  {
    id: "evt5",
    type: "event",
    title: "Carols Night 2025",
    description:
      "Our annual Christmas carol service featuring the choir, special musical performances, drama, and the celebration of the birth of Jesus Christ. Bring the whole family!",
    url: "/events#evt5",
    date: "2025-12-20",
    tags: ["christmas", "carols", "celebration", "music"],
    meta: { location: "Main Sanctuary", time: "6:00 PM" },
  },

  // Announcements
  {
    id: "ann1",
    type: "announcement",
    title: "New Member Classes Begin",
    description:
      "Welcome to MFM Youth Church! New member orientation classes begin this Sunday. Learn about our church history, beliefs, departments, and how to get plugged into the life of the church.",
    url: "/announcements#ann1",
    date: "2025-07-14",
    tags: ["new members", "orientation", "welcome", "classes"],
    meta: { category: "Membership" },
  },
  {
    id: "ann2",
    type: "announcement",
    title: "Church Bus Schedule Update",
    description:
      "The church bus route has been updated with new pickup points. Please check the notice board or visit the church office for the latest schedule and routes available for Sunday services.",
    url: "/announcements#ann2",
    date: "2025-07-10",
    tags: ["transport", "bus", "schedule", "logistics"],
    meta: { category: "General" },
  },
  {
    id: "ann3",
    type: "announcement",
    title: "21 Days of Fasting and Prayer",
    description:
      "The parish embarks on 21 days of fasting and prayer starting next Monday. Prayer points and guidelines will be shared daily. Join us as we seek God's face for the second half of the year.",
    url: "/announcements#ann3",
    date: "2025-07-05",
    tags: ["fasting", "prayer", "spiritual", "consecration"],
    meta: { category: "Spiritual" },
  },
  {
    id: "ann4",
    type: "announcement",
    title: "Children's Church Volunteers Needed",
    description:
    "We are looking for dedicated members to serve in the Children's Church ministry. If you have a passion for teaching children about God's Word, please sign up at the church office.",
    url: "/announcements#ann4",
    date: "2025-07-08",
    tags: ["volunteers", "children", "ministry", "service"],
    meta: { category: "Ministry" },
  },
  {
    id: "ann5",
    type: "announcement",
    title: "Building Fund Contribution",
    description:
    "As part of our church building project, members are encouraged to contribute towards the new auditorium. Special envelopes are available at the ushers' desk. God bless you as you give.",
    url: "/announcements#ann5",
    date: "2025-07-01",
    tags: ["building", "offering", "contribution", "project"],
    meta: { category: "Finance" },
  },

  // Devotionals
  {
    id: "dev1",
    type: "devotional",
    title: "The Grace That Sustains",
    description:
      "When the storms of life rage, it is God's grace that keeps us standing. Today's devotional explores how to rely on God's sustaining grace in difficult seasons, drawing strength from 2 Corinthians 12:9.",
    url: "/devotionals#dev1",
    date: "2025-07-13",
    tags: ["grace", "strength", "encouragement", "sustenance"],
    meta: { scripture: "2 Corinthians 12:9", author: "Pastor Adebayo" },
  },
  {
    id: "dev2",
    type: "devotional",
    title: "Finding Peace in Storms",
    description:
      "Peace is not the absence of trouble but the presence of God in the midst of it. This devotional walks through Philippians 4:6-7 and teaches how to experience God's peace that surpasses all understanding.",
    url: "/devotionals#dev2",
    date: "2025-07-12",
    tags: ["peace", "storms", "anxiety", "trust"],
    meta: { scripture: "Philippians 4:6-7", author: "Minister Chukwu" },
  },
  {
    id: "dev3",
    type: "devotional",
    title: "The Power of Forgiveness",
    description:
      "Unforgiveness is a prison that locks both the offender and the offended. Learn how to release those who have hurt you and walk in the freedom that forgiveness brings, just as Christ forgave you.",
    url: "/devotionals#dev3",
    date: "2025-07-11",
    tags: ["forgiveness", "freedom", "healing", "relationships"],
    meta: { scripture: "Ephesians 4:32", author: "Minister Chukwu" },
  },
  {
    id: "dev4",
    type: "devotional",
    title: "Walking by Faith, Not by Sight",
    description:
      "Faith is the evidence of things not seen. This devotional encourages believers to trust God even when circumstances don't make sense, knowing that He who promised is faithful.",
    url: "/devotionals#dev4",
    date: "2025-07-10",
    tags: ["faith", "trust", "obedience", "believing"],
    meta: { scripture: "2 Corinthians 5:7", author: "Pastor Adebayo" },
  },
  {
    id: "dev5",
    type: "devotional",
    title: "The Blessing of Obedience",
    description:
      "Obedience is the key to unlocking God's blessings in your life. When we align our actions with God's Word, we position ourselves for divine favour and supernatural increase.",
    url: "/devotionals#dev5",
    date: "2025-07-09",
    tags: ["obedience", "blessing", "obedience", "prosperity"],
    meta: { scripture: "Deuteronomy 28:1-2", author: "Minister Chukwu" },
  },

  // Testimonies
  {
    id: "test1",
    type: "testimony",
    title: "Healed of Chronic Headache",
    description:
      "For over five years, I suffered from chronic migraines that medication could not resolve. During the prayer meeting, the pastor laid hands on me, and from that moment, I have been completely free. Glory to God!",
    url: "/testimonies#test1",
    date: "2025-07-06",
    tags: ["healing", "migraine", "miracle", "prayer"],
    meta: { name: "Sister Faith O." },
  },
  {
    id: "test2",
    type: "testimony",
    title: "Got My Dream Job After Months of Waiting",
    description:
      "After 14 months of unemployment and countless interviews, I got a call for my dream role at a multinational company. God's timing is indeed perfect. I kept trusting Him through the wait.",
    url: "/testimonies#test2",
    date: "2025-06-29",
    tags: ["job", "employment", "breakthrough", "testimony"],
    meta: { name: "Brother Emmanuel A." },
  },
  {
    id: "test3",
    type: "testimony",
    title: "Supernatural Provision During Hardship",
    description:
      "When my husband lost his job and bills were piling up, God provided in miraculous ways. From anonymous gifts to unexpected opportunities, we never lacked. God is truly our Provider.",
    url: "/testimonies#test3",
    date: "2025-06-22",
    tags: ["provision", "finance", "miracle", "God's faithfulness"],
    meta: { name: "Sister Grace M." },
  },
  {
    id: "test4",
    type: "testimony",
    title: "Safe Delivery After Complicated Pregnancy",
    description:
      "Doctors had said the pregnancy was high-risk, but we trusted God. After prayers from the church family, I delivered a healthy baby boy safely. God is faithful!",
    url: "/testimonies#test4",
    date: "2025-06-15",
    tags: ["childbirth", "safe delivery", "healing", "family"],
    meta: { name: "Sister Blessing T." },
  },

  // Pages
  {
    id: "page1",
    type: "page",
    title: "About Us",
    description:
      "Learn about MFM Youth Church, our history, mission, vision, and core values. Discover who we are and what drives our passion for kingdom advancement and community impact.",
    url: "/about",
    date: "2025-01-01",
    tags: ["about", "history", "mission", "vision"],
    meta: { category: "Church Info" },
  },
  {
    id: "page2",
    type: "page",
    title: "Leadership",
    description:
      "Meet the dedicated leaders and pastors who serve at MFM Youth Church. Our leadership team is committed to shepherding the flock with integrity, love, and the Word of God.",
    url: "/leadership",
    date: "2025-01-01",
    tags: ["leadership", "pastors", "elders", "team"],
    meta: { category: "Church Info" },
  },
  {
    id: "page3",
    type: "page",
    title: "Departments & Units",
    description:
      "Explore the various departments and units in the church. From Ushering to Choir, Technical to Evangelism, find a place to serve and use your God-given talents for kingdom purposes.",
    url: "/departments",
    date: "2025-01-01",
    tags: ["departments", "units", "service", "volunteers"],
    meta: { category: "Church Info" },
  },
  {
    id: "page4",
    type: "page",
    title: "Prayer Requests",
    description:
      "Submit your prayer requests and let us stand in agreement with you. Our prayer team is committed to lifting your needs before the Lord in faith. All requests are treated with confidentiality.",
    url: "/prayer",
    date: "2025-01-01",
    tags: ["prayer", "request", "intercession", "support"],
    meta: { category: "Ministry" },
  },

  // People (Leaders)
  {
    id: "lead1",
    type: "leader",
    title: "Pastor Adebayo",
    description:
      "Senior Pastor of MFM Youth Church, Utako, Abuja. A dedicated servant of God with over 20 years of ministry experience, passionate about teaching the Word and raising leaders.",
    url: "/leadership#lead1",
    date: "2025-01-01",
    tags: ["pastor", "senior pastor", "leader", "teacher"],
    meta: { role: "Senior Pastor", experience: "20+ years" },
  },
  {
    id: "lead2",
    type: "leader",
    title: "Minister Chukwu",
    description:
      "Associate Minister at MFM Youth Church. A gifted teacher of the Word with a passion for discipleship and youth mentorship. Leads the Bible Study ministry.",
    url: "/leadership#lead2",
    date: "2025-01-01",
    tags: ["minister", "teacher", "discipleship", "youth"],
    meta: { role: "Associate Minister" },
  },
  {
    id: "lead3",
    type: "leader",
    title: "Deaconess Adeyemi",
    description:
      "Head of the Women's Fellowship ministry. A mother in Israel who has nurtured and mentored countless women in the church. Her wisdom and compassion have touched many lives.",
    url: "/leadership#lead3",
    date: "2025-01-01",
    tags: ["deaconess", "women", "fellowship", "mentorship"],
    meta: { role: "Head of Women's Fellowship" },
  },

  // Ministries
  {
    id: "min1",
    type: "ministry",
    title: "Choir Ministry",
    description:
      "The choir leads the congregation in heartfelt worship during all services. Comprising talented vocalists and instrumentalists dedicated to creating an atmosphere for God's presence.",
    url: "/join-ministry#min1",
    date: "2025-01-01",
    tags: ["choir", "music", "worship", "singing"],
    meta: { meetingDay: "Saturdays, 4:00 PM", members: "30+" },
  },
  {
    id: "min2",
    type: "ministry",
    title: "Ushering Department",
    description:
      "The ushers ensure order, warmth, and comfort during all church services. They are the first point of contact for visitors and play a vital role in creating a welcoming atmosphere.",
    url: "/join-ministry#min2",
    date: "2025-01-01",
    tags: ["ushering", "welcome", "order", "service"],
    meta: { meetingDay: "Saturdays, 3:00 PM", members: "20+" },
  },
  {
    id: "min3",
    type: "ministry",
    title: "Youth Ministry",
    description:
      "Empowering young people to live for God and fulfil their destiny. The youth ministry organises Bible studies, fellowship meetings, outreach programmes, and exciting social events.",
    url: "/join-ministry#min3",
    date: "2025-01-01",
    tags: ["youth", "young adults", "fellowship", "empowerment"],
    meta: { meetingDay: "Thursdays, 5:30 PM", members: "50+" },
  },
  {
    id: "min4",
    type: "ministry",
    title: "Evangelism Department",
    description:
      "Committed to fulfilling the Great Commission by reaching the unsaved with the Gospel. Organises community outreaches, street evangelism, hospital visits, and discipleship programmes.",
    url: "/join-ministry#min4",
    date: "2025-01-01",
    tags: ["evangelism", "outreach", "Gospel", "soul winning"],
    meta: { meetingDay: "Saturdays, 10:00 AM", members: "25+" },
  },

  // Media / Gallery
  {
    id: "gal1",
    type: "gallery",
    title: "Sunday Service - January 2025",
    description:
      "Photo highlights from our Sunday services in January 2025. Capturing moments of worship, prayer, the Word, and fellowship as the congregation gathered to honour God.",
    url: "/gallery#gal1",
    date: "2025-01-31",
    tags: ["sunday", "service", "photos", "worship"],
    meta: { format: "Photos", count: "48 images" },
  },
  {
    id: "gal2",
    type: "gallery",
    title: "Carols Night Highlights 2024",
    description:
      "Relive the magical moments from our 2024 Carols Night. Featuring performances by the choir, drama presentations, and the lighting of the Christmas tree.",
    url: "/gallery#gal2",
    date: "2024-12-25",
    tags: ["carols", "christmas", "music", "celebration"],
    meta: { format: "Photos & Video", count: "62 images" },
  },
  {
    id: "gal3",
    type: "gallery",
    title: "Watch Live Service Stream",
    description:
      "Join our Sunday services live from anywhere in the world. Stream our worship, prayers, and sermons in real-time. Available every Sunday from 8:30 AM (WAT).",
    url: "/live",
    date: "2025-07-13",
    tags: ["live", "stream", "worship", "online"],
    meta: { format: "Live Stream", schedule: "Sundays, 8:30 AM" },
  },
  {
    id: "gal4",
    type: "gallery",
    title: "Youth Conference 2024 Highlights",
    description:
      "Video highlights and photos from the 2024 Youth Conference. An unforgettable time of worship, teaching, and fellowship for young people across the FCT.",
    url: "/gallery#gal4",
    date: "2024-08-20",
    tags: ["youth", "conference", "highlights", "video"],
    meta: { format: "Video & Photos", count: "35 images" },
  },
];

export function searchAll(
  query: string,
  category?: SearchCategory
): SearchResult[] {
  const normalizedQuery = query.toLowerCase().trim();

  if (!normalizedQuery) return [];

  let results = mockSearchResults.filter((item) => {
    const titleMatch = item.title.toLowerCase().includes(normalizedQuery);
    const descMatch = item.description.toLowerCase().includes(normalizedQuery);
    const tagsMatch = item.tags.some((tag) =>
      tag.toLowerCase().includes(normalizedQuery)
    );
    const metaMatch = Object.values(item.meta).some((val) =>
      val.toLowerCase().includes(normalizedQuery)
    );
    return titleMatch || descMatch || tagsMatch || metaMatch;
  });

  if (category && category !== "all") {
    const allowedTypes = categoryMap[category];
    if (allowedTypes) {
      results = results.filter((item) => allowedTypes.includes(item.type));
    }
  }

  return results;
}

export function getPopularSearches(): string[] {
  return [
    "sermon",
    "prayer",
    "healing",
    "youth",
    "testimony",
    "grace",
    "thanksgiving",
    "marriage",
    "devotional",
    "worship",
  ];
}

export function getSuggestedResults(): SearchResult[] {
  return [
    mockSearchResults.find((r) => r.id === "ser1")!,
    mockSearchResults.find((r) => r.id === "evt1")!,
    mockSearchResults.find((r) => r.id === "dev1")!,
    mockSearchResults.find((r) => r.id === "test1")!,
  ];
}
