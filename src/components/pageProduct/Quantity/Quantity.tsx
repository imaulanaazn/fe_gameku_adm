import { ChangeEvent } from "react";

interface IQUantityProps {
    value: string;
    setValue: (value: string) => void;
}

const Quantity: React.FC<IQUantityProps> = ({ value, setValue }) => {
    const handleValueQuantity = (e: ChangeEvent<HTMLInputElement>) => {
        if (parseInt(e.target.value) > 100) {
            setValue("100");
        } else {
            setValue(e.target.value);
        }
    };

    return (
        <div className="bg-slate-200 shadow-md rounded-lg p-7 mb-4">
            <div className="py-2 px-8 text-white rounded-lg shadow-lg shadow-slate-400 bg-[#B72025] w-fit text-sm">
                Jumlah Pembelian
            </div>
            <div className="grid grid-cols-1 mt-5">
                <input
                    type="number"
                    name="quantity"
                    id="quantity"
                    className="p-4 rounded-md text-sm"
                    value={parseInt(value)}
                    onChange={handleValueQuantity}
                />
            </div>
        </div>
    );
};

export default Quantity;
