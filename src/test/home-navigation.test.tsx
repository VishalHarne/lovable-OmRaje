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
  it("shows the exact Marathi landing artwork before the existing site in every language", () => {
    const { container } = render(<HomePage />);
    const cover = container.querySelector(".landing-cover");
    const header = container.querySelector(".site-header");
    if (!(cover instanceof HTMLElement) || !(header instanceof HTMLElement)) {
      throw new Error("Landing cover or sticky header not found");
    }
    expect(cover.compareDocumentPosition(header) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(within(cover).getByRole("img", { name: /अडचणी अनेक, उपाय एक!/ })).toBeInTheDocument();
    expect(cover.querySelector(".landing-cover-copy")).toBeNull();

    for (const language of ["हिंदी", "English"]) {
      fireEvent.click(screen.getByRole("button", { name: language }));
      expect(within(cover).getByRole("img", { name: /अडचणी अनेक, उपाय एक!/ })).toBeInTheDocument();
    }
  });

  it("reveals the fixed header after the visitor starts scrolling", () => {
    const originalScrollY = Object.getOwnPropertyDescriptor(window, "scrollY");
    try {
      Object.defineProperty(window, "scrollY", { configurable: true, value: 0 });
      const { container } = render(<HomePage />);
      const header = container.querySelector(".site-header");
      if (!(header instanceof HTMLElement)) throw new Error("Site header not found");
      expect(header).not.toHaveClass("is-visible");

      Object.defineProperty(window, "scrollY", { configurable: true, value: 40 });
      fireEvent.scroll(window);
      expect(header).toHaveClass("is-visible");
    } finally {
      if (originalScrollY) Object.defineProperty(window, "scrollY", originalScrollY);
    }
  });

  it("shows concise social platform labels in each language", () => {
    render(<HomePage />);
    const versions = [
      { language: null, facebook: "फेसबुक", instagram: "इन्स्टाग्राम" },
      { language: "हिंदी", facebook: "फ़ेसबुक", instagram: "इंस्टाग्राम" },
      { language: "English", facebook: "Facebook", instagram: "Instagram" },
    ];

    for (const version of versions) {
      if (version.language) fireEvent.click(screen.getByRole("button", { name: version.language }));
      expect(screen.getByText(version.facebook, { selector: "strong" }).closest("a"))
        .toHaveAttribute("href", "https://www.facebook.com/omprakashrajenimbalkar");
      expect(screen.getByText(version.instagram, { selector: "strong" }).closest("a"))
        .toHaveAttribute("href", "https://www.instagram.com/mpomrajenimbalkar/");
    }
  });

  it("shows the field-wall text as one paragraph in each language", () => {
    const { container } = render(<HomePage />);
    const versions = [
      {
        language: null,
        title: "आपली माती, आपली माणसं.",
        paragraphs: [
          "धाराशिवच्या मातीमध्ये एक वेगळाच आपुलकीचा ओलावा आहे. या मातीने आणि इथल्या माणसांनी मला कायम भरभरून प्रेम, विश्वास आणि आशीर्वाद दिले आहेत.",
          "या प्रेमाने आणि विश्वासानेच मला जनसेवेची प्रेरणा दिली आहे. त्यामुळे आपल्या मातीसाठी, आपल्या माणसांसाठी जे जे शक्य आहे, ते करण्यासाठी मी सदैव प्रयत्नशील राहिलो आहे आणि यापुढेही राहीन.",
          "या मातीचे आणि इथल्या प्रत्येक माणसाचे ऋण मी कायम मानत आलो आहे आणि आयुष्यभर मानत राहीन.",
          "आपली माती, आपली माणसं — हेच माझं बळ, हीच माझी प्रेरणा आणि हीच माझी ओळख.",
        ],
      },
      {
        language: "हिंदी",
        title: "अपनी मिट्टी, अपने लोग",
        paragraphs: [
          "धाराशिव की मिट्टी में अपनापन और आत्मीयता की एक अनोखी खुशबू है। इस मिट्टी और यहाँ के लोगों ने मुझे हमेशा भरपूर प्यार, विश्वास और आशीर्वाद दिया है।",
          "इसी प्यार और विश्वास ने मुझे जनसेवा के लिए निरंतर प्रेरित किया है। इसलिए अपनी मिट्टी और अपने लोगों के लिए जो भी संभव है, उसे करने के लिए मैं हमेशा प्रयासरत रहा हूँ और आगे भी रहूँगा।",
          "इस मिट्टी और यहाँ के हर व्यक्ति के प्रति मैं हमेशा ऋणी रहा हूँ और जीवनभर रहूँगा।",
          "अपनी मिट्टी, अपने लोग — यही मेरी ताकत, यही मेरी प्रेरणा और यही मेरी पहचान है।",
        ],
      },
      {
        language: "English",
        title: "Our Land, Our People",
        paragraphs: [
          "There is a unique warmth and sense of belonging in the soil of Dharashiv. The land and its people have always showered me with immense love, trust, and blessings.",
          "This love and trust have been my constant inspiration to serve. I have always strived to do everything possible for our land and our people, and I will continue to do so with unwavering dedication.",
          "I have always felt indebted to this land and every person who calls it home, and I will remain so throughout my life.",
          "Our Land, Our People — our strength, our inspiration, and our identity.",
        ],
      },
    ];
    for (const version of versions) {
      if (version.language) fireEvent.click(screen.getByRole("button", { name: version.language }));
      expect(screen.getByRole("heading", { name: version.title })).toBeInTheDocument();
      const copy = container.querySelectorAll("p.field-wall-copy");
      expect(copy).toHaveLength(1);
      expect(copy[0]).toHaveTextContent(version.paragraphs.join(" "));
      expect(container.querySelectorAll(".field-wall-grid figure")).toHaveLength(7);
      expect(copy[0].closest(".field-wall-card")).toContainElement(container.querySelector(".field-wall-grid"));
    }
  });

  it("shows the requested homepage copy in each language", () => {
    const { container } = render(<HomePage />);
    const navigation = screen.getByRole("navigation", { name: "मुख्य नेव्हिगेशन" });
    const versions = [
      {
        language: null,
        nav: "जनसेवा",
        connect: "कनेक्ट",
        media: "मीडिया",
        hero: "अडचणी अनेक, उपाय एक… तुमचा ओम राजे!",
        subtext: "विश्वास जनतेचा, संकल्प विकासाचा",
        lead: "आपला जीव, धाराशिव.",
        year2009: "महाराष्ट्र विधानसभेचे आमदार म्हणून निवड",
        year2019: "धाराशिव मतदारसंघातून १७व्या लोकसभेवर निवड.",
        work: "माझा ठाम विश्वास आहे की कोणतेही कार्य हे एकट्याने नव्हे, तर टीमवर्क आणि सामूहिक प्रयत्नांतून यशस्वी होत असते. याच विचाराने मी सदैव कार्यरत आहे. चला, आपण सर्वजण एकत्र येऊन, एकजुटीने वाटचाल करूया आणि आपल्या जनतेचे उज्ज्वल भविष्य घडवूया.",
        gallery: "जनतेच्या मनात, जनतेच्या सोबत",
        careers: "स्वप्नांना संधी, भविष्याची दिशा.",
        contact: "हाक तुमची, साथ आमची.",
      },
      {
        language: "हिंदी",
        nav: "जनकार्य",
        connect: "कनेक्ट",
        media: "मीडिया",
        hero: "समस्याएँ अनेक, समाधान एक… आपका अपना ओम राजे!",
        subtext: "विश्वास जनता का, संकल्प विकास का।",
        lead: "अपना जीवन, धाराशिव।",
        year2009: "महाराष्ट्र विधानसभा विधायक के रूप में निर्वाचित",
        year2019: "धाराशिव से १७वीं लोकसभा के लिए निर्वाचित।",
        work: "मेरा दृढ़ विश्वास है कि सामूहिक प्रयास और टीमवर्क से ही हर कार्य सफल होता है। इसी सोच के साथ मैं निरंतर कार्यरत हूँ। आइए, हम सब मिलकर आगे बढ़ें और अपने लोगों का उज्ज्वल भविष्य बनाएँ।",
        gallery: "जनता के दिल में, जनता के साथ",
        careers: "सपनों को अवसर, भविष्य की दिशा।",
        contact: "आपकी पुकार, हमारा साथ।",
      },
      {
        language: "English",
        nav: "Public work",
        connect: "Connect",
        media: "Media",
        hero: "Many Problems, One Solution — Your Om Raje!",
        subtext: "The People's Trust, Our Commitment to Development.",
        lead: "Our life, Dharashiv.",
        year2009: "Elected as a Member of the Maharashtra Legislative Assembly (MLA)",
        year2019: "Elected to the 17th Lok Sabha from Dharashiv.",
        work: "I firmly believe that every endeavour succeeds not through individual efforts alone, but through teamwork and collective commitment. This belief has always been the driving force behind my work. Let us come together, move forward as one, and build a brighter future for our people.",
        gallery: "In the Hearts of the People, By Their Side",
        careers: "Dreams Empowered, Futures Guided.",
        contact: "Your Call, Our Commitment.",
      },
    ];

    for (const version of versions) {
      if (version.language) fireEvent.click(screen.getByRole("button", { name: version.language }));
      expect(within(navigation).getByRole("link", { name: version.nav })).toHaveAttribute("href", "#work");
      expect(within(navigation).getByRole("link", { name: version.connect })).toHaveAttribute("href", "#social");
      expect(within(navigation).getByRole("link", { name: version.media })).toHaveAttribute("href", "/videos");
      expect(screen.getByText(version.hero, { selector: "h1" })).toBeInTheDocument();
      expect(screen.getByText(version.subtext)).toBeInTheDocument();
      expect(screen.getByText(version.lead).tagName).toBe("STRONG");
      expect(screen.getByText(version.year2009)).toBeInTheDocument();
      expect(screen.getByText(version.year2019)).toBeInTheDocument();
      expect(screen.getByText(version.work)).toBeInTheDocument();
      for (const heading of [version.gallery, version.careers, version.contact]) {
        expect(screen.getByText(heading, { selector: "h2" })).toBeInTheDocument();
      }
    }
    expect(container.querySelector(".hero-eyebrow")).toBeNull();
    expect(container.querySelector(".principle-strip")).toBeNull();
    expect(container.querySelector(".impact-band")).toBeNull();
    expect(container.querySelector(".context-note")).toBeNull();
  });

  it("cycles through only the first three public-work posts", () => {
    const { container } = render(<HomePage />);
    const tabs = screen.getAllByRole("tab");
    expect(tabs).toHaveLength(3);
    expect(container.querySelector('[data-post-id="hospital-inauguration"]')).toBeNull();
    fireEvent.click(tabs[2]);
    fireEvent.click(screen.getByRole("button", { name: "पुढील पोस्ट" }));
    expect(tabs[0]).toHaveAttribute("aria-selected", "true");
  });

  it("removes section labels while retaining the main headings", () => {
    const { container } = render(<HomePage />);
    expect(container.querySelector(".section-marker")).toBeNull();
    expect(container.querySelector(".gallery-heading .eyebrow")).toBeNull();
    expect(container.querySelector(".field-wall-head .eyebrow")).toBeNull();
    expect(container.querySelector(".initiative-label")).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "English" }));
    expect(screen.queryByText("A people's representative")).not.toBeInTheDocument();
    expect(screen.queryByText("Work for the people")).not.toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Dharashiv is my home. Its people are my purpose." })).toBeInTheDocument();
  });

  it("shows the page 02 title in the selected language", () => {
    render(<HomePage />);
    expect(screen.getByRole("heading", { name: "एकत्र चालूया, उज्ज्वल भविष्य घडवूया!" })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "हिंदी" }));
    expect(screen.getByRole("heading", { name: "साथ चलें, उज्ज्वल भविष्य बनाएँ!" })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "English" }));
    expect(screen.getByRole("heading", { name: "Let's Walk Together, Let's Build a Brighter Future!" })).toBeInTheDocument();
  });

  it("links Grievances between Careers and Connect to the page 05 form", () => {
    const { container } = render(<HomePage />);
    const navigation = screen.getByRole("navigation", { name: "मुख्य नेव्हिगेशन" });
    const contact = container.querySelector("#contact");
    if (!(contact instanceof HTMLElement)) throw new Error("Grievance section not found");
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
    expect(within(navigation).getByRole("link", { name: "कनेक्ट" })).toHaveAttribute("href", "#social");

    fireEvent.click(screen.getByRole("button", { name: "हिंदी" }));
    expect(within(navigation).getByRole("link", { name: "कनेक्ट" })).toHaveAttribute("href", "#social");

    fireEvent.click(screen.getByRole("button", { name: "English" }));
    expect(within(navigation).getByRole("link", { name: "Connect" })).toHaveAttribute("href", "#social");
  });
});
