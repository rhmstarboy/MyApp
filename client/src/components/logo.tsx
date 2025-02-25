import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
}

const Logo = ({ className }: LogoProps) => {
  return (
    <h1 className={cn("text-2xl font-bold", className)}>
      <span className="text-white">Air</span>
      <span className="text-primary">Dropor</span>
    </h1>
  );
};

export default Logo;
