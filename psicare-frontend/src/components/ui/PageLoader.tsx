export function PageLoader() {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full min-h-[50vh] animate-fade-in">
      <div className="relative">
        <div className="w-12 h-12 border-4 border-secondary-100 rounded-full"></div>
        <div className="w-12 h-12 border-4 border-primary-500 rounded-full border-t-transparent animate-spin absolute top-0 left-0"></div>
      </div>
      <p className="mt-4 text-sm font-medium text-secondary-400 animate-pulse">
        Carregando...
      </p>
    </div>
  );
}