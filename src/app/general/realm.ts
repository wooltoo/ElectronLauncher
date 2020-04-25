import { RealmStatus } from "./realmstatus";

export class Realm
{
    name : string;
    status : RealmStatus;

    constructor(nameI : string, status : RealmStatus) {
        this.name = nameI;
        this.status = status;
    }

    getName() : string {
        return this.name;
    }

    getStatus() : RealmStatus {
        return this.status;
    }
}