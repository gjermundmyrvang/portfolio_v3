import { AppInfo } from "../types/app-types";
import AppCard from "./appcard";
import CustomMarquee from "./custom-marquee";

interface AppProps {
  appEntries: AppInfo[];
}

export default function Apps({ appEntries }: AppProps) {
  return (
    <section className="py-8 w-full mx-auto px-4">
      <CustomMarquee speed={20} className="h-50 py-8">
        {appEntries.map((app) => (
          <AppCard key={app.name} app={app} />
        ))}
      </CustomMarquee>
    </section>
  );
}
