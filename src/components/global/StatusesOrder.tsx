const StatusesOrder: React.FC<{ value: string }> = ({ value }) => {
  let styling = "bg-gray-600 text-gray-50";
  let displayText = "Waiting";
  if (value === "1") {
    styling = "bg-slate-200 text-slate-800 font-medium";
    displayText = "Belum dibayar";
  } else if (value === "2") {
    styling = "bg-yellow-100 text-yellow-800 font-medium";
    displayText = "Belum diproses";
  } else if (value === "3") {
    styling = "bg-emerald-100 text-emerald-800 font-medium";
    displayText = "Berhasil";
  } else if (value === "4") {
    styling = "bg-rose-100 text-rose-800 font-medium";
    displayText = "Gagal";
  } else if (value === "5") {
    styling = "bg-rose-100 text-rose-800 font-medium";
    displayText = "Expired";
  } else if (value === "6") {
    styling = "bg-blue-100 text-blue-800 font-medium";
    displayText = "Sedang Diproses";
  } else if (value === "7") {
    styling = "bg-orange-100 text-orange-800 font-medium";
    displayText = "Refunded";
  }

  return (
    <div className={`p-2 ${styling} text-center rounded-full`}>
      {displayText}
    </div>
  );
};

export default StatusesOrder;
