import { useRef } from "react";
import { Camera, ImagePlus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/i18n";
import type { ImageMeta } from "@/types/emergency";

interface Props {
  value: ImageMeta | null;
  onChange: (value: ImageMeta | null) => void;
}

export function ImageCapture({ value, onChange }: Props) {
  const { t } = useI18n();
  const uploadRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File | undefined, source: "upload" | "camera") => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      onChange({
        filename: file.name,
        content_type: file.type,
        size_bytes: file.size,
        source,
        data_url: typeof reader.result === "string" ? reader.result : null,
      });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <ImagePlus className="h-4 w-4 text-primary" />
        <span className="text-sm font-semibold">{t.emergency.imageLabel}</span>
      </div>

      <input
        ref={uploadRef}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={(e) => handleFile(e.target.files?.[0], "upload")}
      />
      <input
        ref={cameraRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="sr-only"
        onChange={(e) => handleFile(e.target.files?.[0], "camera")}
      />

      {value ? (
        <div className="relative overflow-hidden rounded-lg border">
          {value.data_url ? (
            <img
              src={value.data_url}
              alt={t.emergency.imageSelected}
              className="max-h-56 w-full object-cover"
            />
          ) : (
            <div className="flex h-28 items-center justify-center bg-muted/40 text-muted-foreground">
              <ImagePlus className="h-8 w-8" />
            </div>
          )}
          <button
            type="button"
            onClick={() => onChange(null)}
            aria-label={t.emergency.imageRemove}
            className="absolute end-2 top-2 grid h-8 w-8 place-items-center rounded-full bg-background/90 text-foreground shadow-soft backdrop-blur transition-colors hover:bg-background"
          >
            <X className="h-4 w-4" />
          </button>
          <div className="absolute inset-x-0 bottom-0 truncate bg-gradient-to-t from-black/60 to-transparent px-3 py-2 text-xs font-medium text-white">
            {value.filename ?? t.emergency.imageSelected}
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button
            type="button"
            variant="outline"
            size="md"
            onClick={() => uploadRef.current?.click()}
            className="flex-1"
          >
            <ImagePlus className="h-4 w-4" />
            {t.emergency.imageUpload}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="md"
            onClick={() => cameraRef.current?.click()}
            className="flex-1"
          >
            <Camera className="h-4 w-4" />
            {t.emergency.imageCapture}
          </Button>
        </div>
      )}

      <p className="text-xs text-muted-foreground">{t.emergency.imageHint}</p>
    </div>
  );
}
