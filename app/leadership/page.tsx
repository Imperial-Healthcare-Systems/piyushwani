import type { Metadata } from "next";

import { PersonIcon } from "@/components/icons";
import { Crumb, Note, Ph, Rrow } from "@/components/ui";

export const metadata: Metadata = {
  title: "Leadership — Piyushwani OPC Pvt. Ltd.",
  description:
    "Piyushwani OPC Pvt. Ltd. is wholly owned and led by Dr. Shiwani Bansal, BAMS.",
};

export default function LeadershipPage() {
  return (
    <>
      <section className="sect sect--card">
        <div className="wrap">
          <Crumb>Leadership</Crumb>
          <div className="lab">Leadership</div>
          <h1 className="h-xl" style={{ margin: "14px 0 18px" }}>
            Leadership
          </h1>
          <p className="lede">
            Piyushwani OPC Pvt. Ltd. is wholly owned and led by Dr. Shiwani
            Bansal.
          </p>
        </div>
      </section>

      <section className="sect sect--paper">
        <div className="wrap split">
          <div>
            <div className="person" style={{ maxWidth: 330 }}>
              <div className="avatar">
                <PersonIcon />
              </div>
              <div className="person-in">
                <h3>Dr. Shiwani Bansal</h3>
                <div className="role">Founder &amp; Director · BAMS</div>
                <p>
                  <Ph label="photograph — high-resolution professional" />
                </p>
              </div>
            </div>
            <Note style={{ marginTop: 16 }}>
              <strong>Confirmed.</strong> Intake form §4: the Director is{" "}
              <strong>Dr. Shiwani Bansal</strong>; the admin portal account is
              registered as <strong>Shiwani Bansal</strong>. The earlier
              &ldquo;Shivani&rdquo; spelling in the MoM was a transcription error
              and has been corrected throughout.
            </Note>
          </div>

          <div className="body-w">
            <Rrow k="Qualifications" first>
              <p>
                BAMS — Bachelor of Ayurvedic Medicine and Surgery
                <br />
                <span className="muted">
                  <Ph label="institution and year of graduation" />
                </span>
              </p>
            </Rrow>
            <Rrow k="Registration">
              <p>
                <Ph label="medical council registration number, if you wish to publish it" />
              </p>
            </Rrow>
            <Rrow k="Experience">
              <p>
                <Ph label="years and areas of practice" />
              </p>
            </Rrow>
            <Rrow k="Focus areas">
              <p>
                <Ph label="3–5 areas" />
              </p>
            </Rrow>

            <h2 className="h-md" style={{ margin: "30px 0 12px" }}>
              Biography
            </h2>
            <p className="muted" style={{ fontSize: ".9rem" }}>
              To be completed by the client, 250–350 words, in four parts:
            </p>
            <p>
              <strong>Background.</strong>{" "}
              <Ph label="education, clinical training, and where the interest in pharmaceuticals began" />
            </p>
            <p>
              <strong>Path to founding.</strong>{" "}
              <Ph label="practice and professional experience leading to the decision to establish Piyushwani" />
            </p>
            <p>
              <strong>The company today.</strong>{" "}
              <Ph label="role in the business — formulation decisions, manufacturing partner selection, quality standards, clinical oversight" />
            </p>
            <p>
              <strong>Perspective.</strong>{" "}
              <Ph label="what she believes the industry gets wrong and what the company is set up to do differently" />
            </p>

            <Note style={{ marginTop: 22 }}>
              <em>
                &quot;
                <Ph label="one or two sentences, in her own words, on why traceability and documentation matter in this business" />
                &quot;
              </em>
              <br />
              <br />
              <strong>— Dr. Shiwani Bansal, Founder</strong>
            </Note>
          </div>
        </div>
      </section>
    </>
  );
}
