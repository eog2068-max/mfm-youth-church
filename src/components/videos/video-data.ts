export interface Video {
  id: string;
  title: string;
  speaker: string;
  date: string;
  duration: string;
  views: string;
  category: string;
  seriesId?: string;
  description: string;
  isFeatured?: boolean;
}

export interface Series {
  id: string;
  name: string;
  description: string;
  videoCount: number;
  coverGradient: string;
}

export const mockSeries: Series[] = [
  { id: "s1", name: "Walking in Destiny", description: "A powerful series on discovering and fulfilling your God-given destiny", videoCount: 6, coverGradient: "from-[#4A148C] to-[#6A1B9A]" },
  { id: "s2", name: "Prayer That Moves Mountains", description: "Learning the secrets of effectual and fervent prayer", videoCount: 4, coverGradient: "from-[#D32F2F] to-[#B71C1C]" },
  { id: "s3", name: "The Grace Life", description: "Understanding God's unmerited favour and walking in it daily", videoCount: 5, coverGradient: "from-[#2E7D32] to-[#1B5E20]" },
  { id: "s4", name: "Family Matters", description: "Building godly homes and strong family foundations", videoCount: 4, coverGradient: "from-[#C62828] to-[#B71C1C]" },
  { id: "s5", name: "Spiritual Warfare", description: "Equipping believers for victory in spiritual battles", videoCount: 3, coverGradient: "from-[#4A148C] to-[#311B92]" },
  { id: "s6", name: "Sunday Services", description: "Complete Sunday worship service recordings", videoCount: 12, coverGradient: "from-[#1A0033] to-[#4A148C]" },
];

export const mockVideos: Video[] = [
  // Series 1: Walking in Destiny
  { id: "v1", title: "Discovering Your Purpose", speaker: "Pastor [Name]", date: "2025-07-13", duration: "48:32", views: "1.2K", category: "Sermon", seriesId: "s1", description: "Understanding that every person was created with a divine purpose and how to discover yours through the Word of God and prayer.", isFeatured: true },
  { id: "v2", title: "Steps to Destiny Fulfillment", speaker: "Pastor [Name]", date: "2025-07-06", duration: "52:15", views: "980", category: "Sermon", seriesId: "s1", description: "Practical steps every believer must take to move from purpose discovery to actual destiny fulfillment." },
  { id: "v3", title: "Overcoming Destiny Delay", speaker: "Pastor [Name]", date: "2025-06-29", duration: "45:18", views: "860", category: "Sermon", seriesId: "s1", description: "When God's timing seems different from yours — how to trust the process and keep moving." },
  { id: "v4", title: "The Power of Vision", speaker: "Pastor [Name]", date: "2025-06-22", duration: "50:10", views: "1.1K", category: "Sermon", seriesId: "s1", description: "How a clear vision from God sustains you through every season of life." },
  { id: "v5", title: "Destiny Helpers", speaker: "Pastor [Name]", date: "2025-06-15", duration: "47:55", views: "740", category: "Sermon", seriesId: "s1", description: "Recognizing and positioning yourself for the people God has assigned to help your destiny." },
  { id: "v6", title: "Finishing Strong", speaker: "Pastor [Name]", date: "2025-06-08", duration: "51:30", views: "690", category: "Sermon", seriesId: "s1", description: "The race is not to the swift but to those who endure to the end. How to finish your course with joy." },

  // Series 2: Prayer That Moves Mountains
  { id: "v7", title: "The Secret Place of Prayer", speaker: "Pastor [Name]", date: "2025-06-27", duration: "55:40", views: "1.5K", category: "Sermon", seriesId: "s2", description: "Understanding the importance of a personal prayer life and how to cultivate intimacy with God." },
  { id: "v8", title: "Praying with Authority", speaker: "Pastor [Name]", date: "2025-06-20", duration: "42:22", views: "1.1K", category: "Sermon", seriesId: "s2", description: "Using the name of Jesus and the Word of God to pray with boldness and authority." },
  { id: "v9", title: "Fasting and Prayer", speaker: "Pastor [Name]", date: "2025-06-13", duration: "48:05", views: "920", category: "Sermon", seriesId: "s2", description: "The power of combining fasting with prayer for breakthroughs and spiritual empowerment." },
  { id: "v10", title: "Persistent Prayer", speaker: "Evangelist Guest", date: "2025-07-04", duration: "1:12:05", views: "2.1K", category: "Special", seriesId: "s2", description: "Learning from the widow who wouldn't give up — the power of importunate prayer." },

  // Series 3: The Grace Life
  { id: "v11", title: "Understanding Grace", speaker: "Pastor [Name]", date: "2025-05-25", duration: "44:18", views: "870", category: "Sermon", seriesId: "s3", description: "A foundational teaching on what grace truly is and how it differs from mercy and law." },
  { id: "v12", title: "Grace for Every Season", speaker: "Pastor [Name]", date: "2025-05-18", duration: "46:30", views: "780", category: "Sermon", seriesId: "s3", description: "No matter what season of life you are in, God's grace is sufficient." },
  { id: "v13", title: "Growing in Grace", speaker: "Pastor [Name]", date: "2025-05-11", duration: "43:12", views: "650", category: "Sermon", seriesId: "s3", description: "Practical ways to grow in the grace and knowledge of our Lord Jesus Christ." },
  { id: "v14", title: "Grace to Overcome", speaker: "Pastor [Name]", date: "2025-05-04", duration: "49:45", views: "710", category: "Sermon", seriesId: "s3", description: "How God's grace empowers us to overcome every challenge and temptation." },
  { id: "v15", title: "The Throne of Grace", speaker: "Pastor [Name]", date: "2025-04-27", duration: "41:20", views: "580", category: "Sermon", seriesId: "s3", description: "Coming boldly to the throne of grace to obtain mercy and find help in time of need." },

  // Series 4: Family Matters
  { id: "v16", title: "Building a Godly Home", speaker: "Pastor [Name]", date: "2025-05-15", duration: "38:45", views: "650", category: "Sermon", seriesId: "s4", description: "Foundational principles for building a home that honours God and thrives in love." },
  { id: "v17", title: "Raising Godly Children", speaker: "Guest Speaker", date: "2025-05-08", duration: "1:05:30", views: "1.8K", category: "Special", seriesId: "s4", description: "Biblical principles for nurturing children in the fear and admonition of the Lord." },
  { id: "v18", title: "Marriage That Works", speaker: "Pastor [Name]", date: "2025-05-01", duration: "52:00", views: "940", category: "Sermon", seriesId: "s4", description: "Practical wisdom for building a strong, lasting, and fulfilling marriage." },
  { id: "v19", title: "Family Altar", speaker: "Pastor [Name]", date: "2025-04-24", duration: "35:15", views: "520", category: "Sermon", seriesId: "s4", description: "The importance of family devotions and how to establish a consistent family altar." },

  // Series 5: Spiritual Warfare
  { id: "v20", title: "Know Your Enemy", speaker: "Pastor [Name]", date: "2025-04-17", duration: "58:20", views: "1.3K", category: "Sermon", seriesId: "s5", description: "Understanding the spiritual forces arrayed against believers and how to stand firm." },
  { id: "v21", title: "The Armour of God", speaker: "Pastor [Name]", date: "2025-04-10", duration: "1:02:15", views: "1.6K", category: "Sermon", seriesId: "s5", description: "Putting on the whole armour of God for effective spiritual warfare." },
  { id: "v22", title: "Victory in Christ", speaker: "Pastor [Name]", date: "2025-04-03", duration: "46:40", views: "1.0K", category: "Sermon", seriesId: "s5", description: "The finished work of Christ guarantees our victory. How to walk in that victory daily." },

  // Series 6: Sunday Services (latest)
  { id: "v23", title: "The Power of Thanksgiving", speaker: "Pastor [Name]", date: "2025-07-13", duration: "48:32", views: "1.2K", category: "Service", seriesId: "s6", description: "Sunday worship service complete recording." },
  { id: "v24", title: "Living by Faith", speaker: "Pastor [Name]", date: "2025-07-06", duration: "52:15", views: "980", category: "Service", seriesId: "s6", description: "Sunday worship service complete recording." },
  { id: "v25", title: "The Blessing of Obedience", speaker: "Pastor [Name]", date: "2025-06-29", duration: "45:18", views: "860", category: "Service", seriesId: "s6", description: "Sunday worship service complete recording." },
  { id: "v26", title: "Excellence in Service", speaker: "Guest Speaker", date: "2025-06-22", duration: "1:05:30", views: "1.8K", category: "Special", seriesId: "s6", description: "Special Sunday service with guest minister." },
];

export const videoCategories = ["All", "Sermon", "Service", "Special"];