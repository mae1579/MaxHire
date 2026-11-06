const MarkdownCheatsheet = () => (
  <details className="group mt-3 rounded-xl border border-zinc-100 bg-zinc-50 px-4 py-3">
    <summary className="cursor-pointer list-none text-xs font-semibold text-zinc-600 marker:hidden">
      <span className="group-open:hidden">Jak formatować tekst? Pokaż ściągawkę</span>
      <span className="hidden group-open:inline">Ukryj ściągawkę formatowania</span>
    </summary>
    <div className="mt-3 grid gap-3 text-xs text-zinc-600 sm:grid-cols-2">
      <div>
        <p className="mb-1 font-bold text-zinc-800">Pogrubienie i kursywa</p>
        <code className="block rounded bg-white px-2 py-1">**pogrubienie**</code>
        <code className="mt-1 block rounded bg-white px-2 py-1">*kursywa*</code>
      </div>
      <div>
        <p className="mb-1 font-bold text-zinc-800">Listy</p>
        <code className="block whitespace-pre-wrap rounded bg-white px-2 py-1">
          - pierwszy punkt{"\n"}- drugi punkt
        </code>
      </div>
      <div>
        <p className="mb-1 font-bold text-zinc-800">Link</p>
        <code className="block break-all rounded bg-white px-2 py-1">
          [Zobacz stronę](https://example.com)
        </code>
      </div>
      <div>
        <p className="mb-1 font-bold text-zinc-800">Zdjęcie</p>
        <code className="block break-all rounded bg-white px-2 py-1">
          ![Opis zdjęcia](https://...)
        </code>
      </div>
    </div>
  </details>
);

export default MarkdownCheatsheet;
