interface Props {
  onUploadClick: () => void;
}

const UploadTripCard = ({ onUploadClick }: Props) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
      <div className="flex flex-col items-center justify-center min-h-[300px]">
        {/* Illustration placeholder - in real app, this would be an SVG or image */}
        <div className="mb-6 w-full max-w-xs">
          <div className="aspect-square bg-gradient-to-br from-blue-100 to-green-100 rounded-lg flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <svg
                className="w-32 h-32 text-blue-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                />
              </svg>
            </div>
          </div>
        </div>
        
        <button
          onClick={onUploadClick}
          className="px-8 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors mb-3"
        >
          Upload Trip
        </button>
        
        <p className="text-sm text-gray-500 text-center">
          Upload the <span className="font-semibold underline">Excel</span> sheet of your trip
        </p>
      </div>
    </div>
  );
};

export default UploadTripCard;

