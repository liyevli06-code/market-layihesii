import { PrismaHero } from "@/components/ui/prisma-hero";
import LatestMaterials from "@/components/latest-materials";

export default function Home() {
  return (
    <main>
      <PrismaHero />
      <LatestMaterials />
    </main>
  );
}
