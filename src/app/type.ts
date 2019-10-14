export type DataTableModel = {
    edit: boolean;
    data: {
        index: number;
        team: string;
        name: string;
    }
}

export class PersonModel {
    index: number = null;
    team: string = "";
    name: string = "";
}