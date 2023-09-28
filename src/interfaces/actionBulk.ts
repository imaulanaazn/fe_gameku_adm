import { IconProp } from "@fortawesome/fontawesome-svg-core";

export interface IActionBulk {
    title: string;
    icon: IconProp;
    classActive: string;
    classNotAllowed: string;
    onClick: () => void;
}
