import { forwardRef } from "react";
import { ProductionExplorerDashboard } from "./dashboard";

const App = forwardRef<HTMLElement>((_, ref) => (
  <main ref={ref} className="min-h-screen bg-canvas">
    <ProductionExplorerDashboard />
  </main>
));

App.displayName = "App";

export { App };
