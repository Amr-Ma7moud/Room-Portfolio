import { motion } from "framer-motion";
import { User, Code2, GraduationCap, Server, Terminal, Settings } from "lucide-react";
import data from "@/data/portfolio.json";
import { card } from "./shared";

// Eagerly load all image assets so we can resolve dynamic avatar filenames
const avatars = import.meta.glob<{ default: string }>(
  "../../../assets/*.{jpg,jpeg,png,webp,avif}",
  { eager: true }
);

function getAvatarUrl(filename: string | undefined) {
  if (!filename) return undefined;
  const match = Object.keys(avatars).find((key) => key.endsWith(`/${filename}`));
  return match ? avatars[match]?.default : undefined;
}

export function AboutPanel() {
  const { about } = data as any; // We'll add this to the JSON
  const avatarUrl = getAvatarUrl(about?.avatar);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex h-full flex-col gap-6 p-6"
    >
      <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={data.profile.name}
            className="h-20 w-20 shrink-0 rounded-full object-cover border border-emerald-500/30 bg-emerald-500/10"
          />
        ) : (
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
            <User className="h-10 w-10" />
          </div>
        )}
        <div>
          <h2 className="text-2xl font-bold text-white tracking-wider">{data.profile.name}</h2>
          <p className="text-emerald-400 font-mono text-sm mt-1">{data.profile.role}</p>
        </div>
      </div>

      <div className={card}>
        <div className="flex flex-col gap-2">
          <p className="text-white/80 leading-relaxed text-sm md:text-base">
            {about?.bio || data.resume.summary}
          </p>
        </div>
      </div>

      {about?.interests && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 mt-2">
          {about.interests.map((interest: any, i: number) => {
            const iconMap: Record<string, any> = { Code2, Server, GraduationCap, Terminal, Settings };
            const Icon = iconMap[interest.icon] || GraduationCap;
            return (
              <div key={i} className="flex items-center gap-3 rounded-lg border border-white/5 bg-white/5 p-3">
                <Icon className="h-5 w-5 text-emerald-400" />
                <span className="text-sm text-white/90">{interest.label}</span>
              </div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}
