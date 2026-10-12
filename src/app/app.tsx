import { forwardRef } from "react";
import { ProductionExplorerDashboard } from "features/production-explorer";

const App = forwardRef<HTMLElement>((_, ref) => (
  <main ref={ref} className="min-h-screen bg-slate-950">
    <ProductionExplorerDashboard />
  </main>
));

App.displayName = "App";

export default App;
