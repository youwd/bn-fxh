export type DataTableModel = {
    edit: boolean;
    leave: boolean;
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

export type CaptainModel = {
    element: Object;
    data: PersonModel;
}