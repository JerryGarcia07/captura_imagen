import { Link } from "react-router-dom";
import { Folder } from "lucide-react";

interface OptionCardProps {
  title: string;
  path: string;
}

export default function OptionCard({ title, path }: OptionCardProps) {
  return (
    <Link
      to={path}
      className="flex flex-col items-center justify-center p-6 border-2 border-orange-500 rounded-xl text-gray-700 dark:text-[#FFD8C9] bg-white dark:bg-transparent hover:bg-orange-50 dark:hover:bg-orange-500/10 hover:scale-105 transition-all duration-300 group shadow-sm dark:shadow-none"
    >
      <Folder
        size={64}
        className="mb-4 text-orange-400 dark:text-[#FFD8C9] group-hover:text-orange-500 transition-colors duration-300 fill-current"
      />
      <span className="font-semibold text-lg">{title}</span>
    </Link>
  );
}
