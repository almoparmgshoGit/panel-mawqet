import { PALETTE_GRADIENT, type DonationPalette } from "@/lib/types";

interface Props {
  titleAr: string;
  orgAr: string;
  imageUrl?: string | null;
  palette: DonationPalette;
}

export function DonationCardPreview({
  titleAr,
  orgAr,
  imageUrl,
  palette,
}: Props) {
  return (
    <div
      className="relative w-full h-44 rounded-2xl overflow-hidden text-white shadow-lg"
      style={{ background: PALETTE_GRADIENT[palette] }}
    >
      {imageUrl && (
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `url(${imageUrl})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
      )}
      <div className="relative h-full p-5 flex flex-col justify-end">
        <div className="text-xs opacity-80 mb-1">{orgAr}</div>
        <div className="text-xl font-bold leading-tight">{titleAr}</div>
      </div>
    </div>
  );
}
