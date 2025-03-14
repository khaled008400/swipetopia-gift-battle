
const DevelopmentInfo = () => {
  if (!import.meta.env.DEV) return null;
  
  return (
    <div className="mt-4 p-3 bg-blue-900/30 rounded-md">
      <p className="text-xs text-blue-400">
        Development mode: Demo email is demo@example.com with password "password"
      </p>
    </div>
  );
};

export default DevelopmentInfo;
