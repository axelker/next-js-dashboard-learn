export type State = {
    errors?: {
        name?:string[];
        email?: string[];
        password?: string[];
    };
    message?: string | null;
    values?: {
        name?:string;
        email?: string;
        password?: string;
    };
};