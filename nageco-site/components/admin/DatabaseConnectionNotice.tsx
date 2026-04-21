export function DatabaseConnectionNotice() {
  return (
    <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
      Unable to connect to the database. Check DATABASE_URL and DIRECT_URL in your environment settings.
    </div>
  );
}
