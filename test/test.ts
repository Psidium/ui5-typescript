import { Something } from "./aroundHere/Something";
import Batata from "sap/ui/core/Batata";

export class Oi {
    oi(aaa: number) {
        console.log('oi');
    }
}

const oi: Oi = new Oi();
oi.oi(1);
let bat = new Batata();
bat;