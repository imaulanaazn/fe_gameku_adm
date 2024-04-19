import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { faAngleRight, faAngleLeft } from "@fortawesome/free-solid-svg-icons";
import { faCircle } from "@fortawesome/free-regular-svg-icons";
import Link from "next/link";

import styles from "./Footer.module.css";
interface IButtonSocialMediaProps {
  icon: any;
  title: string;
  to: string;
}

const ButtonSocialMedia: React.FC<IButtonSocialMediaProps> = ({
  icon,
  title,
  to,
}) => {
  return (
    <Link
      href={to}
      onClick={(e) => e.stopPropagation()}
      target="_blank"
      className="md:w-40 md:h-12 w-12 h-12 flex justify-center items-center gap-3 bg-[#B72025] rounded-md  font-semibold text-white text-sm px-4"
    >
      <FontAwesomeIcon icon={icon} size="xl" />
      <p className={`hidden md:block`}>{title}</p>
    </Link>
  );
};

export default ButtonSocialMedia;
