import Image from "next/image";
import { LampDemo } from "src/components/ui/LampDemo"
function Lamp() {
  return <div>This is a Lamp component</div>;
}

export default function Page() {
  return (
    <div>
      {/* Existing content */}
      <header>
       <Lamp />
      </header>

      <main>
        <LampDemo/>
      </main>
      <a>
          Go to nextjs.org →
        </a>
    </div>
  );
}