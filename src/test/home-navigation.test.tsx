import { fireEvent, render, screen, within } from "@testing-library/react";
import type { AnchorHTMLAttributes } from "react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@tanstack/react-router", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@tanstack/react-router")>();
  return {
    ...actual,
    Link: ({ to, ...props }: AnchorHTMLAttributes<HTMLAnchorElement> & { to: string }) => (
      <a href={to} {...props} />
    ),
  };
});

import { HomePage } from "@/routes/index";

describe("Home navigation", () => {
  it("shows unnumbered section labels in each language", () => {
    const { container } = render(<HomePage />);
    const labels = () => Array.from(container.querySelectorAll(".section-marker > span"), (label) => label.textContent);

    expect(labels()).toEqual(["जनतेचा प्रतिनिधी", "लोकहिताचे कार्य", "पुढचे पाऊल", "तुमचा आवाज महत्त्वाचा", "जोडलेले राहा"]);
    fireEvent.click(screen.getByRole("button", { name: "हिंदी" }));
    expect(labels()).toEqual(["जनता के प्रतिनिधि", "जनहित का काम", "अगला कदम", "आपकी आवाज़ अहम है", "जुड़े रहें"]);
    fireEvent.click(screen.getByRole("button", { name: "English" }));
    expect(labels()).toEqual(["A people's representative", "Work for the people", "The next step", "Your voice matters", "Stay connected"]);
  });

  it("shows the page 02 title in the selected language", () => {
    render(<HomePage />);
    expect(screen.getByRole("heading", { name: "एकजुटीतून घडवूया आपले भविष्य" })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "हिंदी" }));
    expect(screen.getByRole("heading", { name: "एकजुट होकर संवारें अपना भविष्य" })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "English" }));
    expect(screen.getByRole("heading", { name: "Together, we shape our future" })).toBeInTheDocument();
  });

  it("links Grievances between Careers and Connect to the page 05 form", () => {
    const { container } = render(<HomePage />);
    const navigation = screen.getByRole("navigation", { name: "मुख्य नेव्हिगेशन" });
    const contact = container.querySelector("#contact");
    if (!(contact instanceof HTMLElement)) throw new Error("Grievance section not found");
    expect(within(contact).getByText("तुमचा आवाज महत्त्वाचा")).toBeInTheDocument();
    expect(within(contact).getByRole("heading", { name: "तुमची अडचण सांगा" })).toBeInTheDocument();
    expect(within(navigation).getByRole("link", { name: "तक्रारी" })).toHaveAttribute("href", "#contact");

    fireEvent.click(screen.getByRole("button", { name: "हिंदी" }));
    expect(within(navigation).getByRole("link", { name: "शिकायतें" })).toHaveAttribute("href", "#contact");

    fireEvent.click(screen.getByRole("button", { name: "English" }));
    const links = within(navigation).getAllByRole("link").map((link) => link.textContent);
    expect(links.indexOf("Grievances")).toBe(links.indexOf("Careers") + 1);
    expect(links.indexOf("Connect")).toBe(links.indexOf("Grievances") + 1);
    const grievances = within(navigation).getByRole("link", { name: "Grievances" });
    expect(grievances).toHaveAttribute("href", "#contact");

    const menuButton = screen.getByRole("button", { name: "Open navigation" });
    fireEvent.click(menuButton);
    expect(menuButton).toHaveAttribute("aria-expanded", "true");
    fireEvent.click(grievances);
    expect(menuButton).toHaveAttribute("aria-expanded", "false");
  });

  it("links Connect to the social section in each language", () => {
    const { container } = render(<HomePage />);
    const navigation = screen.getByRole("navigation", { name: "मुख्य नेव्हिगेशन" });
    const social = container.querySelector("#social");
    if (!(social instanceof HTMLElement)) throw new Error("Social section not found");
    expect(within(social).getByRole("link", { name: /फेसबुक/ })).toHaveAttribute(
      "href",
      "https://www.facebook.com/omprakashrajenimbalkar",
    );
    expect(within(social).getByRole("link", { name: /व्हॉट्सॲप/ })).toBeInTheDocument();
    expect(within(social).getByRole("link", { name: /इन्स्टाग्राम/ })).toBeInTheDocument();
    expect(within(navigation).getByRole("link", { name: "जोडलेले राहा" })).toHaveAttribute("href", "#social");

    fireEvent.click(screen.getByRole("button", { name: "हिंदी" }));
    expect(within(navigation).getByRole("link", { name: "जुड़ें" })).toHaveAttribute("href", "#social");

    fireEvent.click(screen.getByRole("button", { name: "English" }));
    expect(within(navigation).getByRole("link", { name: "Connect" })).toHaveAttribute("href", "#social");
  });
});
