interface IStatusesProps {
    status: string;
}

const Statuses: React.FC<IStatusesProps> = ({ status }) => {
    if (status === "1") {
        return (
            <div className="bg-yellow-500 text-yellow-50 lg:text-sm text-xs h-fit w-fit py-2 px-5 rounded-md">
                Belum Dibayar
            </div>
        );
    } else if (status === "2") {
        return (
            <div className="bg-green-500 text-green-50 lg:text-sm text-xs h-fit w-fit py-2 px-5 rounded-md">
                Sudah Dibayar
            </div>
        );
    } else if (status === "3" || status === "4") {
        return (
            <div className="bg-red-500 text-red-50 lg:text-sm text-xs h-fit w-fit py-2 px-5 rounded-md">
                {status === "3" ? "Expired" : "Failed"}
            </div>
        );
    } else {
        return <div className="bg-blue-500 text-blue-50 lg:text-sm text-xs h-fit w-fit py-2 px-5 rounded-md">N/A</div>;
    }
};

export default Statuses;
