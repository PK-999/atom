import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Scientific Sources & Evidence Library | ATOM",
  description:
    "Explore peer-reviewed scientific literature, UN reports (UNSCEAR, IPCC, UNECE, WHO), IAEA databases, and technical citations that ground ATOM's claims and metrics.",
};

export default function SourcesPage() {
  redirect("/evidence");
}
