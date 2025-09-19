// Make sure the file exists at this path, or update the path if necessary.
import { AlertPanel } from "../../components/admin/AlertPanel";
import { MapView } from "../../components/admin/MapView";
import { SidePanel } from "../../components/admin/SidePanel";
import { Navigation } from "../../components/admin/Navigation";

export function AdminDashboard() {
  return (
    <div className="min-h-screen">
      <Navigation activeTab="dashboard" onTabChange={() => {}} />
      <div className="flex">
        <SidePanel onClose={() => {}} location={null} />
        <main className="flex-1 p-6 pt-20">
          <AlertPanel onAlertSelect={() => {}} />
          <MapView onLocationSelect={() => {}} />
        </main>
      </div>
    </div>
  );
}