import type { Metadata } from "next";
import { SellerProductUploadView } from "@/features/seller-pwa";

export const metadata: Metadata = {
  title: "Vender Peça // Seller PWA | Desapegado Acervo",
  description:
    "Interface móvel ultrarrápida para upload de fotos da câmera, catalogação e envio de peças de streetwear e luxo para curadoria.",
};

export default function AddClothesPage() {
  return <SellerProductUploadView />;
}
