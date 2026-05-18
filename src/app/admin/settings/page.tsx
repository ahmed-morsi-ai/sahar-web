import { AdminHeader } from "@/components/admin/AdminHeader";

export default function AdminSettingsPage() {
  return (
    <div>
      <AdminHeader title="Settings" copy="Private store settings and operational notes." />
      <div className="rounded-2xl border border-gold/15 bg-white/[0.045] p-6 text-ivory/65 backdrop-blur-2xl">
        <p>Change the WhatsApp number with NEXT_PUBLIC_WHATSAPP_NUMBER.</p>
        <p className="mt-3">Change admin credentials by updating ADMIN_EMAIL and ADMIN_PASSWORD, then running npm run db:seed.</p>
      </div>
    </div>
  );
}
