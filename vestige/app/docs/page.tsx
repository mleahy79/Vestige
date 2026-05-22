"use client";

export default function DocsPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold text-zinc-800">Docs</h1>
        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-[#89648F] rounded-full hover:bg-[#7a5880] transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="6 9 6 2 18 2 18 9" />
            <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
            <rect x="6" y="14" width="12" height="8" />
          </svg>
          Print / Save as PDF
        </button>
      </div>

      <div
        id="printable-content"
        className="prose max-w-none rounded-xl border border-[#c1cdb5]/60 p-8 bg-white"
      >
        <h2 className="text-[#89648F]">Getting Started</h2>
        <p className="text-zinc-600">Add your documentation content here.</p>
      </div>
    </div>
  );
}
