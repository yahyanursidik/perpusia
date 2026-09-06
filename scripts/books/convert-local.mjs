import { existsSync, mkdirSync, readdirSync, statSync } from "node:fs";
import { basename, extname, resolve } from "node:path";
import { spawnSync } from "node:child_process";

const workspaceRoot = resolve(import.meta.dirname, "../..");
const inputDirectory = resolve(workspaceRoot, "local-input");
const draftDirectory = resolve(workspaceRoot, "draft");

function newestLocalPdf() {
  if (!existsSync(inputDirectory)) return undefined;

  return readdirSync(inputDirectory)
    .filter((name) => extname(name).toLowerCase() === ".pdf")
    .map((name) => resolve(inputDirectory, name))
    .sort((left, right) => statSync(right).mtimeMs - statSync(left).mtimeMs)[0];
}

function slugify(value) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

const requestedInput = process.argv[2];
const inputPath = requestedInput ? resolve(workspaceRoot, requestedInput) : newestLocalPdf();

if (!inputPath || !existsSync(inputPath)) {
  console.error("PDF belum ditemukan.");
  console.error(`Salin PDF ke ${inputDirectory}, lalu jalankan lagi: pnpm book:convert`);
  process.exit(1);
}

if (extname(inputPath).toLowerCase() !== ".pdf") {
  console.error(`Input harus berupa PDF: ${inputPath}`);
  process.exit(1);
}

const requestedSlug = process.argv[3];
const slug = slugify(requestedSlug || basename(inputPath, extname(inputPath)));

if (!slug) {
  console.error("Nama file tidak dapat diubah menjadi slug yang valid.");
  process.exit(1);
}

const bookDraftDirectory = resolve(draftDirectory, slug);
const outputPath = resolve(bookDraftDirectory, `${slug}.epub`);
mkdirSync(bookDraftDirectory, { recursive: true });

console.log(`Sumber : ${inputPath}`);
console.log(`Draft  : ${outputPath}`);
console.log("Konversi PDF ke EPUB sedang berjalan. Hasil tetap berstatus draft.");

const conversion = spawnSync("ebook-convert", [inputPath, outputPath], {
  cwd: workspaceRoot,
  shell: false,
  stdio: "inherit",
});

if (conversion.error?.code === "ENOENT") {
  console.error("ebook-convert tidak ditemukan. Instal Calibre dan pastikan tersedia di PATH.");
  process.exit(1);
}

if (conversion.error) {
  throw conversion.error;
}

if (conversion.status !== 0 || !existsSync(outputPath) || statSync(outputPath).size === 0) {
  console.error("Konversi gagal atau menghasilkan file kosong.");
  process.exit(conversion.status || 1);
}

console.log("Draft EPUB selesai dibuat.");
console.log("Langkah berikutnya: periksa struktur bab, teks Arab, catatan kaki, dan daftar isi sebelum publish.");
