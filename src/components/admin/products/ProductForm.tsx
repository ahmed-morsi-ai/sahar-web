"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import { ArrowLeft, Eye, Save, Sparkles, Upload, X } from "lucide-react";
import type { ProductFormValues } from "@/lib/actions/products";
import { formatPrice } from "@/lib/money";
import { isImagePath, isVideoPath } from "@/lib/media-utils";
import { ProductImagePreview } from "@/components/admin/products/ProductImagePreview";

const productVideoOptions = [
  "/videos/leslyyyn_pindown.io_1778960192.mp4",
  "/videos/products/ombre-mystique.mp4",
  "/videos/products/rose-nocturne.mp4",
  "/videos/products/lumiere-eternelle.mp4",
  "/videos/products/amber-silk.mp4"
];

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function numberOrEmpty(value: string) {
  return value === "" ? "" : Number(value);
}

export function ProductForm({
  mode,
  productId,
  initialValues,
  savedMessage
}: {
  mode: "create" | "edit";
  productId?: string;
  initialValues: ProductFormValues;
  savedMessage?: string;
}) {
  const router = useRouter();
  const [values, setValues] = useState(initialValues);
  const [slugWasEdited, setSlugWasEdited] = useState(mode === "edit");
  const [message, setMessage] = useState(savedMessage ?? "");
  const [error, setError] = useState("");
  const [imageUploadMessage, setImageUploadMessage] = useState("");
  const [imageUploadError, setImageUploadError] = useState("");
  const [uploadedImageFileName, setUploadedImageFileName] = useState("");
  const [videoUploadMessage, setVideoUploadMessage] = useState("");
  const [videoUploadError, setVideoUploadError] = useState("");
  const [uploadedVideoFileName, setUploadedVideoFileName] = useState("");
  const [savedSlug, setSavedSlug] = useState(mode === "edit" ? initialValues.slug : "");
  const [isPending, startTransition] = useTransition();
  const [isImageUploading, startImageUploadTransition] = useTransition();
  const [isVideoUploading, startVideoUploadTransition] = useTransition();
  const isUploading = isImageUploading || isVideoUploading;

  const previewHref = useMemo(() => (savedSlug ? `/product/${savedSlug}` : ""), [savedSlug]);
  const profitPerItem = values.price - values.costPrice;
  const profitMargin = values.price > 0 ? Math.round((profitPerItem / values.price) * 100) : 0;

  function setText<K extends keyof ProductFormValues>(key: K, value: ProductFormValues[K]) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  function updateName(name: string) {
    setValues((current) => ({
      ...current,
      name,
      slug: slugWasEdited ? current.slug : slugify(name)
    }));
  }

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");

    if (values.image && !isImagePath(values.image)) {
      setError("Main image must be an image path. Put MP4 files in the video field.");
      return;
    }

    if (values.video && !isVideoPath(values.video)) {
      setError("Video path must be an MP4 file.");
      return;
    }

    startTransition(async () => {
      try {
        const payload = { ...values, slug: values.slug || slugify(values.name) };
        const response = await fetch(mode === "create" ? "/api/admin/products" : `/api/admin/products/${productId}`, {
          method: mode === "create" ? "POST" : "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        const result = (await response.json().catch(() => null)) as {
          error?: string;
          product?: { id: string; slug: string };
        } | null;

        if (!response.ok || !result?.product) {
          setError(result?.error ?? "Could not save product.");
          return;
        }

        setSavedSlug(result.product.slug);
        setValues((current) => ({ ...current, slug: result.product?.slug ?? current.slug }));

        if (mode === "create") {
          router.push(`/admin/products/${result.product.id}/edit?saved=created`);
          return;
        }

        setMessage("Product saved.");
        router.refresh();
      } catch {
        setError("Network error. Check the dev server and try again.");
      }
    });
  }

  function uploadProductImage(file: File | null) {
    setImageUploadError("");
    setImageUploadMessage("");
    setUploadedImageFileName("");

    if (!file) return;

    const allowedTypes = ["image/png", "image/jpeg", "image/webp", "image/jpg"];
    if (!allowedTypes.includes(file.type)) {
      setImageUploadError("Only PNG, JPG, JPEG, and WEBP images are allowed.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setImageUploadError("Image must be 5MB or smaller.");
      return;
    }

    startImageUploadTransition(async () => {
      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("slug", values.slug || slugify(values.name) || "product");

        const response = await fetch("/api/admin/upload/product-image", {
          method: "POST",
          body: formData
        });
        const result = (await response.json().catch(() => null)) as { error?: string; path?: string } | null;

        if (!response.ok || !result?.path) {
          setImageUploadError(result?.error ?? "Could not upload image.");
          return;
        }

        const uploadedPath = result.path;
        setValues((current) => ({
          ...current,
          image: uploadedPath,
          gallery: [
            uploadedPath,
            ...current.gallery
              .split(/[\n,]/)
              .map((item) => item.trim())
              .filter((item) => item && item !== uploadedPath && isImagePath(item))
          ].join("\n")
        }));
        setUploadedImageFileName(file.name);
        setImageUploadMessage(`Uploaded to ${uploadedPath}`);
      } catch {
        setImageUploadError("Network error. Image upload failed.");
      }
    });
  }

  function uploadProductVideo(file: File | null) {
    setVideoUploadError("");
    setVideoUploadMessage("");
    setUploadedVideoFileName("");

    if (!file) return;

    const allowedTypes = ["video/mp4"];
    if (!allowedTypes.includes(file.type)) {
      setVideoUploadError("Only MP4 videos are allowed.");
      return;
    }

    if (file.size > 80 * 1024 * 1024) {
      setVideoUploadError("Video must be 80MB or smaller.");
      return;
    }

    startVideoUploadTransition(async () => {
      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("slug", values.slug || slugify(values.name) || "product");

        const response = await fetch("/api/admin/upload/product-video", {
          method: "POST",
          body: formData
        });
        const result = (await response.json().catch(() => null)) as { error?: string; path?: string } | null;

        if (!response.ok || !result?.path) {
          setVideoUploadError(result?.error ?? "Could not upload video.");
          return;
        }

        const uploadedPath = result.path;
        setValues((current) => ({
          ...current,
          video: uploadedPath
        }));
        setUploadedVideoFileName(file.name);
        setVideoUploadMessage(`Uploaded to ${uploadedPath}`);
      } catch {
        setVideoUploadError("Network error. Video upload failed.");
      }
    });
  }

  return (
    <form onSubmit={submit} className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link href="/admin/products" className="inline-flex items-center gap-2 text-sm text-gold">
          <ArrowLeft className="h-4 w-4" />
          Back to products
        </Link>
        <div className="flex flex-wrap gap-3">
          {previewHref ? (
            <Link
              href={previewHref}
              target="_blank"
              className="inline-flex h-11 items-center gap-2 rounded-full border border-gold/20 px-5 text-sm font-semibold text-gold transition hover:border-gold/45"
            >
              <Eye className="h-4 w-4" />
              Preview Public Product
            </Link>
          ) : null}
          <button
            type="submit"
            disabled={isPending || isUploading}
            className="inline-flex h-11 items-center gap-2 rounded-full bg-gold px-6 text-sm font-semibold text-night transition hover:bg-[#f4d8aa] disabled:opacity-60"
          >
            <Save className="h-4 w-4" />
            {isPending ? "Saving..." : "Save Product"}
          </button>
        </div>
      </div>

      {message ? (
        <div className="rounded-2xl border border-emerald/25 bg-emerald/10 px-4 py-3 text-sm text-emerald">
          {message}
        </div>
      ) : null}
      {error ? (
        <div className="rounded-2xl border border-red-400/25 bg-red-500/10 px-4 py-3 text-sm text-red-100">
          {error}
        </div>
      ) : null}

      <section className="rounded-2xl border border-gold/15 bg-white/[0.045] p-5 backdrop-blur-2xl">
        <SectionTitle title="Basic" />
        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          <Field label="Product name" required>
            <input value={values.name} onChange={(event) => updateName(event.target.value)} className={inputClass} placeholder="Ombre Mystique" />
          </Field>
          <Field label="Slug" required>
            <input
              value={values.slug}
              onChange={(event) => {
                setSlugWasEdited(true);
                setText("slug", slugify(event.target.value));
              }}
              className={inputClass}
              placeholder="ombre-mystique"
            />
          </Field>
          <Field label="Arabic name">
            <input value={values.arabicName} onChange={(event) => setText("arabicName", event.target.value)} className={inputClass} placeholder="سهر" />
          </Field>
          <Field label="Category" required>
            <input value={values.category} onChange={(event) => setText("category", event.target.value)} className={inputClass} placeholder="Oud, Night, Best Sellers" />
          </Field>
          <Field label="Cost Price">
            <input
              type="number"
              min="0"
              step="0.01"
              value={values.costPrice}
              onChange={(event) => setText("costPrice", Number(event.target.value))}
              className={inputClass}
            />
          </Field>
          <Field label="Sale Price" required>
            <input type="number" min="1" value={values.price} onChange={(event) => setText("price", Number(event.target.value))} className={inputClass} />
          </Field>
          <Field label="Old price">
            <input type="number" min="1" value={values.oldPrice} onChange={(event) => setText("oldPrice", numberOrEmpty(event.target.value))} className={inputClass} />
          </Field>
          <div className="grid gap-3 rounded-2xl border border-gold/15 bg-night/50 p-4 lg:col-span-2 sm:grid-cols-2">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-gold/65">Profit per bottle</p>
              <p className={profitPerItem >= 0 ? "mt-2 font-serif text-3xl text-emerald" : "mt-2 font-serif text-3xl text-red-200"}>
                {formatPrice(profitPerItem)}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-gold/65">Profit margin</p>
              <p className={profitMargin >= 0 ? "mt-2 font-serif text-3xl text-ivory" : "mt-2 font-serif text-3xl text-red-200"}>
                {profitMargin}%
              </p>
            </div>
            {values.costPrice > values.price && values.price > 0 ? (
              <p className="rounded-2xl border border-red-400/25 bg-red-500/10 px-4 py-3 text-sm text-red-100 sm:col-span-2">
                Cost price is higher than sale price. This product will lose money.
              </p>
            ) : null}
          </div>
          <Field label="Tags" className="lg:col-span-2">
            <input value={values.tags} onChange={(event) => setText("tags", event.target.value)} className={inputClass} placeholder="signature, oud, evening" />
          </Field>
          <Field label="Short description" required className="lg:col-span-2">
            <textarea value={values.description} onChange={(event) => setText("description", event.target.value)} className={textareaClass} rows={3} />
          </Field>
          <Field label="Long description" required className="lg:col-span-2">
            <textarea value={values.longDescription} onChange={(event) => setText("longDescription", event.target.value)} className={textareaClass} rows={5} />
          </Field>
        </div>
      </section>

      <section className="rounded-2xl border border-gold/15 bg-white/[0.045] p-5 backdrop-blur-2xl">
        <SectionTitle title="Scent" />
        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          <Field label="Notes summary">
            <input value={values.notes} onChange={(event) => setText("notes", event.target.value)} className={inputClass} placeholder="Saffron, Oud Wood, Amber" />
          </Field>
          <Field label="Top notes">
            <input value={values.topNotes} onChange={(event) => setText("topNotes", event.target.value)} className={inputClass} placeholder="Saffron Glow, Pink Pepper" />
          </Field>
          <Field label="Heart notes">
            <input value={values.heartNotes} onChange={(event) => setText("heartNotes", event.target.value)} className={inputClass} placeholder="Oud Wood, Rose Resin" />
          </Field>
          <Field label="Base notes">
            <input value={values.baseNotes} onChange={(event) => setText("baseNotes", event.target.value)} className={inputClass} placeholder="Amber Silk, Musk" />
          </Field>
          <Field label="Longevity" required>
            <input value={values.longevity} onChange={(event) => setText("longevity", event.target.value)} className={inputClass} placeholder="18h" />
          </Field>
          <Field label="Projection" required>
            <input value={values.projection} onChange={(event) => setText("projection", event.target.value)} className={inputClass} placeholder="Strong, elegant trail" />
          </Field>
          <Field label="Occasion" required>
            <input value={values.occasion} onChange={(event) => setText("occasion", event.target.value)} className={inputClass} placeholder="Evening, occasions" />
          </Field>
          <Field label="Gender" required>
            <input value={values.gender} onChange={(event) => setText("gender", event.target.value)} className={inputClass} placeholder="Unisex" />
          </Field>
        </div>
      </section>

      <section className="rounded-2xl border border-gold/15 bg-white/[0.045] p-5 backdrop-blur-2xl">
        <SectionTitle title="Media" />
        <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_180px]">
          <div className="grid gap-4">
            <div className="rounded-2xl border border-gold/15 bg-night/45 p-4">
              <p className="text-xs uppercase tracking-[0.22em] text-gold/65">Product image upload</p>
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <label className="inline-flex h-11 cursor-pointer items-center gap-2 rounded-full bg-gold px-5 text-sm font-semibold text-night transition hover:bg-[#f4d8aa]">
                  <Upload className="h-4 w-4" />
                  {isImageUploading ? "Uploading..." : values.image ? "Replace Image" : "Choose Product Image"}
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp,image/jpg"
                    className="sr-only"
                    disabled={isImageUploading}
                    onChange={(event) => uploadProductImage(event.target.files?.[0] ?? null)}
                  />
                </label>
                {values.image ? (
                  <button
                    type="button"
                    onClick={() => {
                      setText("image", "");
                      setImageUploadMessage("");
                      setUploadedImageFileName("");
                    }}
                    className="inline-flex h-11 items-center gap-2 rounded-full border border-red-400/25 px-4 text-sm text-red-100"
                  >
                    <X className="h-4 w-4" />
                    Remove Image
                  </button>
                ) : null}
              </div>
              {uploadedImageFileName ? <p className="mt-3 text-xs text-ivory/50">Selected: {uploadedImageFileName}</p> : null}
              {imageUploadMessage ? <p className="mt-3 break-all text-xs text-emerald">{imageUploadMessage}</p> : null}
              {imageUploadError ? <p className="mt-3 text-xs text-red-100">{imageUploadError}</p> : null}
            </div>
            <Field label="Main image path" required>
              <input value={values.image} onChange={(event) => setText("image", event.target.value)} className={inputClass} placeholder="/images/products/ombre-mystique.png" />
            </Field>
            <Field label="Gallery image paths">
              <textarea value={values.gallery} onChange={(event) => setText("gallery", event.target.value)} className={textareaClass} rows={4} placeholder="/images/products/one.png&#10;/images/products/two.png" />
            </Field>
            <div className="rounded-2xl border border-gold/15 bg-night/45 p-4">
              <p className="text-xs uppercase tracking-[0.22em] text-gold/65">Product video upload</p>
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <label className="inline-flex h-11 cursor-pointer items-center gap-2 rounded-full bg-gold px-5 text-sm font-semibold text-night transition hover:bg-[#f4d8aa]">
                  <Upload className="h-4 w-4" />
                  {isVideoUploading ? "Uploading..." : values.video ? "Replace Video" : "Choose Product Video"}
                  <input
                    type="file"
                    accept="video/mp4"
                    className="sr-only"
                    disabled={isVideoUploading}
                    onChange={(event) => uploadProductVideo(event.target.files?.[0] ?? null)}
                  />
                </label>
                {values.video ? (
                  <button
                    type="button"
                    onClick={() => {
                      setText("video", "");
                      setVideoUploadMessage("");
                      setUploadedVideoFileName("");
                    }}
                    className="inline-flex h-11 items-center gap-2 rounded-full border border-red-400/25 px-4 text-sm text-red-100"
                  >
                    <X className="h-4 w-4" />
                    Remove Video
                  </button>
                ) : null}
              </div>
              {uploadedVideoFileName ? <p className="mt-3 text-xs text-ivory/50">Selected: {uploadedVideoFileName}</p> : null}
              {videoUploadMessage ? <p className="mt-3 break-all text-xs text-emerald">{videoUploadMessage}</p> : null}
              {videoUploadError ? <p className="mt-3 text-xs text-red-100">{videoUploadError}</p> : null}
            </div>
            <Field label="Optional video path">
              <input value={values.video} onChange={(event) => setText("video", event.target.value)} className={inputClass} placeholder="/videos/product-film.mp4" />
            </Field>
            <label>
              <span className="mb-2 block text-xs uppercase tracking-[0.22em] text-gold/65">Select existing product video</span>
              <select
                value={productVideoOptions.includes(values.video) ? values.video : ""}
                onChange={(event) => setText("video", event.target.value)}
                className={inputClass}
              >
                <option value="">No selected video</option>
                {productVideoOptions.map((path) => (
                  <option key={path} value={path}>
                    {path}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div>
            <p className="mb-3 text-xs uppercase tracking-[0.22em] text-gold/65">Live Preview</p>
            <ProductImagePreview src={values.image} alt={values.name || "Product image"} className="aspect-square h-auto w-full" />
            {values.video && isVideoPath(values.video) ? (
              <div className="mt-4 overflow-hidden rounded-2xl border border-gold/15 bg-night/70">
                <video
                  className="aspect-square w-full object-cover"
                  src={values.video}
                  autoPlay
                  muted
                  loop
                  playsInline
                  controls
                  preload="metadata"
                />
                <p className="break-all px-3 py-2 text-xs text-ivory/45">{values.video}</p>
              </div>
            ) : values.video ? (
              <p className="mt-4 rounded-2xl border border-red-400/25 bg-red-500/10 px-3 py-2 text-xs text-red-100">
                Video preview requires an MP4 path.
              </p>
            ) : null}
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-gold/15 bg-white/[0.045] p-5 backdrop-blur-2xl">
        <SectionTitle title="Commerce" />
        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          <Field label="Size options">
            <textarea value={values.sizes} onChange={(event) => setText("sizes", event.target.value)} className={textareaClass} rows={3} placeholder="50ml:0&#10;100ml:500" />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Stock">
              <input type="number" min="0" value={values.stock} onChange={(event) => setText("stock", Number(event.target.value))} className={inputClass} />
            </Field>
            <Field label="Rating">
              <input type="number" min="0" max="5" step="0.1" value={values.rating} onChange={(event) => setText("rating", Number(event.target.value))} className={inputClass} />
            </Field>
            <Field label="Review count">
              <input type="number" min="0" value={values.reviewCount} onChange={(event) => setText("reviewCount", Number(event.target.value))} className={inputClass} />
            </Field>
          </div>
          <div className="grid gap-3 lg:col-span-2 sm:grid-cols-3">
            <Toggle label="Best Seller" checked={values.isBestSeller} onChange={(checked) => setText("isBestSeller", checked)} />
            <Toggle label="New" checked={values.isNew} onChange={(checked) => setText("isNew", checked)} />
            <Toggle label="Active in Shop" checked={values.isActive} onChange={(checked) => setText("isActive", checked)} />
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-gold/15 bg-white/[0.045] p-5 backdrop-blur-2xl">
        <SectionTitle title="SEO" optional />
        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          <Field label="Meta title">
            <input value={values.metaTitle} onChange={(event) => setText("metaTitle", event.target.value)} className={inputClass} />
          </Field>
          <Field label="Meta description">
            <textarea value={values.metaDescription} onChange={(event) => setText("metaDescription", event.target.value)} className={textareaClass} rows={3} />
          </Field>
        </div>
      </section>

      <div className="flex flex-wrap justify-end gap-3">
        <Link href="/admin/products" className="inline-flex h-11 items-center rounded-full border border-gold/20 px-5 text-sm font-semibold text-ivory/70">
          Cancel
        </Link>
        <button type="submit" disabled={isPending || isUploading} className="inline-flex h-11 items-center gap-2 rounded-full bg-gold px-6 text-sm font-semibold text-night disabled:opacity-60">
          <Save className="h-4 w-4" />
          {isPending ? "Saving..." : "Save Product"}
        </button>
      </div>
    </form>
  );
}

const inputClass =
  "h-11 w-full rounded-full border border-gold/15 bg-night/70 px-4 text-sm text-ivory placeholder:text-ivory/35 focus:border-gold/50 focus:ring-gold/20";

const textareaClass =
  "w-full rounded-2xl border border-gold/15 bg-night/70 px-4 py-3 text-sm leading-6 text-ivory placeholder:text-ivory/35 focus:border-gold/50 focus:ring-gold/20";

function SectionTitle({ title, optional }: { title: string; optional?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <Sparkles className="h-4 w-4 text-gold" />
      <h2 className="font-serif text-3xl text-ivory">{title}</h2>
      {optional ? <span className="text-xs uppercase tracking-[0.22em] text-ivory/35">Optional</span> : null}
    </div>
  );
}

function Field({
  label,
  required,
  className,
  children
}: {
  label: string;
  required?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <label className={className}>
      <span className="mb-2 block text-xs uppercase tracking-[0.22em] text-gold/65">
        {label}
        {required ? " *" : ""}
      </span>
      {children}
    </label>
  );
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (checked: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`flex items-center justify-between gap-4 rounded-2xl border px-4 py-3 text-sm transition ${
        checked
          ? "border-emerald/35 bg-emerald/10 text-emerald"
          : "border-gold/15 bg-night/40 text-ivory/60 hover:border-gold/35"
      }`}
    >
      <span>{label}</span>
      <span className={`h-5 w-9 rounded-full p-0.5 transition ${checked ? "bg-emerald" : "bg-ivory/20"}`}>
        <span className={`block h-4 w-4 rounded-full bg-night transition ${checked ? "translate-x-4" : ""}`} />
      </span>
    </button>
  );
}
