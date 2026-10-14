import { forwardRef } from "react";

const ProductionMapLegend = forwardRef<HTMLDivElement>((_, ref) => (
  <div
    ref={ref}
    aria-label="Production map legend"
    className="flex items-center gap-2 text-xs text-text-secondary"
  >
    <span className="h-3 w-3 rounded-sm bg-map-no-data" />
    No data
    <span className="h-3 w-3 rounded-sm bg-map-low" />
    Lower production
    <span className="h-3 w-3 rounded-sm bg-map-high" />
    Higher production
    <span className="h-3 w-3 rounded-sm bg-map-selection" />
    Selected country
  </div>
));

ProductionMapLegend.displayName = "ProductionMapLegend";

export { ProductionMapLegend };
