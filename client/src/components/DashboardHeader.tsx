interface Props {
  userName?: string;
  onLogout: () => void;
}

const DashboardHeader = ({ userName = "User", onLogout }: Props) => {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-black"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="6" x2="12" y2="12" />
              <line x1="12" y1="12" x2="16" y2="16" />
            </svg>
            <span className="text-xl font-bold text-black">Speedo</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-gray-50 rounded-lg px-4 py-3 inline-flex items-center gap-2">
              <span className="text-2xl">👋</span>
              <span className="font-semibold text-gray-900">
                Welcome, {userName}
              </span>
            </div>
            <button
              onClick={onLogout}
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;

