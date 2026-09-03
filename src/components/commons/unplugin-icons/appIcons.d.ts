export interface AppIcon {
    body: string;
    width?: number;
    height?: number;
}
export interface AppIconSet {
    prefix: string;
    width?: number;
    height?: number;
    icons: Record<string, AppIcon>;
}
export declare const appSet: AppIconSet;
export declare const appIcons: Record<string, string>;
