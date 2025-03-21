import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}


// tsconfig.json content for reference
const tsconfig = {
  compilerOptions: {
    baseUrl: "./",
    paths: {
      "@/*": ["src/*"]
    }
    // other options
  }
};