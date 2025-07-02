interface ContainerProps {
  children: JSX.Element | JSX.Element[];
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
      className={`w-full max-w-screen-2xl mx-auto px-4 sm:px-5 md:px-10 lg:px-16 xl:px-28 ${className}`}
    >
      {children}
    </div>
  );
};

export default Container;
