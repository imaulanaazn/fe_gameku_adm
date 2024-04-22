interface ContainerProps {
  children: JSX.Element;
  className?: string;
  id?: string;
}

const Container: React.FC<ContainerProps> = ({
  children,
  className = "",
  id = "",
}) => {
  return (
    <div
      id={id}
      className={`w-full px-5 sm:px-6 md:px-10 lg:px-16 xl:px-28 ${className}`}
    >
      {children}
    </div>
  );
};

export default Container;
