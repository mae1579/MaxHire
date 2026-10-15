const BrowsePagination = ({ page, totalPages, loading, updateParams, className }) => (
  <div className={`flex justify-center items-center gap-6 ${className}`}>
    <button
      onClick={() => {
        updateParams({ page: Math.max(page - 1, 1) });
        window.scrollTo(0, 0);
      }}
      disabled={page === 1 || loading}
      className="text-[10px] font-bold text-[#f4f4f5] bg-[#070709] border border-[#1f1f22] px-6 py-3 rounded-xl uppercase tracking-widest hover:bg-[#18181b] disabled:opacity-20 transition-all cursor-pointer"
    >
      Wstecz
    </button>

    <span className="text-[#71717a] text-[11px] font-bold uppercase tracking-widest">
      {page} / {totalPages}
    </span>

    <button
      onClick={() => {
        updateParams({ page: Math.min(page + 1, totalPages) });
        window.scrollTo(0, 0);
      }}
      disabled={page === totalPages || loading}
      className="text-[10px] font-bold text-[#f4f4f5] bg-[#070709] border border-[#1f1f22] px-6 py-3 rounded-xl uppercase tracking-widest hover:bg-[#18181b] disabled:opacity-20 transition-all cursor-pointer"
    >
      Dalej
    </button>
  </div>
);

export default BrowsePagination;
