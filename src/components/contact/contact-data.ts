export const churchInfo = {
  name: "MFM INT'L HQ ANNEX, Youth Church, Abuja",
  shortName: "MFM Youth Church",
  address: "14 Ekukinam Street, Opp. Chisco Motor Park Utako, Abuja.",
  mapsQuery: "14+Ekukinam+Street+Opp+Chisco+Motor+Park+Utako+Abuja",
  mapsUrl: "https://www.google.com/maps/search/?api=1&query=14+Ekukinam+Street+Opp+Chisco+Motor+Park+Utako+Abuja",
  phone: "+234 905 001 7238",
  phoneRaw: "+2349050017238",
  email: "thecenaclemfmycr10@gmail.com",
  website: "www.mfmannexyouth.org",
  websiteUrl: "https://www.mfmannexyouth.org/",
};

export const socialLinks = [
  {
    name: "Facebook",
    url: "https://facebook.com/mfmannexyouth",
    icon: "facebook" as const,
  },
  {
    name: "Instagram",
    url: "https://instagram.com/mfmannexyouth",
    icon: "instagram" as const,
  },
  {
    name: "YouTube",
    url: "https://youtube.com/@mfmannexyouth",
    icon: "youtube" as const,
  },
  {
    name: "X (Twitter)",
    url: "https://x.com/mfmannexyouth",
    icon: "twitter" as const,
  },
];

export interface ServiceTime {
  id: string;
  name: string;
  day: string;
  dayIndex: number;
  startTime: string;
  endTime: string;
  description?: string;
}

export const serviceTimes: ServiceTime[] = [
  {
    id: "sunday-first",
    name: "Sunday Worship Service",
    day: "Sunday",
    dayIndex: 0,
    startTime: "7:00 AM",
    endTime: "10:00 AM",
    description: "Praise, worship and the Word",
  },
  {
    id: "tuesday-bible",
    name: "Tuesday Digging Deep (Bible Study)",
    day: "Tuesday",
    dayIndex: 2,
    startTime: "5:30 PM",
    endTime: "7:00 PM",
    description: "Digging deeper into God's Word",
  },
  {
    id: "thursday-faith-clinic",
    name: "Thursday Faith Clinic",
    day: "Thursday",
    dayIndex: 4,
    startTime: "5:30 PM",
    endTime: "7:00 PM",
    description: "Faith-building teachings and prayers for healing and breakthroughs",
  },

];

export const officeHours = {
  weekdays: "Monday - Friday: 9:00 AM - 5:00 PM",
  saturday: "Saturday: 10:00 AM - 2:00 PM",
  sunday: "Sunday: Before & after services",
};

export const contactSubjects = [
  { value: "general", label: "General Inquiry" },
  { value: "prayer", label: "Prayer Request" },
  { value: "membership", label: "Membership" },
  { value: "events", label: "Events" },
  { value: "media", label: "Media / Technical" },
  { value: "feedback", label: "Feedback" },
  { value: "other", label: "Other" },
];

export function getUpcomingService(): {
  service: ServiceTime;
  daysUntil: number;
  label: string;
} {
  const now = new Date();
  const currentDay = now.getDay();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  const currentTotalMinutes = currentHour * 60 + currentMinute;

  const dayServices = serviceTimes.filter((s) => s.dayIndex === currentDay);

  function timeToMinutes(time: string): number {
    const [timePart, period] = time.split(" ");
    let [hours, minutes] = timePart.split(":").map(Number);
    if (period === "PM" && hours !== 12) hours += 12;
    if (period === "AM" && hours === 12) hours = 0;
    return hours * 60 + minutes;
  }

  const upcomingToday = dayServices
    .filter((s) => timeToMinutes(s.startTime) > currentTotalMinutes)
    .sort((a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime));

  if (upcomingToday.length > 0) {
    const service = upcomingToday[0];
    return {
      service,
      daysUntil: 0,
      label: "Next: Today",
    };
  }

  const sortedByDay = [...serviceTimes].sort((a, b) => {
    const dayDiffA = (a.dayIndex - currentDay + 7) % 7;
    const dayDiffB = (b.dayIndex - currentDay + 7) % 7;
    if (dayDiffA !== dayDiffB) return dayDiffA - dayDiffB;
    return timeToMinutes(a.startTime) - timeToMinutes(b.startTime);
  });

  const nextService = sortedByDay[0];
  const daysUntil =
    (nextService.dayIndex - currentDay + 7) % 7 || 7;

  return {
    service: nextService,
    daysUntil,
    label:
      daysUntil === 1
        ? "Next: Tomorrow"
        : `Next: In ${daysUntil} days`,
  };
}