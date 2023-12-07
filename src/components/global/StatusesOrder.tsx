const StatusesOrder: React.FC<{ value: string }> = ({ value }) => {
    let styling = "bg-gray-600 text-gray-50";
    let displayText = "Waiting";
    if (value === "1") {
        styling = "bg-blue-600 text-blue-50";
        displayText = "Belum dibayar";
    } else if (value === "2") {
        styling = "bg-blue-600 text-blue-50";
        displayText = "Belum diproses";
    } else if (value === "3") {
        styling = "bg-green-600 text-green-50";
        displayText = "Berhasil";
    } else if (value === "4") {
        styling = "bg-red-600 text-red-50";
        displayText = "Gagal";
    } else if (value === "5") {
        styling = "bg-red-600 text-red-50";
        displayText = "Expired";
    } else if (value === "6") {
        styling = "bg-blue-600 text-blue-50";
        displayText = "Sedang Diproses";
    }

    return <div className={`px-4 py-2 ${styling} text-center rounded-md shadow-md`}>{displayText}</div>;
};

export default StatusesOrder;
