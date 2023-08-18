const TotalPayments = () => {
    return (
        <div className="bg-black text-white w-full sticky bottom-0 lg:px-20 lg:py-5 flex justify-end items-end gap-5 font-montserrat p-5">
            <div className="text-sm">
                <p>Total</p>
                <p className="mt-1 text-xs">340 Diamonds (310 + 30 Bonus) x 2, BCA</p>
                <p className="font-extrabold text-xl">Rp. 300.000</p>
            </div>
            <div className="py-3 w-48 bg-[#B72025] rounded-lg cursor-pointer text-sm flex justify-center items-center">
                Beli Sekarang!
            </div>
        </div>
    );
};

export default TotalPayments;
