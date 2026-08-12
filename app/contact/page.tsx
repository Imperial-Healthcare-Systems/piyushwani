import type { Metadata } from "next";

import RfqForm from "@/components/RfqForm";
import { Crumb, Media, Rrow } from "@/components/ui";

export const metadata: Metadata = {
  title: "Contact Us — Piyushwani OPC Pvt. Ltd.",
  description:
    "Product enquiries, bulk orders, distribution partnerships, or something that needs a person.",
};

export default function ContactPage() {
  return (
    <>
      <section className="sect sect--card">
        <div className="wrap">
          <Crumb>Contact</Crumb>
          <div className="lab">Get in touch</div>
          <h1 className="h-xl" style={{ margin: "14px 0 18px" }}>
            Contact Us
          </h1>
          <p className="lede" style={{ marginBottom: 28 }}>
            Product enquiries, bulk orders, distribution partnerships, or
            something that needs a person.
          </p>
          <Media
            img="contact-reception"
            alt="Piyushwani corporate reception with brand signage and greenery"
            className="media--wide"
          />
        </div>
      </section>

      <section className="sect sect--paper">
        <div className="wrap split">
          <RfqForm />

          <div>
            <h2 className="h-md" style={{ marginBottom: 16 }}>
              Contact details
            </h2>

            <Rrow k="Registered office" first>
              <p>
                Office No. 4, Ground Floor, D-248/10,
                <br />
                Abhishek Business Centre, Laxmi Nagar,
                <br />
                East Delhi, Delhi 110092
              </p>
            </Rrow>
            <Rrow k="Branch office">
              <p>
                Office No. 172–173, 1st Floor, D-248/10,
                <br />
                Balaji Business Centre, Laxmi Nagar,
                <br />
                East Delhi, Delhi 110092
              </p>
            </Rrow>
            <Rrow k="Phone">
              <p>
                <a href="tel:+918796922237">+91 87969 22237</a>
                <br />
                <span className="muted">
                  Monday to Saturday, 9:30 am – 6:30 pm IST
                </span>
              </p>
            </Rrow>
            <Rrow k="Sales &amp; distribution">
              <p>
                <a href="mailto:sales@piyushwani.com">sales@piyushwani.com</a>
                <br />
                <span className="muted">WhatsApp +91 87969 22237</span>
              </p>
            </Rrow>
            <Rrow k="General email">
              <p>
                <a href="mailto:piyushwani002@gmail.com">
                  piyushwani002@gmail.com
                </a>
              </p>
            </Rrow>
            <Rrow k="Support">
              <p>
                <a href="mailto:support@piyushwani.com">support@piyushwani.com</a>
                <br />
                <span className="muted">+91 87969 22234</span>
              </p>
            </Rrow>
          </div>
        </div>
      </section>
    </>
  );
}
