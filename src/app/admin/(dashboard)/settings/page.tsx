import { Save } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Settings | Admin" };

export default function AdminSettingsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold font-heading mb-6">Store Settings</h1>

      <div className="space-y-6 max-w-2xl">
        {/* General */}
        <div className="bg-white rounded-xl border border-[var(--color-border)] p-6">
          <h2 className="font-bold mb-4">General</h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1.5 block">Store Name</label>
              <input type="text" className="input" defaultValue="PrintMacha" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Tagline</label>
              <input type="text" className="input" defaultValue="Premium 3D Printed Art & Decor" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1.5 block">Store Email</label>
                <input type="email" className="input" defaultValue="hello@printmacha.com" />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Store Phone</label>
                <input type="tel" className="input" defaultValue="+91 98765 43210" />
              </div>
            </div>
          </div>
        </div>

        {/* Shipping */}
        <div className="bg-white rounded-xl border border-[var(--color-border)] p-6">
          <h2 className="font-bold mb-4">Shipping</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1.5 block">Free Shipping Above (₹)</label>
                <input type="number" className="input" defaultValue="999" />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Flat Shipping Rate (₹)</label>
                <input type="number" className="input" defaultValue="99" />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">COD Fee (₹)</label>
                <input type="number" className="input" defaultValue="49" />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">GST Rate (%)</label>
                <input type="number" className="input" defaultValue="18" />
              </div>
            </div>
          </div>
        </div>

        {/* WhatsApp */}
        <div className="bg-white rounded-xl border border-[var(--color-border)] p-6">
          <h2 className="font-bold mb-4">WhatsApp Support</h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1.5 block">WhatsApp Number (with country code)</label>
              <input type="text" className="input" defaultValue="919876543210" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Default Message</label>
              <input type="text" className="input" defaultValue="Hi PrintMacha! I have a question about your products." />
            </div>
          </div>
        </div>

        {/* Social */}
        <div className="bg-white rounded-xl border border-[var(--color-border)] p-6">
          <h2 className="font-bold mb-4">Social Links</h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1.5 block">Instagram URL</label>
              <input type="url" className="input" defaultValue="https://instagram.com/printmacha" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Facebook URL</label>
              <input type="url" className="input" placeholder="https://facebook.com/..." />
            </div>
          </div>
        </div>

        {/* Return Policy */}
        <div className="bg-white rounded-xl border border-[var(--color-border)] p-6">
          <h2 className="font-bold mb-4">Return Policy</h2>
          <div>
            <label className="text-sm font-medium mb-1.5 block">Return Window (days)</label>
            <input type="number" className="input" defaultValue="7" />
          </div>
        </div>

        <button className="btn btn-primary"><Save className="w-4 h-4" /> Save Settings</button>
      </div>
    </div>
  );
}
