export interface GivingCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
}

export const givingCategories: GivingCategory[] = [
  {
    id: "tithe",
    name: "Tithe",
    description: "Returning 10% of your income as an act of obedience and trust in God's provision.",
    icon: "TrendingUp",
    color: "from-[#4A148C] to-[#6A1B9A]",
  },
  {
    id: "offering",
    name: "Offering",
    description: "A freewill gift unto the Lord as an expression of your love and gratitude.",
    icon: "Gift",
    color: "from-[#D32F2F] to-[#E53935]",
  },
  {
    id: "thanksgiving",
    name: "Thanksgiving",
    description: "A special offering of gratitude for God's blessings, protection, and faithfulness.",
    icon: "Heart",
    color: "from-[#2E7D32] to-[#388E3C]",
  },
  {
    id: "special-seed",
    name: "Special Seed",
    description: "A prophetic or targeted gift sown towards a specific need or breakthrough.",
    icon: "Sprout",
    color: "from-[#F57C00] to-[#C62828]",
  },
  {
    id: "mission",
    name: "Mission Support",
    description: "Supporting missionary work and the spread of the Gospel to unreached regions.",
    icon: "Globe",
    color: "from-[#00695C] to-[#00796B]",
  },
  {
    id: "building",
    name: "Building Fund",
    description: "Contributing towards the church building project and infrastructure development.",
    icon: "Building2",
    color: "from-[#6A1B9A] to-[#7B1FA2]",
  },
  {
    id: "welfare",
    name: "Welfare",
    description: "Supporting the less privileged, widows, orphans, and those in need within our community.",
    icon: "HandHeart",
    color: "from-[#AD1457] to-[#C2185B]",
  },
  {
    id: "youth",
    name: "Youth Fund",
    description: "Empowering the next generation through youth programmes, scholarships, and events.",
    icon: "Flame",
    color: "from-[#C62828] to-[#B71C1C]",
  },
];

export const bankDetails = {
  bankName: "Access Bank",
  accountName: "MFM Youth Church",
  accountNumber: "0045678901",
  sortCode: "",
};

export const paymentMethods = [
  {
    id: "bank-transfer",
    name: "Bank Transfer",
    description: "Transfer directly to our church bank account",
    icon: "Landmark",
  },
  {
    id: "online",
    name: "Online Payment",
    description: "Pay securely with your debit or credit card",
    icon: "CreditCard",
  },
  {
    id: "in-person",
    name: "In-Person",
    description: "Give during any of our church services",
    icon: "Church",
  },
];

export const givingScriptures = [
  {
    reference: "2 Corinthians 9:7",
    text: "Each of you should give what you have decided in your heart to give, not reluctantly or under compulsion, for God loves a cheerful giver.",
  },
  {
    reference: "Luke 6:38",
    text: "Give, and it will be given to you. A good measure, pressed down, shaken together and running over, will be poured into your lap.",
  },
  {
    reference: "Malachi 3:10",
    text: "Bring the whole tithe into the storehouse, that there may be food in my house. Test me in this, says the LORD Almighty, and see if I will not throw open the floodgates of heaven and pour out so much blessing that there will not be room enough to store it.",
  },
  {
    reference: "Proverbs 11:25",
    text: "A generous person will prosper; whoever refreshes others will be refreshed.",
  },
];

export const givingBlessings = [
  {
    testimony: "I started tithing faithfully three years ago, and God has supernaturally increased my income beyond what I ever imagined. My business has tripled, and I have never lacked anything.",
    name: "Brother Emeka N.",
    category: "Business Breakthrough",
  },
  {
    testimony: "When I gave my first Thanksgiving offering, I was jobless and struggling. Within two weeks, I received a call for an interview and eventually got the job of my dreams. God is faithful!",
    name: "Sister Adaeze O.",
    category: "Employment",
  },
  {
    testimony: "Sowing into the Building Fund was the best decision for our family. Shortly after, God blessed us with our own home after years of renting. He honours every seed sown in faith.",
    name: "Brother and Sister Adeyemi",
    category: "Housing Provision",
  },
];
