# Local conversion input

Salin satu atau beberapa PDF ke folder ini, lalu jalankan:

```bash
pnpm book:convert
```

Tanpa argumen, script memilih PDF yang terakhir diubah. Untuk memilih file tertentu:

```bash
pnpm book:convert -- "local-input/nama-buku.pdf" "slug-opsional"
```

Hasil berada di `draft/<slug>/<slug>.epub`. PDF dan EPUB diabaikan Git dan tidak dipublikasikan otomatis.
