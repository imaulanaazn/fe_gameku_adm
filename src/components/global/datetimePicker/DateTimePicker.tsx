import React, { useState } from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import id from "date-fns/locale/id";

registerLocale("id", id);

interface DateTimePickerProps {
    onDateChange: (date: Date) => void;
    required?: boolean;
    placeholder: string;
    classname?: string;
}

const DateTimePicker: React.FC<DateTimePickerProps> = ({ onDateChange, required, placeholder, classname }) => {
    const [selectedDate, setSelectedDate] = useState<Date>();

    const handleDateChange = (date: Date) => {
        setSelectedDate(date);
        onDateChange(date);
    };

    return (
        <div className="w-full">
            <DatePicker
                selected={selectedDate}
                onChange={handleDateChange}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                timeCaption="Time"
                dateFormat="MMMM d, yyyy HH:mm"
                className={`${
                    classname ? classname : "border-2 border-gray-200 focus:ring-2 focus:ring-blue-500 rounded p-2"
                }`}
                locale="id"
                minDate={new Date()}
                placeholderText={placeholder}
                required={required || false}
                isClearable
                monthsShown={2}
                withPortal
            />
        </div>
    );
};

export default DateTimePicker;
