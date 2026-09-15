import { useState } from "react";
import { card } from "./shared";
import data from "@/data/portfolio.json";
import { ArrowLeft, ExternalLink } from "lucide-react";

export function CertificatesPanel() {
  const [selectedCert, setSelectedCert] = useState<typeof data.certificates[0] | null>(null);

  if (selectedCert) {
    return (
      <div className="font-mono text-emerald-400/90 text-sm h-full flex flex-col">
        <button
          onClick={() => setSelectedCert(null)}
          className="mb-4 inline-flex items-center gap-2 text-emerald-500 hover:text-emerald-300 transition-colors w-fit"
        >
          <ArrowLeft className="h-4 w-4" /> Back to list
        </button>
        <div className="border border-emerald-500/30 bg-black/80 rounded-lg p-6 flex-1 overflow-y-auto">
          <div className="flex justify-between border-b border-emerald-500/30 pb-2 mb-6">
            <span>CERT({selectedCert.date})</span>
            <span className="hidden sm:inline">User Credentials</span>
            <span>CERT({selectedCert.date})</span>
          </div>
          <div className="space-y-6">
            <div>
              <h4 className="font-bold text-emerald-300">NAME</h4>
              <p className="pl-4 sm:pl-8 mt-1 text-white">{selectedCert.title}</p>
            </div>
            <div>
              <h4 className="font-bold text-emerald-300">ISSUER</h4>
              <p className="pl-4 sm:pl-8 mt-1 text-white/80">{selectedCert.issuer}</p>
            </div>
            {selectedCert.skills && selectedCert.skills.length > 0 && (
              <div>
                <h4 className="font-bold text-emerald-300">SKILLS</h4>
                <div className="pl-4 sm:pl-8 mt-2 flex flex-wrap gap-2">
                  {selectedCert.skills.map(s => (
                    <span key={s} className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded text-xs text-emerald-400">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}
            <div>
              <h4 className="font-bold text-emerald-300">DESCRIPTION</h4>
              <p className="pl-4 sm:pl-8 mt-1 text-emerald-400/70">{selectedCert.detail}</p>
            </div>
            {selectedCert.image && (
              <div>
                <h4 className="font-bold text-emerald-300">CREDENTIAL_FILE</h4>
                <div className="pl-4 sm:pl-8 mt-2">
                  <a href={selectedCert.image} target="_blank" rel="noreferrer" className="block overflow-hidden rounded border border-emerald-500/30 hover:border-emerald-400 transition-colors group relative">
                    <img 
                      src={selectedCert.image} 
                      alt={selectedCert.title} 
                      className="w-full h-auto max-h-48 object-cover opacity-80 group-hover:opacity-100 transition-opacity bg-black" 
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        const parent = e.currentTarget.parentElement as HTMLAnchorElement;
                        if (parent) {
                          parent.removeAttribute('href');
                          parent.removeAttribute('target');
                          parent.classList.remove('hover:border-emerald-400');
                          parent.classList.add('p-4', 'flex', 'items-center', 'justify-center', 'bg-emerald-950/30', 'cursor-not-allowed', 'border-emerald-500/10');
                          
                          const overlay = parent.querySelector('.absolute');
                          if (overlay) (overlay as HTMLElement).style.display = 'none';
                          
                          if (!parent.querySelector('.fallback-text')) {
                            const span = document.createElement('span');
                            span.innerText = "Not yet uploaded";
                            span.className = "fallback-text flex items-center gap-2 text-emerald-500/40 text-xs uppercase tracking-widest";
                            parent.appendChild(span);
                          }
                        }
                      }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/50 transition-opacity">
                      <span className="flex items-center gap-2 bg-emerald-500/20 text-emerald-300 px-3 py-1.5 rounded backdrop-blur-sm border border-emerald-500/30">
                        <ExternalLink size={16} /> Open Full Size
                      </span>
                    </div>
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {data.certificates.map((c) => (
        <button
          key={c.title}
          onClick={() => setSelectedCert(c)}
          className={`${card} group grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4 w-full text-left transition-all hover:-translate-y-0.5 hover:border-emerald-500/30 hover:bg-white/10`}
        >
          <div className="min-w-0">
            <h3 className="truncate text-sm font-semibold text-white group-hover:text-emerald-400 transition-colors">{c.title}</h3>
            <p className="text-xs text-white/55">{c.issuer}</p>
            <p className="mt-1 text-sm text-white/50">{c.detail}</p>
          </div>
          <span className="shrink-0 font-mono text-xs text-emerald-300/80">{c.date}</span>
        </button>
      ))}
    </div>
  );
}
