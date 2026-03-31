"use client";
import RingLoader from "@/components/RingLoader";
import { UserAuth } from "@/lib/AuthContext";
import { UsersPanel } from "@/components/UsersPanel";
import { ModulesPanel } from "@/components/ModulesPanel";
import { ApplicationsPanel } from "@/components/ApplicationsPanel";
import UnAuthorized from "@/components/UnAuthorized";
import { ExaminationsPanel } from "@/components/ExaminationsPanel";
import { EntrepreneursPanel } from "@/components/EntrepreneursPanel";

export default function Home() {
  const { userData, logOut } = UserAuth();

  if (!userData) return <RingLoader />;

  if (userData && userData.user_type !== "Admin") return <UnAuthorized />;

  return (
    <div className="container max-w-7xl mx-auto">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-8">
        <UsersPanel />
        <ModulesPanel />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-8 mt-8">
        <ApplicationsPanel />
        <ExaminationsPanel />
      </div>

      <div className="mt-8">
        <EntrepreneursPanel />
      </div>
    </div>
  );
}
