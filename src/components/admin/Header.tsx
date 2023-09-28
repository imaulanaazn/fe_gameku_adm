const Header: React.FC<{ title: string }> = ({ title }) => {
    return <div className="py-5 text-2xl font-semibold font-montserrat">{title}</div>;
};

export default Header;
