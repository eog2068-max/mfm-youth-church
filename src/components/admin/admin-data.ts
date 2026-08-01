export interface DashboardStats {
  totalMembers: number;
  weeklyAttendance: number;
  monthlyGrowth: number;
  activeMinistries: number;
  totalSermons: number;
  totalEvents: number;
  prayerRequests: number;
  testimonies: number;
}

export const dashboardStats: DashboardStats = {
  totalMembers: 847,
  weeklyAttendance: 623,
  monthlyGrowth: 12.5,
  activeMinistries: 10,
  totalSermons: 156,
  totalEvents: 48,
  prayerRequests: 89,
  testimonies: 34,
};

export type ActivityType =
  | "member"
  | "sermon"
  | "event"
  | "prayer"
  | "testimony"
  | "announcement";

export type ActivityStatus = "new" | "pending" | "approved" | "published";

export interface RecentActivity {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  timestamp: string;
  status: ActivityStatus;
}

export const recentActivities: RecentActivity[] = [
  {
    id: "act-1",
    type: "member",
    title: "New Member Registered",
    description: "Sister Grace Okonkwo completed registration and joined the Welcome Committee",
    timestamp: "2025-01-15T09:30:00Z",
    status: "new",
  },
  {
    id: "act-2",
    type: "sermon",
    title: "New Sermon Published",
    description: "\"Walking in Divine Destiny\" by Pastor Adeyemi has been published to the sermon library",
    timestamp: "2025-01-15T08:15:00Z",
    status: "published",
  },
  {
    id: "act-3",
    type: "event",
    title: "Event Registration Open",
    description: "2025 Annual Convention registration is now open with 142 early sign-ups",
    timestamp: "2025-01-14T16:45:00Z",
    status: "approved",
  },
  {
    id: "act-4",
    type: "prayer",
    title: "Prayer Request Submitted",
    description: "Brother Emmanuel needs prayer for travelling mercy and visa approval",
    timestamp: "2025-01-14T14:20:00Z",
    status: "new",
  },
  {
    id: "act-5",
    type: "testimony",
    title: "Testimony Awaiting Review",
    description: "Sister Ngozi shared a testimony about God's provision for her business",
    timestamp: "2025-01-14T11:00:00Z",
    status: "pending",
  },
  {
    id: "act-6",
    type: "announcement",
    title: "Announcement Created",
    description: "Mid-week Bible Study schedule change notice drafted for review",
    timestamp: "2025-01-14T09:30:00Z",
    status: "pending",
  },
  {
    id: "act-7",
    type: "member",
    title: "Member Updated Profile",
    description: "Deacon Tunde Bakare updated contact information and ministry involvement",
    timestamp: "2025-01-13T17:15:00Z",
    status: "approved",
  },
  {
    id: "act-8",
    type: "sermon",
    title: "Sermon Awaiting Approval",
    description: "\"The Power of Thanksgiving\" by Minister Folake needs review before publishing",
    timestamp: "2025-01-13T15:40:00Z",
    status: "pending",
  },
  {
    id: "act-9",
    type: "event",
    title: "Youth Conference Planned",
    description: "Youth Ministry proposed \"Arise & Shine\" conference for March 2025",
    timestamp: "2025-01-13T12:00:00Z",
    status: "new",
  },
  {
    id: "act-10",
    type: "prayer",
    title: "Prayer Chain Updated",
    description: "Wednesday prayer chain roster updated with 24 new intercessors",
    timestamp: "2025-01-13T10:30:00Z",
    status: "approved",
  },
  {
    id: "act-11",
    type: "testimony",
    title: "Testimony Published",
    description: "Brother Chinedu's healing testimony approved and published to the website",
    timestamp: "2025-01-12T16:00:00Z",
    status: "published",
  },
  {
    id: "act-12",
    type: "announcement",
    title: "Special Thanksgiving Notice",
    description: "Annual thanksgiving service announcement published for all congregations",
    timestamp: "2025-01-12T14:20:00Z",
    status: "published",
  },
  {
    id: "act-13",
    type: "member",
    title: "Family Registration",
    description: "The Adeyemi family of 5 registered as new members from Gwarinpa branch",
    timestamp: "2025-01-12T11:45:00Z",
    status: "new",
  },
  {
    id: "act-14",
    type: "event",
    title: "Fundraiser Event Completed",
    description: "Church building fundraiser raised ₦4.2M with 387 attendees",
    timestamp: "2025-01-11T20:00:00Z",
    status: "approved",
  },
  {
    id: "act-15",
    type: "sermon",
    title: "Sermon Series Started",
    description: "\"Embracing God's Purpose\" 4-part series by Pastor Adewale launched",
    timestamp: "2025-01-11T09:00:00Z",
    status: "published",
  },
];

export interface QuickAction {
  id: string;
  label: string;
  icon: string;
  description: string;
  href: string;
  color: string;
}

export const quickActions: QuickAction[] = [
  {
    id: "qa-1",
    label: "Add Sermon",
    icon: "BookOpen",
    description: "Upload a new sermon to the library",
    href: "#",
    color: "#4A148C",
  },
  {
    id: "qa-2",
    label: "Create Event",
    icon: "Calendar",
    description: "Schedule a new church event",
    href: "#",
    color: "#2E7D32",
  },
  {
    id: "qa-3",
    label: "New Announcement",
    icon: "Megaphone",
    description: "Post a new announcement",
    href: "#",
    color: "#D32F2F",
  },
  {
    id: "qa-4",
    label: "View Prayer Requests",
    icon: "MessageSquare",
    description: "Review submitted prayer requests",
    href: "#",
    color: "#6A1B9A",
  },
  {
    id: "qa-5",
    label: "Review Testimonies",
    icon: "Star",
    description: "Approve or moderate testimonies",
    href: "#",
    color: "#C62828",
  },
  {
    id: "qa-6",
    label: "Manage Members",
    icon: "Users",
    description: "View and manage member records",
    href: "#",
    color: "#00695C",
  },
  {
    id: "qa-7",
    label: "Media Upload",
    icon: "Image",
    description: "Upload photos, videos, or audio",
    href: "#",
    color: "#1565C0",
  },
  {
    id: "qa-8",
    label: "Send Newsletter",
    icon: "Mail",
    description: "Compose and send church newsletter",
    href: "#",
    color: "#AD1457",
  },
];

export interface DashboardChartData {
  weeklyAttendance: { week: string; value: number }[];
  monthlyVisitors: { month: string; value: number }[];
}

export const dashboardChartData: DashboardChartData = {
  weeklyAttendance: [
    { week: "Dec 2", value: 578 },
    { week: "Dec 9", value: 601 },
    { week: "Dec 16", value: 545 },
    { week: "Dec 23", value: 490 },
    { week: "Dec 30", value: 520 },
    { week: "Jan 6", value: 598 },
    { week: "Jan 13", value: 612 },
    { week: "Jan 15", value: 623 },
  ],
  monthlyVisitors: [
    { month: "Feb", value: 320 },
    { month: "Mar", value: 345 },
    { month: "Apr", value: 380 },
    { month: "May", value: 410 },
    { month: "Jun", value: 395 },
    { month: "Jul", value: 430 },
    { month: "Aug", value: 450 },
    { month: "Sep", value: 470 },
    { month: "Oct", value: 485 },
    { month: "Nov", value: 510 },
    { month: "Dec", value: 540 },
    { month: "Jan", value: 565 },
  ],
};

export type PriorityLevel = "low" | "medium" | "high";

export interface PendingItem {
  id: string;
  type: string;
  title: string;
  submittedBy: string;
  submittedAt: string;
  priority: PriorityLevel;
}

export const pendingItems: PendingItem[] = [
  {
    id: "pend-1",
    type: "Testimony",
    title: "Healing testimony from Sister Ngozi about God's provision",
    submittedBy: "Sister Ngozi Eze",
    submittedAt: "2025-01-15T10:00:00Z",
    priority: "medium",
  },
  {
    id: "pend-2",
    type: "Prayer Request",
    title: "Urgent prayer needed for visa approval",
    submittedBy: "Brother Emmanuel",
    submittedAt: "2025-01-15T09:30:00Z",
    priority: "high",
  },
  {
    id: "pend-3",
    type: "Event Registration",
    title: "Annual Convention registration for the Okafor family (6 members)",
    submittedBy: "Brother Chinedu Okafor",
    submittedAt: "2025-01-15T08:45:00Z",
    priority: "medium",
  },
  {
    id: "pend-4",
    type: "Sermon",
    title: "\"The Power of Thanksgiving\" - awaiting review",
    submittedBy: "Minister Folake Adeyemi",
    submittedAt: "2025-01-14T16:00:00Z",
    priority: "low",
  },
  {
    id: "pend-5",
    type: "Testimony",
    title: "Testimony of academic breakthrough for daughter",
    submittedBy: "Mrs. Amina Bello",
    submittedAt: "2025-01-14T14:30:00Z",
    priority: "low",
  },
  {
    id: "pend-6",
    type: "Announcement",
    title: "Mid-week Bible Study schedule change notice",
    submittedBy: "Deacon Tunde Bakare",
    submittedAt: "2025-01-14T11:00:00Z",
    priority: "high",
  },
  {
    id: "pend-7",
    type: "Event Registration",
    title: "Youth Conference volunteer sign-up - 8 new volunteers",
    submittedBy: "Youth President David",
    submittedAt: "2025-01-13T17:00:00Z",
    priority: "medium",
  },
  {
    id: "pend-8",
    type: "Prayer Request",
    title: "Prayer for safe delivery expected in February",
    submittedBy: "Sister Mercy John",
    submittedAt: "2025-01-13T15:20:00Z",
    priority: "high",
  },
];