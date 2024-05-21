interface IStatusesProps {
  status: string;
}

const Statuses: React.FC<IStatusesProps> = ({ status }) => {
  if (status === "1") {
    return (
      <div className="bg-yellow-100 text-yellow-700 lg:text-sm text-xs h-fit w-full py-3 px-5 rounded-full">
        Belum Dibayar
      </div>
    );
  } else if (status === "2" || status === "6") {
    return (
      <div className="bg-blue-100 text-blue-700 lg:text-sm text-xs h-fit w-full py-3 px-5 rounded-full">
        Sedang Diproses
      </div>
    );
  } else if (status === "3") {
    return (
      <div className="bg-emerald-100 text-emerald-700 lg:text-sm text-xs h-fit w-full py-3 px-5 rounded-full">
        Sudah Dibayar
      </div>
    );
  } else if (status === "4") {
    return (
      <div className="bg-red-100 text-red-700 lg:text-sm text-xs h-fit w-full py-3 px-5 rounded-full">
        Failed
      </div>
    );
  } else if (status === "5") {
    return (
      <div className="bg-red-100 text-red-700 lg:text-sm text-xs h-fit w-full py-3 px-5 rounded-full">
        Expired
      </div>
    );
  }
};

export default Statuses;
