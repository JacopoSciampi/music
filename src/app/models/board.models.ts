export class Note {
    fillColor: string;
    borderColor: string;
    point: number;

    isClicked: boolean;
    isSpecial: boolean;
    id: number;

    position: number; // can be 1,2,3,4,5 for the board
    offsetTime: any; // needed for save and reproduce

    offsetTop: number;
    offsetLeft: number;
}

export class Controller {
    fillColor: string;
    borderColor: string;
    isKeyDown: boolean;
    keyCode: number;
    keyValue: string;
    position: number;
}