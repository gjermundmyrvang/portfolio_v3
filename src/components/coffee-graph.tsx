import { getCoffees } from "../lib/coffees";
import ContributionGraphWrapper from "./graph-wrapper";

const coffeePalette = [
  "bg-neutral-100 dark:bg-transparent border border-neutral-200 dark:border-neutral-700",
  "bg-red-900",
  "bg-red-700",
  "bg-red-500",
  "bg-red-300",
];

export default async function CoffeeGraph() {
  const data = await getCoffees();

  return (
    <ContributionGraphWrapper
      weeks={data.weeks}
      palette={coffeePalette}
      total={data.totalContributions ?? 0}
      title="Coffee Activity"
      totalLabel="coffees total"
      since={data.since}
      label="coffees"
    />
  );
}
