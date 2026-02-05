import React from "react";
import ReactDOM from "react-dom/client";
import HeroSection, { HeroSectionProps } from "./components/HeroSection";
import "./index.css";

// Define the custom element
class HeroSectionElement extends HTMLElement {
  private root: ReactDOM.Root | null = null;
  private mountPoint: HTMLDivElement | null = null;

  static get observedAttributes() {
    return ["title", "subtitle", "description", "image-src", "image-alt"];
  }

  connectedCallback() {
    // Create shadow DOM for style encapsulation
    const shadow = this.attachShadow({ mode: "open" });

    // Add styles to shadow DOM
    const styleLink = document.createElement("link");
    styleLink.rel = "stylesheet";
    styleLink.href = new URL("./index.css", import.meta.url).href;
    shadow.appendChild(styleLink);

    // Create mount point
    this.mountPoint = document.createElement("div");
    shadow.appendChild(this.mountPoint);

    // Render React component
    this.root = ReactDOM.createRoot(this.mountPoint);
    this.render();
  }

  disconnectedCallback() {
    if (this.root) {
      this.root.unmount();
    }
  }

  attributeChangedCallback() {
    this.render();
  }

  private render() {
    if (!this.root) return;

    const props: HeroSectionProps = {
      title: this.getAttribute("title") || undefined,
      subtitle: this.getAttribute("subtitle") || undefined,
      description: this.getAttribute("description") || undefined,
      imageSrc: this.getAttribute("image-src") || undefined,
      imageAlt: this.getAttribute("image-alt") || undefined,
    };

    this.root.render(
      <React.StrictMode>
        <HeroSection {...props} />
      </React.StrictMode>
    );
  }
}

// Register the custom element
if (!customElements.get("hero-section")) {
  customElements.define("hero-section", HeroSectionElement);
}

export { HeroSection };
export type { HeroSectionProps };