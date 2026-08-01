export type EventCategory = "Service" | "Special Programme" | "Conference" | "Community" | "Youth" | "Training";

export interface ChurchEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  endDate?: string;
  time: string;
  endTime?: string;
  venue: string;
  category: EventCategory;
  isRecurring: boolean;
  recurringDay?: string;
  featured?: boolean;
  registrationRequired: boolean;
  capacity?: number;
  registeredCount?: number;
  image?: string;
}

export const eventCategories: EventCategory[] = [
  "Service",
  "Special Programme",
  "Conference",
  "Community",
  "Youth",
  "Training",
];

export const categoryColors: Record<EventCategory, { bg: string; text: string; border: string }> = {
  "Service": { bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-100" },
  "Special Programme": { bg: "bg-red-50", text: "text-red-700", border: "border-red-100" },
  "Conference": { bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-100" },
  "Community": { bg: "bg-green-50", text: "text-green-700", border: "border-green-100" },
  "Youth": { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-100" },
  "Training": { bg: "bg-teal-50", text: "text-teal-700", border: "border-teal-100" },
};

export const mockEvents: ChurchEvent[] = [
  {
    id: "ev1",
    title: "Sunday Worship Service",
    description: "Our regular Sunday worship service featuring praise, worship, the Word of God, and fellowship. Come and experience God\u2019s presence in a powerful way as we lift holy hands unto the Lord.",
    date: "2025-07-20",
    time: "08:00",
    endTime: "13:00",
    venue: "MFM Youth Church, Utako",
    category: "Service",
    isRecurring: true,
    recurringDay: "Every Sunday",
    featured: true,
    registrationRequired: false,
    capacity: 500,
    registeredCount: 320,
  },
  {
    id: "ev2",
    title: "Tuesday Bible Study",
    description: "In-depth, systematic study of the Word of God. This term we are studying the Book of Romans \u2014 exploring the righteousness of God, faith, grace, and the transformation power of the Gospel.",
    date: "2025-07-22",
    time: "17:30",
    endTime: "20:00",
    venue: "Church Main Auditorium",
    category: "Training",
    isRecurring: true,
    recurringDay: "Every Tuesday",
    registrationRequired: false,
  },

  {
    id: "ev3b",
    title: "Thursday Faith Clinic",
    description: "A special time of faith-building teachings, prayers, and declarations for divine healing, breakthroughs, and supernatural interventions. Come expecting miracles.",
    date: "2025-07-24",
    time: "17:30",
    endTime: "19:00",
    venue: "Church Main Auditorium",
    category: "Service",
    isRecurring: true,
    recurringDay: "Every Thursday",
    registrationRequired: false,
  },
  {
    id: "ev4",
    title: "Annual Convention 2025",
    description: "Our biggest event of the year! A week-long convention featuring powerful speakers, anointed worship, miracle services, and divine encounters. Theme: \u2018Overflowing Grace\u2019. Accommodation available.",
    date: "2025-08-04",
    endDate: "2025-08-10",
    time: "09:00",
    endTime: "21:00",
    venue: "MFM Redemption Camp, Km 46 Lagos-Ibadan Expressway",
    category: "Conference",
    isRecurring: false,
    featured: true,
    registrationRequired: true,
    capacity: 2000,
    registeredCount: 1456,
  },
  {
    id: "ev5",
    title: "Youth Explosion 2025",
    description: "A special programme for young adults and teenagers featuring music, drama, games, workshops, and the Word. Theme: \u2018Arise and Shine\u2019. Come with a friend!",
    date: "2025-08-16",
    time: "10:00",
    endTime: "16:00",
    venue: "Church Main Auditorium, Utako",
    category: "Youth",
    isRecurring: false,
    featured: true,
    registrationRequired: true,
    capacity: 300,
    registeredCount: 187,
  },
  {
    id: "ev6",
    title: "Community Outreach \u2014 Utako Medical Mission",
    description: "Free medical outreach to the Utako community. Services include blood pressure checks, blood sugar tests, malaria testing, general consultations, and free medication. Volunteers and medical professionals needed.",
    date: "2025-08-23",
    time: "09:00",
    endTime: "15:00",
    venue: "Utako Community Park",
    category: "Community",
    isRecurring: false,
    registrationRequired: true,
    capacity: 500,
    registeredCount: 89,
  },
  {
    id: "ev7",
    title: "Marriage Enrichment Seminar",
    description: "A one-day seminar for married couples and those preparing for marriage. Topics include communication, financial stewardship, intimacy, conflict resolution, and raising godly children. Facilitated by experienced marriage counsellors.",
    date: "2025-08-30",
    time: "10:00",
    endTime: "16:00",
    venue: "Church Conference Room",
    category: "Training",
    isRecurring: false,
    registrationRequired: true,
    capacity: 100,
    registeredCount: 54,
  },
  {
    id: "ev8",
    title: "Special Holy Ghost Service",
    description: "A special all-night service dedicated to intense worship, prayer, and the move of the Holy Spirit. Come prepared for a divine encounter that will transform your life forever.",
    date: "2025-07-27",
    time: "22:00",
    endTime: "04:00",
    venue: "Church Main Auditorium",
    category: "Special Programme",
    isRecurring: false,
    registrationRequired: false,
    capacity: 500,
    registeredCount: 210,
  },
  {
    id: "ev9",
    title: "Children\u2019s Day Celebration",
    description: "A fun-filled day celebrating our children with special presentations, games, prizes, Bible quizzes, and a special word for the young ones. Parents are encouraged to attend with their children.",
    date: "2025-07-27",
    time: "10:00",
    endTime: "14:00",
    venue: "Church Premises",
    category: "Youth",
    isRecurring: false,
    registrationRequired: false,
  },
  {
    id: "ev10",
    title: "Workers\u2019 Training Programme",
    description: "Mandatory training for all church workers. Modules include: role-specific duties, spiritual leadership, effective service, and pastoral care fundamentals. Certificate of completion issued.",
    date: "2025-09-06",
    endDate: "2025-09-07",
    time: "09:00",
    endTime: "17:00",
    venue: "Church Conference Room",
    category: "Training",
    isRecurring: false,
    registrationRequired: true,
    capacity: 150,
    registeredCount: 98,
  },
  {
    id: "ev11",
    title: "Back to School Prayer",
    description: "A special prayer session for all students returning to school. Parents and students come together to commit the new academic session into God\u2019s hands. Prayers for wisdom, protection, and success.",
    date: "2025-09-06",
    time: "08:00",
    endTime: "10:00",
    venue: "Church Main Auditorium",
    category: "Special Programme",
    isRecurring: false,
    registrationRequired: false,
  },
  {
    id: "ev12",
    title: "Community Clean-Up Exercise",
    description: "As part of our social responsibility, we organise a quarterly clean-up of the Utako neighbourhood. Gloves, bags, and tools provided. Come and serve your community.",
    date: "2025-09-13",
    time: "07:00",
    endTime: "11:00",
    venue: "Utako District, Abuja",
    category: "Community",
    isRecurring: false,
    registrationRequired: false,
  },
];

export function getUpcomingEvents(): ChurchEvent[] {
  const now = new Date();
  const today = now.toISOString().split("T")[0];
  return mockEvents.filter((e) => e.date >= today).sort((a, b) => a.date.localeCompare(b.date));
}

export function getFeaturedEvents(): ChurchEvent[] {
  return mockEvents.filter((e) => e.featured);
}

export function getEventsByMonth(year: number, month: number): ChurchEvent[] {
  return mockEvents.filter((e) => {
    const d = new Date(e.date);
    return d.getFullYear() === year && d.getMonth() === month;
  });
}
