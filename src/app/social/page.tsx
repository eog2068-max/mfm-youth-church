import type { Metadata } from "next";
import { SocialLandingPage } from "@/components/social/social-landing";

export const metadata: Metadata = {
  title: "YouthConnect",
  description:
    "Connect with your church family. Pray together, encourage one another, and grow in faith. Connect. Pray. Encourage. Grow. Together.",
};

export default function SocialPage() {
  return <SocialLandingPage />;
}
