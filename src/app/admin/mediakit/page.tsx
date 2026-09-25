"use client";
import { MediaKitForm } from "@/components/admin/mediakit/MediaKitForm";

// Registro único da collection `mediakit` (cria se não existir).
export default function AdminMediaKitPage() {
  return (
    <div className="container mx-auto px-4 py-8 md:py-10">
      <MediaKitForm />
    </div>
  );
}
