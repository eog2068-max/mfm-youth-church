export type AnnouncementCategory =
  | "general"
  | "service"
  | "event"
  | "ministry"
  | "youth"
  | "children"
  | "community"
  | "admin";

export type AnnouncementPriority = "urgent" | "high" | "normal" | "low";

export interface Announcement {
  id: string;
  title: string;
  body: string;
  category: AnnouncementCategory;
  priority: AnnouncementPriority;
  date: string;
  expiryDate: string;
  author: string;
  isPinned: boolean;
  attachments: string[];
  tags: string[];
}

export const announcementCategories: AnnouncementCategory[] = [
  "general",
  "service",
  "event",
  "ministry",
  "youth",
  "children",
  "community",
  "admin",
];

export const categoryLabels: Record<AnnouncementCategory, string> = {
  general: "General",
  service: "Service",
  event: "Event",
  ministry: "Ministry",
  youth: "Youth",
  children: "Children",
  community: "Community",
  admin: "Admin",
};

export const categoryColors: Record<
  AnnouncementCategory,
  { bg: string; text: string; dot: string }
> = {
  general: { bg: "bg-purple-50", text: "text-purple-700", dot: "bg-purple-500" },
  service: { bg: "bg-purple-50", text: "text-purple-700", dot: "bg-purple-500" },
  event: { bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-500" },
  ministry: {
    bg: "bg-teal-50",
    text: "text-teal-700",
    dot: "bg-teal-500",
  },
  youth: { bg: "bg-red-50", text: "text-red-700", dot: "bg-red-500" },
  children: {
    bg: "bg-pink-50",
    text: "text-pink-700",
    dot: "bg-pink-500",
  },
  community: {
    bg: "bg-green-50",
    text: "text-green-700",
    dot: "bg-green-500",
  },
  admin: { bg: "bg-gray-50", text: "text-gray-700", dot: "bg-gray-500" },
};

export const priorityConfig: Record<
  AnnouncementPriority,
  { label: string; border: string; bg: string; text: string; dot: string }
> = {
  urgent: {
    label: "Urgent",
    border: "border-l-red-500",
    bg: "bg-red-50",
    text: "text-red-700",
    dot: "bg-red-500",
  },
  high: {
    label: "High",
    border: "border-l-amber-500",
    bg: "bg-amber-50",
    text: "text-amber-700",
    dot: "bg-amber-500",
  },
  normal: {
    label: "Normal",
    border: "border-l-blue-400",
    bg: "bg-purple-50",
    text: "text-purple-700",
    dot: "bg-purple-400",
  },
  low: {
    label: "Low",
    border: "border-l-gray-300",
    bg: "bg-gray-50",
    text: "text-gray-500",
    dot: "bg-gray-400",
  },
};

export const mockAnnouncements: Announcement[] = [
  {
    id: "ann-001",
    title: "Special Thanksgiving Service This Sunday",
    body: "Brethren, we warmly invite you to our Special Thanksgiving Service holding this Sunday by 7:00 AM at the main auditorium. This is a season to return all glory to God for His faithfulness, provision, and protection over our families and the church throughout the first half of the year. Come with your thanksgiving offerings, testimonies, and a heart full of gratitude. There will be special ministrations from the choir and the children's department. Let us come together to celebrate the goodness of the Lord. Remember, every good and perfect gift comes from above.",
    category: "service",
    priority: "high",
    date: "2025-07-17",
    expiryDate: "2025-12-31",
    author: "Church Secretary",
    isPinned: true,
    attachments: ["Thanksgiving-Service-Order.pdf"],
    tags: ["thanksgiving", "service", "offering"],
  },
  {
    id: "ann-002",
    title: "Youth Conference 2025 Registration Now Open",
    body: "Registration for the Youth Youth Conference 2025 themed 'Arise and Shine: The Next Generation of Kingdom Leaders' is now officially open. The conference holds from August 15th to 17th at the church auditorium. This year's edition features guest speakers from across Nigeria, interactive workshops on leadership, digital evangelism, and purpose discovery, as well as worship sessions led by anointed music ministers. Early bird registration fee is N2,000 which covers conference materials, lunch for three days, and a conference T-shirt. You can register at the youth desk after service or via the church website. Don't miss this life-transforming experience.",
    category: "youth",
    priority: "high",
    date: "2025-07-15",
    expiryDate: "2025-12-31",
    author: "Youth President",
    isPinned: true,
    attachments: [
      "Youth-Conference-2025-Flyer.pdf",
      "Registration-Form.pdf",
    ],
    tags: ["youth", "conference", "registration", "leadership"],
  },
  {
    id: "ann-003",
    title: "Vacation Bible School (VBS) Registration",
    body: "Parents, the 2025 Vacation Bible School holds from August 11th to 15th, 9:00 AM to 1:00 PM daily. This year's theme is 'Journey Through the Bible: Heroes of Faith.' Our children will enjoy Bible stories, memory verses, crafts, games, music, and snacks. The programme is open to children aged 4 to 14 years. Registration is free but mandatory for planning purposes. Please register your children at the children's church desk or see Sister Ngozi after any service. We also need volunteers — teachers, helpers, and those who can assist with crafts and catering. God bless you as you invest in the spiritual growth of our children.",
    category: "children",
    priority: "normal",
    date: "2025-07-16",
    expiryDate: "2025-12-31",
    author: "Children's Church Coordinator",
    isPinned: false,
    attachments: ["VBS-Registration-Form.pdf"],
    tags: ["children", "VBS", "holiday", "registration"],
  },
  {
    id: "ann-004",
    title: "Church Bus Schedule Change Effective Next Week",
    body: "Please be informed that effective from Monday, July 21st, there will be adjustments to the church bus schedule. The Gwarinpa route bus will now depart at 7:15 AM instead of 7:00 AM, while the Kubwa route will depart at 6:45 AM. The Wuse and Central Area route remains unchanged. These adjustments are due to ongoing road construction along the Gwarinpa expressway. We apologise for any inconvenience and encourage members to plan accordingly. The bus coordinator, Brother Emeka, is available at the transport desk for any enquiries. Evening service buses will continue to operate as before from 5:00 PM.",
    category: "admin",
    priority: "urgent",
    date: "2025-07-18",
    expiryDate: "2025-12-31",
    author: "Transport Unit",
    isPinned: true,
    attachments: ["Updated-Bus-Schedule.pdf"],
    tags: ["transport", "bus", "schedule", "important"],
  },
  {
    id: "ann-005",
    title: "New Members' Classes Begin Next Month",
    body: "If you have been worshipping with us for three months or more and have not yet attended the New Members' Class, this is your opportunity. The next batch of classes begins on Sunday, August 3rd, immediately after the first service. The six-week programme covers the foundational doctrines of the Christian faith, the history and vision of MFM, the structure of Youth Church, spiritual gifts discovery, and how to get plugged into a department. Completion of the class is a prerequisite for becoming a full member of the parish. Please register at the church office or speak with Deaconess Adeyinka after service.",
    category: "general",
    priority: "normal",
    date: "2025-07-14",
    expiryDate: "2025-12-31",
    author: "Discipleship Unit",
    isPinned: false,
    attachments: [],
    tags: ["new-members", "class", "discipleship", "foundation"],
  },
  {
    id: "ann-006",
    title: "Prayer Walk This Saturday Across Utako Community",
    body: "Join us this Saturday, July 19th, as we take our prayers to the streets of the Utako community. We will gather at the church premises by 6:30 AM and proceed in groups to cover different zones in prayer. The prayer walk is an expression of our commitment to standing in the gap for our community, our neighbours, and the peace of Abuja. Please wear comfortable walking shoes, bring your water bottles, and come with a heart of intercession. Prayer points and route maps will be distributed at the gathering point. The exercise should conclude by 9:00 AM. Let us believe God for mighty testimonies as we march for Him.",
    category: "community",
    priority: "normal",
    date: "2025-07-16",
    expiryDate: "2025-12-31",
    author: "Prayer Ministry",
    isPinned: false,
    attachments: [],
    tags: ["prayer", "community", "outreach", "intercession"],
  },
  {
    id: "ann-007",
    title: "Carols Night Auditions Open to All Members",
    body: "Preparations for the 2025 Carols Night are in full swing, and auditions for solo performances, group ministrations, drama, and spoken word are now open. If you have a talent in singing, playing an instrument, acting, or any creative arts, we invite you to register for auditions holding on July 26th and August 2nd in the church auditorium from 3:00 PM to 6:00 PM. The Carols Night is scheduled for December 13th, and this year's edition promises to be the best yet with the theme 'Joy to the World.' Registration forms are available at the music department stand. For enquiries, contact the Music Director, Brother Tunde.",
    category: "event",
    priority: "normal",
    date: "2025-07-15",
    expiryDate: "2025-12-31",
    author: "Music Department",
    isPinned: false,
    attachments: ["Carols-Night-Audition-Form.pdf"],
    tags: ["carols", "audition", "music", "creative"],
  },
  {
    id: "ann-008",
    title: "End of Year Thanksgiving Programme Dates Announced",
    body: "By the grace of God, our End of Year Thanksgiving Programme for 2025 has been scheduled to hold from December 21st to 31st. The eleven-day programme will feature special prayer sessions, revival meetings, a candlelight service on Christmas Eve, watchnight service on December 31st, and our annual crossover service into 2026. The theme for this year is 'Unending Grace' (1 Corinthians 15:10). Full details of the daily activities, guest ministers, and service times will be communicated in due course. Members are encouraged to begin preparing their hearts, invite family and friends, and plan to be part of every session. It is going to be a glorious ending to the year.",
    category: "event",
    priority: "normal",
    date: "2025-07-17",
    expiryDate: "2025-12-31",
    author: "Church Secretary",
    isPinned: false,
    attachments: [],
    tags: ["thanksgiving", "end-of-year", "crossover", "programme"],
  },
  {
    id: "ann-009",
    title: "Urgent: Water Supply Disruption on Church Premises",
    body: "Due to emergency maintenance work by the Abuja Water Board in the Utako area, there will be no water supply on the church premises from Wednesday, July 23rd to Friday, July 25th. Members coming for midweek services on Wednesday and Friday are advised to come with drinking water. Portable water will be provided in the fellowship hall for essential use. We expect normal supply to be restored by Saturday morning. The church management apologises for this inconvenience and thanks you for your understanding. If you have any questions, please contact the facility manager, Brother Chukwuma.",
    category: "admin",
    priority: "urgent",
    date: "2025-07-18",
    expiryDate: "2025-12-31",
    author: "Facility Management",
    isPinned: false,
    attachments: [],
    tags: ["urgent", "facility", "water", "notice"],
  },
  {
    id: "ann-010",
    title: "Women's Fellowship Monthly Meeting",
    body: "The Youth Women's Fellowship invites all sisters to the July edition of our monthly meeting holding this Saturday, July 19th, from 10:00 AM to 1:00 PM in the church fellowship hall. Our guest speaker, Pastor (Mrs) Folake Adeyemi from MFM Dominion Parish, Gwarinpa, will be ministering on the topic 'Walking in Divine Health: God's Promise for His Daughters.' There will also be a special prayer session for families, time for fellowship, and light refreshment. All women, young and old, married and single, are warmly welcome. Please come with your Bible and notebook. Childcare will be provided for mothers with young children.",
    category: "ministry",
    priority: "normal",
    date: "2025-07-14",
    expiryDate: "2025-12-31",
    author: "Women's Fellowship President",
    isPinned: false,
    attachments: [],
    tags: ["women", "fellowship", "ministry", "monthly"],
  },
  {
    id: "ann-011",
    title: "Men of Purpose Quarterly Retreat",
    body: "Calling all brothers to the Men of Purpose Quarterly Retreat holding from Friday, August 22nd to Sunday, August 24th at the Green Resort, Gwagwalada, Abuja. The retreat theme is 'Rising Men: Standing Firm in a Shifting Culture' (1 Corinthians 16:13). Activities include Bible teachings, group discussions, prayer sessions, team-building exercises, and recreational activities. The retreat fee of N15,000 covers accommodation, feeding, and conference materials. Registration is now open at the men's fellowship desk or by contacting Brother Segun. This is a great opportunity to bond, grow spiritually, and network with other brothers. Don't miss it.",
    category: "ministry",
    priority: "high",
    date: "2025-07-16",
    expiryDate: "2025-12-31",
    author: "Men's Fellowship Coordinator",
    isPinned: false,
    attachments: ["Retreat-Registration-Form.pdf", "Retreat-Itinerary.pdf"],
    tags: ["men", "retreat", "fellowship", "spiritual-growth"],
  },
  {
    id: "ann-012",
    title: "Church Website and Mobile App Update",
    body: "We are excited to announce that the Youth Church website and mobile app have been updated with new features to serve you better. You can now stream live services directly from the app, submit prayer requests, register for events, give your tithes and offerings online, and access sermon notes and devotionals. To get the latest version of the app, please update it from the Google Play Store or Apple App Store. If you do not have the app yet, search for 'Youth Assembly' in your app store to download it. Your feedback is valuable — please share your experience with the ICT team.",
    category: "general",
    priority: "low",
    date: "2025-07-13",
    expiryDate: "2025-12-31",
    author: "ICT Department",
    isPinned: false,
    attachments: [],
    tags: ["technology", "app", "website", "update"],
  },
  {
    id: "ann-013",
    title: "Workers in Training (WIT) Programme Commences August",
    body: "The next Workers in Training (WIT) programme is scheduled to commence on Sunday, August 10th. This six-month intensive programme is designed to prepare and equip every intending worker for effective service in the house of God. Classes hold every Sunday from 2:00 PM to 4:00 PM and cover topics including the doctrine of Christ, prayer life, evangelism, Christian character, and departmental orientation. Eligibility requires that you must be a baptized member who has completed the New Members' Class. Application forms are available at the church office and must be submitted by August 3rd. For more information, contact the Training Coordinator, Pastor Emmanuel.",
    category: "ministry",
    priority: "normal",
    date: "2025-07-17",
    expiryDate: "2025-12-31",
    author: "Training Coordinator",
    isPinned: false,
    attachments: ["WIT-Application-Form.pdf"],
    tags: ["workers", "training", "discipleship", "service"],
  },
  {
    id: "ann-014",
    title: "Community Outreach: Back to School Supplies Drive",
    body: "As part of our ongoing commitment to serving the Utako community, the Social Responsibility Committee is organising a Back to School Supplies Drive. We are collecting new and gently used school bags, notebooks, pens, pencils, rulers, mathematical sets, and other essential school supplies. These will be distributed to underprivileged children in the Utako and Jabi communities ahead of the new academic session in September. Collection boxes are placed at the church entrance and the fellowship hall. The drive runs from now until August 31st. We also welcome cash donations for purchasing additional items. May the Lord bless you abundantly as you give.",
    category: "community",
    priority: "normal",
    date: "2025-07-15",
    expiryDate: "2025-12-31",
    author: "Social Responsibility Committee",
    isPinned: false,
    attachments: ["Supplies-Drive-Flyer.pdf"],
    tags: ["outreach", "community", "education", "donation"],
  },
  {
    id: "ann-015",
    title: "New Department Launch: Creative Arts Ministry",
    body: "We are pleased to announce the official launch of the Youth Creative Arts Ministry. This new department is dedicated to harnessing the creative gifts within our congregation for the glory of God. Areas of focus include photography, videography, graphic design, social media content creation, drama, poetry, spoken word, and fine arts. Whether you are a professional or simply have a passion for the creative arts, there is a place for you. The inaugural meeting holds on Saturday, July 26th at 3:00 PM in the church conference room. Come and discover how your creativity can serve God's kingdom. For enquiries, contact the department head, Sister Amara.",
    category: "ministry",
    priority: "normal",
    date: "2025-07-16",
    expiryDate: "2025-12-31",
    author: "Creative Arts Ministry",
    isPinned: false,
    attachments: [],
    tags: ["creative", "arts", "ministry", "new-department"],
  },
  {
    id: "ann-016",
    title: "Tithes and Offering: New Digital Payment Channels",
    body: "In our continuous effort to make giving convenient for all members, we have added new digital payment channels for tithes, offerings, and other financial contributions. You can now give via the following methods: Bank Transfer to our dedicated GTBank account, USSD code, or through the church mobile app. All payments are automatically recorded and receipts are generated. Please ensure you include your name and the purpose of the giving in the payment reference. For any issues with digital payments, Brother Kunle from the finance department is available to assist you after services.",
    category: "admin",
    priority: "low",
    date: "2025-07-12",
    expiryDate: "2025-12-31",
    author: "Finance Department",
    isPinned: false,
    attachments: ["Digital-Payment-Guide.pdf"],
    tags: ["giving", "tithe", "offering", "digital", "payment"],
  },
  {
    id: "ann-017",
    title: "Sunday School Teachers Needed for New Term",
    body: "The Christian Education Department is seeking dedicated and passionate members to join our Sunday School teaching team for the new term beginning in September. We need teachers for the following age groups: Toddlers (2-4 years), Primary (5-9 years), Juniors (10-13 years), and Teens (14-18 years). Teaching materials and lesson plans are provided. A brief orientation and training session will be held for all new teachers on August 30th. If you have a love for children, a good understanding of the Bible, and a desire to impact the next generation, please see the Sunday School Superintendent, Deaconess Funke, or register at the Christian Education desk.",
    category: "children",
    priority: "normal",
    date: "2025-07-17",
    expiryDate: "2025-12-31",
    author: "Christian Education Department",
    isPinned: false,
    attachments: [],
    tags: ["sunday-school", "teaching", "children", "volunteers"],
  },
];

export function getActiveAnnouncements(): Announcement[] {
  const today = new Date().toISOString().split("T")[0];
  return mockAnnouncements.filter((a) => a.expiryDate >= today);
}

export function getPinnedAnnouncements(): Announcement[] {
  const today = new Date().toISOString().split("T")[0];
  return mockAnnouncements.filter(
    (a) => a.isPinned && a.expiryDate >= today
  );
}

export function getAnnouncementsByCategory(
  cat: AnnouncementCategory
): Announcement[] {
  const today = new Date().toISOString().split("T")[0];
  return mockAnnouncements.filter(
    (a) => a.category === cat && a.expiryDate >= today
  );
}
