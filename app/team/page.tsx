import type { Metadata } from "next";

import TeamTabs from "@/components/TeamTabs";
import { Crumb } from "@/components/ui";

export const metadata: Metadata = {
  title: "Our Team — Piyushwani OPC Pvt. Ltd.",
  description:
    "The people behind Piyushwani — our team, and the medical professionals we work with.",
};

export default function TeamPage() {
  return (
    <>
      <section className="sect sect--card">
        <div className="wrap">
          <Crumb>Team</Crumb>
          <div className="lab">People</div>
          <h1 className="h-xl" style={{ margin: "14px 0 18px" }}>
            Our Team
          </h1>
          <p className="lede">
            The people behind Piyushwani — our team, and the medical
            professionals we work with.
          </p>
        </div>
      </section>

      <section className="sect sect--paper">
        <div className="wrap">
          <TeamTabs />
        </div>
      </section>
    </>
  );
}
