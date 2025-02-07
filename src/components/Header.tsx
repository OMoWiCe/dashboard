import { useState } from "react";
import { Button } from "@mui/material";
import { X } from "lucide-react";

export default function Header() {
  const [showDisclaimer, setShowDisclaimer] = useState(false);

  return (
    <header className="flex justify-between items-center p-4 shadow-md bg-gray-800">
      <img src="/logo.png" alt="Logo" className="h-10" />
      <div>
        <Button onClick={() => setShowDisclaimer(true)}>Disclaimer</Button>
        <Button
          onClick={() => window.open("https://documentation.link", "_blank")}
        >
          Docs
        </Button>
      </div>

      {/* Disclaimer Popup */}
      {showDisclaimer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-lg w-full relative">
            <button
              className="absolute top-2 right-2 text-white"
              onClick={() => setShowDisclaimer(false)}
            >
              <X />
            </button>
            <h2 className="text-2xl font-bold mb-4">Ethical Concerns</h2>
            <p>
              Our research adheres to strict ethical guidelines to ensure the
              privacy and security of all data collected. We prioritize
              transparency, consent, and the responsible use of information in
              all our projects.
            </p>
            <Button className="mt-4" onClick={() => setShowDisclaimer(false)}>
              Close
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
