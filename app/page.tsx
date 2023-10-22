import Image from "next/image";
import { HiThereSection } from "./hi-there-section";
import { TechStack } from "./tech-stack";

export default function Home() {
  return (
    <main>
      <Image
        src="https://avatars.githubusercontent.com/u/8887163?v=4"
        alt="me"
        width={100}
        height={100}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2">
        <HiThereSection />
        {/** move tech stack to showcase page, add something along the lines of "or if you wanna check me out here's the dirt" */}
        <TechStack />
      </div>
    </main>
  );
}
