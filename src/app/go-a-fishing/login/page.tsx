import type { Metadata } from "next";
import { PageBanner } from "@/components/layout/page-banner";
import { GafLogin } from "@/components/gaf/gaf-login";

export const metadata: Metadata = {
  title: "Sign In | Go-A-Fishing",
  description: "Sign in to your Go-A-Fishing member account.",
};

export default async function GafLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; message?: string }>;
}) {
  const { error, message } = await searchParams;
  return (
    <>
      <PageBanner
        title="Member Sign In"
        subtitle="Sign in to access your Go-A-Fishing dashboard"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Go-A-Fishing", href: "/go-a-fishing" },
          { label: "Sign In" },
        ]}
      />
      <GafLogin error={error} message={message} />
    </>
  );
}
