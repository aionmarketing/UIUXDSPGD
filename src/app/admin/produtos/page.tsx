import type { Metadata } from "next";
import { SellerProductUploadView } from "@/features/seller-pwa";

export const metadata: Metadata = {
  title: "Upload & Cadastro de Peças // Seller PWA | Desapegado",
  description:
    "Interface móvel de alta performance para cadastro e processamento de fotos de streetwear de luxo para curadoria.",
};

export default function AdminProdutosPage() {
  return <SellerProductUploadView />;
}
