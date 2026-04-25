interface Props {
  keyword: string;
  status: string;
  onKeywordChange: (v: string) => void;
  onStatusChange: (v: string) => void;
}

export default function SearchBar({ keyword, status, onKeywordChange, onStatusChange }: Props) {
  return (
    <div className="flex gap-3 items-center">
      <input
        type="text"
        placeholder="キーワードで検索..."
        value={keyword}
        onChange={e => onKeywordChange(e.target.value)}
        className="flex-1 max-w-xs border border-border rounded px-3 py-2 text-sm text-text placeholder:text-text-sub focus:outline-none focus:ring-2 focus:ring-primary"
      />
      <select
        value={status}
        onChange={e => onStatusChange(e.target.value)}
        className="border border-border rounded px-3 py-2 text-sm text-text bg-surface focus:outline-none focus:ring-2 focus:ring-primary"
      >
        <option value="">すべてのステータス</option>
        <option value="TODO">Todo</option>
        <option value="IN_PROGRESS">In Progress</option>
        <option value="DONE">Done</option>
      </select>
    </div>
  );
}
